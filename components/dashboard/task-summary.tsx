"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskSummaryProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TaskSummary({ className, ...props }: TaskSummaryProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock data - in a real app, this would come from an API
  const tasks = {
    pending: 8,
    completed: 15,
    overdue: 3,
  }

  // Mock task data for the dialog
  const mockTasksByCategory = {
    pending: [
      {
        id: 1,
        title: "Submit inspection report",
        property: "123 Main St",
        dueDate: "Mar 22, 2025",
        transaction: "TX-1234",
      },
      {
        id: 2,
        title: "Review closing documents",
        property: "456 Oak Ave",
        dueDate: "Mar 25, 2025",
        transaction: "TX-1235",
      },
      {
        id: 3,
        title: "Schedule final walkthrough",
        property: "789 Pine Rd",
        dueDate: "Mar 28, 2025",
        transaction: "TX-1236",
      },
    ],
    completed: [
      {
        id: 4,
        title: "Upload purchase agreement",
        property: "123 Main St",
        dueDate: "Mar 15, 2025",
        transaction: "TX-1234",
      },
      {
        id: 5,
        title: "Submit earnest money receipt",
        property: "456 Oak Ave",
        dueDate: "Mar 18, 2025",
        transaction: "TX-1235",
      },
    ],
    overdue: [
      {
        id: 6,
        title: "Complete seller disclosure",
        property: "789 Pine Rd",
        dueDate: "Mar 10, 2025",
        transaction: "TX-1236",
      },
      {
        id: 7,
        title: "Upload lead paint disclosure",
        property: "123 Main St",
        dueDate: "Mar 12, 2025",
        transaction: "TX-1234",
      },
    ],
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    setIsDialogOpen(true)
  }

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "pending":
        return "Pending Tasks"
      case "completed":
        return "Completed Tasks"
      case "overdue":
        return "Overdue Tasks"
      default:
        return "Tasks"
    }
  }

  return (
    <>
      <Card className={cn("shadow-soft card-hover overflow-hidden", className)} {...props}>
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-400"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-poppins text-purple-700">Task Summary</CardTitle>
          <CardDescription>Your pending and completed tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleCategoryClick("pending")}
                className="flex flex-col items-center justify-center rounded-xl border border-purple-200/50 bg-white p-3 shadow-sm hover:bg-purple-50/50 hover:border-purple-300 transition-colors"
              >
                <Clock className="h-6 w-6 text-blue-500" />
                <div className="mt-1.5 text-2xl font-bold text-purple-700">{tasks.pending}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </button>
              <button
                onClick={() => handleCategoryClick("completed")}
                className="flex flex-col items-center justify-center rounded-xl border border-purple-200/50 bg-white p-3 shadow-sm hover:bg-purple-50/50 hover:border-purple-300 transition-colors"
              >
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div className="mt-1.5 text-2xl font-bold text-purple-700">{tasks.completed}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </button>
              <button
                onClick={() => handleCategoryClick("overdue")}
                className="flex flex-col items-center justify-center rounded-xl border border-purple-200/50 bg-white p-3 shadow-sm hover:bg-purple-50/50 hover:border-purple-300 transition-colors"
              >
                <XCircle className="h-6 w-6 text-pink-500" />
                <div className="mt-1.5 text-2xl font-bold text-purple-700">{tasks.overdue}</div>
                <div className="text-xs text-muted-foreground">Overdue</div>
              </button>
            </div>
            <div className="rounded-xl border border-purple-200/50 bg-white shadow-sm">
              <div className="flex items-center justify-between p-3 border-b border-purple-100/50">
                <div className="font-medium text-purple-700">Upcoming Tasks</div>
                <div className="text-sm text-muted-foreground">Due Date</div>
              </div>
              <div className="divide-y divide-purple-100/50">
                {mockTasksByCategory.pending.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 hover:bg-purple-50/50 transition-colors cursor-pointer"
                    onClick={() => handleCategoryClick("pending")}
                  >
                    <div className="grid gap-1">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground">{task.property}</div>
                    </div>
                    <div className="text-sm text-pink-500 font-medium">{task.dueDate}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedCategory ? getCategoryTitle(selectedCategory) : "Tasks"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {selectedCategory &&
              (mockTasksByCategory as Record<string, any>)[selectedCategory]?.map((task: any) => (
                <div
                  key={task.id}
                  className="p-3 border rounded-lg hover:bg-purple-50/50 cursor-pointer"
                  onClick={() => {
                    router.push(`/transactions/${task.transaction}`)
                    setIsDialogOpen(false)
                  }}
                >
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {task.property} • {task.transaction}
                  </div>
                  <div className="text-sm mt-1">
                    Due:{" "}
                    <span className={selectedCategory === "overdue" ? "text-pink-500 font-medium" : ""}>
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => router.push("/tasks")}
              className="gap-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
            >
              View All Tasks
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
