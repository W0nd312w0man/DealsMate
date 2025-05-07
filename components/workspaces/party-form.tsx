"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { EntityType } from "@/hooks/use-contact-manager"

interface PartyFormProps {
  role: "Buyer" | "Seller"
  onBack: () => void
  onSubmit: (partyData: {
    name: string
    email: string
    phone: string
    address: string
    type: EntityType
    role: "Buyer" | "Seller"
    entityName?: string
    authorizedSignorName?: string
    authorizedSignorTitle?: string
  }) => void
}

export function PartyForm({ role, onBack, onSubmit }: PartyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    type: "Individual" as EntityType,
    entityName: "",
    authorizedSignorName: "",
    authorizedSignorTitle: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    setError("")

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError("Please fill in all required fields")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    // Validate entity-specific fields
    if (formData.type !== "Individual") {
      if (!formData.entityName) {
        setError("Entity name is required")
        return
      }

      if (!formData.authorizedSignorName) {
        setError("Authorized signor name is required")
        return
      }

      if (!formData.authorizedSignorTitle) {
        setError("Authorized signor title is required")
        return
      }
    }

    setIsSubmitting(true)

    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false)
      onSubmit({
        ...formData,
        role,
      })
    }, 500)
  }

  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl font-poppins text-purple-700">Add {role}</CardTitle>
        </div>
        <CardDescription>Enter {role.toLowerCase()} information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="party-type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value as EntityType)}>
            <SelectTrigger id="party-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Individual">Individual</SelectItem>
              <SelectItem value="Trust">Trust</SelectItem>
              <SelectItem value="Corporation">Corporation</SelectItem>
              <SelectItem value="LLC">LLC</SelectItem>
              <SelectItem value="Partnership">Partnership</SelectItem>
              <SelectItem value="Estate">Estate</SelectItem>
              <SelectItem value="Power of Attorney">Power of Attorney</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.type !== "Individual" && (
          <div className="space-y-2">
            <Label htmlFor="entity-name">Entity Name</Label>
            <Input
              id="entity-name"
              value={formData.entityName}
              onChange={(e) => handleInputChange("entityName", e.target.value)}
              placeholder="Enter entity name"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">{formData.type === "Individual" ? "Full Name" : "Authorized Signor Name"}</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder={`Enter ${formData.type === "Individual" ? "full name" : "authorized signor name"}`}
            required
          />
        </div>

        {formData.type !== "Individual" && (
          <div className="space-y-2">
            <Label htmlFor="signor-title">Authorized Signor Title</Label>
            <Input
              id="signor-title"
              value={formData.authorizedSignorTitle}
              onChange={(e) => handleInputChange("authorizedSignorTitle", e.target.value)}
              placeholder="E.g., Trustee, Managing Member, Executor"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Mailing Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Enter mailing address"
            required
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </CardFooter>
    </Card>
  )
}
