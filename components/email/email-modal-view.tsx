"use client"

import { useState } from "react"
import { Star, StarOff, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
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

interface EmailModalViewProps {
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
  } | null
  isOpen: boolean
  onClose: () => void
  onStarToggle: (id: string) => void
}

export function EmailModalView({ email, isOpen, onClose, onStarToggle }: EmailModalViewProps) {
  const [showDetails, setShowDetails] = useState(false)

  if (!email) return null

  // Format the email body with proper paragraphs
  const formattedBody = email.body || email.preview

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 bg-gray-900 text-gray-100 border-gray-800 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Modal Header with gradient accent */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500"></div>

        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={email.from.avatar || "/placeholder.svg"} alt={email.from.name} />
              <AvatarFallback className="bg-purple-900 text-purple-100">
                {email.from.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-100">{email.from.name}</div>
              <div className="text-xs text-gray-400">{email.from.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-yellow-400 hover:bg-gray-800"
              onClick={() => onStarToggle(email.id)}
            >
              {email.starred ? (
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarOff className="h-5 w-5" />
              )}
              <span className="sr-only">{email.starred ? "Unstar" : "Star"}</span>
            </Button>
            <EmailExitButton onClose={onClose} />
          </div>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-100">{email.subject}</h2>
            <div className="text-sm text-gray-400">{email.date}</div>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-400 hover:text-gray-100 px-2 h-6"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide details" : "Show details"}
            </Button>
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

          {showDetails && (
            <div className="mt-2 text-sm text-gray-400 bg-gray-800/50 p-2 rounded-md">
              <div>
                <span className="font-medium">To:</span> {email.to?.join(", ") || "me"}
              </div>
              {email.cc && email.cc.length > 0 && (
                <div>
                  <span className="font-medium">Cc:</span> {email.cc.join(", ")}
                </div>
              )}
              {email.labels && email.labels.length > 0 && (
                <div className="flex gap-1 mt-1">
                  <span className="font-medium">Labels:</span>
                  <div className="flex flex-wrap gap-1">
                    {email.labels.map((label) => (
                      <Badge
                        key={label}
                        variant="outline"
                        className="text-xs py-0 px-1.5 border-purple-700 text-purple-400"
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="prose prose-invert prose-sm max-w-none">
            {formattedBody.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {email.attachments && email.attachments.length > 0 && (
            <div className="mt-6 border-t border-gray-800 pt-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Attachments ({email.attachments.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

        <div className="p-4 border-t border-gray-800">
          <EmailActions
            emailId={email.id}
            isRead={email.read}
            isStarred={email.starred}
            hasAttachments={email.attachments && email.attachments.length > 0}
            category={email.category}
            labels={email.labels}
            variant="full"
            onStarToggle={onStarToggle}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
