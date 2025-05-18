import type { Metadata } from "next"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { GmailIntegrationSettings } from "@/components/settings/gmail-integration-settings"

export const metadata: Metadata = {
  title: "Gmail Integration | DealMate",
  description: "Connect your Gmail account to manage email communications within DealMate",
}

export default function GmailIntegrationPage() {
  return (
    <div className="container space-y-6 py-8">
      <BreadcrumbNav />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gmail Integration</h1>
        <p className="text-muted-foreground">
          Connect your Gmail account to DealMate to manage email communications directly within the platform
        </p>
      </div>

      <GmailIntegrationSettings />
    </div>
  )
}
