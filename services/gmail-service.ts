"use client"

import type { EmailCompose } from "@/types/gmail"

// Gmail service with hardcoded credentials
export const GmailService = {
  // Google API credentials
  clientId: "1076146557292-34uhdpoavubdhjs02isk4imnrfcljing.apps.googleusercontent.com",
  clientSecret: "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",

  getAuthUrl: (redirectUri: string, state = ""): string => {
    const scopes = [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.labels",
      "https://www.googleapis.com/auth/gmail.modify",
    ].join(" ")

    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
      GmailService.clientId
    }&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(
      scopes,
    )}&access_type=offline&prompt=consent&state=${state}`
  },

  exchangeCodeForTokens: async (
    code: string,
    redirectUri: string,
  ): Promise<{ accessToken: string; refreshToken: string; expiryDate: number }> => {
    console.log("Exchanging code for tokens...")

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: GmailService.clientId,
        client_secret: GmailService.clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Token exchange failed: ${response.status} ${response.statusText}`, errorText)
      throw new Error(`Token exchange failed: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Token exchange successful")

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || "placeholder_refresh_token",
      expiryDate: Date.now() + data.expires_in * 1000,
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
        client_id: GmailService.clientId,
        client_secret: GmailService.clientSecret,
        grant_type: "refresh_token",
      }),
    })

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      accessToken: data.access_token,
      expiryDate: Date.now() + data.expires_in * 1000,
    }
  },

  getUserProfile: async (accessToken: string): Promise<{ email: string; name: string }> => {
    console.log("Fetching user profile with token:", accessToken.substring(0, 10) + "...")

    try {
      const response = await fetch("https://www.googleapis.com/gmail/v1/users/me/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Failed to get user profile: ${response.status} ${response.statusText}`, errorText)
        throw new Error(`Failed to get user profile: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("User profile fetched successfully:", data)

      return {
        email: data.emailAddress,
        name: data.emailAddress.split("@")[0], // Simple name extraction from email
      }
    } catch (error) {
      console.error("Error in getUserProfile:", error)
      throw error
    }
  },

  // Other Gmail API methods remain the same...
  listLabels: async (accessToken: string): Promise<any[]> => {
    const response = await fetch("https://www.googleapis.com/gmail/v1/users/me/labels", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to list labels: ${response.statusText}`)
    }

    const data = await response.json()
    return data.labels || []
  },

  listThreads: async (accessToken: string, query = ""): Promise<{ threads: any[] }> => {
    const url = new URL("https://www.googleapis.com/gmail/v1/users/me/threads")
    if (query) {
      url.searchParams.append("q", query)
    }
    url.searchParams.append("maxResults", "20")

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to list threads: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      threads: data.threads || [],
    }
  },

  getThread: async (accessToken: string, threadId: string): Promise<any> => {
    const response = await fetch(`https://www.googleapis.com/gmail/v1/users/me/threads/${threadId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get thread: ${response.statusText}`)
    }

    return await response.json()
  },

  getMessage: async (accessToken: string, messageId: string): Promise<any> => {
    const response = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get message: ${response.statusText}`)
    }

    return await response.json()
  },

  sendEmail: async (accessToken: string, email: EmailCompose): Promise<string> => {
    // Implementation for sending emails
    // This would require creating a MIME message and using the gmail.users.messages.send endpoint
    return "mock-message-id" // Placeholder
  },

  markAsRead: async (accessToken: string, messageId: string): Promise<void> => {
    await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        removeLabelIds: ["UNREAD"],
      }),
    })
  },

  markAsUnread: async (accessToken: string, messageId: string): Promise<void> => {
    await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addLabelIds: ["UNREAD"],
      }),
    })
  },

  toggleStar: async (accessToken: string, messageId: string, starred: boolean): Promise<void> => {
    await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addLabelIds: starred ? ["STARRED"] : [],
        removeLabelIds: !starred ? ["STARRED"] : [],
      }),
    })
  },

  trashMessage: async (accessToken: string, messageId: string): Promise<void> => {
    await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },

  getAttachment: async (accessToken: string, messageId: string, attachmentId: string): Promise<string> => {
    const response = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachmentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to get attachment: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data // Base64 encoded attachment data
  },

  getUnreadCount: async (accessToken: string): Promise<number> => {
    const response = await fetch("https://www.googleapis.com/gmail/v1/users/me/messages?q=is:unread&maxResults=1", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get unread count: ${response.statusText}`)
    }

    const data = await response.json()
    return data.resultSizeEstimate || 0
  },
}
