import type { Metadata } from "next"
import { TransactionList } from "@/components/transactions/transaction-list"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PageNavigation } from "@/components/page-navigation"

export const metadata: Metadata = {
  title: "Transactions | DealMate",
  description: "Manage your real estate transactions",
}

export default function TransactionsPage() {
  return (
    <div className="container space-y-6 py-8">
      <BreadcrumbNav />
      <div>
        <p className="text-muted-foreground">View and manage all your real estate transactions</p>
      </div>
      <TransactionFilters />
      <TransactionList />
      <PageNavigation
        prevPage={{ url: "/dashboard", label: "Dashboard" }}
        nextPage={{ url: "/documents", label: "Documents" }}
      />
    </div>
  )
}
