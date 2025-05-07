"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  ChevronDown,
  ChevronUp,
  BotIcon as Robot,
  User,
  Users,
  Building2,
  Briefcase,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task, TaskOwnerRole } from "@/types/task"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface TaskItemProps {
  task: Task
  onToggleCompletion: (id: string) => void
}

export function TaskItem({ task, onToggleCompletion }: TaskItemProps) {
  const [expanded, setExpanded] = useState(false)

  const getRoleIcon = (role: TaskOwnerRole) => {
    switch (role) {
      case "agent":
        return <User className="h-3 w-3 mr-1" />
      case "transaction-coordinator":
        return <Users className="h-3 w-3 mr-1" />
      case "broker":
        return <Building2 className="h-3 w-3 mr-1" />
      case "manager":
        return <Briefcase className="h-3 w-3 mr-1" />
      case "system-administrator":
        return <Robot className="h-3 w-3 mr-1" />
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

  const getPriorityColor = (priority: string, isPastDue: boolean | undefined) => {
    if (isPastDue) return "text-pink-700 bg-pink-50"

    switch (priority) {
      case "high":
        return "text-pink-700 bg-pink-50"
      case "medium":
        return "text-amber-700 bg-amber-50"
      case "low":
        return "text-green-700 bg-green-50"
      default:
        return "text-gray-700 bg-gray-50"
    }
  }

  return (
    <div
      className={cn(
        "rounded-lg border transition-all duration-200 ease-in-out overflow-hidden",
        task.completed
          ? "bg-gray-50/50 border-gray-100"
          : task.isPastDue
            ? "border-pink-200 bg-pink-50/30 hover:bg-pink-50/50"
            : "border-purple-100/50 hover:bg-purple-50/30",
      )}
    >
      {/* Collapsed View */}
      <div className="flex items-start gap-3 p-3">
        <Checkbox checked={task.completed} onCheckedChange={() => onToggleCompletion(task.id)} className="mt-1" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "font-medium text-sm truncate max-w-[calc(100%-24px)]",
                task.completed && "line-through text-muted-foreground",
                task.isPastDue && !task.completed && "text-pink-800",
              )}
            >
              {task.title}
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-1 text-muted-foreground hover:text-purple-600 transition-colors"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1 mt-1">
            {/* Due Date */}
            <div
              className={cn("flex items-center text-xs", task.isPastDue ? "text-pink-700" : "text-muted-foreground")}
            >
              <Clock className="h-3 w-3 mr-1" />
              {task.dueDate}
            </div>

            {/* Priority */}
            <Badge
              variant="outline"
              className={cn("text-xs font-normal border-0 ml-1", getPriorityColor(task.priority, task.isPastDue))}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-1 mt-1 text-xs">
            {/* Created By */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium",
                      task.createdBy === "talos-ai" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800",
                    )}
                  >
                    {task.createdBy === "talos-ai" ? (
                      <>
                        <Robot className="h-3 w-3 mr-0.5" />
                        TALOS
                      </>
                    ) : (
                      <>
                        <User className="h-3 w-3 mr-0.5" />
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
            <span className="inline-flex items-center text-purple-600 ml-1">
              {getRoleIcon(task.ownerRole)}
              {getRoleName(task.ownerRole)}
            </span>

            {/* Owner Name */}
            <span className="text-muted-foreground ml-1">{task.ownerName}</span>
          </div>
        </div>
      </div>

      {/* Expanded View */}
      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t border-dashed border-gray-200 mt-1">
          <div className="bg-white/50 rounded-md p-3 text-sm">
            <table className="w-full text-xs">
              <tbody>
                {task.details && (
                  <tr>
                    <td className="text-muted-foreground pr-2 py-1 align-top">Details:</td>
                    <td className="py-1">{task.details}</td>
                  </tr>
                )}
                <tr>
                  <td className="text-muted-foreground pr-2 py-1">Due Date:</td>
                  <td className="py-1">{task.dueDate}</td>
                </tr>
                <tr>
                  <td className="text-muted-foreground pr-2 py-1">Priority:</td>
                  <td className="py-1">
                    <Badge
                      variant="outline"
                      className={cn("text-xs font-normal border-0", getPriorityColor(task.priority, false))}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td className="text-muted-foreground pr-2 py-1">Created By:</td>
                  <td className="py-1">
                    {task.createdBy === "talos-ai" ? (
                      <span className="inline-flex items-center text-blue-700">
                        <Robot className="h-3 w-3 mr-1" />
                        TALOS AI
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-gray-700">
                        <User className="h-3 w-3 mr-1" />
                        Manual
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="text-muted-foreground pr-2 py-1">Owner:</td>
                  <td className="py-1">
                    <span className="inline-flex items-center">
                      {getRoleIcon(task.ownerRole)}
                      {getRoleName(task.ownerRole)} - {task.ownerName}
                    </span>
                  </td>
                </tr>
                {(task.transaction || task.workspaceId) && (
                  <tr>
                    <td className="text-muted-foreground pr-2 py-1">Linked To:</td>
                    <td className="py-1">
                      {task.transaction && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs text-purple-600 hover:text-purple-800 inline-flex items-center transition-colors"
                          asChild
                        >
                          <a
                            href={`/transactions/${task.transaction}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              // You could add analytics tracking here if needed
                            }}
                            title={`View transaction details for ${task.transactionAddress || task.transaction}`}
                          >
                            <span className="underline-offset-2 hover:underline">
                              Transaction: {task.transactionAddress || task.transaction}
                            </span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                      {task.workspaceId && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs text-purple-600 inline-flex items-center"
                          asChild
                        >
                          <a href={`/workspaces/${task.workspaceId}`}>
                            Workspace: {task.workspaceName || task.workspaceId}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
