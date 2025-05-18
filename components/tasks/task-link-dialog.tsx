"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { Task } from "@/types/task"
import { Textarea } from "@/components/ui/textarea"

interface TaskLinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  onTaskLinked: (taskId: string, linkType: string, linkId: string) => void
}

export function TaskLinkDialog({ open, onOpenChange, task, onTaskLinked }: TaskLinkDialogProps) {
  const [linkType, setLinkType] = useState<"transaction" | "workspace" | "">("")
  const [selectedLinkId, setSelectedLinkId] = useState("")
  const { toast } = useToast()
  const [description, setDescription] = useState("")

  // Mock data for transactions and workspaces
  const transactions = [
    { id: "TX-1234", address: "15614 Yermo Street, Los Angeles, CA" },
    { id: "TX-1235", address: "456 Oak Ave, Somewhere, CA" },
    { id: "TX-1237", address: "101 Cedar Lane, San Francisco, CA" },
  ]

  const workspaces = [
    { id: "ws-1", name: "Karen Chen Property Purchase" },
    { id: "ws-2", name: "Johnson Property Sale" },
    { id: "ws-3", name: "Brown Listing" },
  ]

  const handleConfirm = () => {
    if (!task || !linkType || !selectedLinkId) return

    onTaskLinked(task.id, linkType, selectedLinkId)

    toast({
      title: "Task Linked",
      description: `Task has been linked to ${linkType === "transaction" ? "transaction" : "workspace"} successfully.`,
      variant: "default",
    })

    resetAndClose()
  }

  const resetAndClose = () => {
    setLinkType("")
    setSelectedLinkId("")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>Enter a description for your new task.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              className="min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              if (!description.trim()) return

              // Create a new task
              const newTask = {
                id: `task-${Date.now()}`,
                title: description,
                details: "",
                priority: "medium",
                dueDate: "Today, 5:00 PM",
                isPastDue: false,
                completed: false,
                ownerRole: "agent",
                ownerName: "John Smith",
                createdBy: "manual",
              }

              // Get existing tasks from sessionStorage or initialize empty array
              const existingTasks = JSON.parse(sessionStorage.getItem("tasks") || "[]")

              // Add new task to the array
              const updatedTasks = [newTask, ...existingTasks]

              // Save back to sessionStorage
              sessionStorage.setItem("tasks", JSON.stringify(updatedTasks))

              // Show success toast
              toast({
                title: "Task Created",
                description: "Your task has been created successfully.",
                variant: "default",
              })

              // Reset and close dialog
              setDescription("")
              onOpenChange(false)

              // Force refresh the page to show the new task
              window.location.reload()
            }}
            disabled={!description.trim()}
          >
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
