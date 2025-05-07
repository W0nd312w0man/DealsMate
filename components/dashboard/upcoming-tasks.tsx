"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock } from "lucide-react"

export function UpcomingTasks() {
  // Mock data - in a real app, this would come from an API
  const tasks = [
    {
      id: 1,
      title: "Schedule property viewing",
      property: "123 Main St",
      dueDate: "Apr 28, 2025",
    },
    {
      id: 2,
      title: "Review inspection report with client",
      property: "456 Oak Ave",
      dueDate: "Apr 30, 2025",
    },
    {
      id: 3,
      title: "Submit repair requests",
      property: "789 Pine Rd",
      dueDate: "May 5, 2025",
    },
  ]

  return (
    <Card className="shadow-soft card-hover overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-pink-500 to-purple-400"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-poppins text-purple-700">Upcoming Tasks</CardTitle>
        <CardDescription>Stay on top of your upcoming tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-3 rounded-md border p-3 hover:bg-muted/50">
              <Checkbox
                id={`task-${task.id}`}
                className="mt-1 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`task-${task.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {task.title}
                  </label>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Due {task.dueDate}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{task.property}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
