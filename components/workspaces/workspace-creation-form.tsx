"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Check, Loader2 } from "lucide-react"
import { WorkspaceCreationTypeSelector } from "./workspace-creation-type-selector"
import { PropertyAddressSearch } from "./property-address-search"
import { PartyForm } from "./party-form"
import { PartyList } from "./party-list"
import type { EntityType } from "@/hooks/use-contact-manager"
import { type WorkspaceParty, useWorkspaceParties } from "@/hooks/use-workspace-parties"

export function WorkspaceCreationForm() {
  const router = useRouter()
  const workspaceParties = useWorkspaceParties()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState<
    "type-selection" | "property-search" | "party-form" | "workspace-details" | "review"
  >("type-selection")

  const [workspaceType, setWorkspaceType] = useState<"property" | "client" | null>(null)
  const [propertyAddress, setPropertyAddress] = useState("")
  const [currentPartyRole, setCurrentPartyRole] = useState<"Buyer" | "Seller" | null>(null)
  const [currentParty, setCurrentParty] = useState<WorkspaceParty | null>(null)
  const [validationMessages, setValidationMessages] = useState({
    buyers: "",
    sellers: "",
  })

  // Form state
  const [formData, setFormData] = useState({
    workspaceId: `WS-${Date.now()}`,
    workspaceName: "",
    notes: "",
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTypeSelection = (type: "property" | "client") => {
    setWorkspaceType(type)

    if (type === "property") {
      setCurrentStep("property-search")
    } else {
      // For client type, go directly to workspace details
      setCurrentStep("workspace-details")
    }
  }

  const handleAddressSelected = (address: string) => {
    setPropertyAddress(address)
    setFormData((prev) => ({
      ...prev,
      workspaceName: address,
    }))
    setCurrentStep("workspace-details")
  }

  const handleAddParty = (role: "Buyer" | "Seller") => {
    setCurrentPartyRole(role)
    setCurrentParty(null)
    setCurrentStep("party-form")
  }

  const handleEditParty = (party: WorkspaceParty) => {
    setCurrentPartyRole(party.role)
    setCurrentParty(party)
    setCurrentStep("party-form")
  }

  const handlePartySubmit = (partyData: {
    name: string
    email: string
    phone: string
    address: string
    type: EntityType
    role: "Buyer" | "Seller"
    entityName?: string
    authorizedSignorName?: string
    authorizedSignorTitle?: string
  }) => {
    if (currentParty) {
      // Editing existing party
      workspaceParties.updateParty(currentParty.id, partyData)
    } else {
      // Adding new party
      workspaceParties.addParty(formData.workspaceId, partyData)
    }

    setCurrentStep("workspace-details")
    setCurrentPartyRole(null)
    setCurrentParty(null)

    // Update validation messages
    validateParties()
  }

  const handleRemoveParty = (partyId: string) => {
    workspaceParties.removeParty(partyId)

    // Update validation messages
    validateParties()
  }

  const handleSetPrimary = (partyId: string, role: "Buyer" | "Seller") => {
    workspaceParties.setPrimaryParty(formData.workspaceId, partyId, role)
  }

  const validateParties = () => {
    const buyers = workspaceParties.getBuyersByWorkspace(formData.workspaceId)
    const sellers = workspaceParties.getSellersByWorkspace(formData.workspaceId)

    setValidationMessages({
      buyers: buyers.length === 0 ? "At least one buyer is required" : "",
      sellers: sellers.length === 0 ? "At least one seller is required" : "",
    })

    return buyers.length > 0 && sellers.length > 0
  }

  const handleSubmit = async () => {
    // Validate parties
    const validation = workspaceParties.validateWorkspaceParties(formData.workspaceId)

    if (!validation.valid) {
      setValidationMessages({
        ...validationMessages,
        buyers: validation.message.includes("buyer") ? validation.message : "",
        sellers: validation.message.includes("seller") ? validation.message : "",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call to create workspace
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setShowSuccess(true)

    // Redirect to the new workspace after a delay
    setTimeout(() => {
      router.push(`/workspaces/${formData.workspaceId}`)
    }, 3000)
  }

  const getBuyers = () => {
    return workspaceParties.getBuyersByWorkspace(formData.workspaceId)
  }

  const getSellers = () => {
    return workspaceParties.getSellersByWorkspace(formData.workspaceId)
  }

  if (showSuccess) {
    return (
      <Card className="shadow-soft overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-poppins text-green-700">Success!</CardTitle>
          <CardDescription>Your workspace has been successfully created.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-5 w-5 text-green-600" />
            <AlertTitle>Workspace Created</AlertTitle>
            <AlertDescription>
              Workspace {formData.workspaceId} has been created successfully. You will be redirected to the workspace
              page shortly.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => router.push(`/workspaces/${formData.workspaceId}`)}
              className="bg-gradient-to-r from-green-600 to-emerald-500 hover:opacity-90 transition-opacity"
            >
              Go to Workspace Now
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (currentStep === "type-selection") {
    return <WorkspaceCreationTypeSelector onSelect={handleTypeSelection} />
  }

  if (currentStep === "property-search") {
    return (
      <PropertyAddressSearch
        onBack={() => setCurrentStep("type-selection")}
        onAddressSelected={handleAddressSelected}
      />
    )
  }

  if (currentStep === "party-form" && currentPartyRole) {
    return (
      <PartyForm
        role={currentPartyRole}
        onBack={() => setCurrentStep("workspace-details")}
        onSubmit={handlePartySubmit}
      />
    )
  }

  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-poppins text-purple-700">Create New Workspace</CardTitle>
        <CardDescription>
          {workspaceType === "property"
            ? "Create a workspace based on property address"
            : "Create a workspace based on client name"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspace-name">Workspace Name</Label>
            <Input
              id="workspace-name"
              value={formData.workspaceName}
              onChange={(e) => handleInputChange("workspaceName", e.target.value)}
              placeholder="Enter workspace name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Enter any additional notes about this workspace"
              rows={4}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PartyList
            workspaceId={formData.workspaceId}
            role="Buyer"
            parties={getBuyers()}
            onAddParty={() => handleAddParty("Buyer")}
            onEditParty={handleEditParty}
            onRemoveParty={handleRemoveParty}
            onSetPrimary={(partyId) => handleSetPrimary(partyId, "Buyer")}
            validationMessage={validationMessages.buyers}
          />

          <PartyList
            workspaceId={formData.workspaceId}
            role="Seller"
            parties={getSellers()}
            onAddParty={() => handleAddParty("Seller")}
            onEditParty={handleEditParty}
            onRemoveParty={handleRemoveParty}
            onSetPrimary={(partyId) => handleSetPrimary(partyId, "Seller")}
            validationMessage={validationMessages.sellers}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={() => setCurrentStep("type-selection")}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Creating Workspace..." : "Create Workspace"}
        </Button>
      </CardFooter>
    </Card>
  )
}
