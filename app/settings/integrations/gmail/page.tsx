import type { Metadata } from "next"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { GmailIntegration } from "@/components/integrations/gmail-integration"

export const metadata: Metadata = {
  title: "Gmail Integration | DealMate",
  description: "Connect your Gmail account to automate workspace and transaction creation",
}

export default function GmailIntegrationPage() {
  return (
    <div className="container space-y-6 py-8">
      <BreadcrumbNav />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gmail Integration</h1>
        <p className="text-muted-foreground">
          Connect your Gmail account to TALOS to automate workspace creation, transaction conversion, and task
          generation
        </p>
      </div>

      <GmailIntegration />
    </div>
  )
}
