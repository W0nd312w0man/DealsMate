"use client"

import { useState } from "react"
import { Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatFileSize } from "@/lib/utils"
import { EmailActions } from "./email-actions"
import { EmailExitButton } from "./email-exit-button"
import { cn } from "@/lib/utils"

interface EmailAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
}

interface EmailInlineViewProps {
  email: {
    id: string
    from: {
      name: string
      email: string
      avatar?: string
    }
    to?: string[]
    cc?: string[]
    bcc?: string[]
    subject: string
    body?: string
    preview: string
    date: string
    read: boolean
    starred: boolean
    category: "transaction" | "lead" | "client" | "other" | "workspace"
    labels?: string[]
    workspaceId?: string
    attachments?: EmailAttachment[]
  }
  onClose: () => void
  onStarToggle: (id: string) => void
}

export function EmailInlineView({ email, onClose, onStarToggle }: EmailInlineViewProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Format the email body with proper paragraphs
  const formattedBody = email.body || email.preview

  return (
    <div className="bg-gray-900 text-gray-100 rounded-md overflow-hidden border border-gray-800 mt-1 mb-3 transition-all duration-200 ease-in-out">
      {/* Inline header with gradient accent */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500"></div>

      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <div>
          <h3 className="font-medium text-gray-100">{email.subject}</h3>
          <div className="text-xs text-gray-400 flex items-center gap-2">
            <span>From: {email.from.name}</span>
            <span>•</span>
            <span>{email.date}</span>
          </div>
        </div>
        <EmailExitButton onClose={onClose} size="icon" className="h-7 w-7" />
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-400 hover:text-gray-100 px-2 h-6"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide details" : "Show details"}
          </Button>

          {email.labels && email.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {email.labels.map((label) => (
                <Badge key={label} variant="outline" className="text-xs py-0 px-1.5 border-purple-700 text-purple-400">
                  {label}
                </Badge>
              ))}
              {email.category && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs capitalize",
                    email.category === "transaction" && "bg-blue-100 text-blue-800 border-blue-200",
                    email.category === "lead" && "bg-green-100 text-green-800 border-green-200",
                    email.category === "client" && "bg-purple-100 text-purple-800 border-purple-200",
                    email.category === "workspace" && "bg-amber-100 text-amber-800 border-amber-200",
                    email.category === "other" && "bg-gray-100 text-gray-800 border-gray-200",
                  )}
                >
                  {email.category}
                </Badge>
              )}
            </div>
          )}
        </div>

        {showDetails && (
          <div className="mb-3 text-sm text-gray-400 bg-gray-800/50 p-2 rounded-md">
            <div>
              <span className="font-medium">From:</span> {email.from.name} &lt;{email.from.email}&gt;
            </div>
            <div>
              <span className="font-medium">To:</span> {email.to?.join(", ") || "me"}
            </div>
            {email.cc && email.cc.length > 0 && (
              <div>
                <span className="font-medium">Cc:</span> {email.cc.join(", ")}
              </div>
            )}
          </div>
        )}

        <div className="prose prose-invert prose-sm max-w-none max-h-[300px] overflow-y-auto">
          {formattedBody.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-4 border-t border-gray-800 pt-3">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Attachments ({email.attachments.length})</h4>
            <div className="grid grid-cols-1 gap-2">
              {email.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-2 p-2 rounded-md border border-gray-800 bg-gray-800/50"
                >
                  <Paperclip className="h-4 w-4 text-purple-400" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-300 truncate">{attachment.fileName}</div>
                    <div className="text-xs text-gray-500">{formatFileSize(attachment.fileSize)}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-100 h-8 w-8">
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-800">
        <EmailActions
          emailId={email.id}
          isRead={email.read}
          isStarred={email.starred}
          hasAttachments={email.attachments && email.attachments.length > 0}
          category={email.category}
          labels={email.labels}
          variant="compact"
          onStarToggle={onStarToggle}
        />
      </div>
    </div>
  )
}
