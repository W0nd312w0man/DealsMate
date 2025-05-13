"use client"

import { WorkspaceNamingStep } from "./steps/workspace-naming-step"
import { PropertyAddressStep } from "./steps/property-address-step"
import { ClientNameStep } from "./steps/client-name-step"
import { PartyEntryStep } from "./steps/party-entry-step"
import { WorkspaceDetailsStep } from "./steps/workspace-details-step"
import { WorkspaceReviewStep } from "./steps/workspace-review-step"
import { useWorkspaceCreation } from "@/hooks/use-workspace-creation"

interface WorkspaceCreationFlowProps {
  onComplete: () => void
}

export function WorkspaceCreationFlow({ onComplete }: WorkspaceCreationFlowProps) {
  const {
    currentStep,
    workspaceId,
    workspaceData,
    currentPartyRole,
    editingPartyId,
    handleNamingOptionSelected,
    handlePropertyAddressSelected,
    handleClientNameSelected,
    handlePartySubmitted,
    handleEditParty,
    handleRemoveParty,
    handleSetPrimaryParty,
    handleWorkspaceDetailsSubmitted,
    handleCreateWorkspace,
    getWorkspaceParties,
    getBuyers,
    getSellers,
    setCurrentStep,
    setCurrentPartyRole,
    setEditingPartyId,
  } = useWorkspaceCreation({ onComplete })

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case "naming-options":
        return <WorkspaceNamingStep onSelect={handleNamingOptionSelected} />
      case "property-address":
        return (
          <PropertyAddressStep
            onBack={() => setCurrentStep("naming-options")}
            onAddressSelected={handlePropertyAddressSelected}
          />
        )
      case "client-name":
        return (
          <ClientNameStep onBack={() => setCurrentStep("naming-options")} onClientSelected={handleClientNameSelected} />
        )
      case "party-entry":
        return (
          <PartyEntryStep
            role={currentPartyRole!}
            partyId={editingPartyId}
            onBack={() => setCurrentStep("workspace-details")}
            onSubmit={handlePartySubmitted}
          />
        )
      case "workspace-details":
        return (
          <WorkspaceDetailsStep
            workspaceData={workspaceData}
            workspaceId={workspaceId}
            buyers={getBuyers()}
            sellers={getSellers()}
            onBack={() => setCurrentStep(workspaceData.namingType === "property" ? "property-address" : "client-name")}
            onNext={handleWorkspaceDetailsSubmitted}
            onAddParty={(role) => {
              setCurrentPartyRole(role)
              setEditingPartyId(null)
              setCurrentStep("party-entry")
            }}
            onEditParty={handleEditParty}
            onRemoveParty={handleRemoveParty}
            onSetPrimaryParty={handleSetPrimaryParty}
          />
        )
      case "review":
        return (
          <WorkspaceReviewStep
            workspaceData={workspaceData}
            workspaceId={workspaceId}
            parties={getWorkspaceParties()}
            onBack={() => setCurrentStep("workspace-details")}
            onSubmit={handleCreateWorkspace}
          />
        )
      default:
        return null
    }
  }

  return renderStep()
}
