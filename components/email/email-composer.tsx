"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { EmailCompose, EmailAddress } from "@/types/gmail"
import { Paperclip, X, Send, ChevronDown, ChevronUp, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface EmailComposerProps {
  isOpen: boolean
  onClose: () => void
  onSend: (email: EmailCompose) => Promise<void>
  replyTo?: {
    to: EmailAddress[]
    cc?: EmailAddress[]
    subject: string
    threadId?: string
    messageId?: string
  }
}

export function EmailComposer({ isOpen, onClose, onSend, replyTo }: EmailComposerProps) {
  const [to, setTo] = useState<string>(
    replyTo
      ? replyTo.to
          .map((recipient) => (recipient.name ? `"${recipient.name}" <${recipient.email}>` : recipient.email))
          .join(", ")
      : "",
  )
  const [cc, setCc] = useState<string>(
    replyTo?.cc
      ? replyTo.cc
          .map((recipient) => (recipient.name ? `"${recipient.name}" <${recipient.email}>` : recipient.email))
          .join(", ")
      : "",
  )
  const [bcc, setBcc] = useState<string>("")
  const [subject, setSubject] = useState<string>(
    replyTo ? (replyTo.subject.startsWith("Re:") ? replyTo.subject : `Re: ${replyTo.subject}`) : "",
  )
  const [body, setBody] = useState<string>("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [showCcBcc, setShowCcBcc] = useState<boolean>(!!replyTo?.cc)
  const [isSending, setIsSending] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Only reset if not a reply
      if (!replyTo) {
        setTo("")
        setCc("")
        setBcc("")
        setSubject("")
        setBody("")
        setAttachments([])
        setShowCcBcc(false)
      }
    }
  }, [isOpen, replyTo])

  // Parse email addresses
  const parseEmailAddresses = (addressesString: string): EmailAddress[] => {
    if (!addressesString.trim()) return []

    return addressesString
      .split(",")
      .map((address) => {
        address = address.trim()
        const match = address.match(/"?([^"<]+)"?\s*<?([^>]+@[^>]+)>?/)

        if (match) {
          return {
            name: match[1].trim(),
            email: match[2].trim(),
          }
        }

        return { email: address }
      })
      .filter((addr) => addr.email)
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)

      // Check file size (25MB limit)
      const oversizedFiles = newFiles.filter((file) => file.size > 25 * 1024 * 1024)
      if (oversizedFiles.length > 0) {
        toast({
          title: "File too large",
          description: `Files must be under 25MB: ${oversizedFiles.map((f) => f.name).join(", ")}`,
          variant: "destructive",
        })

        // Filter out oversized files
        const validFiles = newFiles.filter((file) => file.size <= 25 * 1024 * 1024)
        setAttachments((prev) => [...prev, ...validFiles])
      } else {
        setAttachments((prev) => [...prev, ...newFiles])
      }
    }
  }

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Handle send
  const handleSend = async () => {
    // Validate recipients
    const toAddresses = parseEmailAddresses(to)
    if (toAddresses.length === 0) {
      toast({
        title: "Missing recipients",
        description: "Please specify at least one recipient",
        variant: "destructive",
      })
      return
    }

    // Validate subject
    if (!subject.trim()) {
      toast({
        title: "Missing subject",
        description: "Please specify a subject for your email",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      const emailData: EmailCompose = {
        to: toAddresses,
        subject,
        body,
        isHtml: false, // Plain text for now
        attachments,
      }

      // Add CC if present
      const ccAddresses = parseEmailAddresses(cc)
      if (ccAddresses.length > 0) {
        emailData.cc = ccAddresses
      }

      // Add BCC if present
      const bccAddresses = parseEmailAddresses(bcc)
      if (bccAddresses.length > 0) {
        emailData.bcc = bccAddresses
      }

      // Add thread ID and message ID if replying
      if (replyTo) {
        if (replyTo.threadId) {
          emailData.threadId = replyTo.threadId
        }
        if (replyTo.messageId) {
          emailData.replyToMessageId = replyTo.messageId
        }
      }

      await onSend(emailData)

      toast({
        title: "Email Sent",
        description: "Your email has been sent successfully",
      })
    } catch (error) {
      console.error("Failed to send email:", error)

      toast({
        title: "Failed to send email",
        description: error instanceof Error ? error.message : "An error occurred while sending the email",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{replyTo ? "Reply to Email" : "Compose New Email"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-[auto_1fr] items-center gap-2">
            <Label htmlFor="to" className="text-right">
              To:
            </Label>
            <Input id="to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="recipient@example.com" />
          </div>

          {showCcBcc && (
            <>
              <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                <Label htmlFor="cc" className="text-right">
                  Cc:
                </Label>
                <Input id="cc" value={cc} onChange={(e) => setCc(e.target.value)} placeholder="cc@example.com" />
              </div>

              <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                <Label htmlFor="bcc" className="text-right">
                  Bcc:
                </Label>
                <Input id="bcc" value={bcc} onChange={(e) => setBcc(e.target.value)} placeholder="bcc@example.com" />
              </div>
            </>
          )}

          <div className="flex justify-end">
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setShowCcBcc(!showCcBcc)}>
              {showCcBcc ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Hide Cc/Bcc
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Show Cc/Bcc
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-[auto_1fr] items-center gap-2">
            <Label htmlFor="subject" className="text-right">
              Subject:
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>

          <div className="grid grid-cols-[auto_1fr] items-start gap-2">
            <Label htmlFor="body" className="text-right pt-2">
              Body:
            </Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message here..."
              className="min-h-[200px]"
            />
          </div>

          {attachments.length > 0 && (
            <div className="grid grid-cols-[auto_1fr] items-start gap-2">
              <Label className="text-right pt-2">Attachments:</Label>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[300px]">{file.name}</span>
                      <span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAttachment(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-1">
              <Paperclip className="h-4 w-4" />
              Attach
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Clock className="h-4 w-4" />
              Schedule
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={isSending} className="gap-1">
              {isSending && <span className="animate-spin">⟳</span>}
              <Send className="h-4 w-4 mr-1" />
              Send
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
