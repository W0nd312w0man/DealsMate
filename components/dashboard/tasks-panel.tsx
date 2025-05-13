"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  X,
  BotIcon as Robot,
  User,
  Users,
  Briefcase,
  Building2,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { CreateTaskModal } from "./create-task-modal"
import type { TaskStatus } from "@/types/task"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTasks } from "@/hooks/use-tasks"

interface TasksPanelProps {
  className?: string
  filterPendingOnly?: boolean
  onFilterChange?: (filterPendingOnly: boolean) => void
}

export function TasksPanel({ className, filterPendingOnly = false, onFilterChange }: TasksPanelProps) {
  const [showNameSearch, setShowNameSearch] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const {
    filteredTasks,
    pastDueTasks,
    statusFilter,
    setStatusFilter,
    roleFilters,
    nameSearch,
    setNameSearch,
    toggleTaskCompletion,
    addTask,
    clearFilters,
    handleRoleFilterToggle,
    getRoleIcon,
    getRoleName,
    getStatusFilterName,
  } = useTasks({
    initialStatusFilter: filterPendingOnly ? "today" : "all",
    currentUserRole: "agent",
  })

  // Update filter when prop changes
  useEffect(() => {
    if (filterPendingOnly && statusFilter !== "today") {
      setStatusFilter("today")
    } else if (!filterPendingOnly && statusFilter === "today") {
      setStatusFilter("all")
    }
  }, [filterPendingOnly, statusFilter, setStatusFilter])

  const handleStatusFilterChange = (newFilter: TaskStatus | "all") => {
    setStatusFilter(newFilter)
    if (onFilterChange) {
      onFilterChange(newFilter === "today")
    }
  }

  const handleAddTask = (newTask: any) => {
    addTask(newTask)
  }

  return (
    <Card className={cn("shadow-soft card-hover overflow-hidden", className)}>
      <div className="h-1 w-full bg-gradient-to-r from-green-500 to-blue-500"></div>
      <CardHeader className="pb-2">
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
              onClick={() => setShowNameSearch(!showNameSearch)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-1"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  {getStatusFilterName(statusFilter)}
                  {roleFilters.length > 0 && (
                    <Badge variant="outline" className="ml-1 h-5 px-1">
                      {roleFilters.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[220px]">
                <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Status</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => handleStatusFilterChange("all")}
                    className={statusFilter === "all" ? "bg-purple-50 text-purple-700" : ""}
                  >
                    All Tasks
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusFilterChange("past-due")}
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
                    onClick={() => handleStatusFilterChange("today")}
                    className={statusFilter === "today" ? "bg-purple-50 text-purple-700" : ""}
                  >
                    Today
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusFilterChange("upcoming")}
                    className={statusFilter === "upcoming" ? "bg-purple-50 text-purple-700" : ""}
                  >
                    Upcoming
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusFilterChange("completed")}
                    className={statusFilter === "completed" ? "bg-purple-50 text-purple-700" : ""}
                  >
                    Completed
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Owner Role</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={roleFilters.includes("agent")}
                    onCheckedChange={() => handleRoleFilterToggle("agent")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Agent
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={roleFilters.includes("transaction-coordinator")}
                    onCheckedChange={() => handleRoleFilterToggle("transaction-coordinator")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Transaction Coordinator
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={roleFilters.includes("broker")}
                    onCheckedChange={() => handleRoleFilterToggle("broker")}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Broker/Compliance Manager
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={roleFilters.includes("manager")}
                    onCheckedChange={() => handleRoleFilterToggle("manager")}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Team Lead/Manager
                  </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {(statusFilter !== "all" || roleFilters.length > 0 || nameSearch) && (
                  <DropdownMenuItem onClick={clearFilters} className="text-pink-600">
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              className="gap-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Name Search */}
        {showNameSearch && (
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by task owner name..."
              className="w-full pl-8 pr-8 border-purple-200"
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
        )}

        {/* Active Filters Display */}
        {(statusFilter !== "all" || roleFilters.length > 0 || nameSearch) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {statusFilter !== "all" && (
              <Badge
                variant="outline"
                className="bg-purple-50/50 text-purple-700 border-purple-200 flex items-center gap-1"
              >
                {getStatusFilterName(statusFilter)}
                <button className="ml-1 hover:text-pink-600" onClick={() => handleStatusFilterChange("all")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {roleFilters.map((role) => (
              <Badge
                key={role}
                variant="outline"
                className="bg-purple-50/50 text-purple-700 border-purple-200 flex items-center gap-1"
              >
                {getRoleIcon(role)}
                {getRoleName(role)}
                <button className="ml-1 hover:text-pink-600" onClick={() => handleRoleFilterToggle(role)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

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

            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-pink-600 hover:text-pink-700 hover:bg-pink-50/50"
              onClick={clearFilters}
            >
              Clear All
            </Button>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-exp-purple/20 dark:scrollbar-thumb-exp-lavender/20">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                  task.completed
                    ? "bg-gray-50/50 border-gray-100"
                    : task.isPastDue
                      ? "border-pink-200 bg-pink-50/30 hover:bg-pink-50/50"
                      : "border-purple-100/50 hover:bg-purple-50/30",
                )}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "font-medium",
                      task.completed && "line-through text-muted-foreground",
                      task.isPastDue && !task.completed && "text-pink-800",
                    )}
                  >
                    {task.title}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {/* Due Date */}
                    <div
                      className={cn(
                        "flex items-center text-xs",
                        task.isPastDue ? "text-pink-700" : "text-muted-foreground",
                      )}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {task.dueDate}
                    </div>

                    {/* Priority */}
                    {task.priority === "high" && (
                      <Badge
                        className={cn(
                          task.isPastDue
                            ? "bg-pink-100 text-pink-800 hover:bg-pink-100"
                            : "bg-purple-100 text-purple-800 hover:bg-purple-100",
                        )}
                      >
                        High
                      </Badge>
                    )}
                    {task.priority === "medium" && (
                      <Badge variant="outline" className="border-amber-200 text-amber-700">
                        Medium
                      </Badge>
                    )}
                    {task.priority === "low" && (
                      <Badge variant="outline" className="border-green-200 text-green-700">
                        Low
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                    {/* Created By */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                              task.createdBy === "talos-ai" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800",
                            )}
                          >
                            {task.createdBy === "talos-ai" ? (
                              <>
                                <Robot className="h-3 w-3 mr-1" />
                                TALOS AI
                              </>
                            ) : (
                              <>
                                <User className="h-3 w-3 mr-1" />
                                Manual
                              </>
                            )}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {task.createdBy === "talos-ai"
                            ? "Automatically created by TALOS AI from email"
                            : "Manually created by user"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Owner Role */}
                    <span className="inline-flex items-center text-purple-600">
                      {getRoleIcon(task.ownerRole)}
                      {getRoleName(task.ownerRole)}
                    </span>

                    {/* Owner Name */}
                    <span className="text-muted-foreground">{task.ownerName}</span>
                  </div>

                  {/* Transaction or Workspace */}
                  {(task.transaction || task.workspaceId) && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {task.transaction && <>Transaction: {task.transactionAddress || task.transaction}</>}
                      {task.workspaceId && <>Workspace: {task.workspaceName || task.workspaceId}</>}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-muted-foreground">No tasks found</p>
              {(statusFilter !== "all" || roleFilters.length > 0 || nameSearch) && (
                <Button variant="link" className="mt-2 text-purple-600" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
        <CreateTaskModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} onTaskCreated={handleAddTask} />
      </CardContent>
    </Card>
  )
}
