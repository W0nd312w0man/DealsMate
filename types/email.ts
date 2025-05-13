export interface EmailAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  url: string
}

export interface AnalysisResult {
  hasRelevantAttachments: boolean
  relevantAttachments?: any[]
  suggestedActions?: any[]
  emailData?: any
}

export interface EmailData {
  id: string
  from: {
    name: string
    email: string
  }
  subject: string
  body: string
  receivedAt: Date
  attachments: EmailAttachment[]
}
