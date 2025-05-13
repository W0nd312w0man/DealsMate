"use client"

import { useState, useMemo } from "react"
import type { Transaction, TransactionStatus, TransactionType } from "@/types/transaction"
import { getStatusColor, getStatusDescription } from "@/types/transaction"

// Mock data for transactions
const mockTransactions: Transaction[] = [
  {
    id: "TX-1234",
    address: "123 Main St, Anytown, CA 90210",
    type: "Purchase",
    status: "Active",
    price: "$750,000",
    client: "John & Sarah Smith",
    dueDate: "Apr 15, 2025",
    documents: 12,
    tasks: 8,
    complianceStatus: "incomplete",
    compliancePercentage: 75,
  },
  {
    id: "TX-1235",
    address: "456 Oak Ave, Somewhere, CA 90211",
    type: "Sale",
    status: "Pending",
    price: "$925,000",
    client: "Michael Johnson",
    dueDate: "Apr 22, 2025",
    documents: 15,
    tasks: 5,
    complianceStatus: "warning",
    compliancePercentage: 60,
  },
  {
    id: "TX-1236",
    address: "789 Pine Rd, Elsewhere, CA 90212",
    type: "Purchase",
    status: "Expired",
    price: "$550,000",
    client: "Emily & David Brown",
    dueDate: "Mar 30, 2025",
    documents: 8,
    tasks: 4,
    complianceStatus: "incomplete",
    compliancePercentage: 45,
  },
  {
    id: "TX-1237",
    address: "101 Cedar Ln, Nowhere, CA 90213",
    type: "Sale",
    status: "Closing This Month",
    price: "$1,200,000",
    client: "Robert Wilson",
    dueDate: "Apr 30, 2025",
    documents: 18,
    tasks: 12,
    complianceStatus: "complete",
    compliancePercentage: 100,
  },
  {
    id: "TX-1238",
    address: "202 Maple Dr, Anywhere, CA 90214",
    type: "Purchase",
    status: "Closed",
    price: "$825,000",
    client: "Jennifer & Thomas Lee",
    dueDate: "Mar 15, 2025",
    documents: 20,
    tasks: 0,
    complianceStatus: "complete",
    compliancePercentage: 100,
  },
  {
    id: "TX-1239",
    address: "303 Birch St, Somewhere, CA 90215",
    type: "Sale",
    status: "Withdrawn",
    price: "$675,000",
    client: "Patricia Garcia",
    dueDate: "Mar 10, 2025",
    documents: 5,
    tasks: 3,
    complianceStatus: "incomplete",
    compliancePercentage: 30,
  },
  {
    id: "TX-1240",
    address: "404 Elm Rd, Elsewhere, CA 90216",
    type: "Purchase",
    status: "Canceled",
    price: "$950,000",
    client: "James & Mary Wilson",
    dueDate: "Mar 5, 2025",
    documents: 7,
    tasks: 2,
    complianceStatus: "incomplete",
    compliancePercentage: 40,
  },
  {
    id: "TX-1241",
    address: "505 Walnut Ln, Nowhere, CA 90217",
    type: "Sale",
    status: "Archived",
    price: "$1,050,000",
    client: "Charles & Elizabeth Brown",
    dueDate: "Feb 20, 2025",
    documents: 22,
    tasks: 0,
    complianceStatus: "complete",
    compliancePercentage: 100,
  },
]

interface UseTransactionsOptions {
  initialStatusFilter?: TransactionStatus | null
  initialTypeFilter?: TransactionType | "all"
  initialSearchQuery?: string
  initialShowArchived?: boolean
}

export function useTransactions(options: UseTransactionsOptions = {}) {
  const {
    initialStatusFilter = null,
    initialTypeFilter = "all",
    initialSearchQuery = "",
    initialShowArchived = false,
  } = options

  const [transactions] = useState<Transaction[]>(mockTransactions)
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | null>(initialStatusFilter)
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">(initialTypeFilter)
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [showArchived, setShowArchived] = useState(initialShowArchived)
  const [isLoading, setIsLoading] = useState(false)

  // Get counts for each status
  const statusCounts = useMemo(() => {
    const counts: Record<TransactionStatus, number> = {
      Active: 0,
      Pending: 0,
      "Closing This Month": 0,
      Closed: 0,
      Withdrawn: 0,
      Canceled: 0,
      Archived: 0,
    }

    transactions.forEach((transaction) => {
      counts[transaction.status]++
    })

    return counts
  }, [transactions])

  // Filter transactions based on selected filters
  const filteredTransactions = useMemo(() => {
    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return transactions.filter((transaction) => {
      // Filter by archived status
      if (!showArchived && transaction.status === "Archived") {
        return false
      }

      // Filter by status
      if (statusFilter && transaction.status !== statusFilter) {
        return false
      }

      // Filter by type
      if (typeFilter !== "all" && transaction.type !== typeFilter) {
        return false
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          transaction.address.toLowerCase().includes(query) ||
          transaction.client.toLowerCase().includes(query) ||
          transaction.id.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [transactions, statusFilter, typeFilter, searchQuery, showArchived])

  // Get all available statuses
  const allStatuses: TransactionStatus[] = [
    "Active",
    "Pending",
    "Closing This Month",
    "Closed",
    "Withdrawn",
    "Canceled",
    "Archived",
  ]

  // Get all available types
  const allTypes: TransactionType[] = ["Purchase", "Sale", "Lease", "Lease Listing", "Referral", "Other"]

  return {
    transactions,
    filteredTransactions,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    searchQuery,
    setSearchQuery,
    showArchived,
    setShowArchived,
    isLoading,
    statusCounts,
    allStatuses,
    allTypes,
    getStatusColor,
    getStatusDescription,
  }
}
