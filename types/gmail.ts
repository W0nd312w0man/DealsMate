export interface GmailCredentials {
  accessToken: string
  refreshToken: string
  expiryDate: number
  scope: string
}

export interface GmailProfile {
  email: string
  name: string
  picture?: string
}

export interface GmailAttachment {
  id: string
  filename: string
  mimeType: string
  size: number
  contentId?: string
  data?: string // Base64 encoded data
  url?: string
}

export interface GmailMessage {
  id: string
  threadId: string
  labelIds: string[]
  snippet: string
  historyId: string
  internalDate: string
  payload: {
    partId?: string
    mimeType: string
    filename?: string
    headers: Array<{
      name: string
      value: string
    }>
    body?: {
      size: number
      data?: string
      attachmentId?: string
    }
    parts?: Array<{
      partId: string
      mimeType: string
      filename?: string
      headers: Array<{
        name: string
        value: string
      }>
      body: {
        size: number
        data?: string
        attachmentId?: string
      }
    }>
  }
  sizeEstimate: number
  raw?: string
}

export interface GmailThread {
  id: string
  snippet: string
  historyId: string
  messages: GmailMessage[]
}

export interface EmailAddress {
  name?: string
  email: string
}

export interface ParsedEmail {
  id: string
  threadId: string
  subject: string
  from: EmailAddress
  to: EmailAddress[]
  cc?: EmailAddress[]
  bcc?: EmailAddress[]
  date: Date
  body: {
    text?: string
    html?: string
  }
  attachments: GmailAttachment[]
  isRead: boolean
  isStarred: boolean
  labels: string[]
  snippet: string
  originalMessage: GmailMessage
}

export interface EmailCompose {
  to: EmailAddress[]
  cc?: EmailAddress[]
  bcc?: EmailAddress[]
  subject: string
  body: string
  isHtml: boolean
  attachments?: File[]
  threadId?: string // For replies
  replyToMessageId?: string
}

export interface GmailLabel {
  id: string
  name: string
  type: string
  messageListVisibility: string
  labelListVisibility: string
  color?: {
    textColor: string
    backgroundColor: string
  }
}

export interface GmailContact {
  id: string
  name?: string
  email: string
  photoUrl?: string
  lastContactedDate?: Date
  frequencyScore?: number // Higher means more frequent communication
}

export interface GmailNotification {
  id: string
  messageId: string
  threadId: string
  snippet: string
  from: EmailAddress
  subject: string
  receivedAt: Date
  isRead: boolean
}

export interface GmailState {
  isConnected: boolean
  isLoading: boolean
  profile: GmailProfile | null
  labels: GmailLabel[]
  threads: Record<string, GmailThread>
  messages: Record<string, ParsedEmail>
  contacts: GmailContact[]
  notifications: GmailNotification[]
  unreadCount: number
  error: string | null
}
