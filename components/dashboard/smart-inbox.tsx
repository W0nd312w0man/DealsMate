"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Star,
  StarOff,
  Filter,
  ArrowUp,
  ArrowDown,
  RefreshCcw,
  Paperclip,
  FileText,
  FolderOpen,
  Calendar,
  ClipboardList,
  Save,
  ChevronDown,
  ChevronUp,
  Building,
  Mail,
  Copy,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { analyzeEmail } from "@/services/email-analysis-service"
import { CompactAttachmentNotification } from "@/components/email/compact-attachment-notification"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { useEmailViewPreferences } from "@/hooks/use-email-view-preferences"
import { EmailInlineView } from "@/components/email/email-inline-view"
import Link from "next/link"

// Safe sessionStorage access
const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(key)
    }
    return null
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, value)
    }
  },
}

interface Email {
  id: string
  from: {
    name: string
    email: string
    avatar?: string
  }
  subject: string
  preview: string
  date: string
  read: boolean
  starred: boolean
  category: "transaction" | "lead" | "client" | "workspace" | "other"
  labels?: string[]
  workspaceId?: string
  attachments?: {
    id: string
    fileName: string
    fileType: string
    fileSize: number
  }[]
}

interface SmartInboxProps {
  className?: string
  filterUnreadOnly?: boolean
  onFilterChange?: (filterUnreadOnly: boolean) => void
  showAttachmentDetection?: boolean
  isSetUp?: boolean // New prop to track if inbox is set up
}

