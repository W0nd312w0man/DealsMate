"use client"

import { useTransactions } from "@/hooks/use-transactions"
import { TransactionStatusFilter } from "./transaction-status-filter"
import { TransactionList } from "./transaction-list"
import { Skeleton } from "@/components/ui/skeleton"

export function TransactionListFiltered() {
  const { filteredTransactions, statusFilter, setStatusFilter, isLoading } = useTransactions()

  return (
    <div className="space-y-6">
      <TransactionStatusFilter onStatusChange={setStatusFilter} defaultStatus={statusFilter} />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
      ) : (
        <div>
          {statusFilter && filteredTransactions.length > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredTransactions.length} transactions with status:
                <span className="ml-1 font-medium text-purple-700">{statusFilter}</span>
              </div>
              <button
                onClick={() => setStatusFilter(null)}
                className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}

          <TransactionList transactions={filteredTransactions} />
        </div>
      )}
    </div>
  )
}
