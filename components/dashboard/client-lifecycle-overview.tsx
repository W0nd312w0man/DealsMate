"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Building,
  CheckCircle2,
  Clock,
  Home,
  MessageSquare,
  Plus,
  Search,
  UserCircle,
  Archive,
} from "lucide-react"

export function ClientLifecycleOverview() {
  const [activeTab, setActiveTab] = useState("all")

  // Mock data for workspaces in different stages
  const workspaces = [
    {
      id: "WS-1234",
      name: "Karen Chen",
      address: "15614 Yermo Street, Whittier, CA 90603",
      type: "buyer",
      stage: "nurturing",
      substage: "actively-searching",
      lastActivity: "2 hours ago",
      tasks: 3,
      messages: 5,
    },
    {
      id: "WS-1235",
      name: "Michael Johnson",
      address: "456 Oak Avenue, Somewhere, CA 90210",
      type: "seller",
      stage: "nurturing",
      substage: "preparing-to-list",
      lastActivity: "Yesterday",
      tasks: 2,
      messages: 1,
    },
    {
      id: "WS-1236",
      name: "Emily Brown",
      address: "789 Pine Road, Elsewhere, CA 90211",
      type: "seller",
      stage: "transaction",
      substage: "property-listed",
      lastActivity: "3 days ago",
      tasks: 5,
      messages: 8,
    },
    {
      id: "WS-1237",
      name: "Robert Wilson",
      address: "101 Cedar Lane, Nowhere, CA 90212",
      type: "buyer",
      stage: "transaction",
      substage: "under-contract",
      lastActivity: "1 day ago",
      tasks: 7,
      messages: 3,
    },
    {
      id: "WS-1238",
      name: "Sarah Smith",
      address: "202 Maple Street, Anywhere, CA 90213",
      type: "seller",
      stage: "closed",
      substage: "closed",
      lastActivity: "1 week ago",
      tasks: 0,
      messages: 0,
    },
    {
      id: "WS-1239",
      name: "David Lee",
      address: "303 Birch Boulevard, Somewhere Else, CA 90214",
      type: "buyer",
      stage: "archived",
      substage: "archived",
      lastActivity: "3 months ago",
      tasks: 0,
      messages: 0,
    },
  ]

  // Filter workspaces based on active tab
  const filteredWorkspaces = workspaces.filter((workspace) => {
    if (activeTab === "all") return true
    if (activeTab === "nurturing") return workspace.stage === "nurturing"
    if (activeTab === "transaction") return workspace.stage === "transaction"
    if (activeTab === "closed") return workspace.stage === "closed"
    if (activeTab === "archived") return workspace.stage === "archived"
    if (activeTab === "buyer") return workspace.type === "buyer"
    if (activeTab === "seller") return workspace.type === "seller"
    return true
  })

  // Helper function to get stage badge color
  const getStageBadgeColor = (stage: string, substage: string) => {
    if (stage === "nurturing") {
      return "bg-blue-100 text-blue-800"
    } else if (stage === "transaction") {
      if (substage === "property-listed") {
        return "bg-purple-100 text-purple-800"
      } else {
        return "bg-pink-100 text-pink-800"
      }
    } else if (stage === "closed") {
      return "bg-green-100 text-green-800"
    } else if (stage === "archived") {
      return "bg-gray-100 text-gray-800"
    }
    return "bg-gray-100 text-gray-800"
  }

  // Helper function to get stage display name
  const getStageDisplayName = (stage: string, substage: string) => {
    if (stage === "nurturing") {
      if (substage === "actively-searching") {
        return "Actively Searching"
      } else if (substage === "preparing-to-list") {
        return "Preparing to List"
      } else {
        return "Nurturing"
      }
    } else if (stage === "transaction") {
      if (substage === "property-listed") {
        return "Property Listed"
      } else if (substage === "under-contract") {
        return "Under Contract"
      } else {
        return "Transaction"
      }
    } else if (stage === "closed") {
      return "Closed"
    } else if (stage === "archived") {
      return "Archived"
    }
    return stage
  }

  // Helper function to get client type icon
  const getClientTypeIcon = (type: string) => {
    if (type === "buyer") {
      return <Home className="h-4 w-4 text-blue-600" />
    } else if (type === "seller") {
      return <Building className="h-4 w-4 text-purple-600" />
    }
    return <UserCircle className="h-4 w-4 text-gray-600" />
  }

  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-poppins text-purple-700">Client Lifecycle</CardTitle>
            <CardDescription>Manage your clients through their entire journey</CardDescription>
          </div>
          <Button asChild className="gap-1">
            <Link href="/workspaces/create">
              <Plus className="h-4 w-4" />
              New Workspace
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid w-full grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="nurturing">Nurturing</TabsTrigger>
            <TabsTrigger value="transaction">Transaction</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
            <TabsTrigger value="buyer">Buyers</TabsTrigger>
            <TabsTrigger value="seller">Sellers</TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            {filteredWorkspaces.map((workspace) => (
              <Link key={workspace.id} href={`/workspaces/${workspace.id}`} className="block">
                <div
                  className={`rounded-lg border p-4 hover:border-purple-200 hover:bg-purple-50/30 transition-colors ${workspace.stage === "archived" ? "opacity-80" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getClientTypeIcon(workspace.type)}
                        <h3 className="font-medium">{workspace.name}</h3>
                        <Badge className={getStageBadgeColor(workspace.stage, workspace.substage)}>
                          {getStageDisplayName(workspace.stage, workspace.substage)}
                        </Badge>
                        {workspace.stage === "archived" && <Archive className="h-3.5 w-3.5 text-gray-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{workspace.address}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Last activity: {workspace.lastActivity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{workspace.tasks} tasks</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{workspace.messages} messages</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {filteredWorkspaces.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Search className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No workspaces found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  No workspaces match your current filter. Try changing your filter or create a new workspace.
                </p>
                <Button asChild className="mt-4 gap-1">
                  <Link href="/workspaces/create">
                    <Plus className="h-4 w-4" />
                    New Workspace
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
