"use client"

import { useState, useMemo } from "react"
import type { Transaction, TransactionStatus, TransactionType } from "@/types/transaction"
import { getStatusColor, getStatusDescription } from "@/types/transaction"

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

  const [transactions, setTransactions] = useState<Transaction[]>([])
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
    setTransactions,
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
