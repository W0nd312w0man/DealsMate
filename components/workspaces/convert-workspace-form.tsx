"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock data for the workspace being converted
const workspaceData = {
  id: "WS-1234",
  name: "15614 Yermo Street Property",
  address: "15614 Yermo Street, Whittier, CA 90603",
  buyerAgent: "Rudy Carbajal",
  buyer: "Karen Chen",
}

export function ConvertWorkspaceForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("property")

  // Form state
  const [formData, setFormData] = useState({
    // Property Details
    address: workspaceData.address,
    county: "Los Angeles",
    propertyType: "Single Family",
    yearBuilt: "1956",
    mlsNumber: "PW25079672",

    // Contacts
    buyerAgents: workspaceData.buyerAgent,
    buyers: workspaceData.buyer,
    listingAgents: "Angel & Pat Hernandez",
    sellers: "Ofelia Gonzalez",
    escrowAgent: "Michele Wood",
    escrowCompanyName: "Homelight",
    contactEmail: "",

    // Timeline & Key Dates
    createdDate: new Date(),
    purchaseAgreementDate: new Date("2025-04-17"),
    offerAcceptedDate: new Date("2025-04-21"),
    earnestMoneyDueDate: new Date("2025-04-23"),
    inspectionContingencyDueDate: new Date("2025-04-28"),
    sellerDisclosureDueDate: new Date("2025-04-28"),
    loanContingencyDueDate: new Date("2025-05-05"),
    closeOfEscrowDate: new Date("2025-05-21"),
    possessionDate: new Date("2025-05-27"),

    // Purchase Information
    escrowNumber: "25-23968",
    purchasePrice: "880000",
  })

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call to create transaction
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setShowSuccess(true)

    // Redirect to the new transaction after a delay
    setTimeout(() => {
      router.push("/transactions/TR-5678")
    }, 3000)
  }

  const nextTab = () => {
    if (activeTab === "property") setActiveTab("contacts")
    else if (activeTab === "contacts") setActiveTab("timeline")
    else if (activeTab === "timeline") setActiveTab("purchase")
  }

  const prevTab = () => {
    if (activeTab === "purchase") setActiveTab("timeline")
    else if (activeTab === "timeline") setActiveTab("contacts")
    else if (activeTab === "contacts") setActiveTab("property")
  }

  if (showSuccess) {
    return (
      <Card className="shadow-soft overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-poppins text-green-700">Success!</CardTitle>
          <CardDescription>Your workspace has been successfully converted to a transaction.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-5 w-5 text-green-600" />
            <AlertTitle>Transaction Created</AlertTitle>
            <AlertDescription>
              Transaction TR-5678 has been created successfully. You will be redirected to the transaction page shortly.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => router.push("/transactions/TR-5678")}
              className="bg-gradient-to-r from-green-600 to-emerald-500 hover:opacity-90 transition-opacity"
            >
              Go to Transaction Now
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-soft overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-poppins text-purple-700">
            Converting Workspace: {workspaceData.name}
          </CardTitle>
          <CardDescription>
            Please review and complete the information below to convert this workspace into a transaction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid w-full grid-cols-4">
              <TabsTrigger value="property">Property Details</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="timeline">Timeline & Dates</TabsTrigger>
              <TabsTrigger value="purchase">Purchase Info</TabsTrigger>
            </TabsList>

            <TabsContent value="property" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Property Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="county">County</Label>
                  <Input
                    id="county"
                    value={formData.county}
                    onChange={(e) => handleInputChange("county", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleInputChange("propertyType", value)}
                  >
                    <SelectTrigger id="propertyType">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single Family">Single Family</SelectItem>
                      <SelectItem value="Condo">Condo</SelectItem>
                      <SelectItem value="Townhouse">Townhouse</SelectItem>
                      <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                      <SelectItem value="Land">Land</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    value={formData.yearBuilt}
                    onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mlsNumber">MLS #</Label>
                  <Input
                    id="mlsNumber"
                    value={formData.mlsNumber}
                    onChange={(e) => handleInputChange("mlsNumber", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={nextTab}>
                  Next: Contacts
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="buyerAgents">Buyer Agent(s)</Label>
                  <Input
                    id="buyerAgents"
                    value={formData.buyerAgents}
                    onChange={(e) => handleInputChange("buyerAgents", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyers">Buyer(s)</Label>
                  <Input
                    id="buyers"
                    value={formData.buyers}
                    onChange={(e) => handleInputChange("buyers", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="listingAgents">Listing Agent(s)</Label>
                  <Input
                    id="listingAgents"
                    value={formData.listingAgents}
                    onChange={(e) => handleInputChange("listingAgents", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellers">Seller(s)</Label>
                  <Input
                    id="sellers"
                    value={formData.sellers}
                    onChange={(e) => handleInputChange("sellers", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="escrowAgent">Escrow Agent</Label>
                  <Input
                    id="escrowAgent"
                    value={formData.escrowAgent}
                    onChange={(e) => handleInputChange("escrowAgent", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="escrowCompanyName">Escrow Company Name</Label>
                  <Input
                    id="escrowCompanyName"
                    value={formData.escrowCompanyName}
                    onChange={(e) => handleInputChange("escrowCompanyName", e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    placeholder="Primary contact email"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevTab}>
                  Back: Property Details
                </Button>
                <Button type="button" onClick={nextTab}>
                  Next: Timeline & Dates
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="createdDate">Created Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.createdDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.createdDate ? format(formData.createdDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.createdDate}
                        onSelect={(date) => date && handleInputChange("createdDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseAgreementDate">Purchase Agreement Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.purchaseAgreementDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.purchaseAgreementDate ? (
                          format(formData.purchaseAgreementDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.purchaseAgreementDate}
                        onSelect={(date) => date && handleInputChange("purchaseAgreementDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offerAcceptedDate">Offer Accepted Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.offerAcceptedDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.offerAcceptedDate ? (
                          format(formData.offerAcceptedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.offerAcceptedDate}
                        onSelect={(date) => date && handleInputChange("offerAcceptedDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="earnestMoneyDueDate">Earnest Money Deposit Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.earnestMoneyDueDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.earnestMoneyDueDate ? (
                          format(formData.earnestMoneyDueDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.earnestMoneyDueDate}
                        onSelect={(date) => date && handleInputChange("earnestMoneyDueDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inspectionContingencyDueDate">Inspection Contingency Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.inspectionContingencyDueDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.inspectionContingencyDueDate ? (
                          format(formData.inspectionContingencyDueDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.inspectionContingencyDueDate}
                        onSelect={(date) => date && handleInputChange("inspectionContingencyDueDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellerDisclosureDueDate">Seller Disclosure Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.sellerDisclosureDueDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.sellerDisclosureDueDate ? (
                          format(formData.sellerDisclosureDueDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.sellerDisclosureDueDate}
                        onSelect={(date) => date && handleInputChange("sellerDisclosureDueDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanContingencyDueDate">Loan Contingency Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.loanContingencyDueDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.loanContingencyDueDate ? (
                          format(formData.loanContingencyDueDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.loanContingencyDueDate}
                        onSelect={(date) => date && handleInputChange("loanContingencyDueDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="closeOfEscrowDate">Close of Escrow Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.closeOfEscrowDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.closeOfEscrowDate ? (
                          format(formData.closeOfEscrowDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.closeOfEscrowDate}
                        onSelect={(date) => date && handleInputChange("closeOfEscrowDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="possessionDate">Possession Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.possessionDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.possessionDate ? format(formData.possessionDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.possessionDate}
                        onSelect={(date) => date && handleInputChange("possessionDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevTab}>
                  Back: Contacts
                </Button>
                <Button type="button" onClick={nextTab}>
                  Next: Purchase Info
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="purchase" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="escrowNumber">Escrow #</Label>
                  <Input
                    id="escrowNumber"
                    value={formData.escrowNumber}
                    onChange={(e) => handleInputChange("escrowNumber", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevTab}>
                  Back: Timeline & Dates
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Creating Transaction..." : "Create Transaction"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-sm text-muted-foreground">Converting Workspace ID: {workspaceData.id}</p>
          {activeTab === "purchase" && (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating Transaction..." : "Create Transaction"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  )
}
