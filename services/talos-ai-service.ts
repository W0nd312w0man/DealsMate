import type { EmailAttachment } from "@/types/email"
import type { EmailData } from "./email-analysis-service"
import { getTransactions } from "./transaction-service"

export async function analyzeDocument(attachment: EmailAttachment, email: EmailData) {
  // In a real implementation, this would call an AI service
  // For this demo, we'll simulate AI analysis with some logic

  const analysis = {
    attachmentId: attachment.id,
    fileName: attachment.fileName,
    fileType: attachment.fileType,
    fileSize: attachment.fileSize,
    relevanceScore: 0.5, // Default medium relevance
    documentType: "unknown",
    extractedAddress: "",
    extractedClientName: "",
    extractedData: {},
    potentialTransactionMatches: [],
  }

  // Simulate AI analysis based on file name and email content
  if (attachment.fileName.toLowerCase().includes("agreement") || email.subject.toLowerCase().includes("agreement")) {
    analysis.relevanceScore = 0.9
    analysis.documentType = "purchase_agreement"

    // Extract address from email subject or body
    const addressMatch = extractAddress(email.subject) || extractAddress(email.body)
    if (addressMatch) {
      analysis.extractedAddress = addressMatch
    }
  } else if (attachment.fileName.toLowerCase().includes("escrow") || email.subject.toLowerCase().includes("escrow")) {
    analysis.relevanceScore = 0.95
    analysis.documentType = "escrow_instructions"

    // Extract address from email subject or body
    const addressMatch = extractAddress(email.subject) || extractAddress(email.body)
    if (addressMatch) {
      analysis.extractedAddress = addressMatch
    }
  } else if (
    attachment.fileName.toLowerCase().includes("inspection") ||
    email.subject.toLowerCase().includes("inspection")
  ) {
    analysis.relevanceScore = 0.85
    analysis.documentType = "inspection_report"

    // Extract address from email subject or body
    const addressMatch = extractAddress(email.subject) || extractAddress(email.body)
    if (addressMatch) {
      analysis.extractedAddress = addressMatch
    }
  } else if (
    attachment.fileType === "application/pdf" ||
    attachment.fileType === "application/msword" ||
    attachment.fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    // Generic document types that might be relevant
    analysis.relevanceScore = 0.7
  }

  // Extract client name if possible
  analysis.extractedClientName = email.from.name

  // Find potential matching transactions
  if (analysis.extractedAddress) {
    const transactions = await getTransactions()
    analysis.potentialTransactionMatches = transactions
      .filter((t) => t.address.includes(analysis.extractedAddress) || analysis.extractedAddress.includes(t.address))
      .map((t) => ({
        id: t.id,
        address: t.address,
        matchScore: calculateMatchScore(t.address, analysis.extractedAddress),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3) // Top 3 matches
  }

  return analysis
}

function extractAddress(text: string): string | null {
  // This is a simplified address extraction
  // In a real implementation, you would use more sophisticated NLP

  // Look for common address patterns
  const addressRegex =
    /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct|Place|Pl|Terrace|Ter)(?:,\s*[A-Za-z\s]+(?:,\s*[A-Za-z]{2})?)?\s*\d{5}(?:-\d{4})?/gi

  const match = text.match(addressRegex)
  return match ? match[0] : null
}

function calculateMatchScore(address1: string, address2: string): number {
  // Simple string similarity calculation
  // In a real implementation, you would use more sophisticated algorithms

  const a1 = address1.toLowerCase()
  const a2 = address2.toLowerCase()

  // Count matching words
  const words1 = a1.split(/\s+/)
  const words2 = a2.split(/\s+/)

  let matchCount = 0
  for (const word of words1) {
    if (words2.includes(word)) {
      matchCount++
    }
  }

  return matchCount / Math.max(words1.length, words2.length)
}
