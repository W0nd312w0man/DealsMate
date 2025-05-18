"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"

interface WorkspaceConversionDialogProps {
  workspaceId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WorkspaceConversionDialog({ workspaceId, open, onOpenChange }: WorkspaceConversionDialogProps) {
  const router = useRouter()
  const [transactionType, setTransactionType] = useState("listing")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, this would create a transaction from the workspace
    // and redirect to the new transaction page
    setIsSubmitting(false)
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
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="transaction-name">Transaction Name</Label>
              <Input
                id="transaction-name"
                placeholder="Enter transaction name"
                defaultValue={`Transaction ${workspaceId.slice(0, 4)}`}
              />
            </div>
            <div className="grid gap-2">
              <Label>Transaction Type</Label>
              <RadioGroup
                defaultValue={transactionType}
                onValueChange={setTransactionType}
                className="grid grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2 rounded-md border p-2">
                  <RadioGroupItem value="listing" id="listing" />
                  <Label htmlFor="listing" className="cursor-pointer">
                    Listing
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-2">
                  <RadioGroupItem value="buyer" id="buyer" />
                  <Label htmlFor="buyer" className="cursor-pointer">
                    Buyer
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-2">
                  <RadioGroupItem value="rental" id="rental" />
                  <Label htmlFor="rental" className="cursor-pointer">
                    Rental
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="cursor-pointer">
                    Other
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Converting..." : "Convert"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
