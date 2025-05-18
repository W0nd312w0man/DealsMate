"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface WorkspaceConversionDialogProps {
  workspaceId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WorkspaceConversionDialog({ workspaceId, open, onOpenChange }: WorkspaceConversionDialogProps) {
  const router = useRouter()
  const [isConverting, setIsConverting] = useState(false)

  const handleConvert = async () => {
    if (!workspaceId) return

    setIsConverting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsConverting(false)
    onOpenChange(false)

    // Redirect to transactions page
    router.push("/transactions")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Convert to Transaction</DialogTitle>
          <DialogDescription>Convert this workspace into a transaction to track stages and progress.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConvert} disabled={isConverting}>
            {isConverting ? "Converting..." : "Convert"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
