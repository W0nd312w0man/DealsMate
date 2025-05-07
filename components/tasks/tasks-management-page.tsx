"use client"

import { useState } from "react"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PageNavigation } from "@/components/page-navigation"
import { TasksTable } from "@/components/tasks/tasks-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TaskLinkDialog } from "@/components/tasks/task-link-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, X, User, Users, Building2, Briefcase, FolderOpen, FileText } from "lucide-react"
import { CreateTaskModal } from "@/components/dashboard/create-task-modal"
import { TalosTaskCreator } from "@/components/talos/talos-task-creator"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Task, TaskOwnerRole, TaskStatus } from "@/types/task"

export function TasksManagementPage() {
  // Mock current user data - in a real app, this would come from auth context
  const currentUserRole: TaskOwnerRole = "agent"
  const currentUserName = "John Smith"

  const [activeTab, setActiveTab] = useState("all")
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all")
  const [roleFilter, setRoleFilter] = useState<TaskOwnerRole | "all">(currentUserRole)
  const [nameSearch, setNameSearch] = useState("")
  const [workspaceFilter, setWorkspaceFilter] = useState<string | "all">("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>(getMockTasks())
  const [taskTypeFilter, setTaskTypeFilter] = useState<"all" | "transaction" | "workspace" | "individual">("all")
  const [open, setOpen] = useState(false)

  // Filter tasks based on selected filters and active tab
  const filteredTasks = tasks.filter((task) => {
    // Filter by tab
    if (activeTab === "today" && !task.dueDate.includes("Today")) return false
    if (activeTab === "overdue" && !task.isPastDue) return false
    if (activeTab === "upcoming" && (task.dueDate.includes("Today") || task.isPastDue)) return false
    // "all" tab shows all tasks, so no filtering needed for that case

    // Filter by status
    if (statusFilter !== "all") {
      if (statusFilter === "past-due" && !task.isPastDue) return false
      if (statusFilter === "today" && !task.dueDate.includes("Today")) return false
      if (statusFilter === "upcoming" && (task.dueDate.includes("Today") || task.isPastDue)) return false
      if (statusFilter === "completed" && !task.completed) return false
    }

    // Filter by role
    if (roleFilter !== "all" && task.ownerRole !== roleFilter) {
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

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const handleAddTask = (newTask: Task) => {
    setTasks([newTask, ...tasks])
  }

  const clearFilters = () => {
    setStatusFilter("all")
    setRoleFilter(currentUserRole)
    setNameSearch("")
    setWorkspaceFilter("all")
    setTaskTypeFilter("all")
  }

  const getRoleIcon = (role: TaskOwnerRole | "all") => {
    if (role === "all") return null

    switch (role) {
      case "agent":
        return <User className="h-4 w-4 mr-2" />
      case "transaction-coordinator":
        return <Users className="h-4 w-4 mr-2" />
      case "broker":
        return <Building2 className="h-4 w-4 mr-2" />
      case "manager":
        return <Briefcase className="h-4 w-4 mr-2" />
    }
  }

  const getRoleName = (role: TaskOwnerRole | "all") => {
    if (role === "all") return "All Roles"

    switch (role) {
      case "agent":
        return "Agent"
      case "transaction-coordinator":
        return "Transaction Coordinator"
      case "broker":
        return "Broker/Compliance Manager"
      case "manager":
        return "Team Lead/Manager"
    }
  }

  const getStatusName = (status: TaskStatus | "all") => {
    switch (status) {
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

  return (
    <div className="container space-y-6 py-8">
      <BreadcrumbNav />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-muted-foreground">Manage and track all your tasks across transactions</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <Plus className="mr-2 h-4 w-4" /> Create Task
        </Button>
      </div>

      <div className="shadow-soft overflow-hidden rounded-lg border">
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
        <div className="p-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>

            {/* Filters Section */}
            <div className="flex flex-wrap gap-2 mb-6">
              {/* Task Type Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-1"
                  >
                    <FolderOpen className="h-4 w-4 mr-1" />
                    {getTaskTypeName(taskTypeFilter)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[180px]">
                  <DropdownMenuLabel>Task Type Filter</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setTaskTypeFilter("all")}
                    className={taskTypeFilter === "all" ? "bg-purple-50 text-purple-700" : ""}
                  >
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTaskTypeFilter("transaction")}
                    className={taskTypeFilter === "transaction" ? "bg-purple-50 text-purple-700" : ""}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Transactions
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTaskTypeFilter("workspace")}
                    className={taskTypeFilter === "workspace" ? "bg-purple-50 text-purple-700" : ""}
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Workspaces
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTaskTypeFilter("individual")}
                    className={taskTypeFilter === "individual" ? "bg-purple-50 text-purple-700" : ""}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Individual Tasks
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Role Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-1"
                  >
                    {getRoleIcon(roleFilter)}
                    {getRoleName(roleFilter)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[220px]">
                  <DropdownMenuLabel>Owner Role Filter</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setRoleFilter("all")}
                    className={roleFilter === "all" ? "bg-purple-50 text-purple-700" : ""}
                  >
                    All Roles
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setRoleFilter("agent")}
                    className={roleFilter === "agent" ? "bg-purple-50 text-purple-700" : ""}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Agent
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setRoleFilter("transaction-coordinator")}
                    className={roleFilter === "transaction-coordinator" ? "bg-purple-50 text-purple-700" : ""}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Transaction Coordinator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setRoleFilter("broker")}
                    className={roleFilter === "broker" ? "bg-purple-50 text-purple-700" : ""}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Broker/Compliance Manager
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setRoleFilter("manager")}
                    className={roleFilter === "manager" ? "bg-purple-50 text-purple-700" : ""}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Team Lead/Manager
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Name Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by task owner name..."
                  className="w-full pl-8 pr-8 h-9 border-purple-200 text-sm"
                  value={nameSearch}
                  onChange={(e) => setNameSearch(e.target.value)}
                />
                {nameSearch && (
                  <button
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-purple-700"
                    onClick={() => setNameSearch("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Clear Filters Button - only show if filters are applied */}
              {(statusFilter !== "all" ||
                roleFilter !== currentUserRole ||
                nameSearch ||
                workspaceFilter !== "all" ||
                taskTypeFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-pink-600 hover:text-pink-700 hover:bg-pink-50/50"
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {(statusFilter !== "all" ||
              roleFilter !== currentUserRole ||
              nameSearch ||
              workspaceFilter !== "all" ||
              taskTypeFilter !== "all") && (
              <div className="flex flex-wrap gap-2 mb-4">
                {statusFilter !== "all" && (
                  <Badge
                    variant="outline"
                    className="bg-purple-50/50 text-purple-700 border-purple-200 flex items-center gap-1"
                  >
                    {getStatusName(statusFilter)}
                    <button className="ml-1 hover:text-pink-600" onClick={() => setStatusFilter("all")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {taskTypeFilter !== "all" && (
                  <Badge
                    variant="outline"
                    className="bg-purple-50/50 text-purple-700 border-purple-200 flex items-center gap-1"
                  >
                    {taskTypeFilter === "transaction" && <Building2 className="h-3 w-3 mr-1" />}
                    {taskTypeFilter === "workspace" && <FolderOpen className="h-3 w-3 mr-1" />}
                    {taskTypeFilter === "individual" && <FileText className="h-3 w-3 mr-1" />}
                    {getTaskTypeName(taskTypeFilter)}
                    <button className="ml-1 hover:text-pink-600" onClick={() => setTaskTypeFilter("all")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {roleFilter !== currentUserRole && (
                  <Badge
                    variant="outline"
                    className="bg-purple-50/50 text-purple-700 border-purple-200 flex items-center gap-1"
                  >
                    {getRoleIcon(roleFilter)}
                    {getRoleName(roleFilter)}
                    <button className="ml-1 hover:text-pink-600" onClick={() => setRoleFilter(currentUserRole)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {nameSearch && (
                  <Badge
                    variant="outline"
                    className="bg-purple-50/50 text-purple-700 border-purple-200 flex items-center gap-1"
                  >
                    <User className="h-3 w-3 mr-1" />
                    {nameSearch}
                    <button className="ml-1 hover:text-pink-600" onClick={() => setNameSearch("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Tab Content */}
            <TabsContent value="all" className="mt-0">
              <TasksTable tasks={filteredTasks} onToggleCompletion={toggleTaskCompletion} />
            </TabsContent>
            <TabsContent value="overdue" className="mt-0">
              <TasksTable tasks={filteredTasks} onToggleCompletion={toggleTaskCompletion} />
            </TabsContent>
            <TabsContent value="today" className="mt-0">
              <TasksTable tasks={filteredTasks} onToggleCompletion={toggleTaskCompletion} />
            </TabsContent>
            <TabsContent value="upcoming" className="mt-0">
              <TasksTable tasks={filteredTasks} onToggleCompletion={toggleTaskCompletion} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <TaskLinkDialog open={open} onOpenChange={setOpen} />

      <PageNavigation
        prevPage={{ url: "/dashboard", label: "Dashboard" }}
        nextPage={{ url: "/transactions", label: "Transactions" }}
      />

      {/* Task Creation Modal */}
      <CreateTaskModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onTaskCreated={handleAddTask}
        currentUserRole={currentUserRole}
        currentUserName={currentUserName}
      />

      {/* TALOS AI Task Creator - invisible component that creates tasks */}
      <TalosTaskCreator onTaskCreated={handleAddTask} currentUserRole={currentUserRole} />
    </div>
  )
}

// Mock data function
function getMockTasks(): Task[] {
  return [
    {
      id: "t1",
      title: "Review purchase agreement for Karen Chen",
      dueDate: "Today, 2:00 PM",
      completed: false,
      priority: "high",
      transaction: "TX-1234",
      transactionAddress: "15614 Yermo Street, Los Angeles, CA",
      client: "Karen Chen",
      workspaceId: "ws-1",
      workspaceName: "Karen Chen Property Purchase",
      isPastDue: false,
      createdBy: "manual",
      ownerRole: "agent",
      ownerName: "John Smith",
      createdAt: new Date().toISOString(),
    },
    {
      id: "t2",
      title: "Schedule home inspection for 456 Oak Avenue",
      dueDate: "Today, 5:00 PM",
      completed: false,
      priority: "high",
      transaction: "TX-1235",
      transactionAddress: "456 Oak Avenue, San Diego, CA",
      client: "Michael Johnson",
      workspaceId: "ws-2",
      workspaceName: "Johnson Property Sale",
      isPastDue: false,
      createdBy: "talos-ai",
      ownerRole: "transaction-coordinator",
      ownerName: "Sarah Williams",
      createdAt: new Date().toISOString(),
    },
    // Additional tasks omitted for brevity
  ]
}
