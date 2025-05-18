"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { EmailViewSettings } from "@/components/settings/email-view-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { PageHeader } from "@/components/ui/page-header"
import { useSearchParams, useRouter } from "next/navigation"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const defaultTab = searchParams.get("tab") || "general"
  const [isConnecting, setIsConnecting] = useState(false)

  const handleGmailConnect = () => {
    setIsConnecting(true)

    // Using the provided Google API credentials
    const clientId = "1076146557292-34uhdpoavubdhjs02isk4imnrfcljing.apps.googleusercontent.com"
    const redirectUri = `${window.location.origin}/auth/gmail/callback`

    // Define the scopes needed for Gmail access
    const scopes = [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.labels",
      "https://www.googleapis.com/auth/gmail.modify",
    ].join(" ")

    // Construct the OAuth URL
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent`

    // Redirect to Google's authentication page
    window.location.href = authUrl
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <BreadcrumbNav />
      <PageHeader heading="Settings" subheading="Manage your account settings and preferences" />

      <Tabs defaultValue={defaultTab} className="w-full">
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
          <div className="grid gap-6 max-w-3xl">
            <div className="rounded-lg border shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Email Integrations</h3>
                <p className="text-sm text-muted-foreground">Connect your email accounts to DealMate</p>
              </div>
              <div className="p-6 pt-0 space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-red-100 p-2">
                      <Mail className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Gmail</h4>
                      <p className="text-sm text-muted-foreground">
                        Connect your Gmail account to send and receive emails
                      </p>
                    </div>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                    onClick={handleGmailConnect}
                    disabled={isConnecting}
                  >
                    {isConnecting ? "Connecting..." : "Connect Gmail"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
