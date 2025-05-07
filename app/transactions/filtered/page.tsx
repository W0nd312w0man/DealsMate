import type { Metadata } from "next"
import { TransactionListFiltered } from "@/components/transactions/transaction-list-filtered"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PageNavigation } from "@/components/page-navigation"

export const metadata: Metadata = {
  title: "Filtered Transactions | DealMate",
  description: "Filter and manage your real estate transactions by status",
}

export default function FilteredTransactionsPage() {
  return (
    <div className="container space-y-6 py-8">
      <BreadcrumbNav />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">Filter and manage your real estate transactions by status</p>
      </div>

      <TransactionListFiltered />

      <PageNavigation
        prevPage={{ url: "/dashboard", label: "Dashboard" }}
        nextPage={{ url: "/documents", label: "Documents" }}
      />
    </div>
  )
}
