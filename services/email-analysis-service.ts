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
  // Skip analysis if no attachments
  if (!email.attachments || email.attachments.length === 0) {
    return {
      hasRelevantAttachments: false,
    }
  }

  // For demo purposes, we'll simulate the analysis results
  // In a real implementation, this would call the TALOS AI service
  const relevantAttachments = email.attachments.map((attachment, index) => ({
    attachmentId: attachment.id,
    fileName: attachment.fileName,
    fileType: attachment.fileType,
    fileSize: attachment.fileSize,
    documentType: "purchase_agreement",
    relevanceScore: 0.95,
    extractedAddress: "15614 Yermo Street, Whittier, CA 90603",
    extractedClientName: email.from.name,
  }))

  // Generate suggested actions
  const suggestedActions = [
    {
      type: "create_transaction",
      confidence: 0.9,
      data: {
        suggestedTitle: "15614 Yermo Street, Whittier, CA 90603",
        documentType: "purchase_agreement",
        attachmentId: email.attachments[0].id,
      },
    },
    {
      type: "add_to_transaction",
      confidence: 0.8,
      data: {
        transactions: [
          {
            id: "tx-1",
            address: "15614 Yermo Street, Whittier, CA 90603",
            status: "pending",
          },
        ],
        documentType: "purchase_agreement",
        attachmentId: email.attachments[0].id,
      },
    },
    {
      type: "create_workspace",
      confidence: 0.7,
      data: {
        suggestedTitle: email.from.name,
        documentType: "purchase_agreement",
        attachmentId: email.attachments[0].id,
      },
    },
  ]

  return {
    hasRelevantAttachments: true,
    relevantAttachments,
    suggestedActions,
    emailData: email,
  }
}
