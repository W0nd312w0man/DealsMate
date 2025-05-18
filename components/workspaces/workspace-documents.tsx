"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface WorkspaceDocumentsProps {
  workspaceId: string
}

export function WorkspaceDocuments({ workspaceId }: WorkspaceDocumentsProps) {
  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-poppins text-purple-700">Documents</CardTitle>
            <CardDescription>Manage documents for this workspace</CardDescription>
          </div>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No Documents</h3>
          <p className="mt-2 text-sm text-muted-foreground">There are no documents for this workspace yet.</p>
        </div>
      </CardContent>
    </Card>
  )
}
