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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type TransactionType, getStagesByType } from "@/types/transaction"

export function NewTransactionDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    address: "",
    client: "",
    type: "Purchase" as TransactionType,
    stage: "Nurturing",
    price: "",
    closeDate: "",
  })

  // Get available stages based on transaction type
  const availableStages = getStagesByType(formData.type)

  // Handle type change
  const handleTypeChange = (type: TransactionType) => {
    const newStages = getStagesByType(type)
    setFormData({
      ...formData,
      type,
      // Reset stage to first available for new type
      stage: newStages[0],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSuccess(true)

    // Reset form and close dialog after showing success
    setTimeout(() => {
      setFormData({
        address: "",
        client: "",
        type: "Purchase",
        stage: "Nurturing",
        price: "",
        closeDate: "",
      })
      setIsSuccess(false)
      setOpen(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          New Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Transaction</DialogTitle>
          <DialogDescription>
            {isSuccess ? "Transaction created successfully!" : "Enter the details for the new transaction."}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-green-100 p-3">
              <Loader2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Transaction Created!</h3>
            <p className="text-sm text-muted-foreground mt-2">Your new transaction has been created successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transaction-address">Property Address</Label>
                <Input
                  id="transaction-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction-client">Client Name</Label>
                <Input
                  id="transaction-client"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: TransactionType) => handleTypeChange(value)}
                  required
                >
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
                <Label>Initial Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value: string) => setFormData({ ...formData, stage: value })}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select initial stage" />
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
                <Label htmlFor="transaction-price">Price</Label>
                <Input
                  id="transaction-price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction-close-date">Expected Closing Date</Label>
                <Input
                  id="transaction-close-date"
                  type="date"
                  value={formData.closeDate}
                  onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setOpen(false)} type="button">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Creating..." : "Create Transaction"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
