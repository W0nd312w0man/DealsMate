"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, User, Building2, Mail, Phone, MapPin, Check, Pencil, Trash2, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { PartyData, ClientRole } from "./party-entry-form"

interface PartyListProps {
  parties: PartyData[]
  role: ClientRole
  onAddParty: () => void
  onUpdateParty: (party: PartyData) => void
  onDeleteParty: (partyId: string) => void
  onSetPrimary: (partyId: string) => void
  error: string | null
}

export function PartyList({
  parties,
  role,
  onAddParty,
  onUpdateParty,
  onDeleteParty,
  onSetPrimary,
  error,
}: PartyListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [partyToDelete, setPartyToDelete] = useState<string | null>(null)

  const handleDeleteClick = (partyId: string) => {
    setPartyToDelete(partyId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (partyToDelete) {
      onDeleteParty(partyToDelete)
      setDeleteDialogOpen(false)
      setPartyToDelete(null)
    }
  }

  const getPartyTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      individual: "Individual",
      trust: "Trust",
      corporation: "Corporation",
      llc: "LLC",
      partnership: "Partnership",
      estate: "Estate",
      poa: "Power of Attorney",
    }
    return labels[type] || type
  }

  const getPartyDisplayName = (party: PartyData): string => {
    if (party.partyType === "individual") {
      return `${party.firstName} ${party.lastName}`
    } else {
      return party.entityName || ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{role === "buyer" ? "Buyers" : "Sellers"}</h3>
        <Button size="sm" onClick={onAddParty} className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Plus className="h-4 w-4 mr-1" />
          Add {role === "buyer" ? "Buyer" : "Seller"}
        </Button>
      </div>

      {parties.length === 0 ? (
        <div className="border border-dashed rounded-lg p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100/10">
            {role === "buyer" ? (
              <User className="h-6 w-6 text-purple-400" />
            ) : (
              <Building2 className="h-6 w-6 text-purple-400" />
            )}
          </div>
          <h3 className="mt-4 text-lg font-medium">No {role === "buyer" ? "Buyers" : "Sellers"} Added</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Click the "Add {role === "buyer" ? "Buyer" : "Seller"}" button to add a {role} to this workspace.
          </p>
          <Button onClick={onAddParty} className="mt-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Plus className="h-4 w-4 mr-1" />
            Add {role === "buyer" ? "Buyer" : "Seller"}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {parties.map((party) => (
            <Card
              key={party.id}
              className={`border ${party.isPrimary ? "border-purple-500 bg-purple-900/10" : "border-gray-800"}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{getPartyDisplayName(party)}</h4>
                      {party.isPrimary && <Badge className="bg-purple-600 text-white">Primary</Badge>}
                      <Badge variant="outline">{getPartyTypeLabel(party.partyType)}</Badge>
                    </div>

                    {party.partyType !== "individual" && party.signerName && (
                      <p className="text-sm text-muted-foreground">
                        Authorized Signer: {party.signerName} ({party.signerTitle})
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-2">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{party.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{party.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm md:col-span-2">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{party.mailingAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {!party.isPrimary && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-900/10"
                        onClick={() => onSetPrimary(party.id)}
                        title="Set as Primary"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-400 hover:bg-blue-900/10"
                      onClick={() => onUpdateParty(party)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-900/10"
                      onClick={() => handleDeleteClick(party.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {role === "buyer" ? "Buyer" : "Seller"}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {role}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
