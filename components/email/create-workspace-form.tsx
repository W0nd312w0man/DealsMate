"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, FileText } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface CreateWorkspaceFormProps {
  emailData: any
  attachmentData: any
  suggestedData: any
  onCancel: () => void
  onComplete: () => void
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
}

export function CreateWorkspaceForm({
  emailData,
  attachmentData,
  suggestedData,
  onCancel,
  onComplete,
  isProcessing,
  setIsProcessing,
}: CreateWorkspaceFormProps) {
  const [formData, setFormData] = useState({
    name: suggestedData?.suggestedTitle || emailData.from.name,
    workspaceType: "client",
    email: emailData.from.email,
    phone: "",
    notes: `Initial contact via email: "${emailData.subject}"`,
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

    // In a real implementation, this would call an API to create the workspace
    console.log("Creating workspace with data:", formData)

    setIsProcessing(false)
    onComplete()
  }

  function mapDocumentType(aiDocType: string): string {
    const mapping: Record<string, string> = {
      lead_information: "Lead Information",
      client_inquiry: "Client Inquiry",
      purchase_agreement: "Purchase Agreement",
      listing_agreement: "Listing Agreement",
      offer: "Offer",
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
          This document will be automatically attached to the new workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Workspace Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter workspace name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workspaceType">Workspace Type</Label>
          <Select value={formData.workspaceType} onValueChange={(value) => handleChange("workspaceType", value)}>
            <SelectTrigger id="workspaceType">
              <SelectValue placeholder="Select workspace type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="property">Property</SelectItem>
              <SelectItem value="project">Project</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter email address"
            type="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter phone number"
            type="tel"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Enter notes"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="documentType">Document Type</Label>
          <Select value={formData.documentType} onValueChange={(value) => handleChange("documentType", value)}>
            <SelectTrigger id="documentType">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lead Information">Lead Information</SelectItem>
              <SelectItem value="Client Inquiry">Client Inquiry</SelectItem>
              <SelectItem value="Property Information">Property Information</SelectItem>
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
          Attach document to workspace
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isProcessing}
          className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:opacity-90 transition-opacity"
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isProcessing ? "Creating..." : "Create Workspace"}
        </Button>
      </div>
    </form>
  )
}
