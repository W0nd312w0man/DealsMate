"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  Check,
  ChevronRight,
  Clock,
  FileText,
  Filter,
  Home,
  Inbox,
  Loader2,
  Lock,
  Mail,
  MailCheck,
  MailPlus,
  MailQuestion,
  Shield,
  Tag,
  Trash,
  Unlock,
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function GmailIntegration() {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [activeTab, setActiveTab] = useState("connection")

  // Integration settings state
  const [settings, setSettings] = useState({
    // Connection settings
    emailAddress: "",

    // Monitoring rules
    monitoringEnabled: true,
    keywordRules: [
      { id: "1", keywords: "offer accepted, escrow open", action: "create_workspace", enabled: true },
      { id: "2", keywords: "transaction, purchase agreement", action: "create_workspace", enabled: true },
      { id: "3", keywords: "earnest money, deposit", action: "create_task", enabled: true },
    ],
    senderRules: [
      { id: "1", senders: "escrow@homelight.com, title@firstam.com", action: "create_workspace", enabled: true },
      { id: "2", senders: "broker@exp.com", action: "flag_important", enabled: true },
    ],
    autoLabeling: true,

    // Action settings
    createWorkspaceEnabled: true,
    convertToTransactionEnabled: true,
    extractDataEnabled: true,
    createTasksEnabled: true,

    // Data mapping
    subjectLineMapping: "workspace_title",
    bodyMapping: "extract_all",
    attachmentHandling: "save_all",

    // Task creation
    taskRules: [
      {
        id: "1",
        trigger: "escrow instructions",
        taskTitle: "Confirm Earnest Money Deposit",
        dueInDays: 2,
        enabled: true,
      },
      { id: "2", trigger: "inspection report", taskTitle: "Review Inspection Report", dueInDays: 1, enabled: true },
    ],

    // Security
    dataAccessLevel: "read_only",
    retentionPeriod: "30_days",
    privacyMode: "minimal_extraction",
  })

  const handleConnect = async () => {
    setIsConnecting(true)

    // Simulate OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsConnected(true)
    setIsConnecting(false)
    setSettings({
      ...settings,
      emailAddress: "user@gmail.com",
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
      emailAddress: "",
    })
  }

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const toggleRule = (ruleType: "keywordRules" | "senderRules" | "taskRules", id: string) => {
    setSettings((prev) => ({
      ...prev,
      [ruleType]: prev[ruleType].map((rule: any) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)),
    }))
  }

  const addRule = (ruleType: "keywordRules" | "senderRules" | "taskRules") => {
    const newRule = {
      id: Date.now().toString(),
      enabled: true,
    }

    if (ruleType === "keywordRules") {
      Object.assign(newRule, { keywords: "", action: "create_workspace" })
    } else if (ruleType === "senderRules") {
      Object.assign(newRule, { senders: "", action: "create_workspace" })
    } else if (ruleType === "taskRules") {
      Object.assign(newRule, { trigger: "", taskTitle: "", dueInDays: 1 })
    }

    setSettings((prev) => ({
      ...prev,
      [ruleType]: [...prev[ruleType], newRule],
    }))
  }

  const removeRule = (ruleType: "keywordRules" | "senderRules" | "taskRules", id: string) => {
    setSettings((prev) => ({
      ...prev,
      [ruleType]: prev[ruleType].filter((rule: any) => rule.id !== id),
    }))
  }

  const updateRule = (
    ruleType: "keywordRules" | "senderRules" | "taskRules",
    id: string,
    field: string,
    value: any,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [ruleType]: prev[ruleType].map((rule: any) => (rule.id === id ? { ...rule, [field]: value } : rule)),
    }))
  }

  const handleToggleSetting = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }))
  }

  const handleSelectChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring Rules</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="mapping">Data Mapping</TabsTrigger>
          <TabsTrigger value="tasks">Task Creation</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Connection Tab */}
        <TabsContent value="connection" className="space-y-6">
          <Card className="shadow-soft overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-poppins text-purple-700">Gmail Connection</CardTitle>
              <CardDescription>Connect your Gmail account to enable email-driven automation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isConnected ? (
                <div className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="h-5 w-5 text-green-600" />
                    <AlertTitle>Connected to Gmail</AlertTitle>
                    <AlertDescription>Your Gmail account is successfully connected to TALOS.</AlertDescription>
                  </Alert>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-red-100 p-2">
                          <Mail className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{settings.emailAddress}</h3>
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
                          <span className="text-sm font-medium">Inbox Monitoring</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Active</p>
                      </div>

                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">Email Labeling</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Enabled</p>
                      </div>

                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">Data Access</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Read-only</p>
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
                          <Tag className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Manage labels</span>
                        </div>
                        <Badge className="bg-green-500">Granted</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MailPlus className="h-4 w-4 text-red-600" />
                          <span className="text-sm">Send emails</span>
                        </div>
                        <Badge className="bg-gray-200 text-gray-700">Not requested</Badge>
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
                      Connect your Gmail account to enable TALOS to monitor your inbox for transaction-related emails.
                    </AlertDescription>
                  </Alert>

                  <div className="rounded-lg border p-6 space-y-4">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="rounded-full bg-purple-100 p-3">
                        <Mail className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-medium text-lg">Connect to Gmail</h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        TALOS will request read-only access to your Gmail inbox to monitor for transaction-related
                        emails. No emails will be sent on your behalf.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">What you&apos;ll get:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">Automatic workspace creation from transaction emails</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">Data extraction from emails to populate transaction details</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">Task generation based on email content</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                      >
                        {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isConnecting ? "Connecting..." : "Connect Gmail Account"}
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
                  {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Disconnect Gmail
                </Button>
              )}
              <Button onClick={() => setActiveTab("monitoring")} className="ml-auto gap-1" disabled={!isConnected}>
                Next: Monitoring Rules
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Monitoring Rules Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <Card className="shadow-soft overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-400"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-poppins text-purple-700">Inbox Monitoring Rules</CardTitle>
              <CardDescription>Configure how TALOS monitors your inbox for transaction-related emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="monitoring-enabled" className="flex flex-col space-y-1">
                  <span>Enable Inbox Monitoring</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Allow TALOS to monitor your inbox for transaction-related emails
                  </span>
                </Label>
                <Switch
                  id="monitoring-enabled"
                  checked={settings.monitoringEnabled}
                  onCheckedChange={() => handleToggleSetting("monitoringEnabled")}
                />
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="keyword-rules">
                  <AccordionTrigger className="text-base font-medium">Keyword Rules</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <p className="text-sm text-muted-foreground">
                      Monitor emails containing specific keywords to trigger actions
                    </p>

                    {settings.keywordRules.map((rule: any) => (
                      <div key={rule.id} className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Keyword Rule</h4>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={rule.enabled}
                              onCheckedChange={() => toggleRule("keywordRules", rule.id)}
                              size="sm"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRule("keywordRules", rule.id)}
                              className="h-8 w-8 p-0 text-muted-foreground"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor={`keywords-${rule.id}`}>Keywords (comma separated)</Label>
                            <Input
                              id={`keywords-${rule.id}`}
                              value={rule.keywords}
                              onChange={(e) => updateRule("keywordRules", rule.id, "keywords", e.target.value)}
                              placeholder="e.g., offer accepted, escrow open"
                              disabled={!rule.enabled}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`action-${rule.id}`}>Action to Trigger</Label>
                            <Select
                              value={rule.action}
                              onValueChange={(value) => updateRule("keywordRules", rule.id, "action", value)}
                              disabled={!rule.enabled}
                            >
                              <SelectTrigger id={`action-${rule.id}`}>
                                <SelectValue placeholder="Select action" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="create_workspace">Create Workspace</SelectItem>
                                <SelectItem value="convert_transaction">Convert to Transaction</SelectItem>
                                <SelectItem value="create_task">Create Task</SelectItem>
                                <SelectItem value="flag_important">Flag as Important</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      onClick={() => addRule("keywordRules")}
                      className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      Add Keyword Rule
                    </Button>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="sender-rules">
                  <AccordionTrigger className="text-base font-medium">Sender Rules</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <p className="text-sm text-muted-foreground">
                      Monitor emails from specific senders to trigger actions
                    </p>

                    {settings.senderRules.map((rule: any) => (
                      <div key={rule.id} className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Sender Rule</h4>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={rule.enabled}
                              onCheckedChange={() => toggleRule("senderRules", rule.id)}
                              size="sm"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRule("senderRules", rule.id)}
                              className="h-8 w-8 p-0 text-muted-foreground"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor={`senders-${rule.id}`}>Email Addresses (comma separated)</Label>
                            <Input
                              id={`senders-${rule.id}`}
                              value={rule.senders}
                              onChange={(e) => updateRule("senderRules", rule.id, "senders", e.target.value)}
                              placeholder="e.g., escrow@homelight.com, title@firstam.com"
                              disabled={!rule.enabled}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`sender-action-${rule.id}`}>Action to Trigger</Label>
                            <Select
                              value={rule.action}
                              onValueChange={(value) => updateRule("senderRules", rule.id, "action", value)}
                              disabled={!rule.enabled}
                            >
                              <SelectTrigger id={`sender-action-${rule.id}`}>
                                <SelectValue placeholder="Select action" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="create_workspace">Create Workspace</SelectItem>
                                <SelectItem value="convert_transaction">Convert to Transaction</SelectItem>
                                <SelectItem value="create_task">Create Task</SelectItem>
                                <SelectItem value="flag_important">Flag as Important</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      onClick={() => addRule("senderRules")}
                      className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      Add Sender Rule
                    </Button>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="labeling">
                  <AccordionTrigger className="text-base font-medium">Email Labeling</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="auto-labeling" className="flex flex-col space-y-1">
                        <span>Automatic Email Labeling</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Apply labels to emails processed by TALOS
                        </span>
                      </Label>
                      <Switch
                        id="auto-labeling"
                        checked={settings.autoLabeling}
                        onCheckedChange={() => handleToggleSetting("autoLabeling")}
                      />
                    </div>

                    <div className="rounded-lg border p-4 space-y-3">
                      <h4 className="text-sm font-medium">Label Configuration</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                          <span className="text-sm">TALOS/Workspace</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">TALOS/Transaction</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm">TALOS/Task</span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setActiveTab("connection")}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("actions")} className="gap-1">
                Next: Actions
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-6">
          <Card className="shadow-soft overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-green-500 to-blue-400"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-poppins text-purple-700">Email-Triggered Actions</CardTitle>
              <CardDescription>Configure what actions TALOS should take when processing emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-purple-600" />
                      <h3 className="font-medium">Workspace Creation</h3>
                    </div>
                    <Switch
                      checked={settings.createWorkspaceEnabled}
                      onCheckedChange={() => handleToggleSetting("createWorkspaceEnabled")}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create new workspaces automatically from qualifying emails
                  </p>
                  <div className="rounded-md bg-purple-50 p-3">
                    <h4 className="text-xs font-medium text-purple-700">Example</h4>
                    <p className="text-xs text-purple-700 mt-1">
                      Email with subject &quot;Offer Accepted - 123 Main St&quot; arrives → New workspace created with
                      address pre-filled
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium">Transaction Conversion</h3>
                    </div>
                    <Switch
                      checked={settings.convertToTransactionEnabled}
                      onCheckedChange={() => handleToggleSetting("convertToTransactionEnabled")}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Prompt to convert workspaces to transactions when specific emails arrive
                  </p>
                  <div className="rounded-md bg-blue-50 p-3">
                    <h4 className="text-xs font-medium text-blue-700">Example</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Email with escrow instructions arrives → Prompt to convert workspace to transaction with escrow
                      details pre-filled
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-green-600" />
                      <h3 className="font-medium">Data Extraction</h3>
                    </div>
                    <Switch
                      checked={settings.extractDataEnabled}
                      onCheckedChange={() => handleToggleSetting("extractDataEnabled")}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Extract transaction data from email content to populate fields
                  </p>
                  <div className="rounded-md bg-green-50 p-3">
                    <h4 className="text-xs font-medium text-green-700">Example</h4>
                    <p className="text-xs text-green-700 mt-1">
                      Email contains &quot;Escrow #12345&quot; → Automatically extract and populate escrow number field
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-pink-600" />
                      <h3 className="font-medium">Task Creation</h3>
                    </div>
                    <Switch
                      checked={settings.createTasksEnabled}
                      onCheckedChange={() => handleToggleSetting("createTasksEnabled")}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Generate tasks automatically based on email content</p>
                  <div className="rounded-md bg-pink-50 p-3">
                    <h4 className="text-xs font-medium text-pink-700">Example</h4>
                    <p className="text-xs text-pink-700 mt-1">
                      Email about inspection report → Create &quot;Review Inspection Report&quot; task with due date
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-3">
                <h3 className="font-medium">Email Response Automation (Coming Soon)</h3>
                <p className="text-sm text-muted-foreground">
                  Enable TALOS to send automatic responses to certain emails
                </p>
                <div className="flex items-center gap-2 rounded-md bg-gray-100 p-3">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    This feature is currently in development and will be available soon.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setActiveTab("monitoring")}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("mapping")} className="gap-1">
                Next: Data Mapping
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Data Mapping Tab */}
        <TabsContent value="mapping" className="space-y-6">
          <Card className="shadow-soft overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-pink-500 to-orange-400"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-poppins text-purple-700">Data Mapping</CardTitle>
              <CardDescription>
                Configure how TALOS maps email content to workspace and transaction fields
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject-mapping">Subject Line Mapping</Label>
                  <Select
                    value={settings.subjectLineMapping}
                    onValueChange={(value) => handleSelectChange("subjectLineMapping", value)}
                  >
                    <SelectTrigger id="subject-mapping">
                      <SelectValue placeholder="Select mapping" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workspace_title">Map to Workspace Title</SelectItem>
                      <SelectItem value="property_address">Map to Property Address</SelectItem>
                      <SelectItem value="transaction_name">Map to Transaction Name</SelectItem>
                      <SelectItem value="ignore">Ignore Subject Line</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    How TALOS should use the email subject line when creating workspaces or transactions
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body-mapping">Email Body Mapping</Label>
                  <Select
                    value={settings.bodyMapping}
                    onValueChange={(value) => handleSelectChange("bodyMapping", value)}
                  >
                    <SelectTrigger id="body-mapping">
                      <SelectValue placeholder="Select mapping" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="extract_all">Extract All Possible Data</SelectItem>
                      <SelectItem value="extract_addresses">Extract Addresses Only</SelectItem>
                      <SelectItem value="extract_dates">Extract Dates Only</SelectItem>
                      <SelectItem value="extract_contacts">Extract Contact Info Only</SelectItem>
                      <SelectItem value="manual_only">Manual Extraction Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    How TALOS should process the email body to extract transaction data
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachment-handling">Attachment Handling</Label>
                  <Select
                    value={settings.attachmentHandling}
                    onValueChange={(value) => handleSelectChange("attachmentHandling", value)}
                  >
                    <SelectTrigger id="attachment-handling">
                      <SelectValue placeholder="Select handling" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="save_all">Save All Attachments</SelectItem>
                      <SelectItem value="save_documents">Save Document Attachments Only</SelectItem>
                      <SelectItem value="prompt_user">Prompt User for Each Attachment</SelectItem>
                      <SelectItem value="ignore">Ignore Attachments</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">How TALOS should handle email attachments</p>
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-3">
                <h3 className="font-medium">Data Extraction Preview</h3>
                <p className="text-sm text-muted-foreground">Example of how TALOS will extract data from emails</p>

                <div className="rounded-md bg-gray-50 p-3 space-y-2">
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Sample Email Subject:</p>
                    <p className="text-xs">Offer Accepted - 15614 Yermo Street, Whittier, CA 90603</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium">Extracted Data:</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        <p className="text-xs">Property Address: 15614 Yermo Street, Whittier, CA 90603</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        <p className="text-xs">Transaction Type: Purchase (Offer Accepted)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-3">
                <h3 className="font-medium">Field Mapping</h3>
                <p className="text-sm text-muted-foreground">Map extracted data to specific transaction fields</p>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 rounded-md bg-gray-50 p-3">
                    <p className="text-xs font-medium">Email Pattern</p>
                    <p className="text-xs font-medium">Maps To</p>

                    <p className="text-xs">Escrow #[number]</p>
                    <p className="text-xs">Escrow Number</p>

                    <p className="text-xs">Close of Escrow: [date]</p>
                    <p className="text-xs">Close of Escrow Date</p>

                    <p className="text-xs">Purchase Price: $[amount]</p>
                    <p className="text-xs">Purchase Price</p>

                    <p className="text-xs">Buyer: [name]</p>
                    <p className="text-xs">Buyer Name</p>

                    <p className="text-xs">Seller: [name]</p>
                    <p className="text-xs">Seller Name</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setActiveTab("actions")}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("tasks")} className="gap-1">
                Next: Task Creation
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Task Creation Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <Card className="shadow-soft overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-yellow-400"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-poppins text-purple-700">Task Creation Rules</CardTitle>
              <CardDescription>Configure how TALOS creates tasks based on email content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="tasks-enabled" className="flex flex-col space-y-1">
                  <span>Enable Task Creation</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Allow TALOS to create tasks based on email content
                  </span>
                </Label>
                <Switch
                  id="tasks-enabled"
                  checked={settings.createTasksEnabled}
                  onCheckedChange={() => handleToggleSetting("createTasksEnabled")}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-medium">Task Rules</h3>

                {settings.taskRules.map((rule: any) => (
                  <div key={rule.id} className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Task Rule</h4>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => toggleRule("taskRules", rule.id)}
                          size="sm"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRule("taskRules", rule.id)}
                          className="h-8 w-8 p-0 text-muted-foreground"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor={`trigger-${rule.id}`}>Email Trigger (keywords)</Label>
                        <Input
                          id={`trigger-${rule.id}`}
                          value={rule.trigger}
                          onChange={(e) => updateRule("taskRules", rule.id, "trigger", e.target.value)}
                          placeholder="e.g., escrow instructions, inspection report"
                          disabled={!rule.enabled}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`task-title-${rule.id}`}>Task Title</Label>
                        <Input
                          id={`task-title-${rule.id}`}
                          value={rule.taskTitle}
                          onChange={(e) => updateRule("taskRules", rule.id, "taskTitle", e.target.value)}
                          placeholder="e.g., Confirm Earnest Money Deposit"
                          disabled={!rule.enabled}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`due-days-${rule.id}`}>Due In (days)</Label>
                        <Input
                          id={`due-days-${rule.id}`}
                          type="number"
                          min="0"
                          value={rule.dueInDays}
                          onChange={(e) =>
                            updateRule("taskRules", rule.id, "dueInDays", Number.parseInt(e.target.value))
                          }
                          disabled={!rule.enabled}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={() => addRule("taskRules")}
                  className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  Add Task Rule
                </Button>
              </div>

              <div className="rounded-lg border p-4 space-y-3">
                <h3 className="font-medium">Task Assignment</h3>
                <p className="text-sm text-muted-foreground">
                  Configure how tasks are assigned when created from emails
                </p>

                <div className="space-y-2">
                  <Label htmlFor="task-assignment">Default Assignment</Label>
                  <Select defaultValue="current_user">
                    <SelectTrigger id="task-assignment">
                      <SelectValue placeholder="Select assignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current_user">Current User</SelectItem>
                      <SelectItem value="transaction_owner">Transaction Owner</SelectItem>
                      <SelectItem value="team_lead">Team Lead</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setActiveTab("mapping")}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("security")} className="gap-1">
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
                    value={settings.dataAccessLevel}
                    onValueChange={(value) => handleSelectChange("dataAccessLevel", value)}
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
                    Controls what level of access TALOS has to your Gmail account
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retention-period">Data Retention Period</Label>
                  <Select
                    value={settings.retentionPeriod}
                    onValueChange={(value) => handleSelectChange("retentionPeriod", value)}
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
                    How long TALOS retains email data after processing
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privacy-mode">Privacy Mode</Label>
                  <Select
                    value={settings.privacyMode}
                    onValueChange={(value) => handleSelectChange("privacyMode", value)}
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
                    Controls how much data TALOS extracts from emails
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
                  >
                    Disconnect Gmail Integration
                  </Button>

                  <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-100">
                    Delete All Extracted Data
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setActiveTab("tasks")}>
                Back
              </Button>
              <Button
                onClick={() => router.push("/settings/integrations")}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
              >
                Save Configuration
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
