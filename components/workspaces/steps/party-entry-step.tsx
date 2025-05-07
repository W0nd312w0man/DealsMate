"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Loader2, UserPlus, Edit, Trash2, Star, CheckCircle } from "lucide-react"
import { useWorkspaceParties } from "@/hooks/use-workspace-parties"
import type { Party, PartyRole } from "../workspace-creation-flow"

interface PartyEntryStepProps {
  role: PartyRole
  partyId?: string | null
  onBack: () => void
  onSubmit: (party: Party) => void
  isSubmitting?: boolean
  workspaceCreated?: boolean
  buyers?: Party[]
  sellers?: Party[]
  onSwitchRole?: (role: PartyRole) => void
  onEditParty?: (partyId: string) => void
  onRemoveParty?: (partyId: string) => void
  onSetPrimaryParty?: (partyId: string, role: PartyRole) => void
  onFinalize?: () => void
}

export function PartyEntryStep({
  role,
  partyId,
  onBack,
  onSubmit,
  isSubmitting = false,
  workspaceCreated = false,
  buyers = [],
  sellers = [],
  onSwitchRole,
  onEditParty,
  onRemoveParty,
  onSetPrimaryParty,
  onFinalize,
}: PartyEntryStepProps) {
  const workspaceParties = useWorkspaceParties()
  const [activeTab, setActiveTab] = useState<"form" | "list">("form")

  const [formData, setFormData] = useState<Party>({
    name: "",
    email: "",
    phone: "",
    address: "",
    type: "Individual",
    role: role,
    entityName: "",
    authorizedSignorName: "",
    authorizedSignorTitle: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load party data if editing
  useEffect(() => {
    if (partyId) {
      const party = workspaceParties.parties.find((p) => p.id === partyId)
      if (party) {
        setFormData({
          name: party.name,
          email: party.email,
          phone: party.phone,
          address: party.address,
          type: party.type,
          role: party.role,
          entityName: party.entityName || "",
          authorizedSignorName: party.authorizedSignorName || "",
          authorizedSignorTitle: party.authorizedSignorTitle || "",
        })
      }
    } else {
      // Reset form for new party
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        type: "Individual",
        role: role,
        entityName: "",
        authorizedSignorName: "",
        authorizedSignorTitle: "",
      })
    }
  }, [partyId, role, workspaceParties.parties])

  const handleChange = (field: keyof Party, value: string) => {
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

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (formData.type !== "Individual") {
      if (!formData.entityName?.trim()) {
        newErrors.entityName = "Entity name is required"
      }

      if (!formData.authorizedSignorName?.trim()) {
        newErrors.authorizedSignorName = "Authorized signor name is required"
      }

      if (!formData.authorizedSignorTitle?.trim()) {
        newErrors.authorizedSignorTitle = "Authorized signor title is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
      // Reset form after submission
      if (!partyId) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          type: "Individual",
          role: role,
          entityName: "",
          authorizedSignorName: "",
          authorizedSignorTitle: "",
        })
      }
    }
  }

  const renderPartyList = (parties: Party[], role: PartyRole) => {
    if (parties.length === 0) {
      return (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-muted-foreground">No {role.toLowerCase()}s added yet</p>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {parties.map((party) => (
          <div key={party.id} className="flex items-center justify-between p-3 border rounded-md bg-background/50">
            <div className="flex items-center space-x-3">
              {party.isPrimary && (
                <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full text-xs flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  Primary
                </div>
              )}
              <div>
                <p className="font-medium">{party.type === "Individual" ? party.name : party.entityName}</p>
                <p className="text-sm text-muted-foreground">{party.email}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {!party.isPrimary && onSetPrimaryParty && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSetPrimaryParty(party.id!, role)}
                  title="Set as primary"
                >
                  <Star className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
              {onEditParty && (
                <Button variant="ghost" size="icon" onClick={() => onEditParty(party.id!)} title="Edit party">
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
              {onRemoveParty && (
                <Button variant="ghost" size="icon" onClick={() => onRemoveParty(party.id!)} title="Remove party">
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "form" | "list")} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="form" disabled={isSubmitting}>
            {partyId ? "Edit" : "Add"} {role}
          </TabsTrigger>
          <TabsTrigger value="list" disabled={isSubmitting}>
            Party List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {partyId ? "Edit" : "Add"} {role}
            </h2>
            {onSwitchRole && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={role === "Buyer" ? "default" : "outline"}
                  onClick={() => onSwitchRole("Buyer")}
                  disabled={isSubmitting}
                >
                  Buyer
                </Button>
                <Button
                  size="sm"
                  variant={role === "Seller" ? "default" : "outline"}
                  onClick={() => onSwitchRole("Seller")}
                  disabled={isSubmitting}
                >
                  Seller
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Entity Type</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
                className="flex flex-col space-y-1"
                disabled={isSubmitting}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Individual" id="individual" />
                  <Label htmlFor="individual">Individual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="LLC" id="llc" />
                  <Label htmlFor="llc">LLC</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Corporation" id="corporation" />
                  <Label htmlFor="corporation">Corporation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Trust" id="trust" />
                  <Label htmlFor="trust">Trust</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.type !== "Individual" && (
              <div className="space-y-4 border-l-2 border-purple-500/20 pl-4">
                <div className="space-y-2">
                  <Label htmlFor="entityName">Entity Name</Label>
                  <Input
                    id="entityName"
                    value={formData.entityName}
                    onChange={(e) => handleChange("entityName", e.target.value)}
                    className={errors.entityName ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.entityName && <p className="text-red-500 text-sm">{errors.entityName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authorizedSignorName">Authorized Signor Name</Label>
                  <Input
                    id="authorizedSignorName"
                    value={formData.authorizedSignorName}
                    onChange={(e) => handleChange("authorizedSignorName", e.target.value)}
                    className={errors.authorizedSignorName ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.authorizedSignorName && <p className="text-red-500 text-sm">{errors.authorizedSignorName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authorizedSignorTitle">Authorized Signor Title</Label>
                  <Input
                    id="authorizedSignorTitle"
                    value={formData.authorizedSignorTitle}
                    onChange={(e) => handleChange("authorizedSignorTitle", e.target.value)}
                    className={errors.authorizedSignorTitle ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.authorizedSignorTitle && (
                    <p className="text-red-500 text-sm">{errors.authorizedSignorTitle}</p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">{formData.type === "Individual" ? "Full Name" : "Contact Name"}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={errors.phone ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className={errors.address ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
          </div>

          <div className="flex justify-between mt-6 pt-4 border-t border-purple-900/10">
            <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                `Save ${role}`
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <span className="text-blue-500 mr-2">●</span> Buyers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderPartyList(buyers, "Buyer")}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    if (onSwitchRole) onSwitchRole("Buyer")
                    setActiveTab("form")
                  }}
                  disabled={isSubmitting}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Add Buyer
                </Button>
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
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    if (onSwitchRole) onSwitchRole("Seller")
                    setActiveTab("form")
                  }}
                  disabled={isSubmitting}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Add Seller
                </Button>
              </CardContent>
            </Card>
          </div>

          {workspaceCreated && buyers.length > 0 && sellers.length > 0 && onFinalize && (
            <div className="mt-6 pt-4 border-t border-purple-900/10">
              <Alert className="bg-green-900/10 border-green-800/30 mb-4">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  Workspace created and parties added. You can now finalize the workspace.
                </AlertDescription>
              </Alert>

              <Button
                onClick={onFinalize}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finalizing...
                  </>
                ) : (
                  "Finalize Workspace"
                )}
              </Button>
            </div>
          )}

          {(!workspaceCreated || buyers.length === 0 || sellers.length === 0) && (
            <Alert className="bg-blue-900/10 border-blue-800/30">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription>
                {!workspaceCreated
                  ? "Please create a workspace first by saving a property address."
                  : buyers.length === 0
                    ? "Please add at least one buyer."
                    : "Please add at least one seller."}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
