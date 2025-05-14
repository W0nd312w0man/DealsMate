"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { GmailService } from "@/services/gmail-service"
import type { GmailState, GmailCredentials, ParsedEmail, EmailCompose, GmailThread } from "@/types/gmail"
import { useToast } from "@/components/ui/use-toast"

// Initial state
const initialState: GmailState = {
  isConnected: false,
  isLoading: false,
  profile: null,
  labels: [],
  threads: {},
  messages: {},
  contacts: [],
  notifications: [],
  unreadCount: 0,
  error: null,
}

// Create context
interface GmailContextType extends GmailState {
  connect: () => void
  disconnect: () => void
  refreshMessages: (query?: string) => Promise<void>
  getThread: (threadId: string) => Promise<void>
  getMessage: (messageId: string) => Promise<ParsedEmail | null>
  sendEmail: (email: EmailCompose) => Promise<string>
  markAsRead: (messageId: string) => Promise<void>
  markAsUnread: (messageId: string) => Promise<void>
  toggleStar: (messageId: string, star: boolean) => Promise<void>
  trashMessage: (messageId: string) => Promise<void>
  getAttachment: (messageId: string, attachmentId: string) => Promise<string>
  dismissNotification: (notificationId: string) => void
}

const GmailContext = createContext<GmailContextType | undefined>(undefined)

