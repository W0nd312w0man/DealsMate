"use client"

import { useState, useEffect } from "react"
import { analyzeEmail } from "@/services/email-analysis-service"
import { AttachmentNotification } from "@/components/email/attachment-notification"
import type { TalosNotification } from "@/components/talos/talos-notifications"

export function EmailAnalysisIntegration() {
  const [analysisResults, setAnalysisResults] = useState<any[]>([])
  const [dismissedEmails, setDismissedEmails] = useState<string[]>([])

  // Simulate checking for new emails periodically
  useEffect(() => {
    const checkForNewEmails = async () => {
      // In a real implementation, this would poll an email API
      // For this demo, we'll simulate a new email with an attachment
      const mockEmail = {
        id: `email-${Date.now()}`,
        from: {
          name: "Karen Chen",
          email: "karen.chen@example.com",
        },
        subject: "Offer Accepted on 15614 Yermo Street",
        body: "Great news! The sellers have accepted your offer on the property at 15614 Yermo Street, Whittier, CA 90603. I've attached the signed purchase agreement for your records. Let's schedule a call to discuss next steps.",
        receivedAt: new Date(),
        attachments: [
          {
            id: `attachment-${Date.now()}`,
            fileName: "Purchase_Agreement_15614_Yermo_St.pdf",
            fileType: "application/pdf",
            fileSize: 2500000,
            url: "#",
          },
        ],
      }

      // Only show the notification if we haven't already processed this email
      if (!dismissedEmails.includes(mockEmail.id)) {
        const result = await analyzeEmail(mockEmail)
        if (result.hasRelevantAttachments) {
          setAnalysisResults((prev) => [...prev, result])

          // Add to TALOS notifications
          if (window.talosNotifications) {
            const notification: Omit<TalosNotification, "id" | "timestamp" | "read"> = {
              type: "document_analyzed",
              title: "Document detected in email",
              description: `TALOS AI detected "${result.emailData.attachments[0].fileName}" in email from ${result.emailData.from.name}.`,
              actionUrl: "/documents",
              actionLabel: "View Document",
              secondaryAction: {
                label: "Process Document",
                url: "#",
              },
              relatedEntity: {
                type: "document",
                id: result.emailData.attachments[0].id,
                name: result.emailData.attachments[0].fileName,
              },
            }

            // @ts-ignore - Add to global notifications
            window.talosNotifications.add(notification)
          }
        }
      }
    }

    // Check for new emails on component mount
    checkForNewEmails()

    // Set up periodic checking (in a real app, this would be handled by a more robust system)
    const interval = setInterval(() => {
      // Disabled for demo purposes to avoid multiple notifications
      // checkForNewEmails()
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [dismissedEmails])

  const handleDismiss = (emailId: string) => {
    setDismissedEmails((prev) => [...prev, emailId])
    setAnalysisResults((prev) => prev.filter((result) => result.emailData.id !== emailId))
  }

  const handleActionComplete = (emailId: string) => {
    setDismissedEmails((prev) => [...prev, emailId])
    setAnalysisResults((prev) => prev.filter((result) => result.emailData.id !== emailId))

    // Add a notification about the completed action
    if (window.talosNotifications) {
      const result = analysisResults.find((r) => r.emailData.id === emailId)
      if (result) {
        const notification: Omit<TalosNotification, "id" | "timestamp" | "read"> = {
          type: "task_created",
          title: "Document processed",
          description: `TALOS AI processed "${result.emailData.attachments[0].fileName}" and created appropriate tasks.`,
          actionUrl: "/tasks",
          actionLabel: "View Tasks",
          relatedEntity: {
            type: "document",
            id: result.emailData.attachments[0].id,
            name: result.emailData.attachments[0].fileName,
          },
        }

        // @ts-ignore - Add to global notifications
        window.talosNotifications.add(notification)
      }
    }
  }

  if (analysisResults.length === 0) {
    return null
  }

  return (
    <div className="shadow-soft card-hover overflow-hidden rounded-lg border bg-card text-card-foreground">
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-poppins text-purple-700">Email Attachments Detected</h3>
        </div>
        <div className="space-y-4">
          {analysisResults.map((result) => (
            <AttachmentNotification
              key={result.emailData.id}
              analysisResult={result}
              onDismiss={() => handleDismiss(result.emailData.id)}
              onActionComplete={() => handleActionComplete(result.emailData.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
