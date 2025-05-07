"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  ChevronLeft,
  Phone,
  Mail,
  Building,
  User,
  DollarSign,
  CalendarPlus2Icon as CalendarIcon2,
  CalendarIcon,
  PanelRight,
} from "lucide-react"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { TransactionProgressTracker } from "@/components/transactions/transaction-progress-tracker"
import { DocumentList } from "@/components/transactions/document-list"
import { TaskList } from "@/components/transactions/task-list"
import { ComplianceChecklist } from "@/components/transactions/compliance-checklist"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// Mock function to get transaction data - in a real app, this would fetch from an API
function getTransaction(id: string) {
  // This is just mock data for demonstration
  const transaction = {
    id,
    address: "123 Main St, Anytown, CA 90210",
    type: "Purchase",
    status: "Active",
    price: "$750,000",
    client: "John & Sarah Smith",
    dueDate: "Apr 15, 2025",
    documents: 12,
    missingDocuments: 2,
    description: "Single-family home purchase in Anytown neighborhood",
    mlsNumber: "MLS-12345",
    closeDate: "Apr 15, 2025",
  }

  return transaction
}

export default function TransactionPage({ params }: { params: { id: string } }) {
  const transaction = getTransaction(params.id)
  const [sheetOpen, setSheetOpen] = useState(false)

  if (!transaction) {
    notFound()
  }

  return (
    <div className="container py-8">
      <BreadcrumbNav />
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <a href="/transactions">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Transactions
            </a>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Transaction {params.id}</h1>
          <p className="text-muted-foreground">123 Main Street, Anytown, CA 90210</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="gap-2">
            <Phone className="h-4 w-4" />
            Contact Broker
          </Button>
          <Button variant="outline" className="gap-2">
            <Mail className="h-4 w-4" />
            Contact Transactions
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <PanelRight className="h-4 w-4" />
                Overview
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle>Transaction Overview</SheetTitle>
                <SheetDescription>Quick view of transaction details</SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Transaction Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm bg-muted/50 p-3 rounded-md">
                    <div className="text-muted-foreground">ID:</div>
                    <div>{params.id}</div>
                    <div className="text-muted-foreground">Type:</div>
                    <div>Listing</div>
                    <div className="text-muted-foreground">Status:</div>
                    <div>In Progress</div>
                    <div className="text-muted-foreground">Price:</div>
                    <div>$750,000</div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Parties</h3>
                  <div className="space-y-3 bg-muted/50 p-3 rounded-md">
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground">Seller(s)</h4>
                      <p className="text-sm flex items-center gap-1">
                        <User className="h-3 w-3" />
                        John & Jane Smith
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground">Buyer(s)</h4>
                      <p className="text-sm flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Robert Johnson
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground">Seller's Broker</h4>
                      <p className="text-sm flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        ABC Realty
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground">Seller's Agent</h4>
                      <p className="text-sm flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Sarah Williams
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground">Buyer's Broker</h4>
                      <p className="text-sm flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        XYZ Properties
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground">Buyer's Agent</h4>
                      <p className="text-sm flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Michael Brown
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Important Dates</h3>
                  <div className="space-y-2 bg-muted/50 p-3 rounded-md">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Closing:</span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon2 className="h-3 w-3" />
                        Dec 15, 2023
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Inspection:</span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon2 className="h-3 w-3" />
                        Nov 20, 2023
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Appraisal:</span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon2 className="h-3 w-3" />
                        Nov 25, 2023
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Financing:</span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon2 className="h-3 w-3" />
                        Dec 1, 2023
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Earnest Money:</span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon2 className="h-3 w-3" />
                        Nov 15, 2023
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Final WalkThru:</span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon2 className="h-3 w-3" />
                        Dec 14, 2023
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="space-y-6">
        {/* Property Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
            <CardDescription>Details about the property in this transaction</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue="123 Main Street, Anytown, CA 90210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mls">MLS Number</Label>
              <Input id="mls" defaultValue="MLS12345678" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transaction-type">Transaction Type</Label>
              <Select defaultValue="listing">
                <SelectTrigger id="transaction-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="listing">Listing</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="lease">Lease</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter property details here"
                defaultValue="Beautiful single-family home with 3 bedrooms and 2 bathrooms. Recently renovated kitchen and bathrooms."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Key Dates Section */}
        <Card>
          <CardHeader>
            <CardTitle>Key Dates</CardTitle>
            <CardDescription>Important deadlines for this transaction</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="closing-date">Closing Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Pick a date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="inspection-deadline">Inspection Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Pick a date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="appraisal-deadline">Appraisal Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Pick a date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="financing-deadline">Financing Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Pick a date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="earnest-money">Earnest Money Due</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Pick a date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="earnest-amount">Earnest Money Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="earnest-amount" className="pl-8" placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="final-walkthru">Final WalkThru</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Pick a date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Escrow/Title/Attorney & Lender Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Services</CardTitle>
            <CardDescription>Select services used in this transaction</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="closing-service">Closing Service</Label>
              <Select>
                <SelectTrigger id="closing-service">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="escrow">Escrow</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="attorney">Attorney</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-provider">Provider Name</Label>
              <Input id="service-provider" placeholder="Enter provider name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lender">Lender Involved</Label>
              <Select>
                <SelectTrigger id="lender">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lender-name">Lender Name</Label>
              <Input id="lender-name" placeholder="Enter lender name" />
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          <TabsContent value="documents">
            <DocumentList />
          </TabsContent>
          <TabsContent value="tasks">
            <TaskList />
          </TabsContent>
          <TabsContent value="compliance">
            <ComplianceChecklist />
          </TabsContent>
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Timeline</CardTitle>
                <CardDescription>Track the progress of this transaction</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionProgressTracker
                  currentStatus="review"
                  attentionReason={transaction.status === "Active" ? "documents" : null}
                  attentionDetails={
                    transaction.status === "Active" ? "Missing purchase agreement and lead paint disclosure." : ""
                  }
                  interruptedStage="review"
                  hasPostCloseCorrection={false}
                  hasShortTermAdvancement={false}
                  transactionId={params.id}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
