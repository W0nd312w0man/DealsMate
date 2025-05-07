"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionProgressTracker, type TransactionStatus, type AttentionReason } from "@/components/transactions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PageNavigation } from "@/components/page-navigation"

export default function TransactionProgressDemoPage() {
  const [status, setStatus] = useState<TransactionStatus>("in-review")
  const [attentionReason, setAttentionReason] = useState<AttentionReason>(null)

  // Show attention reason selector only when status is "needs-attention"
  const showAttentionReason = status === "needs-attention"

  return (
    <div className="container py-8 space-y-8">
      <BreadcrumbNav />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transaction Progress Tracker</h1>
        <p className="text-muted-foreground">A horizontal progress bar to visualize transaction statuses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Progress</CardTitle>
          <CardDescription>Visualize the progress of a transaction through various stages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <TransactionProgressTracker
            currentStatus={status}
            attentionReason={showAttentionReason ? attentionReason : null}
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
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="needs-attention">Needs Attention</SelectItem>
                  <SelectItem value="corrections-required">Corrections Required</SelectItem>
                  <SelectItem value="file-approved">File Approved</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="commission-disbursement-released">Commission Disbursement Released</SelectItem>
                  <SelectItem value="payment-issued">Payment Issued</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showAttentionReason && (
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
                </RadioGroup>
              </div>
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
          <TransactionProgressTracker currentStatus="needs-attention" attentionReason="documents" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example: Transaction in Progress</CardTitle>
          <CardDescription>Showing a transaction that is being processed</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionProgressTracker currentStatus="processing" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example: Completed Transaction</CardTitle>
          <CardDescription>Showing a transaction that has been completed</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionProgressTracker currentStatus="completed" />
        </CardContent>
      </Card>

      <PageNavigation
        prevPage={{ url: "/dashboard", label: "Dashboard" }}
        nextPage={{ url: "/transactions", label: "Transactions" }}
      />
    </div>
  )
}
