"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Check,
  ChevronRight,
  Inbox,
  Loader2,
  Lock,
  Mail,
  MailCheck,
  MailPlus,
  MailQuestion,
  Shield,
  Tag,
  Unlock,
  Send,
  Bell,
  Paperclip,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useGmailAuth } from "@/hooks/use-gmail-auth"

export function GmailIntegrationSettings() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("connection")
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  // Gmail auth hook
  const { initiateAuth, disconnectGmail, isAuthenticated, checkAuthStatus } = useGmailAuth()

  // Settings state
  const [settings, setSettings] = useState({
    signature: {
      enabled: true,
      content: "<p>Your Name</p><p>Real Estate Agent</p><p>your.email@gmail.com</p><p>+1 (555) 123-4567</p>",
    },
    sending: {
      defaultSenderName: "",
      replyToAddress: "",
      ccBehavior: "none",
      sendBehavior: "immediate",
      attachmentLimit: "25",
    },
    receiving: {
      syncEnabled: true,
      syncFrequency: "5",
      syncLabels: "all",
      syncPeriod: "30",
      autoCategorize: true,
      autoLink: true,
      extractAttachments: true,
    },
    notifications: {
      enabled: true,
      sound: "chime",
      filters: {
        all: false,
        important: true,
        transactions: true,
        leads: true,
      },
      previewType: "subject-sender",
      browserNotifications: true,
      mobileNotifications: false,
    },
    security: {
      dataAccessLevel: "read_write",
      retentionPeriod: "30_days",
      privacyMode: "standard_extraction",
    },
  })

  // Check for OAuth callback parameters
  useEffect(() => {
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (code) {
      handleOAuthCallback(code)
    } else if (error) {
      toast({
        title: "Authentication Error",
        description: decodeURIComponent(error),
        variant: "destructive",
      })
      router.replace("/settings/integrations/gmail")
    }

    // Check if already authenticated
    checkAuthenticationStatus()
  }, [searchParams])

  // Check authentication status
  const checkAuthenticationStatus = async () => {
    const status = await checkAuthStatus()
    setIsConnected(status.isAuthenticated)
    if (status.isAuthenticated && status.userEmail) {
      setUserEmail(status.userEmail)

      // Load user settings if available
      loadUserSettings()
    }
  }

  // Handle OAuth callback
  const handleOAuthCallback = async (code: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/gmail/auth/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to authenticate with Gmail")
      }

      setIsConnected(true)
      setUserEmail(data.email)

      toast({
        title: "Gmail Connected",
        description: "Your Gmail account has been successfully connected to DealMate.",
        variant: "default",
      })

      // Clean up URL
      router.replace("/settings/integrations/gmail")
    } catch (error) {
      console.error("Authentication error:", error)
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect Gmail account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load user settings
  const loadUserSettings = async () => {
    try {
      const response = await fetch("/api/gmail/settings")

      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  // Save settings
  const saveSettings = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/gmail/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      toast({
        title: "Settings Saved",
        description: "Your Gmail integration settings have been saved.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Connect Gmail
  const handleConnect = async () => {
    setIsLoading(true)
    try {
      await initiateAuth()
    } catch (error) {
      console.error("Error initiating auth:", error)
      toast({
        title: "Connection Error",
        description: "Failed to initiate Gmail connection. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Disconnect Gmail
  const handleDisconnect = async () => {
    setIsLoading(true)

    try {
      await disconnectGmail()

      setIsConnected(false)
      setUserEmail("")

      toast({
        title: "Gmail Disconnected",
        description: "Your Gmail account has been disconnected from DealMate.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error disconnecting:", error)
      toast({
        title: "Error",
        description: "Failed to disconnect Gmail account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update settings
  const updateSettings = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  // Update nested settings
  const updateNestedSettings = (section, nestedKey, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedKey]: {
          ...prev[section][nestedKey],
          [key]: value,
        },
      },
    }))
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="sending">Sending Emails</TabsTrigger>
          <TabsTrigger value="receiving">Receiving Emails</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Connection Tab */}
        <TabsContent value="connection" className="space-y-6">
          <Card className="shadow-soft overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-poppins text-purple-700">Gmail Connection</CardTitle>
              <CardDescription>Connect your Gmail account to enable email integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isConnected ? (
                <div className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="h-5 w-5 text-green-600" />
                    <AlertTitle>Connected to Gmail</AlertTitle>
                    <AlertDescription>Your Gmail account is successfully connected to DealMate.</AlertDescription>
                  </Alert>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-red-100 p-2">
                          <Mail className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{userEmail}</h3>
                          <p className="text-sm text-muted-foreground">Connected account</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Connection Status</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <Inbox className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">Inbox Access</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Active</p>
                      </div>

                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">Send Emails</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Enabled</p>
                      </div>

                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">Notifications</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Enabled</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Permissions</h3>
                    <div className="rounded-lg border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MailCheck className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Read emails</span>
                        </div>
                        <Badge className="bg-green-500">Granted</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MailPlus className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Send emails</span>
                        </div>
                        <Badge className="bg-green-500">Granted</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Manage labels</span>
                        </div>
                        <Badge className="bg-green-500">Granted</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Access attachments</span>
                        </div>
                        <Badge className="bg-green-500">Granted</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert className="bg-blue-50 border-blue-200">
                    <MailQuestion className="h-5 w-5 text-blue-600" />
                    <AlertTitle>Gmail Connection Required</AlertTitle>
                    <AlertDescription>
                      Connect your Gmail account to enable sending and receiving emails directly within DealMate.
                    </AlertDescription>
                  </Alert>

                  <div className="rounded-lg border p-6 space-y-4">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="rounded-full bg-purple-100 p-3">
                        <Mail className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-medium text-lg">Connect to Gmail</h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        DealMate will request access to your Gmail account to enable sending and receiving emails
                        directly within the platform.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">What you'll get:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">Send and receive emails directly within DealMate</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">Manage email attachments and contacts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">Receive notifications for new emails</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">Link emails to transactions and workspaces</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={handleConnect}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Connecting..." : "Connect Gmail Account"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              {isConnected && (
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  disabled={isLoading}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Disconnect Gmail
                </Button>
              )}
              <Button onClick={() => setActiveTab("sending")} className="ml-auto gap-1" disabled={!isConnected}>
                Next: Sending Emails
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Sending Emails Tab */}
        <TabsContent value="sending" className="space-y-6">
          <Card className="shadow-soft overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-400"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-poppins text-purple-700">Email Sending Settings</CardTitle>
              <CardDescription>Configure how emails are sent from DealMate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="signature-enabled" className="flex flex-col space-y-1">
                  <span>Enable Email Signature</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Automatically add your signature to outgoing emails
                  </span>
                </Label>
                <Switch
                  id="signature-enabled"
                  checked={settings.signature.enabled}
                  onCheckedChange={(checked) => updateSettings("signature", "enabled", checked)}
                  disabled={!isConnected}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signature-editor">Email Signature</Label>
                <div className="border rounded-md p-4 min-h-[100px]">
                  <div dangerouslySetInnerHTML={{ __html: settings.signature.content }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Click to edit your email signature. HTML formatting is supported.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-sender">Default Sender Name</Label>
                <Input
                  id="default-sender"
                  value={settings.sending.defaultSenderName}
                  onChange={(e) => updateSettings("sending", "defaultSenderName", e.target.value)}
                  placeholder="Your Name"
                  disabled={!isConnected}
                />
                <p className="text-xs text-muted-foreground">
                  This name will appear as the sender for emails sent from DealMate.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reply-to">Reply-To Address</Label>
                <Input
                  id="reply-to"
                  value={settings.sending.replyToAddress}
                  onChange={(e) => updateSettings("sending", "replyToAddress", e.target.value)}
                  placeholder="your.email@gmail.com"
                  disabled={!isConnected}
                />
                <p className="text-xs text-muted-foreground">Replies to your emails will be sent to this address.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cc-behavior">Default CC Behavior</Label>
                <Select
                  value={settings.sending.ccBehavior}
                  onValueChange={(value) => updateSettings("sending", "ccBehavior", value)}
                  disabled={!isConnected}
                >
                  <SelectTrigger id="cc-behavior">
                    <SelectValue placeholder="Select behavior" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No default CC</SelectItem>
                    <SelectItem value="team">CC my team</SelectItem>
                    <SelectItem value="broker">CC my broker</SelectItem>
                    <SelectItem value="custom">Custom CC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="send-behavior">Send Behavior</Label>
                <Select
                  value={settings.sending.sendBehavior}
                  onValueChange={(value) => updateSettings("sending", "sendBehavior", value)}
                  disabled={!isConnected}
                >
                  <SelectTrigger id="send-behavior">
                    <SelectValue placeholder="Select behavior" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Send Immediately</SelectItem>
                    <SelectItem value="delay">Delay by 5 seconds</SelectItem>
                    <SelectItem value="schedule">Allow Scheduling</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Configure how emails are sent when you click the send button.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachment-limit">Attachment Size Limit</Label>
                <Select
                  value={settings.sending.attachmentLimit}
                  onValueChange={(value) => updateSettings("sending", "attachmentLimit", value)}
                  disabled={!isConnected}
                >
                  <SelectTrigger id="attachment-limit">
                    <SelectValue placeholder="Select limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 MB</SelectItem>
                    <SelectItem value="25">25 MB</SelectItem>
                    <SelectItem value="50">50 MB</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Maximum size for email attachments. Gmail's limit is 25 MB.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setActiveTab("connection")} disabled={!isConnected}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("receiving")} className="gap-1" disabled={!isConnected}>
                Next: Receiving Emails
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Receiving Emails Tab */}
        <TabsContent value="receiving" className="space-y-6">
          <Card className="shadow-soft overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-green-500 to-blue-400"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-poppins text-purple-700">Email Receiving Settings</CardTitle>
              <CardDescription>Configure how emails are received and displayed in DealMate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="sync-enabled" className="flex flex-col space-y-1">
                  <span>Enable Email Sync</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Automatically sync emails from Gmail to DealMate
                  </span>
                </Label>
                <Switch
                  id="sync-enabled"
                  checked={settings.receiving.syncEnabled}
                  onCheckedChange={(checked) => updateSettings("receiving", "syncEnabled", checked)}
                  disabled={!isConnected}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sync-frequency">Sync Frequency</Label>
                <Select
                  value={settings.receiving.syncFrequency}
                  onValueChange={(value) => updateSettings("receiving", "syncFrequency", value)}
                  disabled={!isConnected || !settings.receiving.syncEnabled}
                >
                  <SelectTrigger id="sync-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Every 1 minute</SelectItem>
                    <SelectItem value="5">Every 5 minutes</SelectItem>
                    <SelectItem value="15">Every 15 minutes</SelectItem>
                    <SelectItem value="30">Every 30 minutes</SelectItem>
                    <SelectItem value="60">Every hour</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">How often DealMate checks for new emails.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sync-labels">Sync Labels</Label>
                <Select
                  value={settings.receiving.syncLabels}
                  onValueChange={(value) => updateSettings("receiving", "syncLabels", value)}
                  disabled={!isConnected || !settings.receiving.syncEnabled}
                >
                  <SelectTrigger id="sync-labels">
                    <SelectValue placeholder="Select labels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Labels</SelectItem>
                    <SelectItem value="inbox">Inbox Only</SelectItem>
                    <SelectItem value="custom">Custom Labels</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Which Gmail labels to sync with DealMate.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sync-period">Sync Period</Label>
                <Select
                  value={settings.receiving.syncPeriod}
                  onValueChange={(value) => updateSettings("receiving", "syncPeriod", value)}
                  disabled={!isConnected || !settings.receiving.syncEnabled}
                >
                  <SelectTrigger id="sync-period">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="all">All emails</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">How far back to sync emails from Gmail.</p>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="auto-categorize" className="flex flex-col space-y-1">
                  <span>Auto-Categorize Emails</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Automatically categorize emails as transactions, leads, etc.
                  </span>
                </Label>
                <Switch
                  id="auto-categorize"
                  checked={settings.receiving.autoCategorize}
                  onCheckedChange={(checked) => updateSettings("receiving", "autoCategorize", checked)}
                  disabled={!isConnected || !settings.receiving.syncEnabled}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="auto-link" className="flex flex-col space-y-1">
                  <span>Auto-Link to Transactions</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Automatically link emails to relevant transactions
                  </span>
                </Label>
                <Switch
                  id="auto-link"
                  checked={settings.receiving.autoLink}
                  onCheckedChange={(checked) => updateSettings("receiving", "autoLink", checked)}
                  disabled={!isConnected || !settings.receiving.syncEnabled}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="extract-attachments" className="flex flex-col space-y-1">
                  <span>Extract Attachments</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Automatically extract and save attachments from emails
                  </span>
                </Label>
                <Switch
                  id="extract-attachments"
                  checked={settings.receiving.extractAttachments}
                  onCheckedChange={(checked) => updateSettings("receiving", "extractAttachments", checked)}
                  disabled={!isConnected || !settings.receiving.syncEnabled}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setActiveTab("sending")} disabled={!isConnected}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("notifications")} className="gap-1" disabled={!isConnected}>
                Next: Notifications
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-soft overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-pink-500 to-orange-400"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-poppins text-purple-700">Email Notifications</CardTitle>
              <CardDescription>Configure how you are notified about new emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="notifications-enabled" className="flex flex-col space-y-1">
                  <span>Enable Email Notifications</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive notifications for new emails
                  </span>
                </Label>
                <Switch
                  id="notifications-enabled"
                  checked={settings.notifications.enabled}
                  onCheckedChange={(checked) => updateSettings("notifications", "enabled", checked)}
                  disabled={!isConnected}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-sound">Notification Sound</Label>
                <Select
                  value={settings.notifications.sound}
                  onValueChange={(value) => updateSettings("notifications", "sound", value)}
                  disabled={!isConnected || !settings.notifications.enabled}
                >
                  <SelectTrigger id="notification-sound">
                    <SelectValue placeholder="Select sound" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="chime">Chime</SelectItem>
                    <SelectItem value="bell">Bell</SelectItem>
                    <SelectItem value="ping">Ping</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notification Filters</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-all" className="cursor-pointer">
                      All emails
                    </Label>
                    <Switch
                      id="notify-all"
                      checked={settings.notifications.filters.all}
                      onCheckedChange={(checked) => updateNestedSettings("notifications", "filters", "all", checked)}
                      disabled={!isConnected || !settings.notifications.enabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-important" className="cursor-pointer">
                      Important emails only
                    </Label>
                    <Switch
                      id="notify-important"
                      checked={settings.notifications.filters.important}
                      onCheckedChange={(checked) =>
                        updateNestedSettings("notifications", "filters", "important", checked)
                      }
                      disabled={!isConnected || !settings.notifications.enabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-transactions" className="cursor-pointer">
                      Transaction-related emails
                    </Label>
                    <Switch
                      id="notify-transactions"
                      checked={settings.notifications.filters.transactions}
                      onCheckedChange={(checked) =>
                        updateNestedSettings("notifications", "filters", "transactions", checked)
                      }
                      disabled={!isConnected || !settings.notifications.enabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-leads" className="cursor-pointer">
                      Lead-related emails
                    </Label>
                    <Switch
                      id="notify-leads"
                      checked={settings.notifications.filters.leads}
                      onCheckedChange={(checked) => updateNestedSettings("notifications", "filters", "leads", checked)}
                      disabled={!isConnected || !settings.notifications.enabled}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-preview">Notification Preview</Label>
                <Select
                  value={settings.notifications.previewType}
                  onValueChange={(value) => updateSettings("notifications", "previewType", value)}
                  disabled={!isConnected || !settings.notifications.enabled}
                >
                  <SelectTrigger id="notification-preview">
                    <SelectValue placeholder="Select preview" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subject-only">Subject Only</SelectItem>
                    <SelectItem value="subject-sender">Subject and Sender</SelectItem>
                    <SelectItem value="full">Full Preview</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">How much information to show in email notifications.</p>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="browser-notifications" className="flex flex-col space-y-1">
                  <span>Browser Notifications</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Show browser notifications for new emails
                  </span>
                </Label>
                <Switch
                  id="browser-notifications"
                  checked={settings.notifications.browserNotifications}
                  onCheckedChange={(checked) => updateSettings("notifications", "browserNotifications", checked)}
                  disabled={!isConnected || !settings.notifications.enabled}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="mobile-notifications" className="flex flex-col space-y-1">
                  <span>Mobile Notifications</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Send notifications to your mobile device
                  </span>
                </Label>
                <Switch
                  id="mobile-notifications"
                  checked={settings.notifications.mobileNotifications}
                  onCheckedChange={(checked) => updateSettings("notifications", "mobileNotifications", checked)}
                  disabled={!isConnected || !settings.notifications.enabled}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setActiveTab("receiving")} disabled={!isConnected}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("security")} className="gap-1" disabled={!isConnected}>
                Next: Security
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-soft overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-red-500 to-orange-400"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-poppins text-purple-700">Security & Privacy</CardTitle>
              <CardDescription>Configure security and privacy settings for the Gmail integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="data-access">Data Access Level</Label>
                  <Select
                    value={settings.security.dataAccessLevel}
                    onValueChange={(value) => updateSettings("security", "dataAccessLevel", value)}
                    disabled={!isConnected}
                  >
                    <SelectTrigger id="data-access">
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="read_only">Read Only</SelectItem>
                      <SelectItem value="read_write">Read & Write</SelectItem>
                      <SelectItem value="full_access">Full Access</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Controls what level of access DealMate has to your Gmail account
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retention-period">Data Retention Period</Label>
                  <Select
                    value={settings.security.retentionPeriod}
                    onValueChange={(value) => updateSettings("security", "retentionPeriod", value)}
                    disabled={!isConnected}
                  >
                    <SelectTrigger id="retention-period">
                      <SelectValue placeholder="Select retention period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7_days">7 Days</SelectItem>
                      <SelectItem value="30_days">30 Days</SelectItem>
                      <SelectItem value="90_days">90 Days</SelectItem>
                      <SelectItem value="indefinite">Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    How long DealMate retains email data after processing
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privacy-mode">Privacy Mode</Label>
                  <Select
                    value={settings.security.privacyMode}
                    onValueChange={(value) => updateSettings("security", "privacyMode", value)}
                    disabled={!isConnected}
                  >
                    <SelectTrigger id="privacy-mode">
                      <SelectValue placeholder="Select privacy mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal_extraction">Minimal Data Extraction</SelectItem>
                      <SelectItem value="standard_extraction">Standard Data Extraction</SelectItem>
                      <SelectItem value="maximum_extraction">Maximum Data Extraction</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Controls how much data DealMate extracts from emails
                  </p>
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <h3 className="font-medium">Security Information</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-green-600" />
                    <p className="text-sm">OAuth 2.0 authentication - no passwords stored</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-green-600" />
                    <p className="text-sm">Data encrypted in transit and at rest</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Unlock className="h-4 w-4 text-amber-600" />
                    <p className="text-sm">You can revoke access at any time</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-red-200 p-4 space-y-3 bg-red-50">
                <h3 className="font-medium text-red-700">Danger Zone</h3>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-100"
                    onClick={handleDisconnect}
                    disabled={!isConnected || isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Disconnect Gmail Integration
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-100"
                    disabled={!isConnected || isLoading}
                  >
                    Delete All Extracted Data
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setActiveTab("notifications")} disabled={!isConnected}>
                Back
              </Button>
              <Button
                onClick={saveSettings}
                disabled={!isConnected || isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Configuration
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
