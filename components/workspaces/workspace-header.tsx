"use client"

import { useState, useEffect } from "react"
import {
  ArrowRight,
  Calendar,
  Clock,
  Home,
  MessageSquare,
  MoreHorizontal,
  UserCircle,
  Users,
  Archive,
  ArchiveRestore,
  CalendarPlus,
  CalendarClock,
  Mail,
  MessageCircle,
  Palette,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWorkspaceParties } from "@/hooks/use-workspace-parties"
import { WorkspaceConversionDialog } from "./workspace-conversion-dialog"
import { WorkspaceVisualRenameDialog } from "./workspace-visual-rename-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { StatusBadge } from "@/components/ui/status-badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import type { TransactionStatus } from "@/types/transaction"
import { ScheduleEventDialog } from "../calendar/schedule-event-dialog"
import { WorkspaceMessageDialog } from "./workspace-message-dialog"
import { format } from "date-fns"

interface WorkspaceHeaderProps {
  workspaceId: string
}

export function WorkspaceHeader({ workspaceId }: WorkspaceHeaderProps) {
  const workspaceParties = useWorkspaceParties()
  const [showConversionDialog, setShowConversionDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [scheduleType, setScheduleType] = useState<"appointment" | "event">("appointment")
  const [isArchiving, setIsArchiving] = useState(false)
  const [isArchived, setIsArchived] = useState(false)
  const [workspaceName, setWorkspaceName] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const [primaryBuyer, setPrimaryBuyer] = useState<string | null>(null)
  const [primarySeller, setPrimarySeller] = useState<string | null>(null)

  useEffect(() => {
    const buyer = workspaceParties.getPrimaryParty(workspaceId, "Buyer")
    const seller = workspaceParties.getPrimaryParty(workspaceId, "Seller")

    if (buyer) {
      setPrimaryBuyer(buyer.name)
    }

    if (seller) {
      setPrimarySeller(seller.name)
    }
  }, [workspaceId, workspaceParties])

  // Mock data for the workspace
  const workspace = {
    id: workspaceId,
    name: workspaceName || "15614 Yermo Street, Whittier, CA 90603",
    address: "15614 Yermo Street, Whittier, CA 90603",
    type: "property",
    status: isArchived ? ("Archived" as TransactionStatus) : ("Active" as TransactionStatus),
    lastActivity: "2 hours ago",
    tasks: 3,
    messages: 5,
  }

  useEffect(() => {
    setWorkspaceName(workspace.name)
  }, [workspace.name])

  // Helper function to get client type icon
  const getClientTypeIcon = (type: string) => {
    if (type === "property") {
      return <Home className="h-5 w-5 text-blue-600" />
    } else if (type === "client") {
      return <UserCircle className="h-5 w-5 text-purple-600" />
    }
    return <UserCircle className="h-5 w-5 text-gray-600" />
  }

  const handleArchiveToggle = async () => {
    setIsArchiving(true)

    // In a real app, this would call an API to archive/unarchive the workspace
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsArchived(!isArchived)
    setIsArchiving(false)
  }

  const handleScheduleOption = (type: "appointment" | "event") => {
    setScheduleType(type)
    setShowScheduleDialog(true)
  }

  const handleScheduleComplete = (eventData: any) => {
    setShowScheduleDialog(false)

    // Show success toast
    toast({
      title: `${scheduleType === "appointment" ? "Appointment" : "Event"} Scheduled`,
      description: `${eventData.title} has been added to your calendar.`,
      duration: 3000,
    })

    // Add notification to the notification bell
    if (window.talosNotifications) {
      window.talosNotifications.add({
        type: scheduleType === "appointment" ? "event_created" : "event_created",
        title: `New ${scheduleType === "appointment" ? "Appointment" : "Event"} Scheduled`,
        description: `${eventData.title} on ${format(new Date(eventData.date), "MMM dd, yyyy")} at ${eventData.allDay ? "All Day" : format(new Date(eventData.date), "h:mm a")}${eventData.location ? ` at ${eventData.location}` : ""}`,
        actionUrl: "/calendar",
        actionLabel: "View in Calendar",
        relatedEntity: {
          type: "event",
          id: eventData.id,
          name: eventData.title,
        },
        priority: "medium",
      })
    }
  }

  const handleRenameWorkspace = (newName: string) => {
    setWorkspaceName(newName)
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2">
          {getClientTypeIcon(workspace.type)}
          <h1 className="text-3xl font-bold tracking-tight text-exp-purple dark:text-exp-lavender font-poppins">
            {workspaceName}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => setShowRenameDialog(true)}
          >
            <Edit className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Rename workspace</span>
          </Button>
          <StatusBadge status={workspace.status} />
        </div>
        <div className="flex items-center gap-2 mt-1 text-muted-foreground">
          <Users className="h-4 w-4" />
          {primaryBuyer && primarySeller ? (
            <p>
              {primaryBuyer} (Buyer) & {primarySeller} (Seller)
            </p>
          ) : primaryBuyer ? (
            <p>{primaryBuyer} (Buyer)</p>
          ) : primarySeller ? (
            <p>{primarySeller} (Seller)</p>
          ) : (
            <p>No primary parties set</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <TooltipProvider>
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 border-purple-800/30">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <div className="grid gap-1">
                  <Button
                    variant="ghost"
                    className="justify-start text-left"
                    onClick={() => handleScheduleOption("appointment")}
                  >
                    <CalendarClock className="mr-2 h-4 w-4 text-purple-600" />
                    Schedule Appointment
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-left"
                    onClick={() => handleScheduleOption("event")}
                  >
                    <CalendarPlus className="mr-2 h-4 w-4 text-pink-600" />
                    Schedule Event
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent>
              <p>Schedule</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 border-purple-800/30">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <div className="grid gap-1">
                  <Button
                    variant="ghost"
                    className="justify-start text-left"
                    onClick={() => setShowMessageDialog(true)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4 text-purple-600" />
                    Chat with Parties
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-left"
                    onClick={() => router.push(`/communication?workspace=${workspaceId}`)}
                  >
                    <Mail className="mr-2 h-4 w-4 text-pink-600" />
                    Email Parties
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent>
              <p>Message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="h-9 w-9 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                onClick={() => setShowConversionDialog(true)}
              >
                <ArrowRight className="h-4 w-4 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Convert to Transaction</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`h-9 w-9 border-purple-800/30 ${workspace.status === "Archived" ? "text-green-600" : "text-red-600"}`}
                onClick={handleArchiveToggle}
                disabled={isArchiving}
              >
                {isArchiving ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : workspace.status === "Archived" ? (
                  <ArchiveRestore className="h-4 w-4" />
                ) : (
                  <Archive className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{workspace.status === "Archived" ? "Unarchive Workspace" : "Archive Workspace"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 border-purple-800/30">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>More Actions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent align="end" className="border-purple-800/20">
            <DropdownMenuLabel>Workspace Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowRenameDialog(true)}>
              <Palette className="mr-2 h-4 w-4" />
              Rename Visually
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowConversionDialog(true)}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Convert to Transaction
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Clock className="mr-2 h-4 w-4" />
              View Activity Log
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={workspace.status === "Archived" ? "text-green-600" : "text-red-600"}
              onClick={handleArchiveToggle}
            >
              {workspace.status === "Archived" ? (
                <ArchiveRestore className="mr-2 h-4 w-4" />
              ) : (
                <Archive className="mr-2 h-4 w-4" />
              )}
              {workspace.status === "Archived" ? "Unarchive Workspace" : "Archive Workspace"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Workspace Conversion Dialog */}
      <WorkspaceConversionDialog
        workspaceId={workspaceId}
        open={showConversionDialog}
        onOpenChange={setShowConversionDialog}
      />

      {/* Visual Rename Dialog */}
      <WorkspaceVisualRenameDialog
        workspaceId={workspaceId}
        currentName={workspaceName}
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        onRename={handleRenameWorkspace}
      />

      {/* Schedule Event/Appointment Dialog */}
      <ScheduleEventDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        onSave={handleScheduleComplete}
        defaultValues={{
          type: scheduleType === "appointment" ? "appointment" : "event",
          title: scheduleType === "appointment" ? `${workspace.name} Appointment` : `${workspace.name} Event`,
          location: workspace.address,
          workspaceId: workspaceId,
        }}
      />

      {/* Message Dialog */}
      <WorkspaceMessageDialog open={showMessageDialog} onOpenChange={setShowMessageDialog} workspaceId={workspaceId} />
    </div>
  )
}
