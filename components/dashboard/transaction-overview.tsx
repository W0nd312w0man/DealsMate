"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import type { TransactionStatus, TransactionType } from "@/types/transaction"

interface TransactionOverviewProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TransactionOverview({ className, ...props }: TransactionOverviewProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock data - in a real app, this would come from an API
  const transactions = {
    active: 12,
    pending: 5,
    closingThisMonth: 4,
    closed: 8,
    withdrawn: 2,
    canceled: 3,
    archived: 6,
    total: 40,
  }

  // Mock transaction data for the dialog
  const mockTransactionsByCategory: Record<
    string,
    Array<{
      id: string
      address: string
      type: TransactionType
      stage: string
      status: TransactionStatus
      dueDate: string
    }>
  > = {
    active: [
      {
        id: "TX-1234",
        address: "123 Main St, Anytown, CA",
        type: "Purchase",
        stage: "Under Contract",
        status: "Active",
        dueDate: "Apr 15, 2025",
      },
      {
        id: "TX-1235",
        address: "456 Oak Ave, Somewhere, CA",
        type: "Listing",
        stage: "Property Listed",
        status: "Active",
        dueDate: "Apr 22, 2025",
      },
      {
        id: "TX-1238",
        address: "202 Maple Dr, Anywhere, CA",
        type: "Purchase",
        stage: "Actively Searching",
        status: "Active",
        dueDate: "Apr 28, 2025",
      },
    ],
    pending: [
      {
        id: "TX-1239",
        address: "303 Pine St, Nowhere, CA",
        type: "Sale",
        stage: "Under Contract",
        status: "Pending",
        dueDate: "May 5, 2025",
      },
      {
        id: "TX-1240",
        address: "404 Cedar Ln, Elsewhere, CA",
        type: "Purchase",
        stage: "Under Contract",
        status: "Pending",
        dueDate: "May 12, 2025",
      },
    ],
    closingThisMonth: [
      {
        id: "TX-1241",
        address: "505 Elm St, Anytown, CA",
        type: "Purchase",
        stage: "Under Contract",
        status: "Closing This Month",
        dueDate: "Apr 10, 2025",
      },
      {
        id: "TX-1242",
        address: "606 Birch Ave, Somewhere, CA",
        type: "Listing",
        stage: "Under Contract",
        status: "Closing This Month",
        dueDate: "Apr 17, 2025",
      },
    ],
    closed: [
      {
        id: "TX-1243",
        address: "707 Walnut Rd, Nowhere, CA",
        type: "Purchase",
        stage: "Closed",
        status: "Closed",
        dueDate: "Mar 5, 2025",
      },
      {
        id: "TX-1244",
        address: "808 Spruce Dr, Elsewhere, CA",
        type: "Listing",
        stage: "Closed",
        status: "Closed",
        dueDate: "Mar 12, 2025",
      },
    ],
    withdrawn: [
      {
        id: "TX-1245",
        address: "909 Maple Ln, Anytown, CA",
        type: "Purchase",
        stage: "Property Listed",
        status: "Withdrawn",
        dueDate: "Mar 20, 2025",
      },
    ],
    canceled: [
      {
        id: "TX-1246",
        address: "1010 Oak St, Somewhere, CA",
        type: "Lease",
        stage: "Under Contract",
        status: "Canceled",
        dueDate: "Mar 25, 2025",
      },
    ],
    archived: [
      {
        id: "TX-1247",
        address: "1111 Pine Rd, Nowhere, CA",
        type: "Referral",
        stage: "Closed",
        status: "Archived",
        dueDate: "Jan 5, 2025",
      },
      {
        id: "TX-1248",
        address: "1212 Cedar Dr, Elsewhere, CA",
        type: "Other",
        stage: "Closed",
        status: "Archived",
        dueDate: "Feb 12, 2025",
      },
    ],
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    setIsDialogOpen(true)
  }

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "active":
        return "Active Transactions"
      case "pending":
        return "Pending Transactions"
      case "closingThisMonth":
        return "Closing This Month"
      case "closed":
        return "Closed Transactions"
      case "withdrawn":
        return "Withdrawn Transactions"
      case "canceled":
        return "Canceled Transactions"
      case "archived":
        return "Archived Transactions"
      default:
        return "Transactions"
    }
  }

  return (
    <>
      <Card className={cn("shadow-soft card-hover overflow-hidden", className)} {...props}>
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-poppins text-purple-700">Transaction Overview</CardTitle>
          <CardDescription>Your transactions by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              <button
                onClick={() => handleCategoryClick("active")}
                className="rounded-xl border border-green-200/50 bg-white p-3 shadow-sm hover:bg-green-50/50 hover:border-green-300 transition-colors text-left"
              >
                <div className="text-xs font-medium text-muted-foreground">Active</div>
                <div className="text-2xl font-bold text-green-700">{transactions.active}</div>
              </button>
              <button
                onClick={() => handleCategoryClick("pending")}
                className="rounded-xl border border-yellow-200/50 bg-white p-3 shadow-sm hover:bg-yellow-50/50 hover:border-yellow-300 transition-colors text-left"
              >
                <div className="text-xs font-medium text-muted-foreground">Pending</div>
                <div className="text-2xl font-bold text-yellow-700">{transactions.pending}</div>
              </button>
              <button
                onClick={() => handleCategoryClick("closingThisMonth")}
                className="rounded-xl border border-blue-200/50 bg-white p-3 shadow-sm hover:bg-blue-50/50 hover:border-blue-300 transition-colors text-left"
              >
                <div className="text-xs font-medium text-muted-foreground">Closing This Month</div>
                <div className="text-2xl font-bold text-blue-700">{transactions.closingThisMonth}</div>
              </button>
              <button
                onClick={() => handleCategoryClick("closed")}
                className="rounded-xl border border-gray-200/50 bg-white p-3 shadow-sm hover:bg-gray-50/50 hover:border-gray-300 transition-colors text-left"
              >
                <div className="text-xs font-medium text-muted-foreground">Closed</div>
                <div className="text-2xl font-bold text-gray-700">{transactions.closed}</div>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleCategoryClick("withdrawn")}
                className="rounded-xl border border-red-200/50 bg-white p-3 shadow-sm hover:bg-red-50/50 hover:border-red-300 transition-colors text-left"
              >
                <div className="text-xs font-medium text-muted-foreground">Withdrawn</div>
                <div className="text-2xl font-bold text-red-700">{transactions.withdrawn}</div>
              </button>
              <button
                onClick={() => handleCategoryClick("canceled")}
                className="rounded-xl border border-red-200/50 bg-white p-3 shadow-sm hover:bg-red-50/50 hover:border-red-300 transition-colors text-left"
              >
                <div className="text-xs font-medium text-muted-foreground">Canceled</div>
                <div className="text-2xl font-bold text-red-700">{transactions.canceled}</div>
              </button>
              <button
                onClick={() => handleCategoryClick("archived")}
                className="rounded-xl border border-gray-200/50 bg-white p-3 shadow-sm hover:bg-gray-50/50 hover:border-gray-300 transition-colors text-left"
              >
                <div className="text-xs font-medium text-muted-foreground">Archived</div>
                <div className="text-2xl font-bold text-gray-700">{transactions.archived}</div>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedCategory ? getCategoryTitle(selectedCategory) : "Transactions"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {selectedCategory &&
              mockTransactionsByCategory[selectedCategory]?.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-3 border rounded-lg hover:bg-purple-50/50 cursor-pointer"
                  onClick={() => {
                    router.push(`/transactions/${transaction.id}`)
                    setIsDialogOpen(false)
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{transaction.address}</div>
                    <div className="text-xs text-purple-600">{transaction.id}</div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {transaction.type} • Stage: {transaction.stage} • Due: {transaction.dueDate}
                  </div>
                </div>
              ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => router.push("/transactions")}
              className="gap-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
            >
              View All Transactions
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
