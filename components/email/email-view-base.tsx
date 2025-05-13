"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  StarOff,
  Reply,
  Forward,
  Trash2,
  Paperclip,
  FileText,
  Download,
  Calendar,
  ClipboardList,
  Building,
  FolderOpen,
} from "lucide-react"
import { formatFileSize } from "@/lib/utils"
import { EmailActions } from "./email-actions"
import { EmailExitButton } from "./email-exit-button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EmailViewBaseProps {
  email: any
  onClose: () => void
  onStarToggle: (id: string) => void
  renderContainer: (children: React.ReactNode) => React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
  showAttachments?: boolean
  showActions?: boolean
  variant?: "modal" | "inline" | "panel"
}

export function EmailViewBase({
  email,
  onClose,
  onStarToggle,
  renderContainer,
  showHeader = true,
  showFooter = true,
  showAttachments = true,
  showActions = true,
  variant = "modal",
}: EmailViewBaseProps) {
  const [showFullEmail, setShowFullEmail] = useState(false)

  if (!email) return null

  const renderEmailHeader = () => (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={email.from.avatar || "/placeholder.svg"} alt={email.from.name} />
          <AvatarFallback className="bg-purple-100 text-purple-700">
            {email.from.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{email.from.name}</div>
          <div className="text-sm text-muted-foreground">{email.from.email}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {email.date} {email.labels && email.labels.length > 0 && "•"}
            {email.labels &&
              email.labels.map((label: string) => (
                <Badge key={label} variant="outline" className="ml-1 text-xs py-0 px-1.5">
                  {label}
                </Badge>
              ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="text-muted-foreground hover:text-yellow-500 transition-colors"
          onClick={() => onStarToggle(email.id)}
        >
          {email.starred ? (
            <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
          ) : (
            <StarOff className="h-5 w-5" />
          )}
        </button>
        <EmailExitButton onClose={onClose} />
      </div>
    </div>
  )

  const renderEmailBody = () => (
    <div>
      <h2 className="text-xl font-medium mb-4">{email.subject}</h2>
      <div className={`prose prose-sm max-w-none ${!showFullEmail ? "line-clamp-10" : ""}`}>
        <p>{email.preview}</p>
        {!showFullEmail && email.preview.length > 300 && (
          <Button variant="link" className="p-0 h-auto" onClick={() => setShowFullEmail(true)}>
            Show more
          </Button>
        )}
      </div>
    </div>
  )

  const renderAttachments = () => {
    if (!email.attachments || email.attachments.length === 0) return null

    return (
      <div className="mt-6 border-t pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Paperclip className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {email.attachments.length === 1 ? "1 Attachment" : `${email.attachments.length} Attachments`}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {email.attachments.map((attachment: any) => (
            <div
              key={attachment.id}
              className="flex items-start gap-3 p-3 rounded-md border border-muted hover:bg-muted/50 transition-colors"
            >
              <div className="rounded-md bg-muted p-2">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{attachment.fileName}</div>
                <div className="text-xs text-muted-foreground">{formatFileSize(attachment.fileSize)}</div>
                <div className="flex gap-2 mt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="text-xs">Download</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full">
                          <Building className="h-4 w-4" />
                          <span className="sr-only">Link to Transaction</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="text-xs">Link to Transaction</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full">
                          <FolderOpen className="h-4 w-4" />
                          <span className="sr-only">Link to Workspace</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="text-xs">Link to Workspace</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full">
                          <Calendar className="h-4 w-4" />
                          <span className="sr-only">Create Event</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="text-xs">Create Event</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full">
                          <ClipboardList className="h-4 w-4" />
                          <span className="sr-only">Create Task</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="text-xs">Create Task</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderEmailFooter = () => (
    <div className="flex justify-between items-center mt-6 pt-4 border-t">
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Reply className="h-4 w-4 mr-2" />
          Reply
        </Button>
        <Button variant="outline" size="sm">
          <Forward className="h-4 w-4 mr-2" />
          Forward
        </Button>
      </div>
      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  )

  const content = (
    <>
      {showHeader && renderEmailHeader()}
      {renderEmailBody()}
      {showAttachments && renderAttachments()}
      {showFooter && renderEmailFooter()}
      {showActions && <EmailActions email={email} variant={variant} />}
    </>
  )

  return renderContainer(content)
}
