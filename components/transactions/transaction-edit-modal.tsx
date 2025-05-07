"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, PencilIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type TransactionStatus, type TransactionType, getStagesByType } from "@/types/transaction"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface TransactionEditModalProps {
  transaction: {
    id: string
    address: string
    type: TransactionType
    status: TransactionStatus
    stage: string
    price: string
    client: string
    closeDate: string
  }
  onSave?: (updatedTransaction: any) => void
}

export function TransactionEditModal({ transaction, onSave }: TransactionEditModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveComplete, setSaveComplete] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const [formData, setFormData] = useState({
    address: transaction.address,
    type: transaction.type,
    status: transaction.status,
    stage: transaction.stage,
    price: transaction.price,
    client: transaction.client,
    closeDate: transaction.closeDate,
  })

  // Get available stages based on transaction type
  const availableStages = getStagesByType(formData.type)

  // Handle type change
  const handleTypeChange = (type: TransactionType) => {
    const newStages = getStagesByType(type)
    setFormData({
      ...formData,
      type,
      // Reset stage to first available if current stage is not available for new type
      stage: newStages.includes(formData.stage) ? formData.stage : newStages[0],
    })
  }

  // Handle status change
  const handleStatusChange = (status: TransactionStatus) => {
    // Show warning when changing to Withdrawn, Canceled, or Archived
    if (
      ["Withdrawn", "Canceled", "Archived"].includes(status) &&
      !["Withdrawn", "Canceled", "Archived"].includes(formData.status)
    ) {
      setShowWarning(true)
    }

    setFormData({
      ...formData,
      status,
    })
  }

  // Handle stage change
  const handleStageChange = (stage: string) => {
    const currentIndex = availableStages.indexOf(formData.stage)
    const newIndex = availableStages.indexOf(stage)

    // Prevent skipping stages (unless it's a previous stage)
    if (newIndex > currentIndex + 1) {
      // Show warning about skipping stages
      setShowWarning(true)
    }

    setFormData({
      ...formData,
      stage,
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    setShowWarning(false)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (onSave) {
      onSave({
        ...transaction,
        ...formData,
      })
    }

    setIsSaving(false)
    setSaveComplete(true)

    // Close dialog after showing success
    setTimeout(() => {
      setIsOpen(false)
      setSaveComplete(false)
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
        >
          <PencilIcon className="h-4 w-4" />
          Edit Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            {saveComplete ? "Transaction updated successfully!" : "Update transaction details."}
          </DialogDescription>
        </DialogHeader>

        {saveComplete ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-green-100 p-3">
              <Loader2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Transaction Updated!</h3>
            <p className="text-sm text-muted-foreground mt-2">Your changes have been saved successfully.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {showWarning && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    {formData.status === "Withdrawn" || formData.status === "Canceled" || formData.status === "Archived"
                      ? "Changing the status to " + formData.status + " will remove this transaction from active views."
                      : "You're attempting to skip stages in the transaction journey. This is not recommended."}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="transaction-address">Property Address</Label>
                <Input
                  id="transaction-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction-client">Client Name</Label>
                <Input
                  id="transaction-client"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <Select value={formData.type} onValueChange={(value: TransactionType) => handleTypeChange(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Purchase">Purchase</SelectItem>
                    <SelectItem value="Listing">Listing</SelectItem>
                    <SelectItem value="Lease Listing">Lease Listing</SelectItem>
                    <SelectItem value="Lease">Lease</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Transaction Stage</Label>
                <Select value={formData.stage} onValueChange={(value: string) => handleStageChange(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select transaction stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Transaction Status</Label>
                <Select value={formData.status} onValueChange={(value: TransactionStatus) => handleStatusChange(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select transaction status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Closing This Month">Closing This Month</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                    <SelectItem value="Canceled">Canceled</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction-price">Price</Label>
                <Input
                  id="transaction-price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction-close-date">Closing Date</Label>
                <Input
                  id="transaction-close-date"
                  value={formData.closeDate}
                  onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
