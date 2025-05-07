"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PageHeader } from "@/components/ui/page-header"
import { GmailIntegration } from "@/components/integrations/gmail-integration"
import { TextMessageIntegration } from "@/components/settings/text-message-integration"

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <BreadcrumbNav />
      <PageHeader heading="Integrations" subheading="Connect external services to enhance your workflow" />

      <Tabs defaultValue="gmail" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="gmail">Gmail</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="docusign">DocuSign</TabsTrigger>
        </TabsList>
        <TabsContent value="gmail">
          <GmailIntegration />
        </TabsContent>
        <TabsContent value="sms">
          <TextMessageIntegration />
        </TabsContent>
        <TabsContent value="calendar">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Calendar integration settings will appear here</p>
          </div>
        </TabsContent>
        <TabsContent value="docusign">
          <div className="text-center py-8">
            <p className="text-muted-foreground">DocuSign integration settings will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
