import type { Metadata } from "next"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PageNavigation } from "@/components/page-navigation"
import { ComplianceChecklist } from "@/components/compliance/compliance-checklist"
import { ComplianceDocuments } from "@/components/compliance/compliance-documents"
import { ComplianceAlerts } from "@/components/compliance/compliance-alerts"

export const metadata: Metadata = {
  title: "Compliance | DealMate",
  description: "Manage real estate transaction compliance requirements",
}

export default function CompliancePage() {
  return (
    <div className="container space-y-6 py-8">
      <BreadcrumbNav />
      <div>
        <p className="text-muted-foreground">
          Track and manage compliance requirements for your real estate transactions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <ComplianceAlerts className="md:col-span-3" />
        <ComplianceChecklist className="md:col-span-2" />
        <ComplianceDocuments />
      </div>

      <PageNavigation
        prevPage={{ url: "/communication", label: "Communication" }}
        nextPage={{ url: "/dashboard", label: "Dashboard" }}
      />
    </div>
  )
}
