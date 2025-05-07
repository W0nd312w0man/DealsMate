"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { EmailViewSettings } from "@/components/settings/email-view-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { PageHeader } from "@/components/ui/page-header"

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <BreadcrumbNav />
      <PageHeader heading="Settings" subheading="Manage your account settings and preferences" />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="inbox">Smart Inbox</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <div className="grid gap-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">General settings will appear here</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="inbox">
          <div className="grid gap-6 max-w-3xl">
            <EmailViewSettings />
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="grid gap-6 max-w-3xl">
            <NotificationSettings />
          </div>
        </TabsContent>
        <TabsContent value="integrations">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Integration settings will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
