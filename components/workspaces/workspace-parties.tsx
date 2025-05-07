"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PartyList } from "./party-list"
import { PartyForm } from "./party-form"
import { type WorkspaceParty, useWorkspaceParties } from "@/hooks/use-workspace-parties"
import type { ContactPerson } from "@/hooks/use-contact-manager"

interface WorkspacePartiesProps {
  workspaceId: string
}

export function WorkspaceParties({ workspaceId }: WorkspacePartiesProps) {
  const workspaceParties = useWorkspaceParties()
  const [currentStep, setCurrentStep] = useState<"list" | "form">("list")
  const [currentPartyRole, setCurrentPartyRole] = useState<"Buyer" | "Seller" | null>(null)
  const [currentParty, setCurrentParty] = useState<WorkspaceParty | null>(null)
  const [validationMessages, setValidationMessages] = useState({
    buyers: "",
    sellers: "",
  })

  useEffect(() => {
    validateParties()
  }, [workspaceId])

  const handleAddParty = (role: "Buyer" | "Seller") => {
    setCurrentPartyRole(role)
    setCurrentParty(null)
    setCurrentStep("form")
  }

  const handleEditParty = (party: WorkspaceParty) => {
    setCurrentPartyRole(party.role)
    setCurrentParty(party)
    setCurrentStep("form")
  }

  const handlePartySubmit = (partyData: Omit<ContactPerson, "id">) => {
    if (currentParty) {
      // Editing existing party
      workspaceParties.updateParty(currentParty.id, partyData)
    } else if (currentPartyRole) {
      // Adding new party
      workspaceParties.addParty(workspaceId, partyData)
    }

    setCurrentStep("list")
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
    workspaceParties.setPrimaryParty(workspaceId, partyId, role)
  }

  const validateParties = () => {
    const buyers = workspaceParties.getBuyersByWorkspace(workspaceId)
    const sellers = workspaceParties.getSellersByWorkspace(workspaceId)

    setValidationMessages({
      buyers: buyers.length === 0 ? "At least one buyer is required" : "",
      sellers: sellers.length === 0 ? "At least one seller is required" : "",
    })

    return buyers.length > 0 && sellers.length > 0
  }

  const getBuyers = () => {
    return workspaceParties.getBuyersByWorkspace(workspaceId)
  }

  const getSellers = () => {
    return workspaceParties.getSellersByWorkspace(workspaceId)
  }

  if (currentStep === "form" && currentPartyRole) {
    return <PartyForm role={currentPartyRole} onBack={() => setCurrentStep("list")} onSubmit={handlePartySubmit} />
  }

  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-poppins text-purple-700">Workspace Parties</CardTitle>
        <CardDescription>Manage buyers and sellers for this workspace</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <PartyList
            workspaceId={workspaceId}
            role="Buyer"
            parties={getBuyers()}
            onAddParty={() => handleAddParty("Buyer")}
            onEditParty={handleEditParty}
            onRemoveParty={handleRemoveParty}
            onSetPrimary={(partyId) => handleSetPrimary(partyId, "Buyer")}
            validationMessage={validationMessages.buyers}
          />

          <PartyList
            workspaceId={workspaceId}
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
    </Card>
  )
}
