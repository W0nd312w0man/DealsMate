"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Building2, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type TransactionStatus, type TransactionType, getStatusColor } from "@/types/transaction"
import { NewTransactionDialog } from "./new-transaction-dialog"

// Sample data with updated types and statuses
const transactions = [
  {
    id: "TR-1234",
    address: "123 Main St, Anytown, CA",
    client: "John & Sarah Smith",
    status: "Active" as TransactionStatus,
    type: "Purchase" as TransactionType,
    stage: "Under Contract",
    closeDate: "2023-12-15",
    documents: 12,
    tasks: 8,
    compliance: "3 issues",
  },
  {
    id: "TR-1235",
    address: "456 Oak Ave, Somewhere, CA",
    client: "Michael Johnson",
    status: "Pending" as TransactionStatus,
    type: "Listing" as TransactionType,
    stage: "Property Listed",
    closeDate: "2023-12-20",
    documents: 8,
    tasks: 5,
    compliance: "No issues",
  },
  {
    id: "TR-1236",
    address: "789 Pine Rd, Elsewhere, CA",
    client: "Emily & David Brown",
    status: "Closed" as TransactionStatus,
    type: "Lease" as TransactionType,
    stage: "Closed",
    closeDate: "2023-11-30",
    documents: 15,
    tasks: 0,
    compliance: "No issues",
  },
  {
    id: "TR-1237",
    address: "101 Cedar Ln, Nowhere, CA",
    client: "Robert Wilson",
    status: "Closing This Month" as TransactionStatus,
    type: "Purchase" as TransactionType,
    stage: "Under Contract",
    closeDate: "2023-12-25",
    documents: 10,
    tasks: 12,
    compliance: "1 issue",
  },
  {
    id: "TR-1238",
    address: "202 Elm St, Anytown, CA",
    client: "Jennifer Lopez",
    status: "Withdrawn" as TransactionStatus,
    type: "Listing" as TransactionType,
    stage: "Property Listed",
    closeDate: "2023-12-30",
    documents: 7,
    tasks: 3,
    compliance: "No issues",
  },
  {
    id: "TR-1239",
    address: "303 Maple Ave, Somewhere, CA",
    client: "Thomas & Mary Smith",
    status: "Canceled" as TransactionStatus,
    type: "Lease Listing" as TransactionType,
    stage: "Actively Searching",
    closeDate: "2024-01-05",
    documents: 5,
    tasks: 2,
    compliance: "No issues",
  },
  {
    id: "TR-1240",
    address: "404 Birch Rd, Elsewhere, CA",
    client: "William Johnson",
    status: "Archived" as TransactionStatus,
    type: "Referral" as TransactionType,
    stage: "Closed",
    closeDate: "2023-10-15",
    documents: 3,
    tasks: 0,
    compliance: "No issues",
  },
]

type SortField = "id" | "address" | "client" | "status" | "type" | "stage" | "closeDate" | "actions"
type SortDirection = "asc" | "desc"

export function TransactionList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("id")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [showArchived, setShowArchived] = useState(false)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredTransactions = transactions
    .filter((transaction) => showArchived || transaction.status !== "Archived")
    .filter(
      (transaction) =>
        transaction.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      // Handle sorting based on current sort field and direction
      if (sortField === "actions") {
        // For actions column, sort by id as a fallback
        return sortDirection === "asc" ? (a.id > b.id ? 1 : -1) : a.id < b.id ? 1 : -1
      }

      const aValue = a[sortField]
      const bValue = b[sortField]

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  return (
    <Card className="border-purple-800/20 shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-poppins text-purple-700">Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="w-full pl-8 border-purple-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show-archived"
                checked={showArchived}
                onChange={() => setShowArchived(!showArchived)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="show-archived" className="text-sm text-muted-foreground">
                Show Archived
              </label>
            </div>
            <NewTransactionDialog />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="purchase">Purchase</TabsTrigger>
            <TabsTrigger value="listing">Listing</TabsTrigger>
            <TabsTrigger value="lease">Lease</TabsTrigger>
            <TabsTrigger value="referral">Referral</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="m-0">
            <div className="rounded-md border border-purple-100">
              <div className="divide-y divide-purple-100">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="py-4 px-4 hover:bg-purple-50/30 transition-colors">
                    {/* Line 1: Transaction ID + Property Address */}
                    <div className="flex items-center">
                      <span className="font-bold text-foreground">{transaction.id}</span>
                      <span className="mx-2 text-muted-foreground">—</span>
                      <span className="font-medium text-foreground">{transaction.address}</span>
                    </div>

                    {/* Line 2: Client Name + Transaction Type */}
                    <div className="mt-1 flex items-center text-sm">
                      <span>{transaction.client}</span>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-purple-600">{transaction.type}</span>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-blue-600">Stage: {transaction.stage}</span>
                    </div>

                    {/* Line 3: Scheduled Closing Date + Status */}
                    <div className="mt-1 flex items-center text-xs">
                      <span className="text-muted-foreground">Scheduled Closing Date:</span>
                      <span className="ml-1 font-medium">{transaction.closeDate}</span>
                      <span className="mx-2 text-muted-foreground">—</span>
                      <span className="text-muted-foreground">Status:</span>
                      <div
                        className={`ml-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                          transaction.status,
                        )}`}
                      >
                        {transaction.status}
                      </div>
                    </div>

                    {/* Line 4: Actions */}
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-0 h-auto text-purple-600 hover:text-purple-700 hover:bg-transparent"
                        asChild
                      >
                        <Link href={`/transactions/${transaction.id}`} className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          <span className="text-xs relative group">
                            View Transaction Details
                            <span className="absolute inset-x-0 -bottom-0.5 h-px bg-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="purchase" className="m-0">
            {/* Similar list filtered for Purchase transactions */}
          </TabsContent>
          <TabsContent value="listing" className="m-0">
            {/* Similar list filtered for Listing transactions */}
          </TabsContent>
          <TabsContent value="lease" className="m-0">
            {/* Similar list filtered for Lease transactions */}
          </TabsContent>
          <TabsContent value="referral" className="m-0">
            {/* Similar list filtered for Referral transactions */}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-purple-100 bg-purple-50/30">
        <div className="text-sm text-muted-foreground">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filteredTransactions.length === 0}
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={filteredTransactions.length === 0}
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            Print
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
