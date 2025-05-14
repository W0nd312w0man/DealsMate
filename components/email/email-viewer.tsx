"use client"

import type React from "react"

import { useState } from "react"
import type { ParsedEmail } from "@/types/gmail"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGmail } from "@/contexts/gmail-context"
import {
  Reply,
  Forward,
  Trash2,
  Archive,
  Star,
  StarOff,
  Mail,
  MailOpen,
  ChevronLeft,
  MoreHorizontal,
  Calendar,
  FileText,
  Tag,
  Clock,
  Download,
  ExternalLink,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface EmailViewerProps {
  email: ParsedEmail
  onClose: () => void
  onReply: (email: ParsedEmail) => void
  onForward: (email: ParsedEmail) => void
  onDelete: (email: ParsedEmail, e: React.MouseEvent) => void
  onToggleStar: (email: ParsedEmail, e: React.MouseEvent) => void
  onToggleRead: (email: ParsedEmail, e: React.MouseEvent) => void
}

export function EmailViewer({
  email,
  onClose,
  onReply,
  onForward,
  onDelete,
  onToggleStar,
  onToggleRead,
}: EmailViewerProps) {
  const gmail = useGmail()
  const [isReplying, setIsReplying] = useState(false)
  const [isForwarding, setIsForwarding] = useState(false)
  const [showingAttachment, setShowingAttachment] = useState<string | null>(null)

  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleString([], {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get avatar fallback
  const getAvatarFallback = (name: string): string => {
    if (!name) return "?"

    const parts = name.split(" ")
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase()
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  // Handle attachment download
  const handleAttachmentDownload = async (attachmentId: string, filename: string) => {
    try {
      const attachmentData = await gmail.getAttachment(email.id, attachmentId)

      // Create download link
      const link = document.createElement("a")
      link.href = `data:application/octet-stream;base64,${attachmentData}`
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Failed to download attachment:", error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Email header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={(e) => onToggleRead(email, e)} className="gap-1">
              {email.isRead ? (
                <>
                  <MailOpen className="h-4 w-4" />
                  Mark as unread
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Mark as read
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => onDelete(email, e)}
              className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">{email.subject}</h2>

        <div className="flex items-start gap-3">
          <Avatar className="mt-1">
            {email.from.name && (
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(email.from.name)}&background=random`}
                alt={email.from.name}
              />
            )}
            <AvatarFallback>{getAvatarFallback(email.from.name || email.from.email)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {email.from.name || email.from.email}
                  <span className="text-sm font-normal text-muted-foreground ml-2">&lt;{email.from.email}&gt;</span>
                </div>

                <div className="text-sm text-muted-foreground">
                  To: {email.to.map((recipient) => recipient.name || recipient.email).join(", ")}
                  {email.cc && email.cc.length > 0 && (
                    <div>Cc: {email.cc.map((recipient) => recipient.name || recipient.email).join(", ")}</div>
                  )}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">{formatDate(email.date)}</div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={() => setIsReplying(true)} className="gap-1">
                <Reply className="h-4 w-4" />
                Reply
              </Button>

              <Button variant="outline" size="sm" onClick={() => setIsForwarding(true)} className="gap-1">
                <Forward className="h-4 w-4" />
                Forward
              </Button>

              <Button variant="outline" size="sm" onClick={(e) => onToggleStar(email, e)} className="gap-1">
                {email.isStarred ? (
                  <>
                    <StarOff className="h-4 w-4" />
                    Unstar
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4" />
                    Star
                  </>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2">
                    <Archive className="h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Create Event
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <FileText className="h-4 w-4" />
                    Create Document
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Tag className="h-4 w-4" />
                    Add Label
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Clock className="h-4 w-4" />
                    Snooze
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Email body */}
      <div className="flex-1 overflow-auto p-4">
        {/* Attachments */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium mb-2">Attachments ({email.attachments.length})</h3>
            <div className="flex flex-wrap gap-2">
              {email.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center p-2 border rounded-md bg-white">
                  <div className="mr-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" title={attachment.filename}>
                      {attachment.filename}
                    </div>
                    <div className="text-xs text-gray-500">{Math.round(attachment.size / 1024)} KB</div>
                  </div>
                  <div className="flex items-center ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAttachmentDownload(attachment.id, attachment.filename)}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>

                    {attachment.mimeType.startsWith("image/") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowingAttachment(attachment.id)}
                        title="View"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Email content */}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: email.body }} />
      </div>

      {/* Reply/Forward area (placeholder) */}
      {(isReplying || isForwarding) && (
        <div className="border-t p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">{isReplying ? "Reply" : "Forward"}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsReplying(false)
                setIsForwarding(false)
              }}
            >
              Cancel
            </Button>
          </div>

          <textarea
            className="w-full p-2 border rounded-md min-h-[150px]"
            placeholder={isReplying ? "Write your reply..." : "Add a message..."}
            autoFocus
          />

          <div className="flex justify-end mt-2">
            <Button>Send</Button>
          </div>
        </div>
      )}

      {/* Attachment viewer modal (placeholder) */}
      {showingAttachment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium">
                {email.attachments?.find((a) => a.id === showingAttachment)?.filename}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowingAttachment(null)}>
                Close
              </Button>
            </div>

            <div className="flex justify-center">
              <img
                src={`data:image/jpeg;base64,${email.attachments?.find((a) => a.id === showingAttachment)?.content}`}
                alt={email.attachments?.find((a) => a.id === showingAttachment)?.filename || "Attachment"}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
