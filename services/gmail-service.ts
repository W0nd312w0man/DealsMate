import type {
  GmailCredentials,
  GmailMessage,
  GmailThread,
  GmailLabel,
  ParsedEmail,
  EmailCompose,
  EmailAddress,
  GmailAttachment,
  GmailProfile,
} from "@/types/gmail"

// Constants
const GMAIL_API_BASE_URL = "https://gmail.googleapis.com/gmail/v1"
const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.labels",
]

// Helper functions
const getAuthHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
})

const parseEmailAddress = (addressString: string): EmailAddress => {
  const match = addressString.match(/"?([^"<]+)"?\s*<?([^>]+@[^>]+)>?/)
  if (match) {
    return {
      name: match[1].trim(),
      email: match[2].trim(),
    }
  }
  return { email: addressString.trim() }
}

const getHeaderValue = (message: GmailMessage, headerName: string): string | null => {
  const header = message.payload.headers.find((h) => h.name.toLowerCase() === headerName.toLowerCase())
  return header ? header.value : null
}

const decodeBase64 = (data: string): string => {
  // Replace URL-safe characters and add padding if needed
  const sanitized = data.replace(/-/g, "+").replace(/_/g, "/")
  const padding = sanitized.length % 4
  const padded = padding ? sanitized + "=".repeat(4 - padding) : sanitized

  try {
    return atob(padded)
  } catch (e) {
    console.error("Error decoding base64:", e)
    return ""
  }
}

const findBodyPart = (parts: any[], mimeType: string): any => {
  if (!parts) return null

  for (const part of parts) {
    if (part.mimeType === mimeType) {
      return part
    }
    if (part.parts) {
      const found = findBodyPart(part.parts, mimeType)
      if (found) return found
    }
  }
  return null
}

const extractAttachments = (message: GmailMessage): GmailAttachment[] => {
  const attachments: GmailAttachment[] = []

  const processAttachmentParts = (parts: any[]) => {
    if (!parts) return

    for (const part of parts) {
      if (part.filename && part.filename.length > 0) {
        attachments.push({
          id: part.body.attachmentId || `part_${part.partId}`,
          filename: part.filename,
          mimeType: part.mimeType,
          size: part.body.size,
          contentId: part.headers?.find((h: any) => h.name.toLowerCase() === "content-id")?.value,
        })
      }

      if (part.parts) {
        processAttachmentParts(part.parts)
      }
    }
  }

  if (message.payload.parts) {
    processAttachmentParts(message.payload.parts)
  }

  return attachments
}

const parseMessage = (message: GmailMessage): ParsedEmail => {
  // Extract headers
  const subject = getHeaderValue(message, "subject") || "(No Subject)"
  const fromHeader = getHeaderValue(message, "from") || ""
  const toHeader = getHeaderValue(message, "to") || ""
  const ccHeader = getHeaderValue(message, "cc") || ""
  const bccHeader = getHeaderValue(message, "bcc") || ""
  const dateHeader = getHeaderValue(message, "date") || ""

  // Parse addresses
  const from = parseEmailAddress(fromHeader)
  const to = toHeader
    .split(",")
    .map((addr) => parseEmailAddress(addr))
    .filter((addr) => addr.email)
  const cc = ccHeader
    ? ccHeader
        .split(",")
        .map((addr) => parseEmailAddress(addr))
        .filter((addr) => addr.email)
    : []
  const bcc = bccHeader
    ? bccHeader
        .split(",")
        .map((addr) => parseEmailAddress(addr))
        .filter((addr) => addr.email)
    : []

  // Extract body content
  let textBody = ""
  let htmlBody = ""

  if (message.payload.mimeType === "text/plain") {
    textBody = message.payload.body?.data ? decodeBase64(message.payload.body.data) : ""
  } else if (message.payload.mimeType === "text/html") {
    htmlBody = message.payload.body?.data ? decodeBase64(message.payload.body.data) : ""
  } else if (message.payload.parts) {
    const textPart = findBodyPart(message.payload.parts, "text/plain")
    const htmlPart = findBodyPart(message.payload.parts, "text/html")

    if (textPart && textPart.body.data) {
      textBody = decodeBase64(textPart.body.data)
    }

    if (htmlPart && htmlPart.body.data) {
      htmlBody = decodeBase64(htmlPart.body.data)
    }
  }

  // Extract attachments
  const attachments = extractAttachments(message)

  // Determine read/starred status
  const isRead = !message.labelIds.includes("UNREAD")
  const isStarred = message.labelIds.includes("STARRED")

  return {
    id: message.id,
    threadId: message.threadId,
    subject,
    from,
    to,
    cc,
    bcc,
    date: new Date(dateHeader),
    body: {
      text: textBody,
      html: htmlBody,
    },
    attachments,
    isRead,
    isStarred,
    labels: message.labelIds,
    snippet: message.snippet,
    originalMessage: message,
  }
}

