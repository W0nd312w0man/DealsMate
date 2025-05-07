"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Users } from "lucide-react"

interface WorkspaceStagesViewProps {
  clientId: string
}

export function WorkspaceStagesView({ clientId }: WorkspaceStagesViewProps) {
  // Mock data - in a real app, this would come from an API
  const workspace = {
    id: "WS-1234",
    name: "15614 Yermo Street",
    type: "property",
    stage: "Actively Searching",
    lastActivity: "2 hours ago",
    tasks: 3,
    messages: 5,
  }

  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-poppins text-purple-700">Workspace Stages</CardTitle>
        <CardDescription>Current stage in the workspace</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="font-medium">{workspace.stage}</span>
          </div>
          <Badge className="bg-blue-500">In Progress</Badge>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Recent Activity</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Property Viewing Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-sm">New Client Added</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
