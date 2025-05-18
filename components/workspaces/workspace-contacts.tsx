"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface WorkspaceContactsProps {
  workspaceId: string
}

export function WorkspaceContacts({ workspaceId }: WorkspaceContactsProps) {
  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-poppins text-purple-700">Contacts</CardTitle>
            <CardDescription>Manage contacts for this workspace</CardDescription>
          </div>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            New Contact
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No Contacts</h3>
          <p className="mt-2 text-sm text-muted-foreground">There are no contacts for this workspace yet.</p>
        </div>
      </CardContent>
    </Card>
  )
}
