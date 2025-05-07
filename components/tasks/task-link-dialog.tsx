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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { Task } from "@/types/task"

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
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Link Task</DialogTitle>
          <DialogDescription>Link this task to a transaction or workspace.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link-type" className="text-right">
              Link Type
            </Label>
            <Select onValueChange={(value: "transaction" | "workspace") => setLinkType(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select link type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transaction">Transaction</SelectItem>
                <SelectItem value="workspace">Workspace</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {linkType === "transaction" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transaction" className="text-right">
                Transaction
              </Label>
              <Select onValueChange={setSelectedLinkId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select transaction" />
                </SelectTrigger>
                <SelectContent>
                  {transactions.map((tx) => (
                    <SelectItem key={tx.id} value={tx.id}>
                      {tx.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {linkType === "workspace" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workspace" className="text-right">
                Workspace
              </Label>
              <Select onValueChange={setSelectedLinkId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select workspace" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((ws) => (
                    <SelectItem key={ws.id} value={ws.id}>
                      {ws.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!linkType || !selectedLinkId}>
            Link Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
