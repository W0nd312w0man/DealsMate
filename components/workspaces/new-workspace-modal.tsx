"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, Building, CheckCircle, Home, Loader2, MapPin, User, Users } from "lucide-react"
import { useWorkspaceCreation } from "@/hooks/use-workspace-creation"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client
const createSupabaseClient = () => {
  const supabaseUrl = "https://ylpfxtdzizqrzhtxwelk.supabase.co"
  const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlscGZ4dGR6aXpxcnpodHh3ZWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjI1MDgsImV4cCI6MjA2MjgzODUwOH0.Gv623QSJLOZwYrPBhyOkw9Vk-kzrH4PI6qn125gD1Tw"
  return createClient(supabaseUrl, supabaseAnonKey)
}

type NamingType = "property" | "client" | ""
type ClientType = "Buyer" | "Seller" | ""
type EntityType = "Individual" | "Trust" | "Corporation" | "LLC" | "Partnership" | "Estate" | "POA"

interface Party {
  id?: string
  name: string
  email: string
  phone: string
  address: string
  type: EntityType
  role: ClientType
  isPrimary?: boolean
  entityName?: string
  authorizedSignorName?: string
  authorizedSignorTitle?: string
  authorizedSignorEmail?: string
  authorizedSignorPhone?: string
}

interface NewWorkspaceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewWorkspaceModal({ open, onOpenChange }: NewWorkspaceModalProps) {
  const { toast } = useToast()

