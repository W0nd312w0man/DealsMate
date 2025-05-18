"use client"

import { useState, useMemo } from "react"
import type { Task, TaskOwnerRole, TaskStatus } from "@/types/task"
import { useToast } from "@/components/ui/use-toast"
import type { TalosNotification } from "@/components/talos/talos-notifications"

// Function to get tasks - now reads from sessionStorage
function getTasks(): Task[] {
  if (typeof window !== "undefined") {
    const tasksFromStorage = sessionStorage.getItem("tasks")
    if (tasksFromStorage) {
      try {
        return JSON.parse(tasksFromStorage)
      } catch (e) {
        console.error("Error parsing tasks from sessionStorage:", e)
      }
    }
  }
  return []
}

interface UseTasksOptions {
  initialStatusFilter?: TaskStatus | "all"
  initialRoleFilter?: TaskOwnerRole | "all" | TaskOwnerRole[]
  initialNameSearch?: string
  initialWorkspaceFilter?: string | "all"
  initialTaskTypeFilter?: "all" | "transaction" | "workspace" | "individual"
  currentUserRole?: TaskOwnerRole
  currentUserName?: string
}

export function useTasks(options: UseTasksOptions = {}) {
  const {
    initialStatusFilter = "all",
    initialRoleFilter = "all",
    initialNameSearch = "",
    initialWorkspaceFilter = "all",
    initialTaskTypeFilter = "all",
    currentUserRole = "agent",
    currentUserName = "John Smith",
  } = options

  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>(getTasks())
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">(initialStatusFilter)
  const [roleFilters, setRoleFilters] = useState<TaskOwnerRole[]>(
    Array.isArray(initialRoleFilter) ? initialRoleFilter : initialRoleFilter === "all" ? [] : [initialRoleFilter],
  )
  const [nameSearch, setNameSearch] = useState(initialNameSearch)
  const [workspaceFilter, setWorkspaceFilter] = useState<string | "all">(initialWorkspaceFilter)
  const [taskTypeFilter, setTaskTypeFilter] = useState<"all" | "transaction" | "workspace" | "individual">(
    initialTaskTypeFilter,
  )

  // Filter tasks based on selected filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by status
      if (statusFilter !== "all") {
        if (statusFilter === "past-due" && !task.isPastDue) return false
        if (statusFilter === "today" && !task.dueDate.includes("Today")) return false
        if (statusFilter === "upcoming" && (task.dueDate.includes("Today") || task.isPastDue)) return false
        if (statusFilter === "completed" && !task.completed) return false
      }

      // Filter by role
      if (roleFilters.length > 0 && !roleFilters.includes(task.ownerRole)) {
        return false
      }

      // Filter by name
      if (nameSearch && !task.ownerName.toLowerCase().includes(nameSearch.toLowerCase())) {
        return false
      }

      // Filter by workspace
      if (workspaceFilter !== "all" && task.workspaceId !== workspaceFilter) {
        return false
      }

      // Filter by task type
      if (taskTypeFilter !== "all") {
        if (taskTypeFilter === "transaction" && !task.transaction) return false
        if (taskTypeFilter === "workspace" && (!task.workspaceId || task.transaction)) return false
        if (taskTypeFilter === "individual" && (task.workspaceId || task.transaction)) return false
      }

      return true
    })
  }, [tasks, statusFilter, roleFilters, nameSearch, workspaceFilter, taskTypeFilter])

  // Group tasks by past due and active
  const pastDueTasks = useMemo(() => tasks.filter((task) => task.isPastDue && !task.completed), [tasks])

  const toggleTaskCompletion = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))

    // Add notification when a task is completed
    if (task && !task.completed && window.talosNotifications) {
      const notification: Omit<TalosNotification, "id" | "timestamp" | "read"> = {
        type: "task_created",
        title: "Task completed",
        description: `You completed the task: "${task.title}"`,
        actionUrl: "/tasks",
        actionLabel: "View Tasks",
        relatedEntity: {
          type: "task",
          id: task.id,
          name: task.title,
        },
      }

      // @ts-ignore - Add to global notifications
      window.talosNotifications.add(notification)
    }
  }

  const addTask = (newTask: Task) => {
    setTasks([newTask, ...tasks])

    // Add notification for manually created task
    if (window.talosNotifications) {
      const notification: Omit<TalosNotification, "id" | "timestamp" | "read"> = {
        type: "task_created",
        title: "Task created",
        description: `You created a new task: "${newTask.title}"`,
        actionUrl: "/tasks",
        actionLabel: "View Task",
        priority: newTask.priority as any,
        relatedEntity: {
          type: "task",
          id: newTask.id,
          name: newTask.title,
        },
      }

      // @ts-ignore - Add to global notifications
      window.talosNotifications.add(notification)
    }
  }

  const clearFilters = () => {
    setStatusFilter("all")
    setRoleFilters([])
    setNameSearch("")
    setWorkspaceFilter("all")
    setTaskTypeFilter("all")
  }

  const handleRoleFilterToggle = (role: TaskOwnerRole) => {
    setRoleFilters((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]))
  }

  // Helper functions for UI display
  const getRoleIcon = (role: TaskOwnerRole) => {
    switch (role) {
      case "agent":
        return "User"
      case "transaction-coordinator":
        return "Users"
      case "broker":
        return "Building2"
      case "manager":
        return "Briefcase"
      case "system-administrator":
        return "Robot"
    }
  }

  const getRoleName = (role: TaskOwnerRole) => {
    switch (role) {
      case "agent":
        return "Agent"
      case "transaction-coordinator":
        return "Transaction Coordinator"
      case "broker":
        return "Broker/Compliance Manager"
      case "manager":
        return "Team Lead/Manager"
      case "system-administrator":
        return "System Administrator"
    }
  }

  const getStatusFilterName = (filter: TaskStatus | "all") => {
    switch (filter) {
      case "all":
        return "All Tasks"
      case "past-due":
        return "Past Due"
      case "today":
        return "Today"
      case "upcoming":
        return "Upcoming"
      case "completed":
        return "Completed"
    }
  }

  const getTaskTypeName = (type: "all" | "transaction" | "workspace" | "individual") => {
    switch (type) {
      case "all":
        return "All Types"
      case "transaction":
        return "Transactions"
      case "workspace":
        return "Workspaces"
      case "individual":
        return "Individual Tasks"
    }
  }

  return {
    tasks,
    filteredTasks,
    pastDueTasks,
    statusFilter,
    setStatusFilter,
    roleFilters,
    setRoleFilters,
    nameSearch,
    setNameSearch,
    workspaceFilter,
    setWorkspaceFilter,
    taskTypeFilter,
    setTaskTypeFilter,
    toggleTaskCompletion,
    addTask,
    clearFilters,
    handleRoleFilterToggle,
    getRoleIcon,
    getRoleName,
    getStatusFilterName,
    getTaskTypeName,
    currentUserRole,
    currentUserName,
  }
}
