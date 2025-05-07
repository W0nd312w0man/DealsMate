"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, Clock, Plus } from "lucide-react"

export function TaskList() {
  // This is a placeholder component - replace with actual implementation
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction Tasks</CardTitle>
            <CardDescription>Track and manage tasks for this transaction</CardDescription>
          </div>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md border p-4">
            <div className="flex items-start gap-3">
              <Checkbox id="task1" className="mt-1" checked />
              <div className="flex-1">
                <label htmlFor="task1" className="font-medium line-through">
                  Schedule property inspection
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-muted-foreground">Completed on Nov 10, 2023</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-md border p-4">
            <div className="flex items-start gap-3">
              <Checkbox id="task2" className="mt-1" />
              <div className="flex-1">
                <label htmlFor="task2" className="font-medium">
                  Review inspection report with client
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-amber-500" />
                  <span className="text-xs text-muted-foreground">Due on Nov 20, 2023</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-md border p-4">
            <div className="flex items-start gap-3">
              <Checkbox id="task3" className="mt-1" />
              <div className="flex-1">
                <label htmlFor="task3" className="font-medium">
                  Submit repair requests
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-amber-500" />
                  <span className="text-xs text-muted-foreground">Due on Nov 25, 2023</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full gap-1">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
