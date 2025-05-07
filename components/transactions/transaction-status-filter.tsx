"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { TransactionStatus } from "@/types/transaction"

interface TransactionStatusFilterProps extends React.HTMLAttributes<HTMLDivElement> {
  onStatusChange?: (status: TransactionStatus | null) => void
  defaultStatus?: TransactionStatus | null
}

export function TransactionStatusFilter({
  className,
  onStatusChange,
  defaultStatus = null,
  ...props
}: TransactionStatusFilterProps) {
  const [activeStatus, setActiveStatus] = useState<TransactionStatus | null>(defaultStatus)

  // Updated status categories to match standardized statuses
  const statuses: { id: TransactionStatus; label: string; count: number }[] = [
    { id: "Active", label: "Active", count: 12 },
    { id: "Pending", label: "Pending", count: 5 },
    { id: "Closing This Month", label: "Closing This Month", count: 4 },
    { id: "Closed", label: "Closed", count: 8 },
    { id: "Withdrawn", label: "Withdrawn", count: 2 },
    { id: "Canceled", label: "Canceled", count: 3 },
    { id: "Archived", label: "Archived", count: 6 },
  ]

  const handleStatusClick = (statusId: TransactionStatus) => {
    // If already active, deselect it
    const newStatus = activeStatus === statusId ? null : statusId
    setActiveStatus(newStatus)

    // Call the callback if provided
    if (onStatusChange) {
      onStatusChange(newStatus)
    }
  }

  return (
    <Card className={cn("shadow-soft overflow-hidden", className)} {...props}>
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-poppins text-purple-700">Transaction Status</CardTitle>
        <CardDescription>Filter transactions by their current status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {statuses.map((status) => (
            <button
              key={status.id}
              onClick={() => handleStatusClick(status.id)}
              className={cn(
                "flex flex-col items-center rounded-xl border p-3 transition-all",
                "hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-md",
                activeStatus === status.id
                  ? "border-purple-500 bg-purple-50 shadow-md"
                  : "border-purple-200/50 bg-white",
              )}
            >
              <div className="text-xs font-medium text-muted-foreground">{status.label}</div>
              <div className="text-2xl font-bold text-purple-700">{status.count}</div>
              {activeStatus === status.id && <div className="mt-1 text-xs text-purple-600 font-medium">Selected</div>}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
