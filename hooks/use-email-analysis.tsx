"use client"

import { useState } from "react"
import { analyzeEmail } from "@/services/email-analysis-service"
import { analyzeDocument } from "@/services/talos-ai-service"
import type { EmailAttachment, EmailData } from "@/types/email"

interface UseEmailAnalysisOptions {
  onAnalysisComplete?: (result: any) => void
}

export function useEmailAnalysis(options: UseEmailAnalysisOptions = {}) {
  const { onAnalysisComplete } = options

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any[]>([])
  const [dismissedEmails, setDismissedEmails] = useState<string[]>([])

  const analyzeNewEmail = async (email: EmailData) => {
    if (dismissedEmails.includes(email.id)) {
      return null
    }

    setIsAnalyzing(true)

    try {
      const result = await analyzeEmail(email)

      if (result.hasRelevantAttachments) {
        setAnalysisResults((prev) => [...prev, result])
        if (onAnalysisComplete) {
          onAnalysisComplete(result)
        }
        return result
      }

      return null
    } catch (error) {
      console.error("Error analyzing email:", error)
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }

  const analyzeAttachment = async (attachment: EmailAttachment, email: EmailData) => {
    setIsAnalyzing(true)

    try {
      const result = await analyzeDocument(attachment, email)
      return result
    } catch (error) {
      console.error("Error analyzing attachment:", error)
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }

  const dismissEmail = (emailId: string) => {
    setDismissedEmails((prev) => [...prev, emailId])
    setAnalysisResults((prev) => prev.filter((result) => result.emailData.id !== emailId))
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
