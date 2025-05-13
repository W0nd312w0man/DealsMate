"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { TransactionStatus } from "@/types/transaction"
import { useTransactions } from "@/hooks/use-transactions"

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
  const { statusFilter, setStatusFilter, allStatuses, statusCounts } = useTransactions({
    initialStatusFilter: defaultStatus,
  })

  const handleStatusClick = (statusId: TransactionStatus) => {
    // If already active, deselect it
    const newStatus = statusFilter === statusId ? null : statusId
    setStatusFilter(newStatus)

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
          {allStatuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusClick(status)}
              className={cn(
                "flex flex-col items-center rounded-xl border p-3 transition-all",
                "hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-md",
                statusFilter === status ? "border-purple-500 bg-purple-50 shadow-md" : "border-purple-200/50 bg-white",
              )}
            >
              <div className="text-xs font-medium text-muted-foreground">{status}</div>
              <div className="text-2xl font-bold text-purple-700">{statusCounts[status]}</div>
              {statusFilter === status && <div className="mt-1 text-xs text-purple-600 font-medium">Selected</div>}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