// Gmail API Service
export const GmailService = {
  // Authentication
  getAuthUrl: (redirectUri: string, state: string): string => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID || "",
      redirect_uri: redirectUri,
      response_type: "code",
      scope: GMAIL_SCOPES.join(" "),
      access_type: "offline",
      prompt: "consent",
      state,
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  },

  exchangeCodeForTokens: async (code: string, redirectUri: string): Promise<GmailCredentials> => {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID || "",
        client_secret: process.env.GMAIL_CLIENT_SECRET || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error_description || "Failed to exchange code for tokens")
    }

    const data = await response.json()

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiryDate: Date.now() + data.expires_in * 1000,
      scope: data.scope,
    }
  },

  refreshAccessToken: async (refreshToken: string): Promise<{ accessToken: string; expiryDate: number }> => {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID || "",
        client_secret: process.env.GMAIL_CLIENT_SECRET || "",
        grant_type: "refresh_token",
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error_description || "Failed to refresh access token")
    }

    const data = await response.json()

    return {
      accessToken: data.access_token,
      expiryDate: Date.now() + data.expires_in * 1000,
    }
  },

  // User Profile
  getUserProfile: async (accessToken: string): Promise<GmailProfile> => {
    const response = await fetch(`${GMAIL_API_BASE_URL}/users/me/profile`, {
      headers: getAuthHeaders(accessToken),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user profile")
    }

    const data = await response.json()

    return {
      email: data.emailAddress,
      name: data.emailAddress.split("@")[0], // Default name from email
      picture: data.picture,
    }
  },

  // Messages
  listMessages: async (
    accessToken: string,
    query = "",
    maxResults = 20,
    pageToken?: string,
  ): Promise<{ messages: GmailMessage[]; nextPageToken?: string }> => {
    const params = new URLSearchParams({
      maxResults: maxResults.toString(),
      q: query,
    })

    if (pageToken) {
      params.append("pageToken", pageToken)
    }

    const response = await fetch(`${GMAIL_API_BASE_URL}/users/me/messages?${params.toString()}`, {
      headers: getAuthHeaders(accessToken),
    })

    if (!response.ok) {
      throw new Error("Failed to list messages")
    }

    const data = await response.json()

    if (!data.messages) {
      return { messages: [] }
    }

    // Fetch full message details for each message
    const messages = await Promise.all(
      data.messages.map((msg: { id: string }) => GmailService.getMessage(accessToken, msg.id)),
    )

    return {
      messages,
      nextPageToken: data.nextPageToken,
    }
  },

  getMessage: async (accessToken: string, messageId: string): Promise<GmailMessage> => {
    const response = await fetch(`${GMAIL_API_BASE_URL}/users/me/messages/${messageId}?format=full`, {
      headers: getAuthHeaders(accessToken),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch message ${messageId}`)
    }

    return await response.json()
  },

  getParsedMessage: async (accessToken: string, messageId: string): Promise<ParsedEmail> => {
    const message = await GmailService.getMessage(accessToken, messageId)
    return parseMessage(message)
  },

  // Threads
  listThreads: async (
    accessToken: string,
    query = "",
    maxResults = 20,
    pageToken?: string,
  ): Promise<{ threads: GmailThread[]; nextPageToken?: string }> => {
    const params = new URLSearchParams({
      maxResults: maxResults.toString(),
      q: query,
    })

    if (pageToken) {
      params.append("pageToken", pageToken)
    }

    const response = await fetch(`${GMAIL_API_BASE_URL}/users/me/threads?${params.toString()}`, {
      headers: getAuthHeaders(accessToken),
    })

    if (!response.ok) {
      throw new Error("Failed to list threads")
    }

    const data = await response.json()

    if (!data.threads) {
      return { threads: [] }
    }

    // Fetch full thread details for each thread
    const threads = await Promise.all(
      data.threads.map((thread: { id: string }) => GmailService.getThread(accessToken, thread.id)),
    )

    return {
      threads,
      nextPageToken: data.nextPageToken,
    }
  },

  getThread: async (accessToken: string, threadId: string): Promise<GmailThread> => {
    const response = await fetch(`${GMAIL_API_BASE_URL}/users/me/threads/${threadId}?format=full`, {
      headers: getAuthHeaders(accessToken),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch thread ${threadId}`)
    }

    return await response.json()
  },

  // Labels
  listLabels: async (accessToken: string): Promise<GmailLabel[]> => {
    const response = await fetch(`${GMAIL_API_BASE_URL}/users/me/labels`, {
      headers: getAuthHeaders(accessToken),
    })

    if (!response.ok) {
      throw new Error("Failed to list labels")
    }

    const data = await response.json()
    return data.labels || []
  },

  // Attachments
  getAttachment: async (accessToken: string, messageId: string, attachmentId: string): Promise<string> => {
    const response = await fetch(`${GMAIL_API_BASE_URL}/users/me/messages/${messageId}/attachments/${attachmentId}`, {
      headers: getAuthHeaders(accessToken),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch attachment ${attachmentId}`)
    }

    const data = await response.json()
    return data.data // Base64 encoded data
  },

  // Sending emails
  sendEmail: async (accessToken: string, email: EmailCompose): Promise<string> => {
    // Build MIME message
    let mimeContent = ""

    // Add headers
    mimeContent += "MIME-Version: 1.0\r\n"
    mimeContent += `To: ${email.to.map((recipient) => (recipient.name ? `"${recipient.name}" <${recipient.email}>` : recipient.email)).join(", ")}\r\n`

    if (email.cc && email.cc.length > 0) {
      mimeContent += `Cc: ${email.cc.map((recipient) => (recipient.name ? `"${recipient.name}" <${recipient.email}>` : recipient.email)).join(", ")}\r\n`
    }

    if (email.bcc && email.bcc.length > 0) {
      mimeContent += `Bcc: ${email.bcc.map((recipient) => (recipient.name ? `"${recipient.name}" <${recipient.email}>` : recipient.email)).join(", ")}\r\n`
    }

    mimeContent += `Subject: ${email.subject}\r\n`

    if (email.threadId) {
      mimeContent += `References: ${email.threadId}\r\n`

      if (email.replyToMessageId) {
        mimeContent += `In-Reply-To: ${email.replyToMessageId}\r\n`
      }
    }

    // Add content type and boundary if there are attachments
    const boundary = `boundary_${Date.now().toString(16)}`

    if (email.attachments && email.attachments.length > 0) {
      mimeContent += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`
      mimeContent += `--${boundary}\r\n`
    }

    // Add body content type
    if (email.isHtml) {
      mimeContent += "Content-Type: text/html; charset=UTF-8\r\n\r\n"
    } else {
      mimeContent += "Content-Type: text/plain; charset=UTF-8\r\n\r\n"
    }

    // Add body content
    mimeContent += `${email.body}\r\n`

    // Add attachments if any
    if (email.attachments && email.attachments.length > 0) {
      for (const attachment of email.attachments) {
        mimeContent += `\r\n--${boundary}\r\n`
        mimeContent += `Content-Type: ${attachment.type || "application/octet-stream"}\r\n`
        mimeContent += `Content-Disposition: attachment; filename="${attachment.name}"\r\n`
        mimeContent += "Content-Transfer-Encoding: base64\r\n\r\n"

        // Read file as base64
        const reader = new FileReader()
        const base64ContentPromise = new Promise<string>((resolve) => {
          reader.onload = () => {
            const result = reader.result as string
            // Extract base64 part (after the comma)
            const base64 = result.split(",")[1]
            resolve(base64)
          }
          reader.readAsDataURL(attachment)
        })

        const base64Content = await base64ContentPromise

        mimeContent += `${base64Content}\r\n`
      }

      mimeContent += `--${boundary}--`
    }

    // Encode the MIME message in base64
    const encodedMessage = btoa(unescape(encodeURIComponent(mimeContent)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")

    // Send the email
    const response = await fetch(`${GMAIL_API_BASE_URL}/users/me/messages/send`, {
      method: "POST",
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify({
        raw: encodedMessage,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "Failed to send email")
    }

    const data = await response.json()
    return data.id
  },

  // Message actions
  markAsRead: async (accessToken: string, messageId: string): Promise<void> => {
    await fetch(`${GMAIL_API_BASE_URL}/users/me/messages/${messageId}/modify`, {
      method: "POST",
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify({
        removeLabelIds: ["UNREAD"],
      }),
    })
  },

  markAsUnread: async (accessToken: string, messageId: string): Promise<void> => {
    await fetch(`${GMAIL_API_BASE_URL}/users/me/messages/${messageId}/modify`, {
      method: "POST",
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify({
        addLabelIds: ["UNREAD"],
      }),
    })
  },

  toggleStar: async (accessToken: string, messageId: string, star: boolean): Promise<void> => {
    await fetch(`${GMAIL_API_BASE_URL}/users/me/messages/${messageId}/modify`, {
      method: "POST",
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify({
        addLabelIds: star ? ["STARRED"] : [],
        removeLabelIds: star ? [] : ["STARRED"],
      }),
    })
  },

  addLabel: async (accessToken: string, messageId: string, labelId: string): Promise<void> => {
    await fetch(`${GMAIL_API_BASE_URL}/users/me/messages/${messageId}/modify`, {
      method: "POST",
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify({
        addLabelIds: [labelId],
      }),
    })
  },

  removeLabel: async (accessToken: string, messageId: string, labelId: string): Promise<void> => {
    await fetch(`${GMAIL_API_BASE_URL}/users/me/messages/${messageId}/modify`, {
      method: "POST",
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify({
        removeLabelIds: [labelId],
      }),
    })
  },

  trashMessage: async (accessToken: string, messageId: string): Promise<void> => {
    await fetch(`${GMAIL_API_BASE_URL}/users/me/messages/${messageId}/trash`, {
      method: "POST",
      headers: getAuthHeaders(accessToken),
    })
  },

  untrashMessage: async (accessToken: string, messageId: string): Promise<void> => {
    await fetch(`${GMAIL_API_BASE_URL}/users/me/messages/${messageId}/untrash`, {
      method: "POST",
      headers: getAuthHeaders(accessToken),
    })
  },

  // Utility functions
  getUnreadCount: async (accessToken: string): Promise<number> => {
    const response = await fetch(`${GMAIL_API_BASE_URL}/users/me/messages?q=is:unread&maxResults=1`, {
      headers: getAuthHeaders(accessToken),
    })

    if (!response.ok) {
      throw new Error("Failed to get unread count")
    }

    const data = await response.json()
    return data.resultSizeEstimate || 0
  },
}
