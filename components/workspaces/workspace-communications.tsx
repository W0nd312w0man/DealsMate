"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

interface WorkspaceCommunicationsProps {
  workspaceId: string
}

export function WorkspaceCommunications({ workspaceId }: WorkspaceCommunicationsProps) {
  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-green-500 to-teal-500"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-poppins text-purple-700">Communications</CardTitle>
            <CardDescription>Manage communications for this workspace</CardDescription>
          </div>
          <Button className="gap-1">
            <MessageSquare className="h-4 w-4" />
            New Message
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No Communications</h3>
          <p className="mt-2 text-sm text-muted-foreground">There are no communications for this workspace yet.</p>
        </div>
      </CardContent>
    </Card>
  )
}
