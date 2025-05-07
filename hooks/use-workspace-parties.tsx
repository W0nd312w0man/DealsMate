"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { EntityType } from "./use-contact-manager"
import { useContactManager } from "./use-contact-manager"

export interface WorkspaceParty {
  id?: string
  workspaceId: string
  name: string
  email: string
  phone: string
  address: string
  type: EntityType
  role: "Buyer" | "Seller"
  isPrimary?: boolean
  entityName?: string
  authorizedSignorName?: string
  authorizedSignorTitle?: string
}

interface WorkspacePartiesStore {
  parties: WorkspaceParty[]
  addParty: (workspaceId: string, party: Omit<WorkspaceParty, "workspaceId" | "id">) => string
  updateParty: (id: string, party: Partial<WorkspaceParty>) => void
  removeParty: (id: string) => void
  getPartiesByWorkspace: (workspaceId: string) => WorkspaceParty[]
  getBuyersByWorkspace: (workspaceId: string) => WorkspaceParty[]
  getSellersByWorkspace: (workspaceId: string) => WorkspaceParty[]
  setPrimaryParty: (workspaceId: string, partyId: string, role: "Buyer" | "Seller") => void
  getPrimaryParty: (workspaceId: string, role: "Buyer" | "Seller") => WorkspaceParty | undefined
  validateWorkspaceParties: (workspaceId: string) => { valid: boolean; message: string }
}

export const useWorkspaceParties = create<WorkspacePartiesStore>()(
  persist(
    (set, get) => {
      // Initialize contact manager
      const contactManager = typeof window !== "undefined" ? useContactManager.getState() : null

      return {
        parties: [],

        addParty: (workspaceId, partyData) => {
          // Add to contact manager first to handle deduplication
          let contactId = ""

          if (contactManager) {
            contactId = contactManager.addContact({
              name: partyData.name,
              email: partyData.email,
              phone: partyData.phone,
              address: partyData.address,
              type: partyData.role === "Buyer" ? "Client" : "Client",
              tags: [partyData.role],
              entityType: partyData.type,
              entityName: partyData.entityName,
              authorizedSignorName: partyData.authorizedSignorName,
              authorizedSignorTitle: partyData.authorizedSignorTitle,
            })
          } else {
            // Fallback if contact manager is not available
            contactId = `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          }

          // Get the parties for this workspace
          const workspaceParties = get().getPartiesByWorkspace(workspaceId)

          // Check if this should be primary (first of its role)
          const isPrimary = workspaceParties.filter((p) => p.role === partyData.role).length === 0

          // Create the workspace party
          const newParty: WorkspaceParty = {
            ...partyData,
            id: contactId,
            workspaceId,
            isPrimary,
          }

          set((state) => ({
            parties: [...state.parties, newParty],
          }))

          return contactId
        },

        updateParty: (id, partyData) => {
          // Update in contact manager
          if (contactManager) {
            contactManager.updateContact(id, {
              name: partyData.name,
              email: partyData.email,
              phone: partyData.phone,
              address: partyData.address,
              entityType: partyData.type,
              entityName: partyData.entityName,
              authorizedSignorName: partyData.authorizedSignorName,
              authorizedSignorTitle: partyData.authorizedSignorTitle,
            })
          }

          // Update in workspace parties
          set((state) => ({
            parties: state.parties.map((party) => (party.id === id ? { ...party, ...partyData } : party)),
          }))
        },

        removeParty: (id) => {
          // Get the party to be removed
          const partyToRemove = get().parties.find((p) => p.id === id)
          if (!partyToRemove) return

          // If this was a primary party, we need to set a new primary
          if (partyToRemove.isPrimary) {
            const workspaceParties = get()
              .getPartiesByWorkspace(partyToRemove.workspaceId)
              .filter((p) => p.id !== id && p.role === partyToRemove.role)

            if (workspaceParties.length > 0) {
              // Set the first one as primary
              get().setPrimaryParty(partyToRemove.workspaceId, workspaceParties[0].id!, partyToRemove.role)
            }
          }

          // Remove the party
          set((state) => ({
            parties: state.parties.filter((party) => party.id !== id),
          }))
        },

        getPartiesByWorkspace: (workspaceId) => {
          return get().parties.filter((party) => party.workspaceId === workspaceId)
        },

        getBuyersByWorkspace: (workspaceId) => {
          return get().parties.filter((party) => party.workspaceId === workspaceId && party.role === "Buyer")
        },

        getSellersByWorkspace: (workspaceId) => {
          return get().parties.filter((party) => party.workspaceId === workspaceId && party.role === "Seller")
        },

        setPrimaryParty: (workspaceId, partyId, role) => {
          set((state) => ({
            parties: state.parties.map((party) => {
              if (party.workspaceId === workspaceId && party.role === role) {
                return { ...party, isPrimary: party.id === partyId }
              }
              return party
            }),
          }))
        },

        getPrimaryParty: (workspaceId, role) => {
          return get().parties.find(
            (party) => party.workspaceId === workspaceId && party.role === role && party.isPrimary,
          )
        },

        validateWorkspaceParties: (workspaceId) => {
          const buyers = get().getBuyersByWorkspace(workspaceId)
          const sellers = get().getSellersByWorkspace(workspaceId)

          // Check if we have at least one buyer and one seller
          if (buyers.length === 0) {
            return { valid: false, message: "At least one buyer is required" }
          }

          if (sellers.length === 0) {
            return { valid: false, message: "At least one seller is required" }
          }

          // Check if we have a primary buyer and seller
          const primaryBuyer = get().getPrimaryParty(workspaceId, "Buyer")
          const primarySeller = get().getPrimaryParty(workspaceId, "Seller")

          if (!primaryBuyer && buyers.length > 0) {
            return { valid: false, message: "A primary buyer must be selected" }
          }

          if (!primarySeller && sellers.length > 0) {
            return { valid: false, message: "A primary seller must be selected" }
          }

          // Check if all required fields are filled for all parties
          for (const party of [...buyers, ...sellers]) {
            if (!party.name || !party.email || !party.phone || !party.address) {
              return {
                valid: false,
                message: `${party.role} ${party.name || "Unknown"} is missing required information`,
              }
            }

            // Check entity-specific requirements
            if (party.type !== "Individual") {
              if (!party.entityName || !party.authorizedSignorName || !party.authorizedSignorTitle) {
                return {
                  valid: false,
                  message: `${party.role} ${party.name || "Unknown"} is missing entity information`,
                }
              }
            }
          }

          return { valid: true, message: "" }
        },
      }
    },
    {
      name: "dealsmate-workspace-parties",
    },
  ),
)
