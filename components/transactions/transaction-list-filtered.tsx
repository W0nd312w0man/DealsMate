"use client"

import { useState, useEffect } from "react"
import { TransactionStatusFilter } from "./transaction-status-filter"
import { TransactionList } from "./transaction-list"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data - in a real app, this would come from an API
const mockTransactions = [
  {
    id: "TX-1234",
    address: "123 Main St, Anytown, CA 90210",
    type: "Purchase",
    status: "active",
    price: "$750,000",
    client: "John & Sarah Smith",
    dueDate: "Apr 15, 2025",
    documents: 12,
    missingDocuments: 2,
    complianceStatus: "incomplete",
    compliancePercentage: 75,
  },
  {
    id: "TX-1235",
    address: "456 Oak Ave, Somewhere, CA 90211",
    type: "Sale",
    status: "pending",
    price: "$925,000",
    client: "Michael Johnson",
    dueDate: "Apr 22, 2025",
    documents: 15,
    missingDocuments: 0,
    complianceStatus: "warning",
    compliancePercentage: 60,
  },
  {
    id: "TX-1236",
    address: "789 Pine Rd, Elsewhere, CA 90212",
    type: "Purchase",
    status: "expired",
    price: "$550,000",
    client: "Emily & David Brown",
    dueDate: "Mar 30, 2025",
    documents: 8,
    missingDocuments: 4,
    complianceStatus: "incomplete",
    compliancePercentage: 45,
  },
  {
    id: "TX-1237",
    address: "101 Cedar Ln, Nowhere, CA 90213",
    type: "Sale",
    status: "closing",
    price: "$1,200,000",
    client: "Robert Wilson",
    dueDate: "Apr 30, 2025",
    documents: 18,
    missingDocuments: 0,
    complianceStatus: "complete",
    compliancePercentage: 100,
  },
  {
    id: "TX-1238",
    address: "202 Maple Dr, Anywhere, CA 90214",
    type: "Purchase",
    status: "closed",
    price: "$825,000",
    client: "Jennifer & Thomas Lee",
    dueDate: "Mar 15, 2025",
    documents: 20,
    missingDocuments: 0,
    complianceStatus: "complete",
    compliancePercentage: 100,
  },
  {
    id: "TX-1239",
    address: "303 Birch St, Somewhere, CA 90215",
    type: "Sale",
    status: "withdrawn",
    price: "$675,000",
    client: "Patricia Garcia",
    dueDate: "Mar 10, 2025",
    documents: 5,
    missingDocuments: 3,
    complianceStatus: "incomplete",
    compliancePercentage: 30,
  },
  {
    id: "TX-1240",
    address: "404 Elm Rd, Elsewhere, CA 90216",
    type: "Purchase",
    status: "canceled",
    price: "$950,000",
    client: "James & Mary Wilson",
    dueDate: "Mar 5, 2025",
    documents: 7,
    missingDocuments: 2,
    complianceStatus: "incomplete",
    compliancePercentage: 40,
  },
  {
    id: "TX-1241",
    address: "505 Walnut Ln, Nowhere, CA 90217",
    type: "Sale",
    status: "archived",
    price: "$1,050,000",
    client: "Charles & Elizabeth Brown",
    dueDate: "Feb 20, 2025",
    documents: 22,
    missingDocuments: 0,
    complianceStatus: "complete",
    compliancePercentage: 100,
  },
]

export function TransactionListFiltered() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Simulate API call to filter transactions
    const filterTransactions = async () => {
      setIsLoading(true)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Filter transactions based on selected status
      const filtered = selectedStatus ? mockTransactions.filter((t) => t.status === selectedStatus) : mockTransactions

      setFilteredTransactions(filtered)
      setIsLoading(false)
    }

    filterTransactions()
  }, [selectedStatus])

  return (
    <div className="space-y-6">
      <TransactionStatusFilter onStatusChange={setSelectedStatus} defaultStatus={selectedStatus} />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
      ) : (
        <div>
          {selectedStatus && (
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredTransactions.length} transactions with status:
                <span className="ml-1 font-medium text-purple-700">
                  {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
                </span>
              </div>
              <button
                onClick={() => setSelectedStatus(null)}
                className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* This assumes your existing TransactionList component can accept a transactions prop */}
          {/* If not, you'll need to modify it or create a version that can */}
          <TransactionList transactions={filteredTransactions} />
        </div>
      )}
    </div>
  )
}
