"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Task {
  id: string
  description: string
  workspaceId: string
  completed: boolean
  createdAt: string
}

interface WorkspaceTasksProps {
  workspaceId: string
}

export function WorkspaceTasks({ workspaceId }: WorkspaceTasksProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [taskDescription, setTaskDescription] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])

  // Load tasks from sessionStorage on component mount
  useEffect(() => {
    const loadTasks = () => {
      try {
        const storedTasks = sessionStorage.getItem("tasks")
        if (storedTasks) {
          const allTasks = JSON.parse(storedTasks) as Task[]
          // Filter tasks for this workspace
          const workspaceTasks = allTasks.filter((task) => task.workspaceId === workspaceId)
          setTasks(workspaceTasks)
        }
      } catch (error) {
        console.error("Error loading tasks:", error)
      }
    }

    loadTasks()

    // Listen for storage events to update tasks when changed in another component
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "tasks") {
        loadTasks()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [workspaceId])

  const handleSaveTask = () => {
    if (!taskDescription.trim()) return

    try {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        description: taskDescription,
        workspaceId,
        completed: false,
        createdAt: new Date().toISOString(),
      }

      // Get existing tasks from sessionStorage
      const storedTasks = sessionStorage.getItem("tasks")
      const allTasks = storedTasks ? (JSON.parse(storedTasks) as Task[]) : []

      // Add new task
      const updatedTasks = [...allTasks, newTask]

      // Save to sessionStorage
      sessionStorage.setItem("tasks", JSON.stringify(updatedTasks))

      // Update local state
      setTasks((prev) => [...prev, newTask])

      // Reset form and close dialog
      setTaskDescription("")
      setIsDialogOpen(false)

      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event("storage"))
    } catch (error) {
      console.error("Error saving task:", error)
    }
  }

  return (
    <>
      <Card className="shadow-soft overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-pink-500 to-orange-500"></div>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-poppins text-purple-700">Tasks</CardTitle>
              <CardDescription>Manage tasks for this workspace</CardDescription>
            </div>
            <Button className="gap-1" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-2 p-3 rounded-md hover:bg-gray-50 transition-colors border"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2
                      className={`h-5 w-5 ${task.completed ? "text-green-500 fill-green-500" : "text-gray-300"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                      {task.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(task.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-lg font-medium">No Tasks</h3>
              <p className="mt-2 text-sm text-muted-foreground">There are no tasks for this workspace yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>Create a new task for this workspace.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="col-span-3"
                placeholder="Enter task description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask}>Save Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
