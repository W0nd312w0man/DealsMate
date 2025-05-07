"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Loader2, CheckCircle2, X, ChevronDown, ChevronUp, AlertTriangle, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

export function AIDocumentUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [selectedTransaction, setSelectedTransaction] = useState("")
  const [extractedData, setExtractedData] = useState<Record<string, any> | null>(null)
  const [documentType, setDocumentType] = useState("")
  const [activeTab, setActiveTab] = useState("upload")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  // Mock transactions data
  const transactions = [
    { id: "tx-1234", address: "123 Main St (TX-1234)" },
    { id: "tx-1235", address: "456 Oak Ave (TX-1235)" },
    { id: "tx-1236", address: "789 Pine Rd (TX-1236)" },
  ]

  // Document types
  const documentTypes = [
    { id: "purchase-agreement", name: "Purchase Agreement" },
    { id: "seller-disclosure", name: "Seller Disclosure" },
    { id: "inspection-report", name: "Inspection Report" },
    { id: "loan-approval", name: "Loan Approval" },
    { id: "earnest-money", name: "Earnest Money Receipt" },
    { id: "addendum", name: "Addendum" },
    { id: "closing-disclosure", name: "Closing Disclosure" },
    { id: "title-report", name: "Title Report" },
  ]

  // Transaction timeline stages
  const getTransactionTimeline = (
    status: string,
    needsAttention = false,
    needsCommissionDetails = false,
    hasPostCloseCorrection = false,
    hasShortTermAdvancement = false,
  ) => {
    const baseStages = [
      { id: "created", label: "Transaction Created", status: "completed" },
      { id: "documents", label: "Documents Uploaded", status: "completed" },
      {
        id: "review",
        label: "Under Review",
        status:
          status === "review"
            ? "current"
            : status === "needs-attention"
              ? "interrupted"
              : [
                    "broker-approved",
                    "commission-review",
                    "needs-commission",
                    "commission-approved",
                    "commission-delivered",
                    "closed",
                    "payment-issued",
                    "post-close-initiated",
                    "post-close-review",
                    "post-close-approved",
                    "post-close-resolved",
                    "invoice-generated",
                    "payment-received",
                  ].includes(status)
                ? "completed"
                : "upcoming",
      },
    ]

    // Conditionally add "Needs Attention" stage
    const stagesWithAttention = needsAttention
      ? [
          ...baseStages.slice(0, 3),
          {
            id: "needs-attention",
            label: "Needs Attention",
            status: status === "needs-attention" ? "current" : "upcoming",
          },
        ]
      : baseStages

    const midStages = [
      {
        id: "broker-approved",
        label: "Broker Approved",
        status:
          status === "broker-approved"
            ? "current"
            : [
                  "commission-review",
                  "needs-commission",
                  "commission-approved",
                  "commission-delivered",
                  "closed",
                  "payment-issued",
                  "post-close-initiated",
                  "post-close-review",
                  "post-close-approved",
                  "post-close-resolved",
                  "invoice-generated",
                  "payment-received",
                ].includes(status)
              ? "completed"
              : "upcoming",
      },
      {
        id: "commission-review",
        label: "Commission Disbursement Under Review",
        status:
          status === "commission-review"
            ? "current"
            : [
                  "needs-commission",
                  "commission-approved",
                  "commission-delivered",
                  "closed",
                  "payment-issued",
                  "post-close-initiated",
                  "post-close-review",
                  "post-close-approved",
                  "post-close-resolved",
                  "invoice-generated",
                  "payment-received",
                ].includes(status)
              ? "completed"
              : "upcoming",
      },
    ]

    // Conditionally add "Needs Commission Details" stage
    const stagesWithCommission = needsCommissionDetails
      ? [
          ...stagesWithAttention,
          ...midStages.slice(0, 2),
          {
            id: "needs-commission",
            label: "Needs Commission Details",
            status: status === "needs-commission" ? "current" : "upcoming",
          },
        ]
      : [...stagesWithAttention, ...midStages]

    const lateStages = [
      {
        id: "commission-approved",
        label: "Commission Disbursement Approved",
        status:
          status === "commission-approved"
            ? "current"
            : [
                  "commission-delivered",
                  "closed",
                  "payment-issued",
                  "post-close-initiated",
                  "post-close-review",
                  "post-close-approved",
                  "post-close-resolved",
                  "invoice-generated",
                  "payment-received",
                ].includes(status)
              ? "completed"
              : "upcoming",
      },
      {
        id: "commission-delivered",
        label: "Commission Disbursement Delivered",
        status:
          status === "commission-delivered"
            ? "current"
            : [
                  "closed",
                  "payment-issued",
                  "post-close-initiated",
                  "post-close-review",
                  "post-close-approved",
                  "post-close-resolved",
                  "invoice-generated",
                  "payment-received",
                ].includes(status)
              ? "completed"
              : "upcoming",
      },
      {
        id: "closed",
        label: "Closed",
        status:
          status === "closed"
            ? "current"
            : [
                  "payment-issued",
                  "post-close-initiated",
                  "post-close-review",
                  "post-close-approved",
                  "post-close-resolved",
                  "invoice-generated",
                  "payment-received",
                ].includes(status)
              ? "completed"
              : "upcoming",
      },
      {
        id: "payment-issued",
        label: "Payment Issued",
        status:
          status === "payment-issued"
            ? "current"
            : [
                  "post-close-initiated",
                  "post-close-review",
                  "post-close-approved",
                  "post-close-resolved",
                  "invoice-generated",
                  "payment-received",
                ].includes(status)
              ? "completed"
              : "upcoming",
      },
    ]

    let allStages = [...stagesWithCommission, ...lateStages]

    // Conditionally add Post-Close Correction Flow
    if (hasPostCloseCorrection) {
      const postCloseStages = [
        {
          id: "post-close-initiated",
          label: "Post-Close Correction Initiated",
          status:
            status === "post-close-initiated"
              ? "current"
              : [
                    "post-close-review",
                    "post-close-approved",
                    "post-close-resolved",
                    "invoice-generated",
                    "payment-received",
                  ].includes(status)
                ? "completed"
                : "upcoming",
        },
        {
          id: "post-close-review",
          label: "Post-Close Correction Under Review",
          status:
            status === "post-close-review"
              ? "current"
              : ["post-close-approved", "post-close-resolved", "invoice-generated", "payment-received"].includes(status)
                ? "completed"
                : "upcoming",
        },
        {
          id: "post-close-approved",
          label: "Post-Close Approved",
          status:
            status === "post-close-approved"
              ? "current"
              : ["post-close-resolved", "invoice-generated", "payment-received"].includes(status)
                ? "completed"
                : "upcoming",
        },
        {
          id: "post-close-resolved",
          label: "Post-Close Resolved",
          status:
            status === "post-close-resolved"
              ? "current"
              : ["invoice-generated", "payment-received"].includes(status)
                ? "completed"
                : "upcoming",
        },
      ]
      allStages = [...allStages, ...postCloseStages]
    }

    // Conditionally add Short-Term Advancement stages
    if (hasShortTermAdvancement) {
      const shortTermStages = [
        {
          id: "invoice-generated",
          label: "Invoice Generated for Short-Term Advancement",
          status:
            status === "invoice-generated"
              ? "current"
              : ["payment-received"].includes(status)
                ? "completed"
                : "upcoming",
        },
        {
          id: "payment-received",
          label: "Payment Received for Short-Term Advancement",
          status: status === "payment-received" ? "current" : "upcoming",
        },
      ]
      allStages = [...allStages, ...shortTermStages]
    }

    return allStages
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 10485760, // 10MB
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0 || !selectedTransaction || !documentType) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    clearInterval(interval)
    setUploadProgress(100)
    setIsUploading(false)
    setIsProcessing(true)
    setProcessingProgress(0)

    // Simulate AI processing progress
    const processingInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(processingInterval)
          return 100
        }
        return prev + 2
      })
    }, 100)

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 5000))

    clearInterval(processingInterval)
    setProcessingProgress(100)

    // Mock extracted data based on document type
    if (documentType === "purchase-agreement") {
      setExtractedData({
        propertyAddress: {
          streetAddress: "123 Main St",
          city: "Anytown",
          state: "CA",
          zipCode: "90210",
        },
        partiesInvolved: {
          buyer: "John & Sarah Smith",
          seller: "Michael Johnson",
          buyerBroker: "XYZ Realty, Jane Wilson",
          sellerBroker: "ABC Properties, Robert Davis",
        },
        financialDetails: {
          salesPrice: "$750,000",
          earnestMoney: "$15,000",
          loanAmount: "$600,000",
          closingCosts: "$12,500",
        },
        keyDates: {
          contractDate: "March 15, 2025",
          inspectionDeadline: "March 25, 2025",
          financingDeadline: "April 1, 2025",
          closingDate: "April 15, 2025",
          possessionDate: "April 16, 2025",
        },
        additionalTerms: "Seller to leave all appliances. Buyer requests early occupancy 3 days before closing.",
        transactionStatus: "review",
        needsAttention: false,
        needsCommissionDetails: false,
        hasPostCloseCorrection: false,
        hasShortTermAdvancement: false,
      })
    } else if (documentType === "inspection-report") {
      setExtractedData({
        propertyAddress: {
          streetAddress: "123 Main St",
          city: "Anytown",
          state: "CA",
          zipCode: "90210",
        },
        inspectionDetails: {
          inspectionDate: "March 20, 2025",
          inspector: "Quality Home Inspections, LLC",
          inspectionType: "Full Home Inspection",
        },
        majorIssues: [
          "Roof showing signs of wear, estimated 2-3 years of life remaining",
          "HVAC system needs servicing",
          "Minor water damage in basement corner",
        ],
        recommendedRepairs: [
          "Replace weather stripping on exterior doors",
          "Service HVAC system",
          "Repair gutter on north side of house",
        ],
        overallCondition: "Good with minor issues noted",
        transactionStatus: "needs-attention",
        needsAttention: true,
        needsCommissionDetails: false,
        hasPostCloseCorrection: false,
        hasShortTermAdvancement: false,
      })
    } else if (documentType === "closing-disclosure") {
      setExtractedData({
        propertyAddress: {
          streetAddress: "456 Oak Ave",
          city: "Somewhere",
          state: "CA",
          zipCode: "90211",
        },
        partiesInvolved: {
          buyer: "Robert Wilson",
          seller: "Emily & David Brown",
          buyerBroker: "XYZ Realty",
          sellerBroker: "ABC Properties",
        },
        financialDetails: {
          salesPrice: "$925,000",
          earnestMoney: "$20,000",
          loanAmount: "$740,000",
          closingCosts: "$18,500",
        },
        keyDates: {
          contractDate: "February 15, 2025",
          closingDate: "March 30, 2025",
        },
        transactionStatus: "commission-review",
        needsAttention: false,
        needsCommissionDetails: true,
        hasPostCloseCorrection: false,
        hasShortTermAdvancement: false,
      })
    } else if (documentType === "addendum") {
      setExtractedData({
        propertyAddress: {
          streetAddress: "789 Pine Rd",
          city: "Elsewhere",
          state: "CA",
          zipCode: "90212",
        },
        partiesInvolved: {
          buyer: "James & Lisa Thompson",
          seller: "Richard Davis",
          buyerBroker: "XYZ Realty",
          sellerBroker: "ABC Properties",
        },
        financialDetails: {
          salesPrice: "$1,050,000",
          earnestMoney: "$25,000",
        },
        keyDates: {
          contractDate: "January 10, 2025",
          closingDate: "February 28, 2025",
        },
        transactionStatus: "payment-issued",
        needsAttention: false,
        needsCommissionDetails: false,
        hasPostCloseCorrection: true,
        hasShortTermAdvancement: true,
      })
    } else {
      setExtractedData({
        propertyAddress: {
          streetAddress: transactions.find((t) => t.id === selectedTransaction)?.address.split(",")[0] || "123 Main St",
          city: "Anytown",
          state: "CA",
          zipCode: "90210",
        },
        partiesInvolved: {
          buyer: "John & Sarah Smith",
          seller: "Michael Johnson",
          buyerBroker: "XYZ Realty",
          sellerBroker: "ABC Properties",
        },
        financialDetails: {
          salesPrice: "$750,000",
          earnestMoney: "$15,000",
        },
        keyDates: {
          contractDate: "March 15, 2025",
          closingDate: "April 15, 2025",
        },
        documentType: documentTypes.find((d) => d.id === documentType)?.name || documentType,
        uploadDate: new Date().toLocaleDateString(),
        status: "Pending Review",
        transactionStatus: "broker-approved",
        needsAttention: false,
        needsCommissionDetails: false,
        hasPostCloseCorrection: false,
        hasShortTermAdvancement: false,
      })
    }

    // Add a success message
    setSuccessMessage("Document successfully processed! Key information has been extracted.")

    setActiveTab("review")
    setIsProcessing(false)
  }

  const handleCreateTransaction = () => {
    // In a real app, this would create a transaction with the extracted data
    alert("Transaction created successfully with the extracted data!")
    setFiles([])
    setExtractedData(null)
    setSelectedTransaction("")
    setDocumentType("")
    setSuccessMessage(null)
    setActiveTab("upload")
  }

  const toggleExpand = (itemId: string) => {
    if (expandedItem === itemId) {
      setExpandedItem(null)
    } else {
      setExpandedItem(itemId)
    }
  }

  // Render transaction timeline
  const renderTransactionTimeline = (
    status: string,
    needsAttention: boolean,
    needsCommissionDetails: boolean,
    hasPostCloseCorrection: boolean,
    hasShortTermAdvancement: boolean,
  ) => {
    const stages = getTransactionTimeline(
      status,
      needsAttention,
      needsCommissionDetails,
      hasPostCloseCorrection,
      hasShortTermAdvancement,
    )

    return (
      <div className="mt-4 space-y-4">
        <h4 className="text-sm font-semibold text-purple-700">Transaction Timeline</h4>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>
          <div className="space-y-4">
            {stages.map((stage) => (
              <div key={stage.id} className="relative pl-10">
                <div
                  className={`absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border ${
                    stage.status === "current"
                      ? "border-purple-500 bg-purple-100 text-purple-500"
                      : stage.status === "completed"
                        ? "border-green-500 bg-green-100 text-green-500"
                        : stage.status === "interrupted"
                          ? "border-amber-500 bg-amber-100 text-amber-500"
                          : "border-gray-300 bg-gray-100 text-gray-400"
                  }`}
                >
                  {stage.status === "current" ? (
                    <Clock className="h-4 w-4" />
                  ) : stage.status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : stage.status === "interrupted" ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                  )}
                </div>
                <div className="flex items-center">
                  <div
                    className={`font-medium ${
                      stage.status === "current"
                        ? "text-purple-700"
                        : stage.status === "completed"
                          ? "text-green-700"
                          : stage.status === "interrupted"
                            ? "text-amber-700"
                            : "text-gray-500"
                    }`}
                  >
                    {stage.label}
                  </div>
                  {stage.status === "current" && <Badge className="ml-2 bg-purple-500">Current</Badge>}
                  {stage.id === "needs-attention" && <Badge className="ml-2 bg-amber-500">Action Required</Badge>}
                  {stage.id === "needs-commission" && <Badge className="ml-2 bg-amber-500">Input Required</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-poppins text-purple-700">AI Document Upload</CardTitle>
        <CardDescription>
          Upload documents to create transactions or add to existing ones. Our AI will automatically extract key
          information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="review" disabled={!extractedData}>
              Review & Create
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="transaction" className="text-purple-700">
                  Transaction
                </Label>
                <Select value={selectedTransaction} onValueChange={setSelectedTransaction}>
                  <SelectTrigger className="border-purple-200 focus:ring-purple-600">
                    <SelectValue placeholder="Select existing or create new" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Create New Transaction</SelectItem>
                    {transactions.map((tx) => (
                      <SelectItem key={tx.id} value={tx.id}>
                        {tx.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="document-type" className="text-purple-700">
                  Document Type
                </Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger className="border-purple-200 focus:ring-purple-600">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-purple-700">Upload Documents</Label>

              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 transition-colors
                  ${
                    isDragActive
                      ? "border-purple-500 bg-purple-50"
                      : "border-purple-200 hover:border-purple-300 hover:bg-purple-50/50"
                  }
                  ${files.length > 0 ? "pb-2" : ""}
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Upload className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="mt-4 text-sm font-medium">
                    {isDragActive ? "Drop the files here..." : "Drag and drop files here, or click to select files"}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">Supports PDF, DOCX, JPG, PNG (max 10MB)</div>
                </div>

                {files.length > 0 && (
                  <div className="mt-6 space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border border-purple-100 bg-purple-50 p-2"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-purple-600" />
                          <div>
                            <div className="text-sm font-medium">{file.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile(index)
                          }}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {(isUploading || isProcessing) && (
              <div className="space-y-4">
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-purple-700">Uploading documents...</Label>
                      <span className="text-xs text-muted-foreground">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-purple-700">AI processing documents...</Label>
                      <span className="text-xs text-muted-foreground">{processingProgress}%</span>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                    <div className="text-xs text-muted-foreground italic">
                      Extracting key information, dates, parties, and contract terms...
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || !selectedTransaction || !documentType || isUploading || isProcessing}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
              >
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading ? "Uploading..." : isProcessing ? "Processing..." : "Upload & Process"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            {extractedData && (
              <>
                {successMessage && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div className="font-medium text-green-800">{successMessage}</div>
                    </div>
                    <p className="mt-1 text-sm text-green-700">
                      Please review the extracted information below for accuracy.
                    </p>
                  </div>
                )}

                <div className="rounded-lg border p-4">
                  <div className="mb-4 font-medium text-lg text-purple-700">Document Analysis Report</div>

                  {/* Property Address Section - Expandable */}
                  {extractedData.propertyAddress && (
                    <Collapsible
                      open={expandedItem === "propertyAddress"}
                      onOpenChange={() => toggleExpand("propertyAddress")}
                      className="mb-6 border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-md font-semibold text-purple-700">Property Address</h3>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                            {expandedItem === "propertyAddress" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <div className="text-sm font-medium text-purple-700">Street Address:</div>
                            <div className="text-sm">{extractedData.propertyAddress.streetAddress}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-purple-700">City:</div>
                            <div className="text-sm">{extractedData.propertyAddress.city}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-purple-700">State:</div>
                            <div className="text-sm">{extractedData.propertyAddress.state}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-purple-700">Zip Code:</div>
                            <div className="text-sm">{extractedData.propertyAddress.zipCode}</div>
                          </div>
                        </div>

                        {/* Transaction Timeline */}
                        {renderTransactionTimeline(
                          extractedData.transactionStatus,
                          extractedData.needsAttention,
                          extractedData.needsCommissionDetails,
                          extractedData.hasPostCloseCorrection,
                          extractedData.hasShortTermAdvancement,
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* Parties Involved Section - Expandable */}
                  {extractedData.partiesInvolved && (
                    <Collapsible
                      open={expandedItem === "partiesInvolved"}
                      onOpenChange={() => toggleExpand("partiesInvolved")}
                      className="mb-6 border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-md font-semibold text-purple-700">Parties Involved</h3>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                            {expandedItem === "partiesInvolved" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <div className="text-sm font-medium text-purple-700">Buyer:</div>
                            <div className="text-sm">{extractedData.partiesInvolved.buyer}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-purple-700">Seller:</div>
                            <div className="text-sm">{extractedData.partiesInvolved.seller}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-purple-700">Buyer's Broker:</div>
                            <div className="text-sm">{extractedData.partiesInvolved.buyerBroker}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-purple-700">Seller's Broker:</div>
                            <div className="text-sm">{extractedData.partiesInvolved.sellerBroker}</div>
                          </div>
                        </div>

                        {/* Transaction Timeline */}
                        {renderTransactionTimeline(
                          extractedData.transactionStatus,
                          extractedData.needsAttention,
                          extractedData.needsCommissionDetails,
                          extractedData.hasPostCloseCorrection,
                          extractedData.hasShortTermAdvancement,
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* Financial Details Section - Expandable */}
                  {extractedData.financialDetails && (
                    <Collapsible
                      open={expandedItem === "financialDetails"}
                      onOpenChange={() => toggleExpand("financialDetails")}
                      className="mb-6 border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-md font-semibold text-purple-700">Financial Details</h3>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                            {expandedItem === "financialDetails" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <div className="text-sm font-medium text-purple-700">Sales Price:</div>
                            <div className="text-sm">{extractedData.financialDetails.salesPrice}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-purple-700">Earnest Money:</div>
                            <div className="text-sm">{extractedData.financialDetails.earnestMoney}</div>
                          </div>
                          {extractedData.financialDetails.loanAmount && (
                            <div>
                              <div className="text-sm font-medium text-purple-700">Loan Amount:</div>
                              <div className="text-sm">{extractedData.financialDetails.loanAmount}</div>
                            </div>
                          )}
                          {extractedData.financialDetails.closingCosts && (
                            <div>
                              <div className="text-sm font-medium text-purple-700">Closing Costs:</div>
                              <div className="text-sm">{extractedData.financialDetails.closingCosts}</div>
                            </div>
                          )}
                        </div>

                        {/* Transaction Timeline */}
                        {renderTransactionTimeline(
                          extractedData.transactionStatus,
                          extractedData.needsAttention,
                          extractedData.needsCommissionDetails,
                          extractedData.hasPostCloseCorrection,
                          extractedData.hasShortTermAdvancement,
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* Key Dates Section - Expandable */}
                  {extractedData.keyDates && (
                    <Collapsible
                      open={expandedItem === "keyDates"}
                      onOpenChange={() => toggleExpand("keyDates")}
                      className="mb-6 border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-md font-semibold text-purple-700">Key Dates</h3>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                            {expandedItem === "keyDates" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                          {Object.entries(extractedData.keyDates).map(([key, value]) => (
                            <div key={key}>
                              <div className="text-sm font-medium text-purple-700">
                                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                              </div>
                              <div className="text-sm">{value}</div>
                            </div>
                          ))}
                        </div>

                        {/* Transaction Timeline */}
                        {renderTransactionTimeline(
                          extractedData.transactionStatus,
                          extractedData.needsAttention,
                          extractedData.needsCommissionDetails,
                          extractedData.hasPostCloseCorrection,
                          extractedData.hasShortTermAdvancement,
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* Additional Information - Expandable */}
                  {extractedData.additionalTerms && (
                    <Collapsible
                      open={expandedItem === "additionalTerms"}
                      onOpenChange={() => toggleExpand("additionalTerms")}
                      className="mb-6 border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-md font-semibold text-purple-700">Additional Terms</h3>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                            {expandedItem === "additionalTerms" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div className="mt-3 text-sm">{extractedData.additionalTerms}</div>

                        {/* Transaction Timeline */}
                        {renderTransactionTimeline(
                          extractedData.transactionStatus,
                          extractedData.needsAttention,
                          extractedData.needsCommissionDetails,
                          extractedData.hasPostCloseCorrection,
                          extractedData.hasShortTermAdvancement,
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* Inspection Details - Expandable */}
                  {extractedData.inspectionDetails && (
                    <Collapsible
                      open={expandedItem === "inspectionDetails"}
                      onOpenChange={() => toggleExpand("inspectionDetails")}
                      className="mb-6 border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-md font-semibold text-purple-700">Inspection Details</h3>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                            {expandedItem === "inspectionDetails" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                          {Object.entries(extractedData.inspectionDetails).map(([key, value]) => (
                            <div key={key}>
                              <div className="text-sm font-medium text-purple-700">
                                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                              </div>
                              <div className="text-sm">{value}</div>
                            </div>
                          ))}
                        </div>

                        {/* Transaction Timeline */}
                        {renderTransactionTimeline(
                          extractedData.transactionStatus,
                          extractedData.needsAttention,
                          extractedData.needsCommissionDetails,
                          extractedData.hasPostCloseCorrection,
                          extractedData.hasShortTermAdvancement,
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* Major Issues - Expandable */}
                  {extractedData.majorIssues && (
                    <Collapsible
                      open={expandedItem === "majorIssues"}
                      onOpenChange={() => toggleExpand("majorIssues")}
                      className="mb-6 border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-md font-semibold text-purple-700">Major Issues</h3>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                            {expandedItem === "majorIssues" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <ul className="mt-3 list-disc list-inside space-y-1">
                          {extractedData.majorIssues.map((issue, index) => (
                            <li key={index} className="text-sm">
                              {issue}
                            </li>
                          ))}
                        </ul>

                        {/* Transaction Timeline */}
                        {renderTransactionTimeline(
                          extractedData.transactionStatus,
                          extractedData.needsAttention,
                          extractedData.needsCommissionDetails,
                          extractedData.hasPostCloseCorrection,
                          extractedData.hasShortTermAdvancement,
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("upload")}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
                  >
                    Back to Upload
                  </Button>

                  <Button
                    onClick={handleCreateTransaction}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                  >
                    {selectedTransaction === "new" ? "Create Transaction" : "Add to Transaction"}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
