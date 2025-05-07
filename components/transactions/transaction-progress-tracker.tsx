"use client"

import { useState } from "react"
import { CheckCircle2, Clock, AlertTriangle, Circle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Update the TransactionStatus type to include all the required stages
export type TransactionStatus =
  | "created"
  | "documents"
  | "review"
  | "needs-attention"
  | "broker-approved"
  | "commission-review"
  | "needs-commission"
  | "commission-approved"
  | "commission-delivered"
  | "closed"
  | "payment-issued"
  | "post-close-initiated"
  | "post-close-review"
  | "post-close-approved"
  | "post-close-resolved"
  | "invoice-generated"
  | "payment-received"

export type AttentionReason = "documents" | "broker" | "commission" | "approval" | "payment" | "other" | null

export interface TransactionProgressTrackerProps {
  currentStatus: TransactionStatus
  attentionReason?: AttentionReason
  attentionDetails?: string
  interruptedStage?: TransactionStatus | null
  hasPostCloseCorrection?: boolean
  hasShortTermAdvancement?: boolean
  transactionId?: string
  className?: string
  onResolveClick?: () => void
}

// Replace the existing TransactionProgressTracker component with this updated version
export function TransactionProgressTracker({
  currentStatus,
  attentionReason = null,
  attentionDetails = "",
  interruptedStage = null,
  hasPostCloseCorrection = false,
  hasShortTermAdvancement = false,
  transactionId = "",
  className,
  onResolveClick,
}: TransactionProgressTrackerProps) {
  const [expanded, setExpanded] = useState(false)
  const router = useRouter()

  // Define all possible stages
  const getStages = () => {
    // Base stages that are always shown
    const baseStages = [
      { id: "created", label: "Transaction Created", status: "completed" },
      { id: "documents", label: "Documents Uploaded", status: currentStatus === "created" ? "upcoming" : "completed" },
      {
        id: "review",
        label: "Under Review",
        status:
          currentStatus === "review"
            ? "current"
            : currentStatus === "created" || currentStatus === "documents"
              ? "upcoming"
              : "completed",
      },
    ]

    // Determine if we need to show the "Needs Attention" stage
    const needsAttentionStage = attentionReason
      ? [
          {
            id: "needs-attention",
            label: "Needs Attention",
            status: currentStatus === "needs-attention" ? "current" : "upcoming",
          },
        ]
      : []

    // Middle stages
    const midStages = [
      {
        id: "broker-approved",
        label: "Broker Approved",
        status:
          currentStatus === "broker-approved"
            ? "current"
            : ["created", "documents", "review", "needs-attention"].includes(currentStatus)
              ? "upcoming"
              : "completed",
      },
      {
        id: "commission-review",
        label: "Commission Disbursement Under Review",
        status:
          currentStatus === "commission-review"
            ? "current"
            : ["created", "documents", "review", "needs-attention", "broker-approved"].includes(currentStatus)
              ? "upcoming"
              : "completed",
      },
    ]

    // Determine if we need to show the "Needs Commission Details" stage
    const needsCommissionStage =
      currentStatus === "needs-commission" || interruptedStage === "commission-review"
        ? [
            {
              id: "needs-commission",
              label: "Needs Commission Details",
              status: currentStatus === "needs-commission" ? "current" : "upcoming",
            },
          ]
        : []

    // Later stages
    const lateStages = [
      {
        id: "commission-approved",
        label: "Commission Disbursement Approved",
        status:
          currentStatus === "commission-approved"
            ? "current"
            : [
                  "created",
                  "documents",
                  "review",
                  "needs-attention",
                  "broker-approved",
                  "commission-review",
                  "needs-commission",
                ].includes(currentStatus)
              ? "upcoming"
              : "completed",
      },
      {
        id: "commission-delivered",
        label: "Commission Disbursement Delivered",
        status:
          currentStatus === "commission-delivered"
            ? "current"
            : [
                  "created",
                  "documents",
                  "review",
                  "needs-attention",
                  "broker-approved",
                  "commission-review",
                  "needs-commission",
                  "commission-approved",
                ].includes(currentStatus)
              ? "upcoming"
              : "completed",
      },
      {
        id: "closed",
        label: "Closed",
        status:
          currentStatus === "closed"
            ? "current"
            : [
                  "created",
                  "documents",
                  "review",
                  "needs-attention",
                  "broker-approved",
                  "commission-review",
                  "needs-commission",
                  "commission-approved",
                  "commission-delivered",
                ].includes(currentStatus)
              ? "upcoming"
              : "completed",
      },
      {
        id: "payment-issued",
        label: "Payment Issued",
        status:
          currentStatus === "payment-issued"
            ? "current"
            : [
                  "created",
                  "documents",
                  "review",
                  "needs-attention",
                  "broker-approved",
                  "commission-review",
                  "needs-commission",
                  "commission-approved",
                  "commission-delivered",
                  "closed",
                ].includes(currentStatus)
              ? "upcoming"
              : "completed",
      },
    ]

    // Combine all the standard stages
    let allStages = [...baseStages]

    // Insert "Needs Attention" after the interrupted stage if applicable
    if (attentionReason && interruptedStage) {
      const interruptedIndex = allStages.findIndex((stage) => stage.id === interruptedStage)
      if (interruptedIndex !== -1) {
        allStages.splice(interruptedIndex + 1, 0, ...needsAttentionStage)
      } else {
        allStages = [...allStages, ...needsAttentionStage]
      }
    } else if (attentionReason) {
      // If no specific interrupted stage, add after "Under Review"
      allStages = [...allStages, ...needsAttentionStage]
    }

    allStages = [...allStages, ...midStages]

    // Insert "Needs Commission Details" after "Commission Review" if applicable
    if (needsCommissionStage.length > 0) {
      const commissionReviewIndex = allStages.findIndex((stage) => stage.id === "commission-review")
      if (commissionReviewIndex !== -1) {
        allStages.splice(commissionReviewIndex + 1, 0, ...needsCommissionStage)
      } else {
        allStages = [...allStages, ...needsCommissionStage]
      }
    }

    allStages = [...allStages, ...lateStages]

    // Add Post-Close Correction stages if applicable
    if (hasPostCloseCorrection) {
      const postCloseStages = [
        {
          id: "post-close-initiated",
          label: "Post-Close Correction Initiated",
          status:
            currentStatus === "post-close-initiated"
              ? "current"
              : ["payment-issued"].includes(currentStatus)
                ? "upcoming"
                : "completed",
        },
        {
          id: "post-close-review",
          label: "Post-Close Correction Under Review",
          status:
            currentStatus === "post-close-review"
              ? "current"
              : ["payment-issued", "post-close-initiated"].includes(currentStatus)
                ? "upcoming"
                : "completed",
        },
        {
          id: "post-close-approved",
          label: "Post-Close Approved",
          status:
            currentStatus === "post-close-approved"
              ? "current"
              : ["payment-issued", "post-close-initiated", "post-close-review"].includes(currentStatus)
                ? "upcoming"
                : "completed",
        },
        {
          id: "post-close-resolved",
          label: "Post-Close Resolved",
          status:
            currentStatus === "post-close-resolved"
              ? "current"
              : ["payment-issued", "post-close-initiated", "post-close-review", "post-close-approved"].includes(
                    currentStatus,
                  )
                ? "upcoming"
                : "completed",
        },
      ]
      allStages = [...allStages, ...postCloseStages]
    }

    // Add Short-Term Advancement stages if applicable
    if (hasShortTermAdvancement) {
      const shortTermStages = [
        {
          id: "invoice-generated",
          label: "Invoice Generated for Short-Term Advancement",
          status:
            currentStatus === "invoice-generated"
              ? "current"
              : ["post-close-resolved"].includes(currentStatus)
                ? "upcoming"
                : "completed",
        },
        {
          id: "payment-received",
          label: "Payment Received for Short-Term Advancement",
          status:
            currentStatus === "payment-received"
              ? "current"
              : ["post-close-resolved", "invoice-generated"].includes(currentStatus)
                ? "upcoming"
                : "completed",
        },
      ]
      allStages = [...allStages, ...shortTermStages]
    }

    return allStages
  }

  const stages = getStages()

  // Handle resolve click
  const handleResolveClick = () => {
    if (onResolveClick) {
      onResolveClick()
    } else if (transactionId) {
      // Navigate to the transaction details page with the compliance tab open
      router.push(`/transactions/${transactionId}?tab=compliance`)
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="relative h-3 w-full rounded-full bg-gray-100">
          {/* Calculate progress based on completed stages */}
          {stages.map((stage, index) => {
            // Calculate segment width
            const segmentWidth = `${100 / stages.length}%`

            // Determine if this segment should be filled
            const isFilled = stage.status === "completed" || stage.status === "current"

            // Determine color based on status
            const bgColor =
              stage.id === "needs-attention"
                ? "bg-amber-500"
                : stage.id === "needs-commission"
                  ? "bg-amber-500"
                  : stage.status === "current"
                    ? "bg-purple-500"
                    : "bg-green-500"

            return (
              <div
                key={stage.id}
                className={cn(
                  "absolute top-0 h-full rounded-full transition-all",
                  isFilled ? bgColor : "bg-transparent",
                )}
                style={{
                  left: `${(index * 100) / stages.length}%`,
                  width: segmentWidth,
                }}
              />
            )
          })}

          {/* Stage Markers */}
          {stages.map((stage, index) => {
            const position = `${(index * 100) / (stages.length - 1)}%`

            // Determine marker color based on status
            const markerColor =
              stage.id === "needs-attention"
                ? "bg-amber-500 border-amber-500"
                : stage.id === "needs-commission"
                  ? "bg-amber-500 border-amber-500"
                  : stage.status === "current"
                    ? "bg-purple-500 border-purple-500"
                    : stage.status === "completed"
                      ? "bg-green-500 border-green-500"
                      : "bg-gray-200 border-gray-300"

            return (
              <div
                key={`marker-${stage.id}`}
                className={cn("absolute top-0 -mt-1 h-5 w-5 rounded-full border-2", markerColor)}
                style={{
                  left: position,
                  transform: "translateX(-50%)",
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Current Stage Indicator */}
      <div className="mb-4">
        {stages.map((stage) => {
          if (stage.status === "current") {
            return (
              <div key={`current-${stage.id}`} className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground">Current Stage:</div>
                  <div className="text-lg font-semibold text-purple-700">{stage.label}</div>

                  {/* Show attention details if this is the needs-attention stage */}
                  {stage.id === "needs-attention" && attentionDetails && (
                    <div className="mt-2 text-sm text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200">
                      {attentionDetails}
                      {onResolveClick && (
                        <Button
                          onClick={handleResolveClick}
                          size="sm"
                          className="mt-2 bg-amber-500 hover:bg-amber-600 text-white"
                        >
                          Resolve Issue
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Show commission details input if this is the needs-commission stage */}
                  {stage.id === "needs-commission" && (
                    <div className="mt-2 text-sm text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200">
                      Additional commission details required.
                      {onResolveClick && (
                        <Button
                          onClick={handleResolveClick}
                          size="sm"
                          className="mt-2 bg-amber-500 hover:bg-amber-600 text-white"
                        >
                          Provide Details
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          }
          return null
        })}
      </div>

      {/* All Stages List */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {stages.map((stage) => (
          <div
            key={`list-${stage.id}`}
            className={cn(
              "rounded-md border p-2 text-sm",
              stage.status === "current"
                ? "bg-purple-50 border-purple-300"
                : stage.status === "completed"
                  ? "bg-green-50 border-green-200"
                  : stage.id === "needs-attention" || stage.id === "needs-commission"
                    ? "bg-amber-50 border-amber-200"
                    : "bg-gray-50 border-gray-200",
            )}
          >
            <div className="flex items-center gap-2">
              {stage.status === "current" ? (
                <Clock className="h-4 w-4 text-purple-500" />
              ) : stage.status === "completed" ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : stage.id === "needs-attention" || stage.id === "needs-commission" ? (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              ) : (
                <Circle className="h-4 w-4 text-gray-300" />
              )}
              <span
                className={cn(
                  "font-medium",
                  stage.status === "current"
                    ? "text-purple-700"
                    : stage.status === "completed"
                      ? "text-green-700"
                      : stage.id === "needs-attention" || stage.id === "needs-commission"
                        ? "text-amber-700"
                        : "text-gray-500",
                )}
              >
                {stage.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
