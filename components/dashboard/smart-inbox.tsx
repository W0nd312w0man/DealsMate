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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { analyzeEmail } from "@/services/email-analysis-service"
import { CompactAttachmentNotification } from "@/components/email/compact-attachment-notification"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { useEmailViewPreferences } from "@/hooks/use-email-view-preferences"
import { EmailModalView } from "@/components/email/email-modal-view"
import { EmailInlineView } from "@/components/email/email-inline-view"
import { EmailPanelView } from "@/components/email/email-panel-view"

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
}

export function SmartInbox({
  className,
  filterUnreadOnly = false,
  onFilterChange,
  showAttachmentDetection = false,
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

  // Update filter when prop changes
  useEffect(() => {
    setShowUnreadOnly(filterUnreadOnly)
  }, [filterUnreadOnly])

  // Simulate checking for new emails with attachments
  useEffect(() => {
    if (showAttachmentDetection) {
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
    }
  }, [dismissedEmails, showAttachmentDetection])

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

  // Mock data for emails
  const emails: Email[] = [
    {
      id: "e1",
      from: {
        name: "Karen Chen",
        email: "karen.chen@example.com",
        avatar: "/urban-graffiti-art.png",
      },
      subject: "Offer Accepted on 15614 Yermo Street",
      preview:
        "Great news! The sellers have accepted your offer on the property. I've attached the signed purchase agreement and disclosure documents. Let's schedule a call to discuss next steps...",
      date: "10:23 AM",
      read: false,
      starred: true,
      category: "transaction",
      labels: ["urgent", "offer"],
      workspaceId: "ws-1",
      attachments: [
        {
          id: "a1",
          fileName: "Purchase_Agreement_15614_Yermo_Street.pdf",
          fileType: "application/pdf",
          fileSize: 2456789,
        },
        {
          id: "a2",
          fileName: "Property_Disclosure.pdf",
          fileType: "application/pdf",
          fileSize: 1234567,
        },
      ],
    },
    {
      id: "e2",
      from: {
        name: "Michael Johnson",
        email: "michael.j@example.com",
        avatar: "/musical-notes-flowing.png",
      },
      subject: "Listing Agreement for 456 Oak Avenue",
      preview:
        "I've attached the listing agreement for your property. Please review and let me know if you have any questions or if anything needs to be adjusted before we proceed...",
      date: "Yesterday",
      read: true,
      starred: false,
      category: "transaction",
      workspaceId: "ws-2",
      attachments: [
        {
          id: "a7",
          fileName: "Listing_Agreement_456_Oak_Avenue.pdf",
          fileType: "application/pdf",
          fileSize: 3157894,
        },
        {
          id: "a8",
          fileName: "Marketing_Plan.docx",
          fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          fileSize: 1852369,
        },
      ],
    },
    {
      id: "e3",
      from: {
        name: "Emily Brown",
        email: "emily.brown@example.com",
        avatar: "/electric-blue-abstract.png",
      },
      subject: "Interested in property listings in Westside",
      preview:
        "Hello, I'm looking for a 3-bedroom house in the Westside area with a budget of around $750,000. My family and I are planning to relocate by September and would love to see what's available...",
      date: "Apr 24",
      read: false,
      starred: false,
      category: "lead",
      workspaceId: "ws-3",
    },
    {
      id: "e4",
      from: {
        name: "Robert Wilson",
        email: "robert.w@example.com",
        avatar: "/abstract-red-white.png",
      },
      subject: "Home inspection scheduled",
      preview:
        "The home inspection for 101 Cedar Lane has been scheduled for Monday, May 1st at 10:00 AM. I've attached the inspection details and a pre-inspection checklist for your review...",
      date: "Apr 23",
      read: true,
      starred: true,
      category: "transaction",
      workspaceId: "ws-4",
      attachments: [
        {
          id: "a3",
          fileName: "Inspection_Schedule.pdf",
          fileType: "application/pdf",
          fileSize: 987654,
        },
        {
          id: "a9",
          fileName: "Pre_Inspection_Checklist.pdf",
          fileType: "application/pdf",
          fileSize: 765432,
        },
      ],
    },
    {
      id: "e5",
      from: {
        name: "Sarah Smith",
        email: "sarah.smith@example.com",
        avatar: "/stylized-letter-ss.png",
      },
      subject: "Thank you for your help with our home purchase",
      preview:
        "We just wanted to thank you for all your help with our recent home purchase. We couldn't have done it without you! We've settled in nicely and would love to have you over for dinner sometime...",
      date: "Apr 22",
      read: true,
      starred: false,
      category: "client",
      workspaceId: "ws-5",
    },
    {
      id: "e6",
      from: {
        name: "David Lee",
        email: "david.lee@example.com",
        avatar: "/abstract-dl.png",
      },
      subject: "Looking for investment properties",
      preview:
        "I'm interested in exploring investment properties in the downtown area. I've attached a list of properties I've researched along with my analysis of their potential ROI. Do you have any recommendations?",
      date: "Apr 21",
      read: false,
      starred: false,
      category: "lead",
      attachments: [
        {
          id: "a4",
          fileName: "Investment_Properties_List.xlsx",
          fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          fileSize: 3456789,
        },
        {
          id: "a5",
          fileName: "Market_Analysis_Q2.pdf",
          fileType: "application/pdf",
          fileSize: 5678901,
        },
        {
          id: "a6",
          fileName: "ROI_Calculations.xlsx",
          fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          fileSize: 2345678,
        },
      ],
    },
    {
      id: "e7",
      from: {
        name: "eXp Realty",
        email: "notifications@exp.com",
        avatar: "/interconnected-growth.png",
      },
      subject: "New compliance requirements for all agents",
      preview:
        "Please review the updated compliance requirements that will be effective starting next month. All agents must complete the attached training module by May 15th and submit the certification...",
      date: "Apr 20",
      read: true,
      starred: false,
      category: "other",
      attachments: [
        {
          id: "a10",
          fileName: "Compliance_Requirements_2023.pdf",
          fileType: "application/pdf",
          fileSize: 4268531,
        },
        {
          id: "a11",
          fileName: "Training_Module.pptx",
          fileType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          fileSize: 8751269,
        },
      ],
    },
    {
      id: "e8",
      from: {
        name: "Jason Rodriguez",
        email: "j.rodriguez@escrow-services.com",
        avatar: "/placeholder.svg",
      },
      subject: "Escrow Instructions for 15614 Yermo Street",
      preview:
        "Attached are the escrow instructions for the Yermo Street property transaction. Please review, sign, and return at your earliest convenience. We'll need these completed to proceed with the closing...",
      date: "Apr 19",
      read: false,
      starred: true,
      category: "transaction",
      labels: ["important", "escrow"],
      workspaceId: "ws-1",
      attachments: [
        {
          id: "a12",
          fileName: "Escrow_Instructions_15614_Yermo.pdf",
          fileType: "application/pdf",
          fileSize: 3157482,
        },
        {
          id: "a13",
          fileName: "Wire_Transfer_Instructions.pdf",
          fileType: "application/pdf",
          fileSize: 1254863,
        },
      ],
    },
    {
      id: "e9",
      from: {
        name: "Linda Martinez",
        email: "linda.m@example.com",
        avatar: "/placeholder.svg",
      },
      subject: "Referral: The Johnson Family",
      preview:
        "I wanted to introduce you to you my friends, the Johnson family. They're looking to sell their home in Brentwood and purchase something closer to the city. I've told them about your excellent service...",
      date: "Apr 18",
      read: true,
      starred: true,
      category: "lead",
      labels: ["referral"],
    },
    {
      id: "e10",
      from: {
        name: "Mortgage Express",
        email: "approvals@mortgage-express.com",
        avatar: "/placeholder.svg",
      },
      subject: "Pre-Approval Letter for Thomas & Lisa Williams",
      preview:
        "Please find attached the pre-approval letter for Thomas and Lisa Williams for a loan amount of $850,000. The approval is valid for 90 days from today. Let me know if you need any additional information...",
      date: "Apr 17",
      read: false,
      starred: false,
      category: "client",
      workspaceId: "ws-6",
      attachments: [
        {
          id: "a14",
          fileName: "Williams_Pre_Approval_Letter.pdf",
          fileType: "application/pdf",
          fileSize: 1587462,
        },
      ],
    },
    {
      id: "e11",
      from: {
        name: "County Records Office",
        email: "records@county.gov",
        avatar: "/placeholder.svg",
      },
      subject: "Recorded Deed for 789 Maple Avenue",
      preview:
        "The deed for the property at 789 Maple Avenue has been officially recorded. Attached is your copy of the recorded document for your records. Congratulations on completing this transaction...",
      date: "Apr 16",
      read: true,
      starred: false,
      category: "transaction",
      workspaceId: "ws-7",
      attachments: [
        {
          id: "a15",
          fileName: "Recorded_Deed_789_Maple.pdf",
          fileType: "application/pdf",
          fileSize: 2854136,
        },
      ],
    },
    {
      id: "e12",
      from: {
        name: "Jennifer Parker",
        email: "jparker@example.com",
        avatar: "/placeholder.svg",
      },
      subject: "Contract Termination Request",
      preview:
        "After careful consideration, we've decided to terminate our listing contract for 1234 Pine Street. Please find attached our formal termination request. We appreciate your understanding and the efforts you've made...",
      date: "Apr 15",
      read: false,
      starred: true,
      category: "client",
      labels: ["urgent", "needs_attention"],
      workspaceId: "ws-8",
      attachments: [
        {
          id: "a16",
          fileName: "Contract_Termination_Request.pdf",
          fileType: "application/pdf",
          fileSize: 1548762,
        },
      ],
    },
    {
      id: "e13",
      from: {
        name: "Property Management Inc.",
        email: "maintenance@propmgmt.com",
        avatar: "/placeholder.svg",
      },
      subject: "Maintenance Schedule for 555 River Road",
      preview:
        "Here's the annual maintenance schedule for the rental property at 555 River Road. Please review and let us know if you'd like to make any changes or if there are additional services you'd like us to include...",
      date: "Apr 14",
      read: true,
      starred: false,
      category: "transaction",
      workspaceId: "ws-9",
      attachments: [
        {
          id: "a17",
          fileName: "Maintenance_Schedule_555_River.pdf",
          fileType: "application/pdf",
          fileSize: 1987452,
        },
        {
          id: "a18",
          fileName: "Property_Inspection_Report.docx",
          fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          fileSize: 3541865,
        },
      ],
    },
    {
      id: "e14",
      from: {
        name: "Home Warranty Services",
        email: "coverage@homewarranty.com",
        avatar: "/placeholder.svg",
      },
      subject: "Warranty Coverage for 15614 Yermo Street",
      preview:
        "Your home warranty coverage for 15614 Yermo Street has been activated. Attached is your policy document detailing coverage terms and claim procedures. Coverage begins on May 1st and is valid for one year...",
      date: "Apr 13",
      read: true,
      starred: false,
      category: "transaction",
      workspaceId: "ws-1",
      attachments: [
        {
          id: "a19",
          fileName: "Warranty_Policy_15614_Yermo.pdf",
          fileType: "application/pdf",
          fileSize: 4521873,
        },
      ],
    },
    {
      id: "e15",
      from: {
        name: "Community Title Company",
        email: "closings@communitytitle.com",
        avatar: "/placeholder.svg",
      },
      subject: "Closing Disclosure for 101 Cedar Lane",
      preview:
        "Please find attached the Closing Disclosure for the property at 101 Cedar Lane. Review it carefully and contact us with any questions or concerns. The closing is scheduled for May 5th at 2:00 PM at our office...",
      date: "Apr 12",
      read: false,
      starred: true,
      category: "transaction",
      labels: ["important", "closing"],
      workspaceId: "ws-4",
      attachments: [
        {
          id: "a20",
          fileName: "Closing_Disclosure_101_Cedar.pdf",
          fileType: "application/pdf",
          fileSize: 2547896,
        },
        {
          id: "a21",
          fileName: "Closing_Instructions.pdf",
          fileType: "application/pdf",
          fileSize: 1254789,
        },
      ],
    },
    {
      id: "e16",
      from: {
        name: "City Planning Department",
        email: "zoning@cityplanning.gov",
        avatar: "/placeholder.svg",
      },
      subject: "Zoning Verification for 789 Commercial Blvd",
      preview:
        "In response to your request, we've attached the zoning verification letter for the property at 789 Commercial Blvd. The property is zoned for mixed-use commercial/residential as specified in the attached document...",
      date: "Apr 11",
      read: true,
      starred: false,
      category: "other",
      attachments: [
        {
          id: "a22",
          fileName: "Zoning_Verification_789_Commercial.pdf",
          fileType: "application/pdf",
          fileSize: 1587426,
        },
        {
          id: "a23",
          fileName: "Zoning_Map_Section_B7.pdf",
          fileType: "application/pdf",
          fileSize: 5487123,
        },
      ],
    },
    {
      id: "e17",
      from: {
        name: "Alex Thompson",
        email: "alex.t@example.com",
        avatar: "/placeholder.svg",
      },
      subject: "Questions about 456 Oak Avenue listing",
      preview:
        "I saw your listing for 456 Oak Avenue and have a few questions. Does the property have a finished basement? Also, when was the roof last replaced? I'm interested in scheduling a viewing this weekend if possible...",
      date: "Apr 10",
      read: false,
      starred: false,
      category: "lead",
    },
    {
      id: "e18",
      from: {
        name: "Home Inspection Team",
        email: "reports@homeinspect.com",
        avatar: "/placeholder.svg",
      },
      subject: "Inspection Report for 101 Cedar Lane",
      preview:
        "Please find attached the comprehensive inspection report for 101 Cedar Lane. We've identified several minor issues that should be addressed, as well as one major concern with the electrical panel that requires immediate attention...",
      date: "Apr 9",
      read: false,
      starred: true,
      category: "transaction",
      labels: ["urgent", "inspection"],
      workspaceId: "ws-4",
      attachments: [
        {
          id: "a24",
          fileName: "Inspection_Report_101_Cedar.pdf",
          fileType: "application/pdf",
          fileSize: 7854123,
        },
        {
          id: "a25",
          fileName: "Inspection_Photos.zip",
          fileType: "application/zip",
          fileSize: 25478963,
        },
      ],
    },
    {
      id: "e19",
      from: {
        name: "Professional Photographers",
        email: "bookings@realestatephotos.com",
        avatar: "/placeholder.svg",
      },
      subject: "Property Photos for 456 Oak Avenue",
      preview:
        "The professional photos for 456 Oak Avenue are now ready. I've attached the high-resolution images for your review. Let me know if you need any specific edits or if you'd like to schedule additional photography services...",
      date: "Apr 8",
      read: true,
      starred: false,
      category: "transaction",
      workspaceId: "ws-2",
      attachments: [
        {
          id: "a26",
          fileName: "456_Oak_Ave_Photos.zip",
          fileType: "application/zip",
          fileSize: 45871236,
        },
        {
          id: "a27",
          fileName: "Virtual_Tour_Link.pdf",
          fileType: "application/pdf",
          fileSize: 854123,
        },
      ],
    },
    {
      id: "e20",
      from: {
        name: "eXp Realty Training",
        email: "training@exp.com",
        avatar: "/interconnected-growth.png",
      },
      subject: "Upcoming Training: Advanced Transaction Management",
      preview:
        "We're excited to announce an upcoming training session on Advanced Transaction Management using our new system. The session will be held on May 10th at 10:00 AM. Registration details are attached...",
      date: "Apr 7",
      read: true,
      starred: false,
      category: "other",
      attachments: [
        {
          id: "a28",
          fileName: "Training_Registration.pdf",
          fileType: "application/pdf",
          fileSize: 1254789,
        },
        {
          id: "a29",
          fileName: "Training_Agenda.pdf",
          fileType: "application/pdf",
          fileSize: 987456,
        },
      ],
    },
    {
      id: "e21",
      from: {
        name: "Workspace Collaboration",
        email: "workspace@dealmate.io",
        avatar: "/interconnected-growth.png",
      },
      subject: "Updates to 15614 Yermo Street Workspace",
      preview:
        "The workspace for 15614 Yermo Street has been updated with new documents and tasks. Please review the changes and provide your feedback...",
      date: "Apr 6",
      read: true,
      starred: false,
      category: "workspace",
      workspaceId: "ws-1",
      attachments: [
        {
          id: "a30",
          fileName: "Workspace_Summary.pdf",
          fileType: "application/pdf",
          fileSize: 1854236,
        },
      ],
    },
    {
      id: "e22",
      from: {
        name: "Team Collaboration",
        email: "team@dealmate.io",
        avatar: "/urban-grid-blueprint.png",
      },
      subject: "Shared Workspace: 456 Oak Avenue",
      preview:
        "You've been added to the workspace for 456 Oak Avenue. This workspace contains all documents, communications, and tasks related to this property...",
      date: "Apr 5",
      read: false,
      starred: true,
      category: "workspace",
      workspaceId: "ws-2",
      labels: ["important", "collaboration"],
    },
  ]

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

    // If we had state for emails, we would update it here
    // setEmails(updatedEmails);

    // For now, just show a toast notification
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

  return (
    <Card className={cn("shadow-soft card-hover overflow-hidden", className)}>
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-poppins text-purple-700">Smart Inbox</CardTitle>
            <CardDescription>
              {showUnreadOnly
                ? "Showing unread messages only"
                : `${emails.filter((e) => !e.read).length} unread messages`}
            </CardDescription>
          </div>
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
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
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
                {filteredEmails.length > 0 ? (
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
                                      <span className="text-muted-foreground ml-auto">
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
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No emails found</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>

      {/* Email Viewing Components */}
      <EmailModalView
        email={selectedEmail}
        isOpen={isEmailModalOpen}
        onClose={closeEmailView}
        onStarToggle={toggleStar}
      />

      <EmailPanelView email={selectedEmail} isOpen={isPanelOpen} onClose={closeEmailView} onStarToggle={toggleStar} />
    </Card>
  )
}
