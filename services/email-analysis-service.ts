import type { EmailAttachment } from "@/types/email"

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

export async function analyzeEmail(email: EmailData) {
  // Return mock analysis results without making API calls
  return {
    hasRelevantAttachments: false,
    relevantAttachments: [],
    suggestedActions: [],
    emailData: email,
  }
}
