"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { WorkspaceNamingStep } from "./steps/workspace-naming-step"
import { PropertyAddressStep } from "./steps/property-address-step"
import { ClientNameStep } from "./steps/client-name-step"
import { PartyEntryStep } from "./steps/party-entry-step"
import { WorkspaceDetailsStep } from "./steps/workspace-details-step"
import { WorkspaceReviewStep } from "./steps/workspace-review-step"
import type { EntityType } from "@/hooks/use-contact-manager"
import { useWorkspaceParties } from "@/hooks/use-workspace-parties"

export type WorkspaceCreationStep =
  | "naming-options"
  | "property-address"
  | "client-name"
  | "party-entry"
  | "workspace-details"
  | "review"

export type PartyRole = "Buyer" | "Seller"

export interface Party {
  id?: string
  name: string
  email: string
  phone: string
  address: string
  type: EntityType
  role: PartyRole
  isPrimary?: boolean
  entityName?: string
  authorizedSignorName?: string
  authorizedSignorTitle?: string
}

interface WorkspaceCreationFlowProps {
  onComplete: () => void
}

export function WorkspaceCreationFlow({ onComplete }: WorkspaceCreationFlowProps) {
  const router = useRouter()
  const workspaceParties = useWorkspaceParties()

  const [currentStep, setCurrentStep] = useState<WorkspaceCreationStep>("naming-options")
  const [workspaceId] = useState(`WS-${Date.now().toString(36)}`)

  const [workspaceData, setWorkspaceData] = useState({
    namingType: "" as "property" | "client" | "",
    propertyAddress: "",
    clientName: "",
    workspaceName: "",
    stage: "nurturing",
    notes: "",
  })

  const [currentPartyRole, setCurrentPartyRole] = useState<PartyRole | null>(null)
  const [editingPartyId, setEditingPartyId] = useState<string | null>(null)

  // Update workspace data
  const updateWorkspaceData = (data: Partial<typeof workspaceData>) => {
    setWorkspaceData((prev) => ({ ...prev, ...data }))
  }

  // Handle naming option selection
  const handleNamingOptionSelected = (type: "property" | "client") => {
    updateWorkspaceData({ namingType: type })
    setCurrentStep(type === "property" ? "property-address" : "client-name")
  }

  // Handle property address selection
  const handlePropertyAddressSelected = (address: string) => {
    updateWorkspaceData({
      propertyAddress: address,
      workspaceName: address,
    })
    setCurrentStep("party-entry")
  }

  // Handle client name selection
  const handleClientNameSelected = (name: string, role: PartyRole) => {
    updateWorkspaceData({
      clientName: name,
      workspaceName: `${name} - ${role}`,
    })
    setCurrentPartyRole(role)
    setCurrentStep("party-entry")
  }

  // Handle party submission
  const handlePartySubmitted = (party: Party) => {
    if (editingPartyId) {
      // Update existing party
      workspaceParties.updateParty(editingPartyId, party)
      setEditingPartyId(null)
    } else {
      // Add new party
      workspaceParties.addParty(workspaceId, party)
    }

    setCurrentStep("workspace-details")
  }

  // Handle party editing
  const handleEditParty = (partyId: string) => {
    setEditingPartyId(partyId)
    const party = workspaceParties.parties.find((p) => p.id === partyId)
    if (party) {
      setCurrentPartyRole(party.role)
      setCurrentStep("party-entry")
    }
  }

  // Handle party removal
  const handleRemoveParty = (partyId: string) => {
    workspaceParties.removeParty(partyId)
  }

  // Handle setting primary party
  const handleSetPrimaryParty = (partyId: string, role: PartyRole) => {
    workspaceParties.setPrimaryParty(workspaceId, partyId, role)
  }

  // Handle workspace details submission
  const handleWorkspaceDetailsSubmitted = (details: Partial<typeof workspaceData>) => {
    updateWorkspaceData(details)
    setCurrentStep("review")
  }

  // Handle workspace creation
  const handleCreateWorkspace = async () => {
    // Simulate API call to create workspace
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Navigate to the new workspace
    router.push(`/workspaces/${workspaceId}`)
    onComplete()
  }

  // Get parties for the current workspace
  const getWorkspaceParties = () => {
    return workspaceParties.getPartiesByWorkspace(workspaceId)
  }

  // Get buyers for the current workspace
  const getBuyers = () => {
    return workspaceParties.getBuyersByWorkspace(workspaceId)
  }

  // Get sellers for the current workspace
  const getSellers = () => {
    return workspaceParties.getSellersByWorkspace(workspaceId)
  }

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
