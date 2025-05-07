import type { Metadata } from "next"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PageNavigation } from "@/components/page-navigation"
import { ConvertWorkspaceForm } from "@/components/workspaces/convert-workspace-form"

export const metadata: Metadata = {
  title: "Convert Workspace to Transaction | DealMate",
  description: "Convert a workspace into a transaction",
}

export default function ConvertWorkspacePage() {
  return (
    <div className="container space-y-6 py-8">
      <BreadcrumbNav />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Convert Workspace to Transaction</h1>
        <p className="text-muted-foreground">
          Convert this workspace into a transaction by confirming or entering the required information
        </p>
      </div>

      <ConvertWorkspaceForm />

      <PageNavigation
        prevPage={{ url: "/workspaces", label: "Workspaces" }}
        nextPage={{ url: "/transactions", label: "Transactions" }}
      />
    </div>
  )
}
