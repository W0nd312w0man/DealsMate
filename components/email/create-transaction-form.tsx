"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, FileText } from "lucide-react"

interface CreateTransactionFormProps {
  emailData: any
  attachmentData: any
  suggestedData: any
  onCancel: () => void
  onComplete: () => void
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
}

export function CreateTransactionForm({
  emailData,
  attachmentData,
  suggestedData,
  onCancel,
  onComplete,
  isProcessing,
  setIsProcessing,
}: CreateTransactionFormProps) {
  const [formData, setFormData] = useState({
    address: suggestedData?.suggestedTitle || "",
    transactionType: "purchase",
    status: "Active",
    price: "",
    closeDate: "",
    attachDocument: true,
    documentType: mapDocumentType(suggestedData?.documentType || ""),
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real implementation, this would call an API to create the transaction
    console.log("Creating transaction with data:", formData)

    setIsProcessing(false)
    onComplete()
  }

  function mapDocumentType(aiDocType: string): string {
    const mapping: Record<string, string> = {
      purchase_agreement: "Purchase Agreement",
      listing_agreement: "Listing Agreement",
      offer: "Offer",
      escrow_instructions: "Escrow Instructions",
      inspection_report: "Inspection Report",
      unknown: "Other",
    }

    return mapping[aiDocType] || "Other"
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="rounded-lg border p-4 mb-4 bg-purple-50/50">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-purple-600" />
          <span className="font-medium">{attachmentData?.fileName}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          This document will be automatically attached to the new transaction.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="address">Property Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Enter property address"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionType">Transaction Type</Label>
          <Select value={formData.transactionType} onValueChange={(value) => handleChange("transactionType", value)}>
            <SelectTrigger id="transactionType">
              <SelectValue placeholder="Select transaction type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="purchase">Purchase</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="lease">Lease</SelectItem>
              <SelectItem value="refinance">Refinance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Closing This Month">Closing This Month</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
              <SelectItem value="Withdrawn">Withdrawn</SelectItem>
              <SelectItem value="Canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            placeholder="Enter price"
            type="text"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="closeDate">Closing Date</Label>
          <Input
            id="closeDate"
            value={formData.closeDate}
            onChange={(e) => handleChange("closeDate", e.target.value)}
            placeholder="MM/DD/YYYY"
            type="date"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="documentType">Document Type</Label>
          <Select value={formData.documentType} onValueChange={(value) => handleChange("documentType", value)}>
            <SelectTrigger id="documentType">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Purchase Agreement">Purchase Agreement</SelectItem>
              <SelectItem value="Listing Agreement">Listing Agreement</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
              <SelectItem value="Escrow Instructions">Escrow Instructions</SelectItem>
              <SelectItem value="Inspection Report">Inspection Report</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2 py-2">
        <Checkbox
          id="attachDocument"
          checked={formData.attachDocument}
          onCheckedChange={(checked) => handleChange("attachDocument", checked)}
        />
        <Label htmlFor="attachDocument" className="text-sm font-normal">
          Attach document to transaction
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isProcessing}
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isProcessing ? "Creating..." : "Create Transaction"}
        </Button>
      </div>
    </form>
  )
}