// Provider component
export const GmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GmailState>(initialState)
  const [credentials, setCredentials] = useState<GmailCredentials | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Load credentials from localStorage on mount
  useEffect(() => {
    const storedCredentials = localStorage.getItem("gmail_credentials")
    if (storedCredentials) {
      try {
        const parsedCredentials = JSON.parse(storedCredentials) as GmailCredentials
        setCredentials(parsedCredentials)
      } catch (error) {
        console.error("Failed to parse stored credentials:", error)
        localStorage.removeItem("gmail_credentials")
      }
    }
  }, [])

  // Check if access token needs refreshing
  const ensureValidToken = useCallback(async (): Promise<string> => {
    if (!credentials) {
      throw new Error("Not connected to Gmail")
    }

    // Check if token is expired or about to expire (within 5 minutes)
    if (credentials.expiryDate < Date.now() + 5 * 60 * 1000) {
      try {
        const { accessToken, expiryDate } = await GmailService.refreshAccessToken(credentials.refreshToken)

        const updatedCredentials = {
          ...credentials,
          accessToken,
          expiryDate,
        }

        setCredentials(updatedCredentials)
        localStorage.setItem("gmail_credentials", JSON.stringify(updatedCredentials))

        return accessToken
      } catch (error) {
        console.error("Failed to refresh token:", error)
        // If refresh fails, disconnect
        disconnect()
        throw new Error("Session expired. Please reconnect to Gmail.")
      }
    }

    return credentials.accessToken
  }, [credentials])

  // Initialize connection when credentials are available
  useEffect(() => {
    if (credentials && !state.isConnected && !state.isLoading) {
      initializeConnection()
    }
  }, [credentials, state.isConnected, state.isLoading])

  // Initialize connection
  const initializeConnection = async () => {
    if (!credentials) return

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const accessToken = await ensureValidToken()

      // Fetch user profile
      const profile = await GmailService.getUserProfile(accessToken)

      // Fetch labels
      const labels = await GmailService.listLabels(accessToken)

      // Fetch unread count
      const unreadCount = await GmailService.getUnreadCount(accessToken)

      setState((prev) => ({
        ...prev,
        isConnected: true,
        isLoading: false,
        profile,
        labels,
        unreadCount,
      }))

      // Fetch initial messages
      refreshMessages()
    } catch (error) {
      console.error("Failed to initialize Gmail connection:", error)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to connect to Gmail",
      }))
    }
  }

  // Connect to Gmail
  const connect = useCallback(() => {
    const redirectUri = `${window.location.origin}/api/gmail/callback`
    const state = Math.random().toString(36).substring(2)

    // Store state for verification
    sessionStorage.setItem("gmail_auth_state", state)

    // Redirect to Google OAuth
    const authUrl = GmailService.getAuthUrl(redirectUri, state)
    window.location.href = authUrl
  }, [])

  // Disconnect from Gmail
  const disconnect = useCallback(() => {
    localStorage.removeItem("gmail_credentials")
    setCredentials(null)
    setState(initialState)

    toast({
      title: "Disconnected from Gmail",
      description: "Your Gmail account has been disconnected.",
      variant: "default",
    })
  }, [toast])

  // Refresh messages
  const refreshMessages = useCallback(
    async (query = "") => {
      if (!credentials) return

      setState((prev) => ({ ...prev, isLoading: true }))

      try {
        const accessToken = await ensureValidToken()

        // Fetch threads
        const { threads } = await GmailService.listThreads(accessToken, query)

        // Process threads and messages
        const threadsMap: Record<string, GmailThread> = {}
        const messagesMap: Record<string, ParsedEmail> = {}

        for (const thread of threads) {
          threadsMap[thread.id] = thread

          for (const message of thread.messages) {
            const parsedMessage = parseMessage(message)
            messagesMap[message.id] = parsedMessage
          }
        }

        // Update unread count
        const unreadCount = await GmailService.getUnreadCount(accessToken)

        setState((prev) => ({
          ...prev,
          isLoading: false,
          threads: { ...prev.threads, ...threadsMap },
          messages: { ...prev.messages, ...messagesMap },
          unreadCount,
        }))
      } catch (error) {
        console.error("Failed to refresh messages:", error)
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to refresh messages",
        }))
      }
    },
    [credentials, ensureValidToken],
  )

  // Get thread
  const getThread = useCallback(
    async (threadId: string) => {
      if (!credentials) return

      setState((prev) => ({ ...prev, isLoading: true }))

      try {
        const accessToken = await ensureValidToken()

        // Fetch thread
        const thread = await GmailService.getThread(accessToken, threadId)

        // Process messages
        const messagesMap: Record<string, ParsedEmail> = {}

        for (const message of thread.messages) {
          const parsedMessage = parseMessage(message)
          messagesMap[message.id] = parsedMessage
        }

        setState((prev) => ({
          ...prev,
          isLoading: false,
          threads: { ...prev.threads, [threadId]: thread },
          messages: { ...prev.messages, ...messagesMap },
        }))
      } catch (error) {
        console.error(`Failed to fetch thread ${threadId}:`, error)
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : `Failed to fetch thread ${threadId}`,
        }))
      }
    },
    [credentials, ensureValidToken],
  )

  // Get message
  const getMessage = useCallback(
    async (messageId: string): Promise<ParsedEmail | null> => {
      if (!credentials) return null

      // Check if message is already in state
      if (state.messages[messageId]) {
        return state.messages[messageId]
      }

      setState((prev) => ({ ...prev, isLoading: true }))

      try {
        const accessToken = await ensureValidToken()

        // Fetch message
        const message = await GmailService.getMessage(accessToken, messageId)

        // Parse message
        const parsedMessage = parseMessage(message)

        setState((prev) => ({
          ...prev,
          isLoading: false,
          messages: { ...prev.messages, [messageId]: parsedMessage },
        }))

        return parsedMessage
      } catch (error) {
        console.error(`Failed to fetch message ${messageId}:`, error)
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : `Failed to fetch message ${messageId}`,
        }))
        return null
      }
    },
    [credentials, ensureValidToken, state.messages],
  )

  // Send email
  const sendEmail = useCallback(
    async (email: EmailCompose): Promise<string> => {
      if (!credentials) throw new Error("Not connected to Gmail")

      setState((prev) => ({ ...prev, isLoading: true }))

      try {
        const accessToken = await ensureValidToken()

        // Send email
        const messageId = await GmailService.sendEmail(accessToken, email)

        setState((prev) => ({ ...prev, isLoading: false }))

        toast({
          title: "Email Sent",
          description: "Your email has been sent successfully.",
          variant: "default",
        })

        // Refresh messages to include the sent email
        refreshMessages()

        return messageId
      } catch (error) {
        console.error("Failed to send email:", error)
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to send email",
        }))

        toast({
          title: "Failed to Send Email",
          description: error instanceof Error ? error.message : "An error occurred while sending the email.",
          variant: "destructive",
        })

        throw error
      }
    },
    [credentials, ensureValidToken, refreshMessages, toast],
  )

  // Mark as read
  const markAsRead = useCallback(
    async (messageId: string) => {
      if (!credentials) return

      try {
        const accessToken = await ensureValidToken()

        // Mark as read
        await GmailService.markAsRead(accessToken, messageId)

        // Update state
        setState((prev) => {
          const message = prev.messages[messageId]
          if (!message) return prev

          const updatedMessage = {
            ...message,
            isRead: true,
            labels: message.labels.filter((label) => label !== "UNREAD"),
          }

          return {
            ...prev,
            messages: { ...prev.messages, [messageId]: updatedMessage },
            unreadCount: Math.max(0, prev.unreadCount - 1),
          }
        })
      } catch (error) {
        console.error(`Failed to mark message ${messageId} as read:`, error)
        toast({
          title: "Error",
          description: "Failed to mark message as read.",
          variant: "destructive",
        })
      }
    },
    [credentials, ensureValidToken, toast],
  )

  // Mark as unread
  const markAsUnread = useCallback(
    async (messageId: string) => {
      if (!credentials) return

      try {
        const accessToken = await ensureValidToken()

        // Mark as unread
        await GmailService.markAsUnread(accessToken, messageId)

        // Update state
        setState((prev) => {
          const message = prev.messages[messageId]
          if (!message) return prev

          const updatedMessage = {
            ...message,
            isRead: false,
            labels: [...message.labels.filter((label) => label !== "UNREAD"), "UNREAD"],
          }

          return {
            ...prev,
            messages: { ...prev.messages, [messageId]: updatedMessage },
            unreadCount: prev.unreadCount + 1,
          }
        })
      } catch (error) {
        console.error(`Failed to mark message ${messageId} as unread:`, error)
        toast({
          title: "Error",
          description: "Failed to mark message as unread.",
          variant: "destructive",
        })
      }
    },
    [credentials, ensureValidToken, toast],
  )

  // Toggle star
  const toggleStar = useCallback(
    async (messageId: string, star: boolean) => {
      if (!credentials) return

      try {
        const accessToken = await ensureValidToken()

        // Toggle star
        await GmailService.toggleStar(accessToken, messageId, star)

        // Update state
        setState((prev) => {
          const message = prev.messages[messageId]
          if (!message) return prev

          const updatedMessage = {
            ...message,
            isStarred: star,
            labels: star
              ? [...message.labels.filter((label) => label !== "STARRED"), "STARRED"]
              : message.labels.filter((label) => label !== "STARRED"),
          }

          return {
            ...prev,
            messages: { ...prev.messages, [messageId]: updatedMessage },
          }
        })
      } catch (error) {
        console.error(`Failed to ${star ? "star" : "unstar"} message ${messageId}:`, error)
        toast({
          title: "Error",
          description: `Failed to ${star ? "star" : "unstar"} message.`,
          variant: "destructive",
        })
      }
    },
    [credentials, ensureValidToken, toast],
  )

  // Trash message
  const trashMessage = useCallback(
    async (messageId: string) => {
      if (!credentials) return

      try {
        const accessToken = await ensureValidToken()

        // Trash message
        await GmailService.trashMessage(accessToken, messageId)

        // Update state
        setState((prev) => {
          const message = prev.messages[messageId]
          if (!message) return prev

          // Remove message from state
          const { [messageId]: _, ...remainingMessages } = prev.messages

          // Update unread count if the message was unread
          const unreadCount = message.isRead ? prev.unreadCount : Math.max(0, prev.unreadCount - 1)

          return {
            ...prev,
            messages: remainingMessages,
            unreadCount,
          }
        })

        toast({
          title: "Message Moved to Trash",
          description: "The message has been moved to the trash.",
          variant: "default",
        })
      } catch (error) {
        console.error(`Failed to trash message ${messageId}:`, error)
        toast({
          title: "Error",
          description: "Failed to move message to trash.",
          variant: "destructive",
        })
      }
    },
    [credentials, ensureValidToken, toast],
  )

  // Get attachment
  const getAttachment = useCallback(
    async (messageId: string, attachmentId: string): Promise<string> => {
      if (!credentials) throw new Error("Not connected to Gmail")

      try {
        const accessToken = await ensureValidToken()

        // Get attachment
        return await GmailService.getAttachment(accessToken, messageId, attachmentId)
      } catch (error) {
        console.error(`Failed to get attachment ${attachmentId} from message ${messageId}:`, error)
        toast({
          title: "Error",
          description: "Failed to download attachment.",
          variant: "destructive",
        })
        throw error
      }
    },
    [credentials, ensureValidToken, toast],
  )

  // Dismiss notification
  const dismissNotification = useCallback((notificationId: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((notification) => notification.id !== notificationId),
    }))
  }, [])

  // Helper function to parse a message
  const parseMessage = (message: any): ParsedEmail => {
    // Extract headers
    const getHeader = (name: string): string => {
      const header = message.payload.headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())
      return header ? header.value : ""
    }

    const subject = getHeader("subject") || "(No Subject)"
    const fromHeader = getHeader("from") || ""
    const toHeader = getHeader("to") || ""
    const ccHeader = getHeader("cc") || ""
    const bccHeader = getHeader("bcc") || ""
    const dateHeader = getHeader("date") || ""

    // Parse email addresses
    const parseEmailAddress = (addressString: string): { name?: string; email: string } => {
      const match = addressString.match(/"?([^"<]+)"?\s*<?([^>]+@[^>]+)>?/)
      if (match) {
        return {
          name: match[1].trim(),
          email: match[2].trim(),
        }
      }
      return { email: addressString.trim() }
    }

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
    const attachments: any[] = []

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

  // Context value
  const contextValue: GmailContextType = {
    ...state,
    connect,
    disconnect,
    refreshMessages,
    getThread,
    getMessage,
    sendEmail,
    markAsRead,
    markAsUnread,
    toggleStar,
    trashMessage,
    getAttachment,
    dismissNotification,
  }

  return <GmailContext.Provider value={contextValue}>{children}</GmailContext.Provider>
}

// Custom hook to use the Gmail context
export const useGmail = () => {
  const context = useContext(GmailContext)
  if (context === undefined) {
    throw new Error("useGmail must be used within a GmailProvider")
  }
  return context
}
