"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWorkspaceParties } from "@/hooks/use-workspace-parties"
import type { EntityType } from "@/hooks/use-contact-manager"

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
  authorizedSignorEmail?: string
  authorizedSignorPhone?: string
}

interface UseWorkspaceCreationOptions {
  onComplete?: () => void
  initialStep?: WorkspaceCreationStep
}

export function useWorkspaceCreation(options: UseWorkspaceCreationOptions = {}) {
  const { onComplete, initialStep = "naming-options" } = options

  const router = useRouter()
  const workspaceParties = useWorkspaceParties()

  const [currentStep, setCurrentStep] = useState<WorkspaceCreationStep>(initialStep)
  const [workspaceId] = useState(`WS-${Date.now().toString(36)}`)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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
  const [validationMessages, setValidationMessages] = useState({
    buyers: "",
    sellers: "",
  })

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
    validateParties()
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
    validateParties()
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

  // Validate parties
  const validateParties = () => {
    const buyers = workspaceParties.getBuyersByWorkspace(workspaceId)
    const sellers = workspaceParties.getSellersByWorkspace(workspaceId)

    setValidationMessages({
      buyers: buyers.length === 0 ? "At least one buyer is required" : "",
      sellers: sellers.length === 0 ? "At least one seller is required" : "",
    })

    return buyers.length > 0 && sellers.length > 0
  }

  // Handle workspace creation
  const handleCreateWorkspace = async () => {
    // Validate parties
    const validation = workspaceParties.validateWorkspaceParties(workspaceId)

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
      router.push(`/workspaces/${workspaceId}`)
      if (onComplete) {
        onComplete()
      }
    }, 3000)
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

  return {
    currentStep,
    setCurrentStep,
    workspaceId,
    workspaceData,
    updateWorkspaceData,
    currentPartyRole,
    setCurrentPartyRole,
    editingPartyId,
    setEditingPartyId,
    validationMessages,
    isSubmitting,
    showSuccess,
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
    validateParties,
  }
}
