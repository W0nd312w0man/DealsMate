"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Filter,
  Search,
  X,
  CheckCircle2,
  AlertTriangle,
  User,
  Users,
  Building2,
  Briefcase,
  ChevronDown,
  FolderOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { CreateTaskModal } from "./create-task-modal"
import { TaskItem } from "./task-item"
import { TalosTaskCreator } from "@/components/talos/talos-task-creator"
import { Badge } from "@/components/ui/badge"
import { useTasks } from "@/hooks/use-tasks"

interface TasksCardProps {
  className?: string
}

export function TasksCard({ className }: TasksCardProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const {
    filteredTasks,
    pastDueTasks,
    statusFilter,
    setStatusFilter,
    roleFilters,
    nameSearch,
    setNameSearch,
    workspaceFilter,
    setWorkspaceFilter,
    toggleTaskCompletion,
    addTask,
    clearFilters,
    handleRoleFilterToggle,
    getRoleIcon,
    getRoleName,
    getStatusFilterName,
    currentUserRole,
    currentUserName,
  } = useTasks()

  return (
    <Card className={cn("shadow-md overflow-hidden", className)}>
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
      <CardHeader hasFilters className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-poppins text-purple-700">Tasks</CardTitle>
            <CardDescription>
              {pastDueTasks.length > 0 && (
                <span className="text-pink-600 font-medium">{pastDueTasks.length} past due • </span>
              )}
              {filteredTasks.filter((t) => !t.completed).length} pending tasks
            </CardDescription>
          </div>
          <Button
            size="sm"
            className="gap-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 mt-3">
          {/* Status Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-1"
              >
                <Filter className="h-4 w-4 mr-1" />
                {getStatusFilterName(statusFilter)}
                <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[180px]">
              <DropdownMenuLabel>Status Filter</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setStatusFilter("all")}
                className={statusFilter === "all" ? "bg-purple-50 text-purple-700" : ""}
              >
                All Tasks
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("past-due")}
                className={statusFilter === "past-due" ? "bg-pink-50 text-pink-700" : ""}
              >
                <AlertTriangle className={cn("h-3 w-3 mr-1", pastDueTasks.length > 0 && "text-pink-600")} />
                Past Due
                {pastDueTasks.length > 0 && (
                  <Badge variant="outline" className="ml-auto text-xs py-0 h-5 border-pink-200 text-pink-600">
                    {pastDueTasks.length}
                  </Badge>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("today")}
                className={statusFilter === "today" ? "bg-purple-50 text-purple-700" : ""}
              >
                Today
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("upcoming")}
                className={statusFilter === "upcoming" ? "bg-purple-50 text-purple-700" : ""}
              >
                Upcoming
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("completed")}
                className={statusFilter === "completed" ? "bg-purple-50 text-purple-700" : ""}
              >
                Completed
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
                {getRoleIcon(roleFilters)}
                {getRoleName(roleFilters)}
                <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[220px]">
              <DropdownMenuLabel>Owner Role Filter</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleRoleFilterToggle("all")}
                className={roleFilters === "all" ? "bg-purple-50 text-purple-700" : ""}
              >
                All Roles
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleFilterToggle("agent")}
                className={roleFilters === "agent" ? "bg-purple-50 text-purple-700" : ""}
              >
                <User className="h-4 w-4 mr-2" />
                Agent
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleFilterToggle("transaction-coordinator")}
                className={roleFilters === "transaction-coordinator" ? "bg-purple-50 text-purple-700" : ""}
              >
                <Users className="h-4 w-4 mr-2" />
                Transaction Coordinator
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleFilterToggle("broker")}
                className={roleFilters === "broker" ? "bg-purple-50 text-purple-700" : ""}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Broker/Compliance Manager
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleFilterToggle("manager")}
                className={roleFilters === "manager" ? "bg-purple-50 text-purple-700" : ""}
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Team Lead/Manager
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Workspace Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-1"
              >
                <FolderOpen className="h-4 w-4 mr-1" />
                {workspaceFilter === "all" ? "All Workspaces" : `Workspace ${workspaceFilter}`}
                <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[220px]">
              <DropdownMenuLabel>Workspace Filter</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setWorkspaceFilter("all")}
                className={workspaceFilter === "all" ? "bg-purple-50 text-purple-700" : ""}
              >
                All Workspaces
              </DropdownMenuItem>
              {/* This would typically be populated from your workspaces data */}
              <DropdownMenuItem
                onClick={() => setWorkspaceFilter("ws-1")}
                className={workspaceFilter === "ws-1" ? "bg-purple-50 text-purple-700" : ""}
              >
                Workspace: Karen Chen
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setWorkspaceFilter("ws-2")}
                className={workspaceFilter === "ws-2" ? "bg-purple-50 text-purple-700" : ""}
              >
                Workspace: Michael Johnson
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setWorkspaceFilter("ws-3")}
                className={workspaceFilter === "ws-3" ? "bg-purple-50 text-purple-700" : ""}
              >
                Workspace: Emily Brown
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
          {(statusFilter !== "all" || roleFilters !== currentUserRole || nameSearch || workspaceFilter !== "all") && (
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
      </CardHeader>

      <CardContent>
        {/* Active Filters Display */}
        {(statusFilter !== "all" || roleFilters !== currentUserRole || nameSearch || workspaceFilter !== "all") && (
          <div className="flex flex-wrap gap-2 mb-4">
            {statusFilter !== "all" && (
              <Badge
                variant="outline"
                className="bg-purple-50/50 text-purple-700 border-purple-200 flex items-center gap-1"
              >
                {getStatusFilterName(statusFilter)}
                <button className="ml-1 hover:text-pink-600" onClick={() => setStatusFilter("all")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {roleFilters !== currentUserRole && (
              <Badge
                variant="outline"
                className="bg-purple-50/50 text-purple-700 border-purple-200 flex items-center gap-1"
              >
                {getRoleIcon(roleFilters)}
                {getRoleName(roleFilters)}
                <button className="ml-1 hover:text-pink-600" onClick={() => handleRoleFilterToggle(currentUserRole)}>
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

            {workspaceFilter !== "all" && (
              <Badge
                variant="outline"
                className="bg-purple-50/50 text-purple-700 border-purple-200 flex items-center gap-1"
              >
                <FolderOpen className="h-3 w-3 mr-1" />
                Workspace {workspaceFilter}
                <button className="ml-1 hover:text-pink-600" onClick={() => setWorkspaceFilter("all")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Task List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-exp-purple/20 dark:scrollbar-thumb-exp-lavender/20">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggleCompletion={toggleTaskCompletion} />
            ))
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-muted-foreground">No tasks found</p>
              {(statusFilter !== "all" ||
                roleFilters !== currentUserRole ||
                nameSearch ||
                workspaceFilter !== "all") && (
                <Button variant="link" className="mt-2 text-purple-600" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Task Creation Modal */}
        <CreateTaskModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onTaskCreated={addTask}
          currentUserRole={currentUserRole}
          currentUserName={currentUserName}
        />

        {/* TALOS AI Task Creator - invisible component that creates tasks */}
        <TalosTaskCreator onTaskCreated={addTask} currentUserRole={currentUserRole} />
      </CardContent>
    </Card>
  )
}
