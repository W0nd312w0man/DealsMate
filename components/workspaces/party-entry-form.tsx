"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Building2, Mail, Phone, MapPin } from "lucide-react"

export type PartyType = "individual" | "trust" | "corporation" | "llc" | "partnership" | "estate" | "poa"
export type ClientRole = "buyer" | "seller"

export interface PartyData {
  id: string
  firstName: string
  lastName: string
  entityName?: string
  partyType: PartyType
  email: string
  phone: string
  mailingAddress: string
  role: ClientRole
  signerName?: string
  signerTitle?: string
  isPrimary: boolean
}

interface PartyEntryFormProps {
  initialData?: Partial<PartyData>
  role: ClientRole
  onSave: (data: PartyData) => void
  onCancel: () => void
}

export function PartyEntryForm({ initialData, role, onSave, onCancel }: PartyEntryFormProps) {
  const [formData, setFormData] = useState<Partial<PartyData>>({
    id: initialData?.id || crypto.randomUUID(),
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    entityName: initialData?.entityName || "",
    partyType: initialData?.partyType || "individual",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    mailingAddress: initialData?.mailingAddress || "",
    role: role,
    signerName: initialData?.signerName || "",
    signerTitle: initialData?.signerTitle || "",
    isPrimary: initialData?.isPrimary || false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isEntity, setIsEntity] = useState(formData.partyType !== "individual")

  useEffect(() => {
    setIsEntity(formData.partyType !== "individual")
  }, [formData.partyType])

  const handleChange = (field: keyof PartyData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate based on party type
    if (isEntity) {
      if (!formData.entityName) {
        newErrors.entityName = "Entity name is required"
      }
      if (!formData.signerName) {
        newErrors.signerName = "Authorized signer name is required"
      }
      if (!formData.signerTitle) {
        newErrors.signerTitle = "Authorized signer title is required"
      }
    } else {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required"
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required"
      }
    }

    // Common validations
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.mailingAddress) {
      newErrors.mailingAddress = "Mailing address is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData as PartyData)
    }
  }

  return (
    <Card className="border-muted bg-background/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">{isEntity ? "Entity Information" : "Individual Information"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="partyType">Party Type</Label>
          <Select value={formData.partyType} onValueChange={(value) => handleChange("partyType", value as PartyType)}>
            <SelectTrigger id="partyType">
              <SelectValue placeholder="Select party type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="trust">Trust</SelectItem>
              <SelectItem value="corporation">Corporation</SelectItem>
              <SelectItem value="llc">LLC</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
              <SelectItem value="estate">Estate</SelectItem>
              <SelectItem value="poa">Power of Attorney</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isEntity ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entityName">
                <Building2 className="h-4 w-4 inline mr-1" />
                Entity Name
              </Label>
              <Input
                id="entityName"
                value={formData.entityName || ""}
                onChange={(e) => handleChange("entityName", e.target.value)}
                className={errors.entityName ? "border-red-500" : ""}
              />
              {errors.entityName && <p className="text-red-500 text-sm">{errors.entityName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signerName">
                  <User className="h-4 w-4 inline mr-1" />
                  Authorized Signer Name
                </Label>
                <Input
                  id="signerName"
                  value={formData.signerName || ""}
                  onChange={(e) => handleChange("signerName", e.target.value)}
                  className={errors.signerName ? "border-red-500" : ""}
                />
                {errors.signerName && <p className="text-red-500 text-sm">{errors.signerName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signerTitle">Authorized Signer Title</Label>
                <Input
                  id="signerTitle"
                  placeholder="e.g. Trustee, Managing Member"
                  value={formData.signerTitle || ""}
                  onChange={(e) => handleChange("signerTitle", e.target.value)}
                  className={errors.signerTitle ? "border-red-500" : ""}
                />
                {errors.signerTitle && <p className="text-red-500 text-sm">{errors.signerTitle}</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                <User className="h-4 w-4 inline mr-1" />
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName || ""}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName || ""}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">
            <Mail className="h-4 w-4 inline mr-1" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            <Phone className="h-4 w-4 inline mr-1" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mailingAddress">
            <MapPin className="h-4 w-4 inline mr-1" />
            Mailing Address
          </Label>
          <Input
            id="mailingAddress"
            value={formData.mailingAddress || ""}
            onChange={(e) => handleChange("mailingAddress", e.target.value)}
            className={errors.mailingAddress ? "border-red-500" : ""}
          />
          {errors.mailingAddress && <p className="text-red-500 text-sm">{errors.mailingAddress}</p>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          Save {role === "buyer" ? "Buyer" : "Seller"}
        </Button>
      </CardFooter>
    </Card>
  )
}