export function SmartInbox({
  className,
  filterUnreadOnly = false,
  onFilterChange,
  showAttachmentDetection = false,
  isSetUp: propIsSetUp = false, // Default to not set up
}: SmartInboxProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [showUnreadOnly, setShowUnreadOnly] = useState(filterUnreadOnly)
  const [showAttachmentsOnly, setShowAttachmentsOnly] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any[]>([])
  const [dismissedEmails, setDismissedEmails] = useState<string[]>([])
  const [expandedEmails, setExpandedEmails] = useState<string[]>([])
  const [expandedAttachments, setExpandedAttachments] = useState<string[]>([])
  const { toast } = useToast()
  const { emailViewPreference } = useEmailViewPreferences()
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [inlineViewEmailId, setInlineViewEmailId] = useState<string | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  // Gmail authentication states
  const [gmailAccessToken, setGmailAccessToken] = useState<string | null>(null)
  const [gmailRefreshToken, setGmailRefreshToken] = useState<string | null>(null)
  const [gmailTokenExpiry, setGmailTokenExpiry] = useState<string | null>(null)
  const [showToken, setShowToken] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isSetUp, setIsSetUp] = useState(propIsSetUp)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emails, setEmails] = useState<Email[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // Set mounted state to ensure we only access browser APIs after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Check for Gmail tokens on component mount and when window is focused
  useEffect(() => {
    if (!isMounted) return

    const checkGmailAuth = () => {
      console.log("Checking Gmail auth...")
      const accessToken = safeSessionStorage.getItem("gmail_access_token")
      const refreshToken = safeSessionStorage.getItem("gmail_refresh_token")
      const tokenExpiry = safeSessionStorage.getItem("gmail_token_expiry")
      const email = safeSessionStorage.getItem("gmail_user_email")

      console.log("Access token:", accessToken ? "Present" : "Not present")
      console.log("User email:", email)

      if (accessToken) {
        setGmailAccessToken(accessToken)
        setGmailRefreshToken(refreshToken)
        setGmailTokenExpiry(tokenExpiry)
        setUserEmail(email)
        setIsSetUp(true)

        // Fetch emails if we have a token
        fetchEmails(accessToken)
      } else {
        setIsSetUp(propIsSetUp)
      }
    }

    // Check auth on mount
    checkGmailAuth()

    // Also check when window is focused (in case user authenticated in another tab)
    window.addEventListener("focus", checkGmailAuth)
    return () => {
      window.removeEventListener("focus", checkGmailAuth)
    }
  }, [isMounted, propIsSetUp])

  // Fetch emails from Gmail
  const fetchEmails = async (token: string) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Fetching emails with token:", token.substring(0, 10) + "...")

      // Create mock emails for demonstration
      const mockEmails: Email[] = [
        {
          id: "email-1",
          from: {
            name: "Karen Chen",
            email: "karen.chen@example.com",
          },
          subject: "Offer Accepted on 15614 Yermo Street",
          preview:
            "Great news! The sellers have accepted your offer on the property at 15614 Yermo Street, Whittier, CA 90603.",
          date: "2023-05-15",
          read: false,
          starred: true,
          category: "transaction",
          labels: ["Important", "Transaction"],
          attachments: [
            {
              id: "attachment-1",
              fileName: "Purchase_Agreement_15614_Yermo_St.pdf",
              fileType: "application/pdf",
              fileSize: 2500000,
            },
          ],
        },
        {
          id: "email-2",
          from: {
            name: "Michael Rodriguez",
            email: "michael.rodriguez@example.com",
          },
          subject: "Inspection Report for 8721 Oakwood Lane",
          preview:
            "Please find attached the inspection report for 8721 Oakwood Lane. There are a few items that need attention.",
          date: "2023-05-14",
          read: true,
          starred: false,
          category: "transaction",
          labels: ["Transaction"],
          attachments: [
            {
              id: "attachment-2",
              fileName: "Inspection_Report_8721_Oakwood.pdf",
              fileType: "application/pdf",
              fileSize: 3200000,
            },
            {
              id: "attachment-3",
              fileName: "Inspection_Photos.zip",
              fileType: "application/zip",
              fileSize: 15000000,
            },
          ],
        },
        {
          id: "email-3",
          from: {
            name: "Sarah Johnson",
            email: "sarah.johnson@example.com",
          },
          subject: "Interested in listing my property",
          preview: "I'm interested in listing my property at 4532 Maple Avenue. Can we schedule a time to discuss?",
          date: "2023-05-13",
          read: false,
          starred: false,
          category: "lead",
          labels: ["Lead", "New"],
        },
      ]

      // In a real implementation, we would fetch emails from Gmail API
      // const response = await GmailService.listThreads(token);
      // const threads = response.threads;
      // ... process threads into emails format

      console.log("Fetched emails:", mockEmails.length)
      setEmails(mockEmails)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching emails:", error)
      setError("Failed to fetch emails. Please try again.")
      setIsLoading(false)
    }
  }

  // Handle copying token to clipboard
  const copyTokenToClipboard = () => {
    if (!isMounted) return

    if (gmailAccessToken) {
      navigator.clipboard.writeText(gmailAccessToken)
      setCopySuccess(true)
      toast({
        title: "Token Copied",
        description: "Access token copied to clipboard",
        duration: 2000,
      })

      // Reset copy success after 2 seconds
      setTimeout(() => {
        setCopySuccess(false)
      }, 2000)
    }
  }

  // Update filter when prop changes
  useEffect(() => {
    setShowUnreadOnly(filterUnreadOnly)
  }, [filterUnreadOnly])

  // Simulate checking for new emails with attachments
  useEffect(() => {
    if (!isMounted || !showAttachmentDetection) return

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
        }
      }
    }

    // Check for new emails on component mount
    checkForNewEmails()
  }, [dismissedEmails, showAttachmentDetection, isMounted])

  const handleDismiss = (emailId: string) => {
    setDismissedEmails((prev) => [...prev, emailId])
    setAnalysisResults((prev) => prev.filter((result) => result.emailData.id !== emailId))
  }

  const handleActionComplete = (emailId: string) => {
    setDismissedEmails((prev) => [...prev, emailId])
    setAnalysisResults((prev) => prev.filter((result) => result.emailData.id !== emailId))
  }

  // Toggle expanded state for email actions
  const toggleEmailExpanded = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedEmails((prev) => (prev.includes(id) ? prev.filter((emailId) => emailId !== id) : [...prev, id]))
  }

  // Toggle expanded state for attachment actions
  const toggleAttachmentExpanded = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedAttachments((prev) => (prev.includes(id) ? prev.filter((attachId) => attachId !== id) : [...prev, id]))
  }

  // Handle quick actions
  const handleQuickAction = (action: string, email: Email, attachmentId?: string) => {
    const item = attachmentId ? email.attachments?.find((a) => a.id === attachmentId) : email

    const itemType = attachmentId ? "attachment" : "email"
    const itemName = attachmentId ? item?.fileName || "attachment" : email.subject

    let actionText = ""
    let actionIcon = ""

    switch (action) {
      case "link-transaction":
        actionText = `Link ${itemType} to transaction`
        actionIcon = "🏢"
        break
      case "link-workspace":
        actionText = `Link ${itemType} to workspace`
        actionIcon = "📁"
        break
      case "create-event":
        actionText = `Create calendar event from ${itemType}`
        actionIcon = "📅"
        break
      case "create-task":
        actionText = `Create task from ${itemType}`
        actionIcon = "📋"
        break
      case "save-attachment":
        actionText = `Save ${itemType} to documents`
        actionIcon = "💾"
        break
    }

    toast({
      title: `${actionIcon} ${actionText}`,
      description: `"${itemName}" will be processed.`,
      duration: 3000,
    })
  }

  // Handle email click based on user preference
  const handleEmailClick = (email: Email) => {
    // Mark as read if not already
    if (!email.read) {
      // In a real app, this would update the state or call an API
      console.log(`Marking email ${email.id} as read`)
    }

    // Set the selected email for all view types
    setSelectedEmail(email)

    // Handle different view preferences
    switch (emailViewPreference) {
      case "popup-modal":
        // Open the modal view
        setIsEmailModalOpen(true)
        // Close other views
        setInlineViewEmailId(null)
        setIsPanelOpen(false)
        break

      case "expanded-inline":
        // Toggle the inline view
        setInlineViewEmailId(inlineViewEmailId === email.id ? null : email.id)
        // Close other views
        setIsEmailModalOpen(false)
        setIsPanelOpen(false)
        break

      case "bottom-right-panel":
        // Open the panel view
        setIsPanelOpen(true)
        // Close other views
        setIsEmailModalOpen(false)
        setInlineViewEmailId(null)
        break

      default:
        // Default to modal view
        setIsEmailModalOpen(true)
        setInlineViewEmailId(null)
        setIsPanelOpen(false)
    }
  }

  // Close all email views
  const closeEmailView = () => {
    setIsEmailModalOpen(false)
    setInlineViewEmailId(null)
    setIsPanelOpen(false)
    setSelectedEmail(null)
  }

  // Refresh emails
  const handleRefresh = () => {
    if (gmailAccessToken) {
      fetchEmails(gmailAccessToken)
    }
  }

  // Filter emails based on active tab, search query, and unread filter
  const filteredEmails = emails
    .filter((email) => {
      // Filter by unread
      if (showUnreadOnly && email.read) {
        return false
      }

      // Filter by attachments
      if (showAttachmentsOnly && (!email.attachments || email.attachments.length === 0)) {
        return false
      }

      // Filter by tab
      if (activeTab !== "all" && email.category !== activeTab) {
        return false
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          email.from.name.toLowerCase().includes(query) ||
          email.from.email.toLowerCase().includes(query) ||
          email.subject.toLowerCase().includes(query) ||
          email.preview.toLowerCase().includes(query)
        )
      }

      return true
    })
    .sort((a, b) => {
      // Sort by date (simplified for demo)
      if (sortDirection === "asc") {
        return a.date.localeCompare(b.date)
      } else {
        return b.date.localeCompare(a.date)
      }
    })

  const toggleStar = (id: string) => {
    // In a real app, this would update the state or call an API
    console.log(`Toggle star for email ${id}`)

    // For demo purposes, let's update the UI immediately
    const updatedEmails = emails.map((email) => {
      if (email.id === id) {
        return { ...email, starred: !email.starred }
      }
      return email
    })

    setEmails(updatedEmails)

    // Show a toast notification
    toast({
      title: `Email ${emails.find((e) => e.id === id)?.starred ? "unstarred" : "starred"}`,
      description: "Your changes have been saved.",
      duration: 2000,
    })
  }

  const toggleEmailSelection = (id: string) => {
    if (selectedEmails.includes(id)) {
      setSelectedEmails(selectedEmails.filter((emailId) => emailId !== id))
    } else {
      setSelectedEmails([...selectedEmails, id])
    }
  }

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const toggleUnreadFilter = () => {
    const newValue = !showUnreadOnly
    setShowUnreadOnly(newValue)
    if (onFilterChange) {
      onFilterChange(newValue)
    }
  }

  const toggleAttachmentsFilter = () => {
    setShowAttachmentsOnly(!showAttachmentsOnly)
  }

  // Render action buttons for email or attachment
  const renderActionButtons = (email: Email, attachmentId?: string) => {
    return (
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-7 w-7 p-0 rounded-full bg-purple-100 border-purple-200 hover:bg-purple-200 hover:text-purple-800"
                onClick={() => handleQuickAction("link-transaction", email, attachmentId)}
              >
                <Building className="h-3.5 w-3.5 text-purple-700" />
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
              <Button
                size="sm"
                variant="outline"
                className="h-7 w-7 p-0 rounded-full bg-blue-100 border-blue-200 hover:bg-blue-200 hover:text-blue-800"
                onClick={() => handleQuickAction("link-workspace", email, attachmentId)}
              >
                <FolderOpen className="h-3.5 w-3.5 text-blue-700" />
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
              <Button
                size="sm"
                variant="outline"
                className="h-7 w-7 p-0 rounded-full bg-teal-100 border-teal-200 hover:bg-teal-200 hover:text-teal-800"
                onClick={() => handleQuickAction("create-event", email, attachmentId)}
              >
                <Calendar className="h-3.5 w-3.5 text-teal-700" />
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
              <Button
                size="sm"
                variant="outline"
                className="h-7 w-7 p-0 rounded-full bg-indigo-100 border-indigo-200 hover:bg-indigo-200 hover:text-indigo-800"
                onClick={() => handleQuickAction("create-task", email, attachmentId)}
              >
                <ClipboardList className="h-3.5 w-3.5 text-indigo-700" />
                <span className="sr-only">Create Task</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Create Task</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {attachmentId && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 w-7 p-0 rounded-full bg-amber-100 border-amber-200 hover:bg-amber-200 hover:text-amber-800"
                  onClick={() => handleQuickAction("save-attachment", email, attachmentId)}
                >
                  <Save className="h-3.5 w-3.5 text-amber-700" />
                  <span className="sr-only">Save Document</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Save Document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {!attachmentId && email.attachments && email.attachments.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 w-7 p-0 rounded-full bg-amber-100 border-amber-200 hover:bg-amber-200 hover:text-amber-800"
                  onClick={() => handleQuickAction("save-attachment", email)}
                >
                  <Save className="h-3.5 w-3.5 text-amber-700" />
                  <span className="sr-only">Save Attachments</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Save Attachments</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    )
  }

  // Determine if Gmail is connected
  const isGmailConnected = !!gmailAccessToken

  return (
    <Card className={cn("shadow-soft card-hover overflow-hidden", className)}>
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-poppins text-purple-700">Smart Inbox</CardTitle>
            <CardDescription>{userEmail ? `Connected to ${userEmail}` : "No unread messages"}</CardDescription>
          </div>

          {isSetUp ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "border-purple-200 hover:bg-purple-50 hover:text-purple-700",
                  showUnreadOnly ? "bg-purple-100 text-purple-700" : "text-purple-700",
                )}
                onClick={toggleUnreadFilter}
              >
                {showUnreadOnly ? "Show All" : "Unread Only"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "border-purple-200 hover:bg-purple-50 hover:text-purple-700",
                  showAttachmentsOnly ? "bg-purple-100 text-purple-700" : "text-purple-700",
                )}
                onClick={toggleAttachmentsFilter}
              >
                <Paperclip className="h-3.5 w-3.5 mr-1" />
                {showAttachmentsOnly ? "All Emails" : "With Attachments"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
                onClick={toggleSortDirection}
              >
                {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </CardHeader>

      {isGmailConnected && isMounted && (
        <div className="px-6 py-3 bg-blue-50 border-y border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-700">Gmail Access Token</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showToken ? "Hide" : "Show"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                onClick={copyTokenToClipboard}
                disabled={!gmailAccessToken}
              >
                {copySuccess ? (
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {copySuccess ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {showToken && gmailAccessToken && (
            <div className="bg-gray-100 p-2 rounded-md overflow-x-auto">
              <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap break-all">{gmailAccessToken}</pre>
            </div>
          )}

          {gmailTokenExpiry && (
            <div className="mt-2 text-xs text-blue-600">
              Token expires: {new Date(Number.parseInt(gmailTokenExpiry)).toLocaleString()}
            </div>
          )}
        </div>
      )}

      {isSetUp ? (
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search emails..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="transaction">Transactions</TabsTrigger>
                <TabsTrigger value="workspace">Workspace</TabsTrigger>
                <TabsTrigger value="lead">Leads</TabsTrigger>
                <TabsTrigger value="client">Clients</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Loading state */}
                {isLoading && (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
                  </div>
                )}

                {/* Attachment Notifications Section */}
                {showAttachmentDetection && analysisResults.length > 0 && (
                  <div className="mb-4">
                    {analysisResults.map((result) => (
                      <CompactAttachmentNotification
                        key={result.emailData.id}
                        analysisResult={result}
                        onDismiss={() => handleDismiss(result.emailData.id)}
                        onActionComplete={() => handleActionComplete(result.emailData.id)}
                      />
                    ))}
                  </div>
                )}

                <div className="space-y-1 max-h-[650px] overflow-y-auto pr-2">
                  {!isLoading && filteredEmails.length > 0 ? (
                    filteredEmails.map((email) => (
                      <div key={email.id} className="mb-2">
                        <div
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                            email.read ? "hover:bg-purple-50/30" : "bg-purple-50/50 hover:bg-purple-50/70 font-medium",
                            selectedEmails.includes(email.id) && "bg-purple-100/70",
                            email.attachments && email.attachments.length > 0 && "border-l-2 border-purple-300",
                          )}
                          onClick={() => handleEmailClick(email)}
                        >
                          <div className="flex-shrink-0">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={email.from.avatar || "/placeholder.svg"} alt={email.from.name} />
                              <AvatarFallback className="bg-purple-100 text-purple-700">
                                {email.from.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="font-medium truncate">{email.from.name}</div>
                              <div className="text-xs text-muted-foreground">{email.date}</div>
                            </div>
                            <div className="text-sm font-medium truncate">{email.subject}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">{email.preview}</div>
                            {email.labels && email.labels.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {email.labels.map((label) => (
                                  <Badge key={label} variant="outline" className="text-xs py-0 px-1.5">
                                    {label}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {email.attachments && email.attachments.length > 0 && (
                              <div className="relative group">
                                <div className="flex items-center gap-1 mt-1 cursor-pointer">
                                  <Paperclip className="h-3 w-3 text-purple-500" />
                                  <span className="text-xs text-muted-foreground">
                                    {email.attachments.length === 1
                                      ? "1 attachment"
                                      : `${email.attachments.length} attachments`}
                                  </span>
                                  {email.attachments.some((att) => att.fileType.includes("pdf")) && (
                                    <span className="inline-flex items-center rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700">
                                      PDF
                                    </span>
                                  )}
                                  {email.attachments.some((att) => att.fileType.includes("sheet")) && (
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
                                      XLS
                                    </span>
                                  )}
                                  {email.attachments.some((att) => att.fileType.includes("document")) && (
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                                      DOC
                                    </span>
                                  )}
                                </div>

                                {/* Hover tooltip with attachment details */}
                                <div className="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 p-2 z-10 hidden group-hover:block">
                                  <div className="text-xs font-medium mb-1">Attachments:</div>
                                  <div className="space-y-1 max-h-32 overflow-y-auto">
                                    {email.attachments.map((attachment) => (
                                      <div key={attachment.id} className="flex items-center gap-1 text-xs">
                                        <FileText className="h-3 w-3 text-purple-500" />
                                        <span className="truncate">{attachment.fileName}</span>
                                        <span className="text-xs text-muted-foreground ml-auto">
                                          {(attachment.fileSize / 1024 / 1024).toFixed(1)} MB
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <button
                              className="flex-shrink-0 text-muted-foreground hover:text-yellow-500 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleStar(email.id)
                              }}
                            >
                              {email.starred ? (
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              className="flex-shrink-0 text-muted-foreground hover:text-purple-500 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleEmailExpanded(email.id, e)
                              }}
                            >
                              {expandedEmails.includes(email.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Inline Email View - Only show if this email is selected for inline view */}
                        {inlineViewEmailId === email.id && (
                          <EmailInlineView email={email} onClose={closeEmailView} onStarToggle={toggleStar} />
                        )}

                        {/* Email Quick Actions */}
                        {expandedEmails.includes(email.id) && (
                          <div className="ml-12 mt-1 mb-2 bg-purple-50/30 p-2 rounded-md border border-purple-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Mail className="h-4 w-4 text-purple-600" />
                              <span className="text-sm font-medium text-purple-700">Email Actions</span>
                            </div>
                            {renderActionButtons(email)}

                            {/* Attachment Actions */}
                            {email.attachments && email.attachments.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-purple-100">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Paperclip className="h-4 w-4 text-purple-600" />
                                    <span className="text-sm font-medium text-purple-700">Attachment Actions</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleAttachmentExpanded(email.id, e)
                                    }}
                                  >
                                    {expandedAttachments.includes(email.id) ? "Hide Attachments" : "Show Attachments"}
                                    {expandedAttachments.includes(email.id) ? (
                                      <ChevronUp className="h-3 w-3 ml-1" />
                                    ) : (
                                      <ChevronDown className="h-3 w-3 ml-1" />
                                    )}
                                  </Button>
                                </div>

                                {expandedAttachments.includes(email.id) && (
                                  <div className="space-y-2 mt-2">
                                    {email.attachments.map((attachment) => (
                                      <div
                                        key={attachment.id}
                                        className="bg-white p-2 rounded-md border border-purple-100"
                                      >
                                        <div className="flex items-center gap-2 mb-1">
                                          <FileText className="h-3.5 w-3.5 text-purple-500" />
                                          <span className="text-xs font-medium truncate">{attachment.fileName}</span>
                                          <span className="text-xs text-muted-foreground ml-auto">
                                            {(attachment.fileSize / 1024 / 1024).toFixed(1)} MB
                                          </span>
                                        </div>
                                        {renderActionButtons(email, attachment.id)}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : !isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No emails found</p>
                      <Button variant="outline" size="sm" className="mt-4" onClick={handleRefresh}>
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  ) : null}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      ) : (
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="text-center max-w-md">
            <Mail className="h-12 w-12 text-purple-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Set up your email integration</h3>
            <p className="text-muted-foreground mb-6">
              Connect your email account to see your messages directly in DealMate and get AI-powered insights about
              your transactions.
            </p>
            <Link href="/settings?tab=integrations">
              <Button className="bg-purple-600 hover:bg-purple-700">Connect Email Account</Button>
            </Link>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
