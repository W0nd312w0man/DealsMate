import type { EmailAttachment } from "@/types/email"
import type { EmailData } from "./email-analysis-service"

export async function analyzeDocument(attachment: EmailAttachment, email: EmailData) {
  // Return mock document analysis without making API calls
  return {
    documentType: "unknown",
    extractedData: {},
    confidence: 0,
  }
}
