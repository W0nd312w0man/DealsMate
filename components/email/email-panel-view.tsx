"use client"

import { useState, useEffect } from "react"
import { Minimize2, Maximize2, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatFileSize } from "@/lib/utils"
import { EmailActions } from "./email-actions"
import { EmailExitButton } from "./email-exit-button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface EmailAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
}

interface EmailPanelViewProps {
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

export function EmailPanelView({ email, isOpen, onClose, onStarToggle }: EmailPanelViewProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [panelHeight, setPanelHeight] = useState("500px")

  // Handle panel resize
  useEffect(() => {
    if (minimized) {
      setPanelHeight("60px")
    } else {
      setPanelHeight("500px")
    }
  }, [minimized])

  if (!email || !isOpen) return null

  // Format the email body with proper paragraphs
  const formattedBody = email.body || email.preview

  return (
    <div
      className="fixed bottom-4 right-4 w-96 bg-gray-900 text-gray-100 rounded-md overflow-hidden border border-gray-800 shadow-lg transition-all duration-200 ease-in-out z-50 flex flex-col"
      style={{ height: panelHeight, maxHeight: "calc(100vh - 120px)" }}
    >
      {/* Panel header with gradient accent */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500"></div>

      <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-900 flex-shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={email.from.avatar || "/placeholder.svg"} alt={email.from.name} />
            <AvatarFallback className="bg-purple-900 text-purple-100">
              {email.from.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <div className="font-medium text-gray-100 truncate">{minimized ? email.subject : email.from.name}</div>
            {!minimized && <div className="text-xs text-gray-400 truncate">{email.from.email}</div>}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                  onClick={() => setMinimized(!minimized)}
                >
                  {minimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  <span className="sr-only">{minimized ? "Maximize" : "Minimize"}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">{minimized ? "Maximize" : "Minimize"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <EmailExitButton onClose={onClose} size="icon" className="h-7 w-7" />
        </div>
      </div>

      {!minimized && (
        <>
          <div className="p-3 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-100">{email.subject}</h2>
              <div className="text-xs text-gray-400">{email.date}</div>
            </div>

            <div className="mt-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-400 hover:text-gray-100 px-2 h-6"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Hide details" : "Show details"}
              </Button>
            </div>

            {showDetails && (
              <div className="mt-2 text-xs text-gray-400 bg-gray-800/50 p-2 rounded-md">
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

          <div className="flex-1 overflow-y-auto p-3">
            <div className="prose prose-invert prose-sm max-w-none">
              {formattedBody.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {email.attachments && email.attachments.length > 0 && (
              <div className="mt-4 border-t border-gray-800 pt-3">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Attachments ({email.attachments.length})</h3>
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

          <div className="p-3 border-t border-gray-800 flex-shrink-0">
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
        </>
      )}
    </div>
  )
}
