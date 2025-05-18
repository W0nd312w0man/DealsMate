"use client"

import { useState, useEffect } from "react"
import { useGmail } from "@/contexts/gmail-context"
import type { ParsedEmail } from "@/types/gmail"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, StarOff, Trash2, Mail, MailOpen, Paperclip, InboxIcon, Send } from "lucide-react"

interface EmailInboxProps {
  className?: string
}

export function EmailInbox({ className }: EmailInboxProps) {
  const gmail = useGmail()
  const [emails, setEmails] = useState<ParsedEmail[]>([])
  const [activeTab, setActiveTab] = useState("inbox")
  const [searchQuery, setSearchQuery] = useState("")
  const [isComposingEmail, setIsComposingEmail] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<ParsedEmail | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // TODO: Fetch emails from your data source
  }, [])

  // Refresh emails on mount and when tab changes
  useEffect(() => {
    if (gmail.isConnected) {
      refreshEmails()
    }
  }, [gmail.isConnected, activeTab])

  // Filter emails based on active tab
  const getFilteredEmails = (): ParsedEmail[] => {
    const allEmails = Object.values(gmail.messages)

    // Filter by tab
    let filteredEmails = allEmails

    switch (activeTab) {
      case "inbox":
        filteredEmails = allEmails.filter((email) => email.labels.includes("INBOX"))
        break
      case "sent":
        filteredEmails = allEmails.filter((email) => email.labels.includes("SENT"))
        break
      case "starred":
        filteredEmails = allEmails.filter((email) => email.isStarred)
        break
      case "important":
        filteredEmails = allEmails.filter((email) => email.labels.includes("IMPORTANT"))
        break
      case "drafts":
        filteredEmails = allEmails.filter((email) => email.labels.includes("DRAFT"))
        break
      case "trash":
        filteredEmails = allEmails.filter((email) => email.labels.includes("TRASH"))
        break
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filteredEmails = filteredEmails.filter(
        (email) =>
          email.subject.toLowerCase().includes(query) ||
          email.from.email.toLowerCase().includes(query) ||
          email.from.name?.toLowerCase().includes(query) ||
          email.snippet.toLowerCase().includes(query),
      )
    }

    // Sort by date (newest first)
    return filteredEmails.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  // Refresh emails
  const refreshEmails = async () => {
    if (!gmail.isConnected) return

    setIsRefreshing(true)

    try {
      let query = ""

      // Set query based on active tab
      switch (activeTab) {
        case "inbox":
          query = "in:inbox"
          break
        case "sent":
          query = "in:sent"
          break
        case "starred":
          query = "is:starred"
          break
        case "important":
          query = "is:important"
          break
        case "drafts":
          query = "in:drafts"
          break
        case "trash":
          query = "in:trash"
          break
      }

      await gmail.refreshMessages(query)
    } catch (error) {
      console.error("Failed to refresh emails:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleEmailSelect = (email: ParsedEmail) => {
    setSelectedEmail(email)
  }

  const handleStarToggle = (email: ParsedEmail) => {
    // TODO: Implement star toggle
  }

  const handleTrashEmail = (email: ParsedEmail) => {
    // TODO: Implement trash email
  }

  const handleReadToggle = (email: ParsedEmail) => {
    // TODO: Implement read toggle
  }

  // Handle email star toggle
  /*const handleStarToggle = (email: ParsedEmail, e: React.MouseEvent) => {
    e.stopPropagation()
    gmail.toggleStar(email.id, !email.isStarred)
  }

  // Handle email trash
  const handleTrashEmail = (email: ParsedEmail, e: React.MouseEvent) => {
    e.stopPropagation()
    gmail.trashMessage(email.id)
  }

  // Handle email mark as read/unread
  const handleReadToggle = (email: ParsedEmail, e: React.MouseEvent) => {
    e.stopPropagation()

    if (email.isRead) {
      gmail.markAsUnread(email.id)
    } else {
      gmail.markAsRead(email.id)
    }
  }*/

  // Format date
  const formatDate = (date: Date): string => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date >= today) {
      // Today, show time
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (date >= yesterday) {
      // Yesterday
      return "Yesterday"
    } else if (date.getFullYear() === now.getFullYear()) {
      // This year, show month and day
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    } else {
      // Different year, show year
      return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" })
    }
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

  // Render email list
  const renderEmailList = () => {
    const filteredEmails = getFilteredEmails()

    if (gmail.isLoading && !isRefreshing) {
      // Show loading skeletons
      return Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 border-b">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))
    }

    if (filteredEmails.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-gray-100 p-3 mb-4">
            {activeTab === "inbox" ? (
              <InboxIcon className="h-6 w-6 text-gray-400" />
            ) : activeTab === "sent" ? (
              <Send className="h-6 w-6 text-gray-400" />
            ) : activeTab === "starred" ? (
              <Star className="h-6 w-6 text-gray-400" />
            ) : (
              <Mail className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-medium">No emails found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery ? "Try a different search term" : `Your ${activeTab} is empty`}
          </p>
        </div>
      )
    }

    return filteredEmails.map((email) => (
      <div
        key={email.id}
        className={`flex items-start gap-3 p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
          !email.isRead ? "bg-blue-50/30" : ""
        } ${selectedEmail?.id === email.id ? "bg-blue-100/50" : ""}`}
        onClick={() => handleEmailSelect(email)}
      >
        <Avatar className="flex-shrink-0">
          {email.from.name && (
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(email.from.name)}&background=random`}
              alt={email.from.name}
            />
          )}
          <AvatarFallback>{getAvatarFallback(email.from.name || email.from.email)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="font-medium truncate">{email.from.name || email.from.email}</div>
            <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">{formatDate(email.date)}</div>
          </div>

          <div className="text-sm font-medium truncate">{email.subject}</div>

          <div className="text-xs text-muted-foreground line-clamp-1">{email.snippet}</div>

          {email.attachments.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Paperclip className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {email.attachments.length === 1 ? "1 attachment" : `${email.attachments.length} attachments`}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            className="text-muted-foreground hover:text-yellow-500 transition-colors"
            onClick={(e) => handleStarToggle(email, e)}
            title={email.isStarred ? "Unstar" : "Star"}
          >
            {email.isStarred ? (
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            ) : (
              <StarOff className="h-4 w-4" />
            )}
          </button>

          <button
            className="text-muted-foreground hover:text-blue-500 transition-colors"
            onClick={(e) => handleReadToggle(email, e)}
            title={email.isRead ? "Mark as unread" : "Mark as read"}
          >
            {email.isRead ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4 text-blue-500" />}
          </button>

          <button
            className="text-muted-foreground hover:text-red-500 transition-colors"
            onClick={(e) => handleTrashEmail(email, e)}
            title="Move to trash"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    ))
  }

  // If not connected to Gmail
  if (!gmail.isConnected) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Email Inbox</CardTitle>
          <CardDescription>Connect your Gmail account to view your emails</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-gray-100 p-4 mb-4">
            <Mail className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium">Gmail Not Connected</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Connect your Gmail account to send and receive emails directly within DealMate.
          </p>
          <Button
            onClick={gmail.connect}
            className="mt-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
          >
            Connect Gmail
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Email Inbox</CardTitle>
        <CardDescription>Manage your emails</CardDescription>
      </CardHeader>
      <CardContent>
        {gmail.isConnected ? (
          <div className="flex h-[600px]">
            <div className="w-1/3 border-r">
              {emails.map((email) => (
                <div key={email.id} onClick={() => handleEmailSelect(email)}>
                  {email.subject}
                </div>
              ))}
            </div>
            <div className="w-2/3">
              {selectedEmail ? <div>{selectedEmail.body.text}</div> : <div>Select an email to view</div>}
            </div>
          </div>
        ) : (
          <div>Connect to Gmail to view your inbox</div>
        )}
      </CardContent>
    </Card>
  )
}
