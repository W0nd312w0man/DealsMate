"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkspaceOverview } from "./workspace-overview"
import { WorkspaceTasks } from "./workspace-tasks"
import { WorkspaceDocuments } from "./workspace-documents"
import { WorkspaceCommunications } from "./workspace-communications"
import { WorkspaceContacts } from "./workspace-contacts"
import { WorkspaceParties } from "./workspace-parties"

interface WorkspaceTabsProps {
  workspaceId: string
}

export function WorkspaceTabs({ workspaceId }: WorkspaceTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="parties">Parties</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="communications">Communications</TabsTrigger>
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <WorkspaceOverview workspaceId={workspaceId} />
      </TabsContent>
      <TabsContent value="parties">
        <WorkspaceParties workspaceId={workspaceId} />
      </TabsContent>
      <TabsContent value="tasks">
        <WorkspaceTasks workspaceId={workspaceId} />
      </TabsContent>
      <TabsContent value="documents">
        <WorkspaceDocuments workspaceId={workspaceId} />
      </TabsContent>
      <TabsContent value="communications">
        <WorkspaceCommunications workspaceId={workspaceId} />
      </TabsContent>
      <TabsContent value="contacts">
        <WorkspaceContacts workspaceId={workspaceId} />
      </TabsContent>
    </Tabs>
  )
}
