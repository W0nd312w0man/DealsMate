"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionProgressTracker, type TransactionStatus, type AttentionReason } from "@/components/transactions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PageNavigation } from "@/components/page-navigation"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"

export default function TransactionNeedsAttentionDemoPage() {
  const [status, setStatus] = useState<TransactionStatus>("under-review")
  const [attentionReason, setAttentionReason] = useState<AttentionReason>("documents")
  const [attentionDetails, setAttentionDetails] = useState("Missing purchase agreement and lead paint disclosure.")
  const [interruptedStage, setInterruptedStage] = useState<TransactionStatus>("under-review")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Show attention reason selector only when status is "needs-attention"
  const showAttentionOptions = status === "needs-attention"

  const handleResolveClick = () => {
    // Simulate resolving the issue
    setShowSuccessMessage(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false)
      setStatus(interruptedStage)
    }, 3000)
  }

  return (
    <div className="container py-8 space-y-8">
      <BreadcrumbNav />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transaction "Needs Attention" Demo</h1>
        <p className="text-muted-foreground">
          Demonstrates how the "Needs Attention" status interrupts the transaction flow
        </p>
      </div>

      {showSuccessMessage && (
        <div className="rounded-lg border border-green-300 bg-green-50 p-4 animate-pulse">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div className="font-medium text-green-800">
              Issue resolved successfully! Continuing transaction flow...
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Transaction Progress</CardTitle>
          <CardDescription>Visualize how "Needs Attention" interrupts the transaction flow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <TransactionProgressTracker
            currentStatus={status}
            attentionReason={showAttentionOptions ? attentionReason : null}
            attentionDetails={attentionDetails}
            interruptedStage={interruptedStage}
            onResolveClick={handleResolveClick}
          />

          <div className="grid gap-6 pt-4 border-t">
            <div>
              <Label htmlFor="status">Current Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as TransactionStatus)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initiated">Initiated</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="needs-attention">Needs Attention</SelectItem>
                  <SelectItem value="broker-approved">Broker Approved</SelectItem>
                  <SelectItem value="commission-approved">Commission Approved</SelectItem>
                  <SelectItem value="commission-sent">Commission Sent</SelectItem>
                  <SelectItem value="disbursed">Disbursed</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="payment-issued">Payment Issued</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showAttentionOptions && (
              <>
                <div>
                  <Label>Attention Reason</Label>
                  <RadioGroup
                    value={attentionReason || ""}
                    onValueChange={(value) => setAttentionReason(value as AttentionReason)}
                    className="mt-1.5 space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="documents" id="documents" />
                      <Label htmlFor="documents">Missing Documents</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="broker" id="broker" />
                      <Label htmlFor="broker">Broker Review</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="commission" id="commission" />
                      <Label htmlFor="commission">Commission Issue</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="approval" id="approval" />
                      <Label htmlFor="approval">Approval Required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="payment" id="payment" />
                      <Label htmlFor="payment">Payment Issue</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="attention-details">Attention Details</Label>
                  <Textarea
                    id="attention-details"
                    value={attentionDetails}
                    onChange={(e) => setAttentionDetails(e.target.value)}
                    placeholder="Describe the issue that needs attention"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="interrupted-stage">Interrupted Stage</Label>
                  <Select
                    value={interruptedStage}
                    onValueChange={(value) => setInterruptedStage(value as TransactionStatus)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select interrupted stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initiated">Initiated</SelectItem>
                      <SelectItem value="under-review">Under Review</SelectItem>
                      <SelectItem value="broker-approved">Broker Approved</SelectItem>
                      <SelectItem value="commission-approved">Commission Approved</SelectItem>
                      <SelectItem value="commission-sent">Commission Sent</SelectItem>
                      <SelectItem value="disbursed">Disbursed</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    This is the stage that was interrupted by the "Needs Attention" status
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example: Transaction with Issues</CardTitle>
          <CardDescription>Showing a transaction that needs attention due to missing documents</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionProgressTracker
            currentStatus="needs-attention"
            attentionReason="documents"
            attentionDetails="Missing purchase agreement and lead paint disclosure."
            interruptedStage="under-review"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example: Transaction with Commission Issue</CardTitle>
          <CardDescription>Showing a transaction that needs attention due to a commission issue</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionProgressTracker
            currentStatus="needs-attention"
            attentionReason="commission"
            attentionDetails="Commission split needs to be adjusted before proceeding."
            interruptedStage="commission-approved"
          />
        </CardContent>
      </Card>

      <PageNavigation
        prevPage={{ url: "/dashboard", label: "Dashboard" }}
        nextPage={{ url: "/transactions", label: "Transactions" }}
      />
    </div>
  )
}
