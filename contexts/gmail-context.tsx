"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { GmailState, ParsedEmail, EmailCompose } from "@/types/gmail"
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

// Provider component with no API calls
export const GmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GmailState>(initialState)
  const router = useRouter()
  const { toast } = useToast()

  // Mock connect function without API calls
  const connect = useCallback(() => {
    toast({
      title: "Connection Simulated",
      description: "This is a mock connection (no actual API calls).",
      variant: "default",
    })
  }, [toast])

  // Mock disconnect function without API calls
  const disconnect = useCallback(() => {
    setState(initialState)
    toast({
      title: "Disconnected",
      description: "Mock disconnection (no actual API calls).",
      variant: "default",
    })
  }, [toast])

  // Mock refresh messages function without API calls
  const refreshMessages = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    // Simulate loading
    setTimeout(() => {
      setState((prev) => ({ ...prev, isLoading: false }))
    }, 1000)
  }, [])

  // Mock get thread function without API calls
  const getThread = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    // Simulate loading
    setTimeout(() => {
      setState((prev) => ({ ...prev, isLoading: false }))
    }, 1000)
  }, [])

  // Mock get message function without API calls
  const getMessage = useCallback(async (): Promise<ParsedEmail | null> => {
    setState((prev) => ({ ...prev, isLoading: true }))

    // Simulate loading
    setTimeout(() => {
      setState((prev) => ({ ...prev, isLoading: false }))
    }, 1000)

    return null
  }, [])

  // Mock send email function without API calls
  const sendEmail = useCallback(async (): Promise<string> => {
    setState((prev) => ({ ...prev, isLoading: true }))

    // Simulate loading
    setTimeout(() => {
      setState((prev) => ({ ...prev, isLoading: false }))

      toast({
        title: "Email Sent",
        description: "Mock email sending (no actual API calls).",
        variant: "default",
      })
    }, 1000)

    return "mock-message-id"
  }, [toast])

  // Mock mark as read function without API calls
  const markAsRead = useCallback(async () => {
    // No API calls
  }, [])

  // Mock mark as unread function without API calls
  const markAsUnread = useCallback(async () => {
    // No API calls
  }, [])

  // Mock toggle star function without API calls
  const toggleStar = useCallback(async () => {
    // No API calls
  }, [])

  // Mock trash message function without API calls
  const trashMessage = useCallback(async () => {
    // No API calls
    toast({
      title: "Message Moved to Trash",
      description: "Mock trash operation (no actual API calls).",
      variant: "default",
    })
  }, [toast])

  // Mock get attachment function without API calls
  const getAttachment = useCallback(async (): Promise<string> => {
    return "mock_attachment_data"
  }, [])

  // Mock dismiss notification function without API calls
  const dismissNotification = useCallback((notificationId: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((notification) => notification.id !== notificationId),
    }))
  }, [])

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
