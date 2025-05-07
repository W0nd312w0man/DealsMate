"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, FileText, Building, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface AddToTransactionFormProps {
  emailData: any
  attachmentData: any
  suggestedTransactions: any[]
  onCancel: () => void
  onComplete: () => void
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
}

export function AddToTransactionForm({
  emailData,
  attachmentData,
  suggestedTransactions,
  onCancel,
  onComplete,
  isProcessing,
  setIsProcessing,
}: AddToTransactionFormProps) {
  const [formData, setFormData] = useState({
    transactionId: suggestedTransactions.length > 0 ? suggestedTransactions[0].id : "",
    documentType: mapDocumentType(attachmentData?.documentType || "unknown"),
    addToChecklist: true,
    checklistCategory: "required",
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState(suggestedTransactions)

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // In a real implementation, this would filter transactions from an API
    // For this demo, we'll just filter the suggested transactions
    if (!query) {
      setTransactions(suggestedTransactions)
      return
    }

    const filtered = suggestedTransactions.filter((t) => t.address.toLowerCase().includes(query.toLowerCase()))
    setTransactions(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real implementation, this would call an API to add the document to the transaction
    console.log("Adding document to transaction with data:", formData)

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
        <p className="text-sm text-muted-foreground">This document will be added to the selected transaction.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="transactionSearch">Search Transactions</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="transactionSearch"
            placeholder="Search by address or transaction ID"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Select Transaction</Label>
        <div className="max-h-[200px] overflow-y-auto rounded-md border">
          <RadioGroup
            value={formData.transactionId}
            onValueChange={(value) => handleChange("transactionId", value)}
            className="space-y-0"
          >
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center space-x-2 p-3 border-b last:border-0 hover:bg-muted/50"
                >
                  <RadioGroupItem value={transaction.id} id={transaction.id} />
                  <Label htmlFor={transaction.id} className="flex items-center gap-2 cursor-pointer flex-1">
                    <Building className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="font-medium">{transaction.address}</div>
                      <div className="text-xs text-muted-foreground">ID: {transaction.id}</div>
                    </div>
                    {transaction.matchScore && (
                      <div className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        {Math.round(transaction.matchScore * 100)}% match
                      </div>
                    )}
                  </Label>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">No transactions found</div>
            )}
          </RadioGroup>
        </div>
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
            <SelectItem value="Loan Documents">Loan Documents</SelectItem>
            <SelectItem value="Disclosure">Disclosure</SelectItem>
            <SelectItem value="Addendum">Addendum</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="addToChecklist"
            checked={formData.addToChecklist}
            onCheckedChange={(checked) => handleChange("addToChecklist", checked)}
          />
          <Label htmlFor="addToChecklist" className="font-normal">
            Add to transaction checklist
          </Label>
        </div>

        {formData.addToChecklist && (
          <div className="pl-6 pt-2">
            <Label htmlFor="checklistCategory" className="text-sm">
              Checklist Category
            </Label>
            <Select
              value={formData.checklistCategory}
              onValueChange={(value) => handleChange("checklistCategory", value)}
              className="mt-1"
            >
              <SelectTrigger id="checklistCategory">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="required">Required Documents</SelectItem>
                <SelectItem value="optional">Optional Documents</SelectItem>
                <SelectItem value="compliance">Compliance Documents</SelectItem>
                <SelectItem value="financial">Financial Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isProcessing || !formData.transactionId}
          className="bg-gradient-to-r from-green-600 to-teal-500 hover:opacity-90 transition-opacity"
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isProcessing ? "Adding..." : "Add to Transaction"}
        </Button>
      </div>
    </form>
  )
}
