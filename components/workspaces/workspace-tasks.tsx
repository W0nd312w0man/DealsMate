"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface WorkspaceTasksProps {
  workspaceId: string
}

export function WorkspaceTasks({ workspaceId }: WorkspaceTasksProps) {
  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-pink-500 to-orange-500"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-poppins text-purple-700">Tasks</CardTitle>
            <CardDescription>Manage tasks for this workspace</CardDescription>
          </div>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Task management interface would go here */}
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">Task Management</h3>
          <p className="mt-2 text-sm text-muted-foreground">This is a placeholder for the task management interface.</p>
        </div>
      </CardContent>
    </Card>
  )
}
