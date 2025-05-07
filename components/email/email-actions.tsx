"use client"

import { useState } from "react"
import {
  Reply,
  ReplyAll,
  Forward,
  Trash2,
  Archive,
  Star,
  StarOff,
  MailOpen,
  Mail,
  Printer,
  Tag,
  MoreHorizontal,
  Clock,
  FolderPlus,
  FileText,
  Building,
  FolderOpen,
  Calendar,
  ClipboardList,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface EmailActionsProps {
  emailId: string
  isRead: boolean
  isStarred: boolean
  hasAttachments?: boolean
  category?: "transaction" | "lead" | "client" | "other"
  labels?: string[]
  variant?: "full" | "compact" | "minimal"
  orientation?: "horizontal" | "vertical"
  className?: string
  onStarToggle: (id: string) => void
  onReply?: () => void
  onReplyAll?: () => void
  onForward?: () => void
  onDelete?: () => void
  onArchive?: () => void
  onMarkAsRead?: () => void
  onMarkAsUnread?: () => void
  onPrint?: () => void
  onSnooze?: () => void
  onAddLabel?: () => void
  onMoveToFolder?: () => void
}

export function EmailActions({
  emailId,
  isRead,
  isStarred,
  hasAttachments,
  category,
  labels,
  variant = "full",
  orientation = "horizontal",
  className,
  onStarToggle,
  onReply,
  onReplyAll,
  onForward,
  onDelete,
  onArchive,
  onMarkAsRead,
  onMarkAsUnread,
  onPrint,
  onSnooze,
  onAddLabel,
  onMoveToFolder,
}: EmailActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { toast } = useToast()

  // Default handlers if not provided
  const handleReply = () => {
    if (onReply) {
      onReply()
    } else {
      toast({
        title: "Reply",
        description: "Replying to email...",
        duration: 2000,
      })
    }
  }

  const handleReplyAll = () => {
    if (onReplyAll) {
      onReplyAll()
    } else {
      toast({
        title: "Reply All",
        description: "Replying to all recipients...",
        duration: 2000,
      })
    }
  }

  const handleForward = () => {
    if (onForward) {
      onForward()
    } else {
      toast({
        title: "Forward",
        description: "Forwarding email...",
        duration: 2000,
      })
    }
  }

  const handleDelete = () => {
    if (variant === "full") {
      setShowDeleteConfirm(true)
    } else {
      performDelete()
    }
  }

  const performDelete = () => {
    if (onDelete) {
      onDelete()
    } else {
      toast({
        title: "Delete",
        description: "Email moved to trash",
        duration: 2000,
      })
    }
    setShowDeleteConfirm(false)
  }

  const handleArchive = () => {
    if (onArchive) {
      onArchive()
    } else {
      toast({
        title: "Archive",
        description: "Email archived",
        duration: 2000,
      })
    }
  }

  const handleMarkAsRead = () => {
    if (onMarkAsRead) {
      onMarkAsRead()
    } else {
      toast({
        title: "Mark as Read",
        description: "Email marked as read",
        duration: 2000,
      })
    }
  }

  const handleMarkAsUnread = () => {
    if (onMarkAsUnread) {
      onMarkAsUnread()
    } else {
      toast({
        title: "Mark as Unread",
        description: "Email marked as unread",
        duration: 2000,
      })
    }
  }

  const handlePrint = () => {
    if (onPrint) {
      onPrint()
    } else {
      toast({
        title: "Print",
        description: "Preparing to print...",
        duration: 2000,
      })
      window.print()
    }
  }

  const handleSnooze = () => {
    if (onSnooze) {
      onSnooze()
    } else {
      toast({
        title: "Snooze",
        description: "Email snoozed until later",
        duration: 2000,
      })
    }
  }

  const handleAddLabel = () => {
    if (onAddLabel) {
      onAddLabel()
    } else {
      toast({
        title: "Add Label",
        description: "Label added to email",
        duration: 2000,
      })
    }
  }

  const handleMoveToFolder = () => {
    if (onMoveToFolder) {
      onMoveToFolder()
    } else {
      toast({
        title: "Move to Folder",
        description: "Email moved to folder",
        duration: 2000,
      })
    }
  }

  const handleLinkToTransaction = () => {
    toast({
      title: "Link to Transaction",
      description: "Email linked to transaction",
      duration: 2000,
    })
  }

  const handleLinkToWorkspace = () => {
    toast({
      title: "Link to Workspace",
      description: "Email linked to workspace",
      duration: 2000,
    })
  }

  const handleCreateEvent = () => {
    toast({
      title: "Create Event",
      description: "Creating calendar event from email",
      duration: 2000,
    })
  }

  const handleCreateTask = () => {
    toast({
      title: "Create Task",
      description: "Creating task from email",
      duration: 2000,
    })
  }

  // Determine which buttons to show based on variant
  const renderPrimaryActions = () => {
    const containerClass = cn("flex gap-2", orientation === "vertical" && "flex-col items-start", className)

    // Full variant with all actions
    if (variant === "full") {
      return (
        <div className={containerClass}>
          <Button
            variant="outline"
            size={orientation === "vertical" ? "default" : "sm"}
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100"
            onClick={handleReply}
          >
            <Reply className={cn("mr-2", orientation === "vertical" ? "h-4 w-4" : "h-3.5 w-3.5")} />
            Reply
          </Button>
          <Button
            variant="outline"
            size={orientation === "vertical" ? "default" : "sm"}
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100"
            onClick={handleReplyAll}
          >
            <ReplyAll className={cn("mr-2", orientation === "vertical" ? "h-4 w-4" : "h-3.5 w-3.5")} />
            Reply All
          </Button>
          <Button
            variant="outline"
            size={orientation === "vertical" ? "default" : "sm"}
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100"
            onClick={handleForward}
          >
            <Forward className={cn("mr-2", orientation === "vertical" ? "h-4 w-4" : "h-3.5 w-3.5")} />
            Forward
          </Button>
          <Button
            variant="outline"
            size={orientation === "vertical" ? "default" : "sm"}
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100"
            onClick={handleArchive}
          >
            <Archive className={cn("mr-2", orientation === "vertical" ? "h-4 w-4" : "h-3.5 w-3.5")} />
            Archive
          </Button>
          <Button
            variant="outline"
            size={orientation === "vertical" ? "default" : "sm"}
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100"
            onClick={handleDelete}
          >
            <Trash2 className={cn("mr-2", orientation === "vertical" ? "h-4 w-4" : "h-3.5 w-3.5")} />
            Delete
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size={orientation === "vertical" ? "default" : "sm"}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100"
              >
                <MoreHorizontal className={cn(orientation === "vertical" ? "h-4 w-4" : "h-3.5 w-3.5")} />
                <span className="sr-only">More actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-100">
              <DropdownMenuLabel>More Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem
                className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                onClick={isRead ? handleMarkAsUnread : handleMarkAsRead}
              >
                {isRead ? <Mail className="h-4 w-4 mr-2" /> : <MailOpen className="h-4 w-4 mr-2" />}
                {isRead ? "Mark as Unread" : "Mark as Read"}
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer" onClick={handleSnooze}>
                <Clock className="h-4 w-4 mr-2" />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer" onClick={handleAddLabel}>
                <Tag className="h-4 w-4 mr-2" />
                Add Label
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                onClick={handleMoveToFolder}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Move to Folder
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuLabel>DealMate Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                onClick={handleLinkToTransaction}
              >
                <Building className="h-4 w-4 mr-2" />
                Link to Transaction
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                onClick={handleLinkToWorkspace}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Link to Workspace
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                onClick={handleCreateEvent}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Create Event
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                onClick={handleCreateTask}
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Create Task
              </DropdownMenuItem>
              {hasAttachments && (
                <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Save Attachments
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }

    // Compact variant with fewer actions
    if (variant === "compact") {
      return (
        <div className={containerClass}>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100"
            onClick={handleReply}
          >
            <Reply className="h-3.5 w-3.5 mr-1" />
            Reply
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100"
            onClick={handleForward}
          >
            <Forward className="h-3.5 w-3.5 mr-1" />
            Forward
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100 ml-auto"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </div>
      )
    }

    // Minimal variant with icon-only buttons
    return (
      <div className={containerClass}>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-gray-100 hover:bg-gray-800"
          onClick={handleReply}
        >
          <Reply className="h-4 w-4" />
          <span className="sr-only">Reply</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-gray-100 hover:bg-gray-800"
          onClick={handleForward}
        >
          <Forward className="h-4 w-4" />
          <span className="sr-only">Forward</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-gray-100 hover:bg-gray-800"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-gray-100 hover:bg-gray-800"
          onClick={() => onStarToggle(emailId)}
        >
          {isStarred ? <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> : <StarOff className="h-4 w-4" />}
          <span className="sr-only">{isStarred ? "Unstar" : "Star"}</span>
        </Button>
      </div>
    )
  }

  return (
    <>
      {renderPrimaryActions()}

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-gray-900 text-gray-100 border-gray-800">
          <DialogHeader>
            <DialogTitle>Delete Email</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this email? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={performDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
