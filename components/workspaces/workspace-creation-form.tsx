"use client"

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
import { useWorkspaceCreation } from "@/hooks/use-workspace-creation"

export function WorkspaceCreationForm() {
  const {
    currentStep,
    workspaceId,
    workspaceData,
    currentPartyRole,
    validationMessages,
    isSubmitting,
    showSuccess,
    handleNamingOptionSelected,
    handlePropertyAddressSelected,
    handlePartySubmitted,
    handleEditParty,
    handleRemoveParty,
    handleSetPrimaryParty,
    handleCreateWorkspace,
    getBuyers,
    getSellers,
    setCurrentStep,
    setCurrentPartyRole,
    updateWorkspaceData,
  } = useWorkspaceCreation()

  const handleInputChange = (field: string, value: any) => {
    updateWorkspaceData({
      [field]: value,
    })
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
              Workspace {workspaceId} has been created successfully. You will be redirected to the workspace page
              shortly.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => (window.location.href = `/workspaces/${workspaceId}`)}
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
    return <WorkspaceCreationTypeSelector onSelect={handleNamingOptionSelected} />
  }

  if (currentStep === "property-search") {
    return (
      <PropertyAddressSearch
        onBack={() => setCurrentStep("type-selection")}
        onAddressSelected={handlePropertyAddressSelected}
      />
    )
  }

  if (currentStep === "party-form" && currentPartyRole) {
    return (
      <PartyForm
        role={currentPartyRole}
        onBack={() => setCurrentStep("workspace-details")}
        onSubmit={handlePartySubmitted}
      />
    )
  }

  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-poppins text-purple-700">Create New Workspace</CardTitle>
        <CardDescription>
          {workspaceData.namingType === "property"
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
              value={workspaceData.workspaceName}
              onChange={(e) => handleInputChange("workspaceName", e.target.value)}
              placeholder="Enter workspace name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={workspaceData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Enter any additional notes about this workspace"
              rows={4}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PartyList
            workspaceId={workspaceId}
            role="Buyer"
            parties={getBuyers()}
            onAddParty={() => {
              setCurrentPartyRole("Buyer")
              setCurrentStep("party-form")
            }}
            onEditParty={handleEditParty}
            onRemoveParty={handleRemoveParty}
            onSetPrimary={(partyId) => handleSetPrimaryParty(partyId, "Buyer")}
            validationMessage={validationMessages.buyers}
          />

          <PartyList
            workspaceId={workspaceId}
            role="Seller"
            parties={getSellers()}
            onAddParty={() => {
              setCurrentPartyRole("Seller")
              setCurrentStep("party-form")
            }}
            onEditParty={handleEditParty}
            onRemoveParty={handleRemoveParty}
            onSetPrimary={(partyId) => handleSetPrimaryParty(partyId, "Seller")}
            validationMessage={validationMessages.sellers}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={() => setCurrentStep("type-selection")}>
          Back
        </Button>
        <Button
          onClick={handleCreateWorkspace}
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
