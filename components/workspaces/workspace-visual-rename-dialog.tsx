"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { VisualWorkspaceNaming } from "./visual-workspace-naming"
import { useToast } from "@/components/ui/use-toast"

interface WorkspaceVisualRenameDialogProps {
  workspaceId: string
  currentName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onRename: (newName: string) => void
}

export function WorkspaceVisualRenameDialog({
  workspaceId,
  currentName,
  open,
  onOpenChange,
  onRename,
}: WorkspaceVisualRenameDialogProps) {
  const [newName, setNewName] = useState(currentName)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleRename = async () => {
    if (!newName || newName === currentName) return

    setIsSubmitting(true)

    try {
      // Simulate API call to rename workspace
      await new Promise((resolve) => setTimeout(resolve, 800))

      onRename(newName)

      toast({
        title: "Workspace renamed",
        description: `Workspace has been renamed to "${newName}"`,
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rename workspace. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Rename Workspace Visually</DialogTitle>
          <DialogDescription>Use the visual tools below to rename your workspace without typing.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <VisualWorkspaceNaming onNameGenerated={setNewName} initialName={currentName} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleRename}
            disabled={isSubmitting || !newName || newName === currentName}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
          >
            {isSubmitting ? "Saving..." : "Rename Workspace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
