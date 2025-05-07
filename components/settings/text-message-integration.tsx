"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Check, AlertCircle, Phone, Shield, Lock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function TextMessageIntegration() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [activeTab, setActiveTab] = useState("connection")
  const { toast } = useToast()

  // Integration settings state
  const [settings, setSettings] = useState({
    // Connection settings
    phoneNumber: "",
    provider: "twilio",

    // Message settings
    autoReplyEnabled: true,
    autoReplyMessage: "Thank you for your message. I'll get back to you as soon as possible.",

    // Security settings
    dataAccessLevel: "read_write",
    retentionPeriod: "30_days",
  })

  const handleConnect = async () => {
    setIsConnecting(true)

    // Simulate connection
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsConnected(true)
    setIsConnecting(false)
    setSettings({
      ...settings,
      phoneNumber: "(555) 123-4567",
    })

    toast({
      title: "SMS Integration Connected",
      description: "Your SMS integration has been successfully set up.",
    })
  }

  const handleDisconnect = async () => {
    setIsConnecting(true)

    // Simulate disconnection
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsConnected(false)
    setIsConnecting(false)
    setSettings({
      ...settings,
      phoneNumber: "",
    })

    toast({
      title: "SMS Integration Disconnected",
      description: "Your SMS integration has been disconnected.",
    })
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your SMS integration settings have been updated.",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Connection Tab */}
        <TabsContent value="connection" className="space-y-6">
          <Card className="shadow-soft overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-poppins text-purple-700">SMS Connection</CardTitle>
              <CardDescription>Connect your SMS provider to enable text messaging with clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isConnected ? (
                <div className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="h-5 w-5 text-green-600" />
                    <AlertTitle>SMS Integration Connected</AlertTitle>
                    <AlertDescription>
                      Your SMS integration is successfully connected and ready to use.
                    </AlertDescription>
                  </Alert>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-purple-100 p-2">
                          <Phone className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{settings.phoneNumber}</h3>
                          <p className="text-sm text-muted-foreground">Connected phone number</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sms-provider">SMS Provider</Label>
                    <Select value={settings.provider} onValueChange={(value) => updateSetting("provider", value)}>
                      <SelectTrigger id="sms-provider">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="messagebird">MessageBird</SelectItem>
                        <SelectItem value="vonage">Vonage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <AlertTitle>SMS Integration Required</AlertTitle>
                    <AlertDescription>
                      Connect your SMS provider to enable text messaging with clients and receive SMS notifications.
                    </AlertDescription>
                  </Alert>

                  <div className="rounded-lg border p-6 space-y-4">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="rounded-full bg-purple-100 p-3">
                        <MessageSquare className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-medium text-lg">Connect SMS Provider</h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Connect your SMS provider to enable two-way text messaging with clients and receive SMS
                        notifications.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sms-provider">SMS Provider</Label>
                      <Select value={settings.provider} onValueChange={(value) => updateSetting("provider", value)}>
                        <SelectTrigger id="sms-provider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="twilio">Twilio</SelectItem>
                          <SelectItem value="messagebird">MessageBird</SelectItem>
                          <SelectItem value="vonage">Vonage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                      >
                        {isConnecting ? "Connecting..." : "Connect SMS Provider"}
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
                  disabled={isConnecting}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Disconnect SMS Integration
                </Button>
              )}
              <Button onClick={() => setActiveTab("messages")} className="ml-auto gap-1" disabled={!isConnected}>
                Next: Message Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <Card className="shadow-soft overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-400"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-poppins text-purple-700">Message Settings</CardTitle>
              <CardDescription>Configure how text messages are sent and received</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="auto-reply" className="flex flex-col space-y-1">
                  <span>Auto-Reply</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Automatically reply to incoming text messages
                  </span>
                </Label>
                <Switch
                  id="auto-reply"
                  checked={settings.autoReplyEnabled}
                  onCheckedChange={(checked) => updateSetting("autoReplyEnabled", checked)}
                />
              </div>

              {settings.autoReplyEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="auto-reply-message">Auto-Reply Message</Label>
                  <Input
                    id="auto-reply-message"
                    value={settings.autoReplyMessage}
                    onChange={(e) => updateSetting("autoReplyMessage", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    This message will be sent automatically when someone texts you
                  </p>
                </div>
              )}

              <div className="rounded-lg border p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">SMS Usage</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Standard SMS rates may apply based on your provider. Check your SMS provider's pricing for
                      details.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setActiveTab("connection")}>
                Back
              </Button>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-soft overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-red-500 to-orange-400"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-poppins text-purple-700">Security & Privacy</CardTitle>
              <CardDescription>Configure security and privacy settings for SMS integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="data-access">Data Access Level</Label>
                  <Select
                    value={settings.dataAccessLevel}
                    onValueChange={(value) => updateSetting("dataAccessLevel", value)}
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
                    Controls what level of access the SMS integration has
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retention-period">Data Retention Period</Label>
                  <Select
                    value={settings.retentionPeriod}
                    onValueChange={(value) => updateSetting("retentionPeriod", value)}
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
                  <p className="text-xs text-muted-foreground mt-1">How long message data is retained</p>
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
                    <p className="text-sm">All messages are encrypted in transit and at rest</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-green-600" />
                    <p className="text-sm">Phone numbers are stored securely</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setActiveTab("messages")}>
                Back
              </Button>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
