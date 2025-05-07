"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import {
  FileText,
  Plus,
  LinkIcon,
  Save,
  AlertCircle,
  X,
  ClipboardList,
  Calendar,
  FolderOpen,
  FileStack,
} from "lucide-react"

interface CompactAttachmentNotificationProps {
  analysisResult: any
  onDismiss: () => void
  onActionComplete: () => void
}

export function CompactAttachmentNotification({
  analysisResult,
  onDismiss,
  onActionComplete,
}: CompactAttachmentNotificationProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const { toast } = useToast()

  // We'll render the component even if there are no attachments
  // but we still need the analysisResult to be valid
  if (!analysisResult) {
    return null
  }

  // Ensure these properties exist with fallbacks
  const suggestedActions = analysisResult.suggestedActions || []
  const emailData = analysisResult.emailData || {}
  const relevantAttachments = analysisResult.relevantAttachments || []

  const handleActionSelect = (actionType: string) => {
    setSelectedAction(actionType)
    setIsDialogOpen(true)
  }

  const handleActionComplete = () => {
    setIsDialogOpen(false)
    toast({
      title: "Action completed",
      description: "The email attachment has been processed successfully.",
    })
    onActionComplete()
  }

  // Check if we have a first attachment to display
  const firstAttachment = relevantAttachments.length > 0 ? relevantAttachments[0] : null

  return (
    <>
      {analysisResult.hasRelevantAttachments ? (
        <div className="bg-purple-50/70 border-l-2 border-purple-400 p-2 rounded-md mb-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">TALOS detected relevant attachments</span>
            </div>
            <Badge className="bg-purple-100 text-purple-800 text-xs px-1.5 py-0">AI</Badge>
          </div>

          <div className="pl-6 mb-2">
            <div className="text-xs text-muted-foreground mb-1">
              From {emailData.from?.name || "a sender"} • {firstAttachment ? firstAttachment.fileName : "Document"}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {/* Action buttons as icons with tooltips */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 rounded-full bg-purple-100 border-purple-200 hover:bg-purple-200 hover:text-purple-800"
                      onClick={() => handleActionSelect("create_transaction")}
                    >
                      <Plus className="h-3.5 w-3.5 text-purple-700" />
                      <span className="sr-only">Create Transaction</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Create Transaction</p>
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
                      onClick={() => handleActionSelect("create_workspace")}
                    >
                      <Plus className="h-3.5 w-3.5 text-blue-700" />
                      <span className="sr-only">Create Workspace</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Create Workspace</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 rounded-full bg-green-100 border-green-200 hover:bg-green-200 hover:text-green-800"
                      onClick={() => handleActionSelect("add_to_transaction")}
                    >
                      <LinkIcon className="h-3.5 w-3.5 text-green-700" />
                      <span className="sr-only">Add to Transaction</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Add to Transaction</p>
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
                      onClick={() => handleActionSelect("add_task")}
                    >
                      <ClipboardList className="h-3.5 w-3.5 text-indigo-700" />
                      <span className="sr-only">Add Task</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Add Task</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 rounded-full bg-amber-100 border-amber-200 hover:bg-amber-200 hover:text-amber-800"
                      onClick={() => handleActionSelect("save_document")}
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

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 rounded-full bg-gray-100 border-gray-200 hover:bg-gray-200 hover:text-gray-800 ml-auto"
                      onClick={onDismiss}
                    >
                      <X className="h-3.5 w-3.5 text-gray-700" />
                      <span className="sr-only">Dismiss</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Dismiss</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50/70 border-l-2 border-blue-400 p-2 rounded-md mb-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">TALOS analyzed this email</span>
            </div>
            <Badge className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0">AI</Badge>
          </div>

          <div className="pl-6 mb-2">
            <div className="text-xs text-muted-foreground mb-1">
              From {emailData.from?.name || "a sender"} • {emailData.subject || "No subject"}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {/* Action buttons for emails without attachments */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 rounded-full bg-indigo-100 border-indigo-200 hover:bg-indigo-200 hover:text-indigo-800"
                      onClick={() => handleActionSelect("add_task")}
                    >
                      <ClipboardList className="h-3.5 w-3.5 text-indigo-700" />
                      <span className="sr-only">Add to Task</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Add to Task</p>
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
                      onClick={() => handleActionSelect("add_event")}
                    >
                      <Calendar className="h-3.5 w-3.5 text-teal-700" />
                      <span className="sr-only">Add to Event</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Add to Event</p>
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
                      onClick={() => handleActionSelect("link_workspace")}
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
                      className="h-7 w-7 p-0 rounded-full bg-purple-100 border-purple-200 hover:bg-purple-200 hover:text-purple-800"
                      onClick={() => handleActionSelect("link_transaction")}
                    >
                      <FileStack className="h-3.5 w-3.5 text-purple-700" />
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
                      className="h-7 w-7 p-0 rounded-full bg-gray-100 border-gray-200 hover:bg-gray-200 hover:text-gray-800 ml-auto"
                      onClick={onDismiss}
                    >
                      <X className="h-3.5 w-3.5 text-gray-700" />
                      <span className="sr-only">Dismiss</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Dismiss</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      )}

      {/* Action Dialogs */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedAction === "create_transaction" && (
            <>
              <DialogHeader>
                <DialogTitle>Create New Transaction</DialogTitle>
                <DialogDescription>Create a new transaction and automatically attach the document.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-lg border p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">{firstAttachment ? firstAttachment.fileName : "Document"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This document will be attached to the new transaction.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleActionComplete}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                  >
                    Create Transaction
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedAction === "create_workspace" && (
            <>
              <DialogHeader>
                <DialogTitle>Create New Workspace</DialogTitle>
                <DialogDescription>Create a new workspace and automatically attach the document.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-lg border p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">{firstAttachment ? firstAttachment.fileName : "Document"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">This document will be attached to the new workspace.</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleActionComplete}
                    className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:opacity-90 transition-opacity"
                  >
                    Create Workspace
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedAction === "add_to_transaction" && (
            <>
              <DialogHeader>
                <DialogTitle>Add to Existing Transaction</DialogTitle>
                <DialogDescription>Add the document to an existing transaction.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-lg border p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">{firstAttachment ? firstAttachment.fileName : "Document"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Select a transaction to add this document to.</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleActionComplete}
                    className="bg-gradient-to-r from-green-600 to-teal-500 hover:opacity-90 transition-opacity"
                  >
                    Add to Transaction
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedAction === "add_task" && (
            <>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Create a task related to this {analysisResult.hasRelevantAttachments ? "document" : "email"}.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-lg border p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <span className="font-medium">
                      {analysisResult.hasRelevantAttachments
                        ? firstAttachment
                          ? firstAttachment.fileName
                          : "Document"
                        : emailData.subject || "Email"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create a task related to this {analysisResult.hasRelevantAttachments ? "document" : "email"}.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleActionComplete}
                    className="bg-gradient-to-r from-indigo-600 to-violet-500 hover:opacity-90 transition-opacity"
                  >
                    Create Task
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedAction === "add_event" && (
            <>
              <DialogHeader>
                <DialogTitle>Add to Calendar</DialogTitle>
                <DialogDescription>Create a calendar event related to this email.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-lg border p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-teal-600" />
                    <span className="font-medium">{emailData.subject || "Email"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Create a calendar event based on this email.</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleActionComplete}
                    className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:opacity-90 transition-opacity"
                  >
                    Add to Calendar
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedAction === "save_document" && (
            <>
              <DialogHeader>
                <DialogTitle>Save Document</DialogTitle>
                <DialogDescription>Save the document to your document library.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-lg border p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">{firstAttachment ? firstAttachment.fileName : "Document"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This document will be saved to your document library without being linked to any transaction or
                    workspace.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleActionComplete}
                    className="bg-gradient-to-r from-amber-600 to-orange-500 hover:opacity-90 transition-opacity"
                  >
                    Save Document
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedAction === "link_workspace" && (
            <>
              <DialogHeader>
                <DialogTitle>Link to Workspace</DialogTitle>
                <DialogDescription>Link this email to an existing workspace.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-lg border p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FolderOpen className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">{emailData.subject || "Email"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Select a workspace to link this email to.</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleActionComplete}
                    className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:opacity-90 transition-opacity"
                  >
                    Link to Workspace
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedAction === "link_transaction" && (
            <>
              <DialogHeader>
                <DialogTitle>Link to Transaction</DialogTitle>
                <DialogDescription>Link this email to an existing transaction.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-lg border p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileStack className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">{emailData.subject || "Email"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Select a transaction to link this email to.</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleActionComplete}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                  >
                    Link to Transaction
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
