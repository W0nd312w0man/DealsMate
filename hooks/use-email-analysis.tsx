"use client"

import { useState } from "react"
import type { EmailAttachment, EmailData } from "@/types/email"

interface UseEmailAnalysisOptions {
  onAnalysisComplete?: (result: any) => void
}

export function useEmailAnalysis(options: UseEmailAnalysisOptions = {}) {
  const { onAnalysisComplete } = options

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any[]>([])
  const [dismissedEmails, setDismissedEmails] = useState<string[]>([])

  // Mock function without API calls
  const analyzeNewEmail = async (email: EmailData) => {
    setIsAnalyzing(true)

    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false)

      // Mock result
      const result = {
        emailId: email.id,
        hasAttachments: email.attachments && email.attachments.length > 0,
        suggestedActions: [],
      }

      setAnalysisResults((prev) => [...prev, result])

      if (onAnalysisComplete) {
        onAnalysisComplete(result)
      }
    }, 1000)
  }

  // Mock function without API calls
  const analyzeAttachment = async (attachment: EmailAttachment, email: EmailData) => {
    setIsAnalyzing(true)

    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false)

      // Mock result
      const result = {
        attachmentId: attachment.id,
        emailId: email.id,
        documentType: "unknown",
        extractedData: {},
      }

      if (onAnalysisComplete) {
        onAnalysisComplete(result)
      }

      return result
    }, 1000)
  }

  const dismissEmail = (emailId: string) => {
    setDismissedEmails((prev) => [...prev, emailId])
    setAnalysisResults((prev) => prev.filter((result) => result.emailId !== emailId))
  }

  const handleActionComplete = (emailId: string) => {
    dismissEmail(emailId)
  }

  return {
    isAnalyzing,
    analysisResults,
    dismissedEmails,
    analyzeNewEmail,
    analyzeAttachment,
    dismissEmail,
    handleActionComplete,
  }
}
