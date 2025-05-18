"use client"

import type { EmailCompose } from "@/types/gmail"

// Mock service with no actual API calls
export const GmailService = {
  // Mock functions that return static data without making API calls
  getAuthUrl: (redirectUri: string, state: string): string => {
    // Return a mock URL without making an API call
    return "#mock-auth-url"
  },

  exchangeCodeForTokens: async (
    code: string,
    redirectUri: string,
  ): Promise<{ accessToken: string; refreshToken: string; expiryDate: number }> => {
    // Return mock tokens without making an API call
    return {
      accessToken: "mock_access_token",
      refreshToken: "mock_refresh_token",
      expiryDate: Date.now() + 3600000, // 1 hour
    }
  },

  refreshAccessToken: async (refreshToken: string): Promise<{ accessToken: string; expiryDate: number }> => {
    // Return a mock refreshed token without making an API call
    return {
      accessToken: "mock_refreshed_access_token",
      expiryDate: Date.now() + 3600000, // 1 hour
    }
  },

  getUserProfile: async (accessToken: string): Promise<{ email: string; name: string }> => {
    // Return mock user profile without making an API call
    return {
      email: "mockuser@example.com",
      name: "Mock User",
    }
  },

  listLabels: async (accessToken: string): Promise<any[]> => {
    // Return mock labels without making an API call
    return [
      { id: "INBOX", name: "Inbox", type: "system" },
      { id: "SENT", name: "Sent", type: "system" },
      { id: "STARRED", name: "Starred", type: "system" },
    ]
  },

  listThreads: async (accessToken: string, query: string): Promise<{ threads: any[] }> => {
    // Return mock threads without making an API call
    return {
      threads: [],
    }
  },

  getThread: async (accessToken: string, threadId: string): Promise<any> => {
    // Return a mock thread without making an API call
    return {
      id: "thread-1",
      messages: [],
    }
  },

  getMessage: async (accessToken: string, messageId: string): Promise<any> => {
    // Return a mock message without making an API call
    return {
      id: "message-1",
      threadId: "thread-1",
      labelIds: [],
      payload: {
        headers: [],
        body: { data: "" },
      },
    }
  },

  sendEmail: async (accessToken: string, email: EmailCompose): Promise<string> => {
    // Return a mock message ID without making an API call
    return "mock-message-id"
  },

  markAsRead: async (accessToken: string, messageId: string): Promise<void> => {
    // Do nothing, no API call
  },

  markAsUnread: async (accessToken: string, messageId: string): Promise<void> => {
    // Do nothing, no API call
  },

  toggleStar: async (accessToken: string, messageId: string, starred: boolean): Promise<void> => {
    // Do nothing, no API call
  },

  trashMessage: async (accessToken: string, messageId: string): Promise<void> => {
    // Do nothing, no API call
  },

  getAttachment: async (accessToken: string, messageId: string, attachmentId: string): Promise<string> => {
    // Return a mock attachment without making an API call
    return "mock_attachment_data"
  },

  getUnreadCount: async (accessToken: string): Promise<number> => {
    // Return a mock count without making an API call
    return 0
  },
}