  // Use a simplified version of the workspace creation flow for the modal
  const [step, setStep] = useState<"naming" | "property" | "client-type" | "client-details" | "add-another">("naming")
  const [namingType, setNamingType] = useState<"property" | "client" | "">("")
  const [propertyAddress, setPropertyAddress] = useState("")
  const [clientType, setClientType] = useState<"Buyer" | "Seller" | "">("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Use the workspace creation hook for party management
  const { workspaceId, handlePartySubmitted, workspaceParties } = useWorkspaceCreation({
    onComplete: () => {
      onOpenChange(false)
      toast({
        title: "Workspace Created",
        description: "Your workspace has been created successfully with all parties.",
      })
    },
  })

  // Form data
  const [clientData, setClientData] = useState<Party>({
    name: "",
    email: "",
    phone: "",
    address: "",
    type: "Individual",
    role: "Buyer",
  })

  // Validation

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      resetForm()
    }
  }, [open])

  const resetForm = () => {
    setStep("naming")
    setNamingType("")
    setPropertyAddress("")
    setClientType("")
    setClientData({
      name: "",
      email: "",
      phone: "",
      address: "",
      type: "Individual",
      role: "Buyer",
    })
    setErrors({})
    setSuccessMessage("")
  }

  const handleNamingTypeSelect = (type: NamingType) => {
    setNamingType(type)
    setStep(type === "property" ? "property" : "client-type")
  }

  const handlePropertyAddressSave = async () => {
    // Validate
    if (!propertyAddress.trim()) {
      setErrors({ propertyAddress: "Property address is required" })
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Create a workspace ID
      const workspaceId = `WS-${Date.now().toString(36)}`

      // Get the Supabase client
      const supabase = createSupabaseClient()

      // Get the current user (if authenticated)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Create the workspace data
      const workspaceData = {
        id: workspaceId,
        name: propertyAddress,
        address: propertyAddress,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "active",
        type: "property",
        user_id: user?.id || "anonymous",
        stage: "nurturing",
      }

      // Insert the workspace into Supabase
      const { error } = await supabase.from("workspaces").insert(workspaceData)

      if (error) {
        console.error("Error saving workspace:", error)
        throw new Error(error.message)
      }

      // Show success message
      setSuccessMessage(`Workspace "${propertyAddress}" created successfully!`)

      // After a delay, close modal and redirect
      setTimeout(() => {
        onOpenChange(false)
        router.push("/workspaces")
        toast({
          title: "Workspace Created",
          description: `Workspace "${propertyAddress}" has been created successfully.`,
        })
      }, 1500)
    } catch (error) {
      console.error("Error:", error)
      setErrors({ submit: "Failed to create workspace. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClientTypeSelect = (type: ClientType) => {
    setClientType(type)
    setClientData((prev) => ({ ...prev, role: type }))
    setStep("client-details")
  }

  const handleClientDataChange = (field: keyof Party, value: string) => {
    setClientData((prev) => ({ ...prev, [field]: value }))

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Live email validation
    if (field === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }))
      }
    }

    // Same for authorizedSignorEmail
    if (field === "authorizedSignorEmail" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, authorizedSignorEmail: "Please enter a valid email address" }))
      }
    }
  }

  const validateClientForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!clientData.name.trim()) newErrors.name = "Name is required"
    if (!clientData.email.trim()) newErrors.email = "Email is required"
    if (!clientData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!clientData.address.trim()) newErrors.address = "Address is required"

    // Email validation
    if (clientData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Entity-specific validation
    if (clientData.type !== "Individual") {
      if (!clientData.entityName?.trim()) {
        newErrors.entityName = "Entity name is required"
      }
      if (!clientData.authorizedSignorName?.trim()) {
        newErrors.authorizedSignorName = "Authorized signor name is required"
      }
      if (!clientData.authorizedSignorTitle?.trim()) {
        newErrors.authorizedSignorTitle = "Authorized signor title is required"
      }
      if (!clientData.authorizedSignorEmail?.trim()) {
        newErrors.authorizedSignorEmail = "Authorized signor email is required"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.authorizedSignorEmail)) {
        newErrors.authorizedSignorEmail = "Please enter a valid email address"
      }
      if (!clientData.authorizedSignorPhone?.trim()) {
        newErrors.authorizedSignorPhone = "Authorized signor phone is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveClient = async () => {
    if (!validateClientForm()) return

    setIsSubmitting(true)

    try {
      // Simulate API call to save client
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Add client to workspace
      const newParty = {
        ...clientData,
        id: `party-${Date.now()}`,
        isPrimary: true,
      }

      workspaceParties.addParty(workspaceId, newParty)

      // Show success and go to add another step
      setSuccessMessage(`${clientData.role} "${clientData.name}" added successfully!`)
      setStep("add-another")
    } catch (error) {
      setErrors({ submit: `Failed to save ${clientData.role.toLowerCase()}. Please try again.` })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddAnotherParty = () => {
    // Reset client form but keep the workspace context
    setClientData({
      name: "",
      email: "",
      phone: "",
      address: "",
      type: "Individual",
      role: clientData.role === "Buyer" ? "Seller" : "Buyer", // Switch role
    })
    setErrors({})
    setSuccessMessage("")
    setStep("client-details")
  }

  const handleCreateWorkspace = async () => {
    setIsSubmitting(true)

    try {
      // Simulate API call to finalize workspace
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Show success message
      setSuccessMessage("Workspace created successfully!")

      // After a delay, close modal and redirect
      setTimeout(() => {
        onOpenChange(false)
        router.push("/workspaces")
        toast({
          title: "Workspace Created",
          description: "Your workspace has been created successfully with all parties.",
        })
      }, 1500)
    } catch (error) {
      setErrors({ submit: "Failed to create workspace. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderNamingStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-purple-400">Select Workspace Naming Type</h2>
        <p className="text-sm text-muted-foreground">Choose how you want to identify this workspace.</p>
      </div>

      <RadioGroup
        value={namingType}
        onValueChange={(value) => handleNamingTypeSelect(value as NamingType)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
      >
        <div>
          <RadioGroupItem value="property" id="property" className="sr-only peer" />
          <Label
            htmlFor="property"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500 cursor-pointer"
          >
            <div className="mb-2 rounded-md bg-purple-500/20 p-2">
              <Home className="h-5 w-5 text-purple-500" />
            </div>
            <div className="font-semibold">Property Address</div>
            <div className="text-sm text-muted-foreground text-center mt-1">Name workspace by property address</div>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="client" id="client" className="sr-only peer" />
          <Label
            htmlFor="client"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-pink-500 [&:has([data-state=checked])]:border-pink-500 cursor-pointer"
          >
            <div className="mb-2 rounded-md bg-pink-500/20 p-2">
              <User className="h-5 w-5 text-pink-500" />
            </div>
            <div className="font-semibold">Client Name</div>
            <div className="text-sm text-muted-foreground text-center mt-1">Name workspace by client name</div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )

  const renderPropertyStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-purple-400">Enter Property Address</h2>
        <p className="text-sm text-muted-foreground">Enter the property address for this workspace.</p>
      </div>

      <Card className="border-purple-800/20 bg-background/50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="propertyAddress" className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                Property Address
              </Label>
              <Input
                id="propertyAddress"
                placeholder="Enter full property address"
                value={propertyAddress}
                onChange={(e) => {
                  setPropertyAddress(e.target.value)
                  if (errors.propertyAddress) {
                    setErrors((prev) => {
                      const newErrors = { ...prev }
                      delete newErrors.propertyAddress
                      return newErrors
                    })
                  }
                }}
                className={`border-purple-800/30 focus:border-purple-500 ${
                  errors.propertyAddress ? "border-red-500" : ""
                }`}
                disabled={isSubmitting}
              />
              {errors.propertyAddress && <p className="text-red-500 text-sm">{errors.propertyAddress}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setStep("naming")}
          disabled={isSubmitting}
          className="border-purple-800/30 hover:bg-purple-900/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handlePropertyAddressSave}
          disabled={isSubmitting || !propertyAddress.trim()}
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Address"
          )}
        </Button>
      </div>
    </div>
  )

  const renderClientTypeStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-purple-400">Select Client Type</h2>
        <p className="text-sm text-muted-foreground">Is this client a buyer or seller?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <Button
          variant="outline"
          className="h-auto py-6 border-2 hover:border-blue-500 hover:bg-blue-900/10 flex flex-col items-center"
          onClick={() => handleClientTypeSelect("Buyer")}
        >
          <div className="mb-2 rounded-full bg-blue-500/20 p-3">
            <User className="h-6 w-6 text-blue-500" />
          </div>
          <span className="text-lg font-semibold">Buyer</span>
          <span className="text-sm text-muted-foreground mt-1">Client is purchasing property</span>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-6 border-2 hover:border-green-500 hover:bg-green-900/10 flex flex-col items-center"
          onClick={() => handleClientTypeSelect("Seller")}
        >
          <div className="mb-2 rounded-full bg-green-500/20 p-3">
            <Home className="h-6 w-6 text-green-500" />
          </div>
          <span className="text-lg font-semibold">Seller</span>
          <span className="text-sm text-muted-foreground mt-1">Client is selling property</span>
        </Button>
      </div>

      <div className="flex justify-start pt-4">
        <Button
          variant="outline"
          onClick={() => setStep("naming")}
          className="border-purple-800/30 hover:bg-purple-900/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    </div>
  )

  const renderClientDetailsStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-purple-400">{clientType} Information</h2>
        <p className="text-sm text-muted-foreground">Enter the {clientType.toLowerCase()}'s details.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="entityType">Entity Type</Label>
          <Select
            value={clientData.type}
            onValueChange={(value) => handleClientDataChange("type", value as EntityType)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="entityType" className="border-purple-800/30">
              <SelectValue placeholder="Select entity type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Individual">Individual</SelectItem>
              <SelectItem value="Trust">Trust</SelectItem>
              <SelectItem value="Corporation">Corporation</SelectItem>
              <SelectItem value="LLC">LLC</SelectItem>
              <SelectItem value="Partnership">Partnership</SelectItem>
              <SelectItem value="Estate">Estate</SelectItem>
              <SelectItem value="POA">Power of Attorney</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {clientData.type !== "Individual" && (
          <div className="space-y-4 border-l-2 border-purple-500/20 pl-4">
            <div className="space-y-2">
              <Label htmlFor="entityName">Entity Name</Label>
              <Input
                id="entityName"
                value={clientData.entityName || ""}
                onChange={(e) => handleClientDataChange("entityName", e.target.value)}
                className={`border-purple-800/30 ${errors.entityName ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {errors.entityName && <p className="text-red-500 text-sm">{errors.entityName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorizedSignorName">Authorized Signor Name</Label>
              <Input
                id="authorizedSignorName"
                value={clientData.authorizedSignorName || ""}
                onChange={(e) => handleClientDataChange("authorizedSignorName", e.target.value)}
                className={`border-purple-800/30 ${errors.authorizedSignorName ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {errors.authorizedSignorName && <p className="text-red-500 text-sm">{errors.authorizedSignorName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorizedSignorTitle">Authorized Signor Title</Label>
              <Input
                id="authorizedSignorTitle"
                value={clientData.authorizedSignorTitle || ""}
                onChange={(e) => handleClientDataChange("authorizedSignorTitle", e.target.value)}
                className={`border-purple-800/30 ${errors.authorizedSignorTitle ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {errors.authorizedSignorTitle && <p className="text-red-500 text-sm">{errors.authorizedSignorTitle}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorizedSignorEmail">Authorized Signor Email</Label>
              <Input
                id="authorizedSignorEmail"
                type="email"
                value={clientData.authorizedSignorEmail || ""}
                onChange={(e) => handleClientDataChange("authorizedSignorEmail", e.target.value)}
                className={`border-purple-800/30 ${errors.authorizedSignorEmail ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {errors.authorizedSignorEmail && <p className="text-red-500 text-sm">{errors.authorizedSignorEmail}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorizedSignorPhone">Authorized Signor Phone</Label>
              <Input
                id="authorizedSignorPhone"
                value={clientData.authorizedSignorPhone || ""}
                onChange={(e) => handleClientDataChange("authorizedSignorPhone", e.target.value)}
                className={`border-purple-800/30 ${errors.authorizedSignorPhone ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {errors.authorizedSignorPhone && <p className="text-red-500 text-sm">{errors.authorizedSignorPhone}</p>}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">{clientData.type === "Individual" ? "Full Name" : "Contact Name"}</Label>
          <Input
            id="name"
            value={clientData.name}
            onChange={(e) => handleClientDataChange("name", e.target.value)}
            className={`border-purple-800/30 ${errors.name ? "border-red-500" : ""}`}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={clientData.email}
            onChange={(e) => handleClientDataChange("email", e.target.value)}
            className={`border-purple-800/30 ${errors.email ? "border-red-500" : ""}`}
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={clientData.phone}
            onChange={(e) => handleClientDataChange("phone", e.target.value)}
            className={`border-purple-800/30 ${errors.phone ? "border-red-500" : ""}`}
            disabled={isSubmitting}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Mailing Address</Label>
          <Input
            id="address"
            value={clientData.address}
            onChange={(e) => handleClientDataChange("address", e.target.value)}
            className={`border-purple-800/30 ${errors.address ? "border-red-500" : ""}`}
            disabled={isSubmitting}
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setStep("client-type")}
          disabled={isSubmitting}
          className="border-purple-800/30 hover:bg-purple-900/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handlePartySubmitted}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            `Save ${clientType}`
          )}
        </Button>
      </div>
    </div>
  )

  const renderAddAnotherStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-purple-400">Client Added Successfully</h2>
        <p className="text-sm text-muted-foreground">
          Would you like to add another party or create the workspace now?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <Button
          variant="outline"
          className="h-auto py-6 border-2 hover:border-purple-500 hover:bg-purple-900/10 flex flex-col items-center"
          onClick={handleAddAnotherParty}
          disabled={isSubmitting}
        >
          <div className="mb-2 rounded-full bg-purple-500/20 p-3">
            <Users className="h-6 w-6 text-purple-500" />
          </div>
          <span className="text-lg font-semibold">Add Another Party</span>
          <span className="text-sm text-muted-foreground mt-1">
            Add a {clientData.role === "Buyer" ? "seller" : "buyer"} to this workspace
          </span>
        </Button>

        <Button
          className="h-auto py-6 border-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 flex flex-col items-center"
          onClick={handleCreateWorkspace}
          disabled={isSubmitting}
        >
          <div className="mb-2 rounded-full bg-white/20 p-3">
            <Building className="h-6 w-6 text-white" />
          </div>
          <span className="text-lg font-semibold">Create Workspace</span>
          <span className="text-sm text-white/80 mt-1">Finalize and create the workspace</span>
        </Button>
      </div>
    </div>
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isSubmitting) {
          onOpenChange(isOpen)
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[600px] bg-background border-purple-800/20 shadow-lg shadow-purple-900/10 overflow-hidden"
        onInteractOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault()
          }
        }}
      >
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500 absolute top-0 left-0 rounded-t-lg"></div>
        <DialogHeader>
          <DialogTitle className="text-xl font-poppins text-purple-400">Create New Workspace</DialogTitle>
          <DialogDescription>
            {step === "naming" && "Select how you want to name your new workspace."}
            {step === "property" && "Enter the property address for this workspace."}
            {step === "client-type" && "Select whether this client is a buyer or seller."}
            {step === "client-details" && `Enter the ${clientType.toLowerCase()}'s details.`}
            {step === "add-another" && "Would you like to add another party or create the workspace now?"}
          </DialogDescription>
        </DialogHeader>

        {successMessage && (
          <Alert className="bg-green-900/10 border-green-800/30 mb-4">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {errors.submit && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        <div className="py-4">
          {step === "naming" && renderNamingStep()}
          {step === "property" && renderPropertyStep()}
          {step === "client-type" && renderClientTypeStep()}
          {step === "client-details" && renderClientDetailsStep()}
          {step === "add-another" && renderAddAnotherStep()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
