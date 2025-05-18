"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PageNavigation } from "@/components/page-navigation"
import { WorkspaceConversionDialog } from "@/components/workspaces/workspace-conversion-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { WorkspaceHeader } from "@/components/workspaces/workspace-header"
import { WorkspaceOverview } from "@/components/workspaces/workspace-overview"
import { WorkspaceTasks } from "@/components/workspaces/workspace-tasks"
import { WorkspaceDocuments } from "@/components/workspaces/workspace-documents"
import { WorkspaceCommunications } from "@/components/workspaces/workspace-communications"
import { WorkspaceContacts } from "@/components/workspaces/workspace-contacts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function WorkspaceDetailsPage({ params }: { params: { id: string } }) {
  const [showConversionDialog, setShowConversionDialog] = useState(false)
  const [isArchived, setIsArchived] = useState(false)

  return (
    <div className="container mx-auto p-4 space-y-6">
      <BreadcrumbNav />

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild className="border-purple-800/30">
          <Link href="/workspaces">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Workspaces
          </Link>
        </Button>
      </div>

      <WorkspaceHeader workspaceId={params.id} />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-background/50 border border-purple-800/20">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <WorkspaceOverview workspaceId={params.id} />
        </TabsContent>

        <TabsContent value="tasks">
          <WorkspaceTasks workspaceId={params.id} />
        </TabsContent>

        <TabsContent value="documents">
          <WorkspaceDocuments workspaceId={params.id} />
        </TabsContent>

        <TabsContent value="communications">
          <WorkspaceCommunications workspaceId={params.id} />
        </TabsContent>

        <TabsContent value="contacts">
          <WorkspaceContacts workspaceId={params.id} />
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 shadow-lg"
                onClick={() => setShowConversionDialog(true)}
              >
                <ArrowRight className="h-6 w-6 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Convert to Transaction</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <WorkspaceConversionDialog
        workspaceId={params.id}
        open={showConversionDialog}
        onOpenChange={setShowConversionDialog}
      />

      <PageNavigation
        prevPage={{ url: "/workspaces", label: "Workspaces" }}
        nextPage={{ url: "/transactions", label: "Transactions" }}
      />
    </div>
  )
}
