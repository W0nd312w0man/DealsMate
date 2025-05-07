"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Edit, Trash2, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Party, PartyRole } from "../workspace-creation-flow"

interface WorkspaceDetailsStepProps {
  workspaceData: {
    namingType: "property" | "client" | ""
    propertyAddress: string
    clientName: string
    workspaceName: string
    notes: string
  }
  workspaceId: string
  buyers: Party[]
  sellers: Party[]
  onBack: () => void
  onNext: (data: Partial<WorkspaceDetailsStepProps["workspaceData"]>) => void
  onAddParty: (role: PartyRole) => void
  onEditParty: (partyId: string) => void
  onRemoveParty: (partyId: string) => void
  onSetPrimaryParty: (partyId: string, role: PartyRole) => void
}

export function WorkspaceDetailsStep({
  workspaceData,
  workspaceId,
  buyers,
  sellers,
  onBack,
  onNext,
  onAddParty,
  onEditParty,
  onRemoveParty,
  onSetPrimaryParty,
}: WorkspaceDetailsStepProps) {
  const [formData, setFormData] = useState({
    workspaceName: workspaceData.workspaceName,
    notes: workspaceData.notes || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.workspaceName.trim()) {
      newErrors.workspaceName = "Workspace name is required"
    }

    // Validate that we have at least one buyer and one seller
    if (buyers.length === 0) {
      newErrors.buyers = "At least one buyer is required"
    }

    if (sellers.length === 0) {
      newErrors.sellers = "At least one seller is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(formData)
    }
  }

  const renderPartyList = (parties: Party[], role: PartyRole) => {
    if (parties.length === 0) {
      return (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-muted-foreground">No {role.toLowerCase()}s added yet</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => onAddParty(role)}>
            <UserPlus className="h-4 w-4 mr-1" />
            Add {role}
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {parties.map((party) => (
          <div key={party.id} className="flex items-center justify-between p-3 border rounded-md bg-background/50">
            <div className="flex items-center space-x-3">
              {party.isPrimary && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  <Star className="h-3 w-3 mr-1" />
                  Primary
                </Badge>
              )}
              <div>
                <p className="font-medium">{party.type === "Individual" ? party.name : party.entityName}</p>
                <p className="text-sm text-muted-foreground">{party.email}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {!party.isPrimary && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSetPrimaryParty(party.id!, role)}
                  title="Set as primary"
                >
                  <Star className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => onEditParty(party.id!)} title="Edit party">
                <Edit className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onRemoveParty(party.id!)} title="Remove party">
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => onAddParty(role)}>
          <UserPlus className="h-4 w-4 mr-1" />
          Add Another {role}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Workspace Details</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="workspaceName">Workspace Name</Label>
          <Input
            id="workspaceName"
            value={formData.workspaceName}
            onChange={(e) => handleChange("workspaceName", e.target.value)}
            className={errors.workspaceName ? "border-red-500" : ""}
          />
          {errors.workspaceName && <p className="text-red-500 text-sm">{errors.workspaceName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add any additional notes about this workspace"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <span className="text-blue-500 mr-2">●</span> Buyers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderPartyList(buyers, "Buyer")}
            {errors.buyers && <p className="text-red-500 text-sm mt-2">{errors.buyers}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <span className="text-green-500 mr-2">●</span> Sellers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderPartyList(sellers, "Seller")}
            {errors.sellers && <p className="text-red-500 text-sm mt-2">{errors.sellers}</p>}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit}>Continue</Button>
      </div>
    </div>
  )
}
