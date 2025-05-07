"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ChevronDown,
  ChevronUp,
  Clock,
  BotIcon as Robot,
  User,
  Users,
  Building2,
  Briefcase,
  ExternalLink,
  FolderOpen,
  LinkIcon,
  ArrowRightLeft,
  AlertTriangle,
  CalendarIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task, TaskOwnerRole } from "@/types/task"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, isBefore, isToday, addDays } from "date-fns"

interface TasksTableProps {
  tasks: Task[]
  onToggleCompletion: (id: string) => void
}

export function TasksTable({ tasks, onToggleCompletion }: TasksTableProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [convertDialogOpen, setConvertDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedLink, setSelectedLink] = useState("")
  const [extendTaskId, setExtendTaskId] = useState<string | null>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [pastDateWarningOpen, setPastDateWarningOpen] = useState(false)
  const [pendingPastDate, setPendingPastDate] = useState<Date | undefined>(undefined)
  const { toast } = useToast()

  const toggleExpand = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId)
  }

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
    if (isPastDue) return "text-pink-700 bg-pink-50 dark:bg-pink-900/20 dark:text-pink-400"

    switch (priority) {
      case "high":
        return "text-pink-700 bg-pink-50 dark:bg-pink-900/20 dark:text-pink-400"
      case "medium":
        return "text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400"
      case "low":
        return "text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "text-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getTaskType = (task: Task) => {
    if (task.transaction) return "Transaction"
    if (task.workspaceId) return "Workspace"
    return "Individual"
  }

  const getLinkedName = (task: Task) => {
    if (task.transaction) return task.transactionAddress || task.transaction
    if (task.workspaceId) return task.workspaceName || task.workspaceId
    return "N/A"
  }

  const handleLinkTask = (taskId: string) => {
    setSelectedTask(tasks.find((t) => t.id === taskId) || null)
    setLinkDialogOpen(true)
  }

  const handleConvertTask = (taskId: string) => {
    setSelectedTask(tasks.find((t) => t.id === taskId) || null)
    setConvertDialogOpen(true)
  }

  const confirmLinkTask = () => {
    toast({
      title: "Task Linked",
      description: `Task has been linked to ${selectedLink}`,
      variant: "default",
    })
    setLinkDialogOpen(false)
  }

  const confirmConvertTask = () => {
    toast({
      title: "Task Converted",
      description: "Workspace task has been converted to a transaction task",
      variant: "default",
    })
    setConvertDialogOpen(false)
  }

  const handleExtendTask = (taskId: string) => {
    setExtendTaskId(taskId)
    setCalendarOpen(true)
    // Initialize with current due date if possible, otherwise today
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      try {
        // Try to parse the due date if it's in a standard format
        if (task.dueDate.includes("Today")) {
          setSelectedDate(new Date())
        } else if (task.dueDate.includes("Tomorrow")) {
          setSelectedDate(addDays(new Date(), 1))
        } else {
          // Try to parse a date like "Apr 28, 2025"
          const dateMatch = task.dueDate.match(/([A-Za-z]+)\s+(\d+),\s+(\d+)/)
          if (dateMatch) {
            const [_, month, day, year] = dateMatch
            const dateStr = `${month} ${day} ${year}`
            setSelectedDate(new Date(dateStr))
          } else {
            setSelectedDate(new Date())
          }
        }
      } catch (e) {
        // If parsing fails, default to today
        setSelectedDate(new Date())
      }
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return // Prevent blank date selection

    // Check if date is in the past
    if (date && !isToday(date) && isBefore(date, new Date())) {
      setPendingPastDate(date)
      setPastDateWarningOpen(true)
      return
    }

    confirmDateExtension(date)
  }

  const confirmDateExtension = (date: Date) => {
    // Find the task and update its due date
    const taskIndex = tasks.findIndex((t) => t.id === extendTaskId)
    if (taskIndex >= 0) {
      // Format the date for display
      let formattedDate
      if (isToday(date)) {
        formattedDate = `Today, ${format(date, "h:mm a")}`
      } else if (isToday(addDays(date, -1))) {
        formattedDate = `Tomorrow, ${format(date, "h:mm a")}`
      } else {
        formattedDate = format(date, "MMM d, yyyy")
      }

      // In a real app, this would call an API to update the task
      // For this demo, we'll just show a success message
      toast({
        title: "Task Extended Successfully",
        description: `Due date updated to ${formattedDate}`,
        variant: "default",
      })

      // Close the calendar and reset state
      setCalendarOpen(false)
      setExtendTaskId(null)
      setSelectedDate(undefined)
      setPastDateWarningOpen(false)
      setPendingPastDate(undefined)
    }
  }

  const handlePastDateConfirm = () => {
    if (pendingPastDate) {
      confirmDateExtension(pendingPastDate)
    }
    setPastDateWarningOpen(false)
  }

  const handlePastDateCancel = () => {
    setPastDateWarningOpen(false)
    setPendingPastDate(undefined)
  }

  // Mock data for transactions and workspaces
  const transactions = [
    { id: "TX-1234", address: "15614 Yermo Street, Los Angeles, CA" },
    { id: "TX-1235", address: "456 Oak Ave, Somewhere, CA" },
    { id: "TX-1237", address: "101 Cedar Lane, San Francisco, CA" },
  ]

  const workspaces = [
    { id: "ws-1", name: "Karen Chen Property Purchase" },
    { id: "ws-2", name: "Johnson Property Sale" },
    { id: "ws-3", name: "Brown Listing" },
  ]

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-background/50">
        <div className="mx-auto w-16 h-16 rounded-full bg-exp-purple/10 dark:bg-exp-lavender/10 flex items-center justify-center mb-4">
          <Clock className="h-8 w-8 text-exp-purple dark:text-exp-lavender" />
        </div>
        <h3 className="text-lg font-medium text-exp-purple dark:text-exp-lavender mb-2">No tasks found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          There are no tasks matching your current filters. Try adjusting your filters or create a new task.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Task</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <>
                <TableRow key={task.id} className={cn(task.completed && "opacity-60")}>
                  <TableCell className="align-top pt-4">
                    <Checkbox checked={task.completed} onCheckedChange={() => onToggleCompletion(task.id)} />
                  </TableCell>
                  <TableCell>
                    {/* Line 1: Task Name Title */}
                    <div className="font-medium text-base mb-1.5">
                      <span className={cn(task.completed && "line-through text-muted-foreground")}>{task.title}</span>
                    </div>

                    {/* Line 2: Type — Priority — Due Date */}
                    <div className="flex items-center gap-3 mb-1.5 text-sm">
                      <Badge variant="outline" className="font-normal">
                        {getTaskType(task)}
                      </Badge>
                      <span className="text-muted-foreground">—</span>
                      <Badge
                        variant="outline"
                        className={cn("text-xs font-normal border-0", getPriorityColor(task.priority, task.isPastDue))}
                      >
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                      <span className="text-muted-foreground">—</span>

                      {/* Due Date with Extend Task Feature */}
                      <Popover
                        open={calendarOpen && extendTaskId === task.id}
                        onOpenChange={(open) => {
                          if (!open) {
                            setCalendarOpen(false)
                            setExtendTaskId(null)
                          }
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className={cn(task.isPastDue && !task.completed && "text-pink-600 dark:text-pink-400")}>
                            {task.dueDate}
                          </span>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 rounded-full hover:bg-muted hover:text-exp-purple dark:hover:text-exp-lavender"
                              onClick={() => handleExtendTask(task.id)}
                              title="Extend Task"
                            >
                              <CalendarIcon className="h-3.5 w-3.5" />
                            </Button>
                          </PopoverTrigger>
                        </div>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            initialFocus
                            className="rounded-md border"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Line 3: Linked Name */}
                    <div className="mb-1.5 text-sm">
                      <span className="text-muted-foreground mr-1">Linked to:</span>
                      {task.transaction ? (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs text-exp-purple dark:text-exp-lavender hover:text-exp-purple/80 dark:hover:text-exp-lavender/80 inline-flex items-center"
                          asChild
                        >
                          <a href={`/transactions/${task.transaction}`}>
                            <Building2 className="h-3 w-3 mr-1" />
                            {task.transactionAddress || task.transaction}
                          </a>
                        </Button>
                      ) : task.workspaceId ? (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs text-exp-purple dark:text-exp-lavender hover:text-exp-purple/80 dark:hover:text-exp-lavender/80 inline-flex items-center"
                          asChild
                        >
                          <a href={`/workspaces/${task.workspaceId}`}>
                            <FolderOpen className="h-3 w-3 mr-1" />
                            {task.workspaceName || task.workspaceId}
                          </a>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-xs">Individual Task</span>
                      )}
                    </div>

                    {/* Line 4: Created By (only if TALOS AI) */}
                    {task.createdBy === "talos-ai" && (
                      <div className="mb-1.5 text-xs">
                        <span className="inline-flex items-center text-blue-700 dark:text-blue-400">
                          <Robot className="h-3 w-3 mr-1" />
                          Created by TALOS AI
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right align-top pt-4">
                    <div className="flex items-center justify-end space-x-1">
                      {/* Expand button - always shown */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-exp-purple dark:hover:text-exp-lavender"
                        onClick={() => toggleExpand(task.id)}
                        title={expandedTaskId === task.id ? "Collapse" : "Expand"}
                      >
                        {expandedTaskId === task.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>

                      {/* Link button - only for Individual Tasks */}
                      {!task.transaction && !task.workspaceId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-exp-purple dark:hover:text-exp-lavender"
                          onClick={() => handleLinkTask(task.id)}
                          title="Link to Transaction or Workspace"
                        >
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Convert button - only for Workspace Tasks */}
                      {task.workspaceId && !task.transaction && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-exp-purple dark:hover:text-exp-lavender"
                          onClick={() => handleConvertTask(task.id)}
                          title="Convert to Transaction Task"
                        >
                          <ArrowRightLeft className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                {expandedTaskId === task.id && (
                  <TableRow className="bg-muted/30">
                    <TableCell colSpan={3} className="p-4">
                      <div className="bg-background rounded-md p-4 text-sm">
                        <h4 className="font-medium mb-2">{task.title}</h4>
                        {task.details && <p className="text-muted-foreground mb-4">{task.details}</p>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-xs font-medium text-muted-foreground mb-2">Task Details</h5>
                            <div className="space-y-2">
                              <div className="flex items-start">
                                <span className="text-muted-foreground w-24 text-xs">Due Date:</span>
                                <div className="flex items-center">
                                  <span className={cn("text-xs", task.isPastDue && "text-pink-600 dark:text-pink-400")}>
                                    {task.dueDate}
                                  </span>

                                  {/* Extend Task Button in expanded view */}
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 ml-2 text-xs text-exp-purple dark:text-exp-lavender hover:text-exp-purple/80 dark:hover:text-exp-lavender/80 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:scale-x-100 after:bg-exp-purple dark:after:bg-exp-lavender after:transition-transform"
                                    onClick={() => handleExtendTask(task.id)}
                                  >
                                    Extend Task
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <span className="text-muted-foreground w-24 text-xs">Priority:</span>
                                <Badge
                                  variant="outline"
                                  className={cn("text-xs font-normal border-0", getPriorityColor(task.priority, false))}
                                >
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </Badge>
                              </div>
                              <div className="flex items-start">
                                <span className="text-muted-foreground w-24 text-xs">Created By:</span>
                                <span className="text-xs flex items-center">
                                  {task.createdBy === "talos-ai" ? (
                                    <span className="inline-flex items-center text-blue-700 dark:text-blue-400">
                                      <Robot className="h-3 w-3 mr-1" />
                                      TALOS AI
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center">
                                      <User className="h-3 w-3 mr-1" />
                                      Manual
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="text-xs font-medium text-muted-foreground mb-2">Assignment</h5>
                            <div className="space-y-2">
                              <div className="flex items-start">
                                <span className="text-muted-foreground w-24 text-xs">Owner Role:</span>
                                <span className="text-xs flex items-center">
                                  {getRoleIcon(task.ownerRole)}
                                  {getRoleName(task.ownerRole)}
                                </span>
                              </div>
                              <div className="flex items-start">
                                <span className="text-muted-foreground w-24 text-xs">Owner Name:</span>
                                <span className="text-xs">{task.ownerName}</span>
                              </div>
                              <div className="flex items-start">
                                <span className="text-muted-foreground w-24 text-xs">Linked To:</span>
                                <span className="text-xs">
                                  {task.transaction ? (
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="h-auto p-0 text-xs text-exp-purple dark:text-exp-lavender hover:text-exp-purple/80 dark:hover:text-exp-lavender/80 inline-flex items-center"
                                      asChild
                                    >
                                      <a href={`/transactions/${task.transaction}`}>
                                        <Building2 className="h-3 w-3 mr-1" />
                                        {task.transactionAddress || task.transaction}
                                        <ExternalLink className="h-3 w-3 ml-1" />
                                      </a>
                                    </Button>
                                  ) : task.workspaceId ? (
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="h-auto p-0 text-xs text-exp-purple dark:text-exp-lavender hover:text-exp-purple/80 dark:hover:text-exp-lavender/80 inline-flex items-center"
                                      asChild
                                    >
                                      <a href={`/workspaces/${task.workspaceId}`}>
                                        <FolderOpen className="h-3 w-3 mr-1" />
                                        {task.workspaceName || task.workspaceId}
                                        <ExternalLink className="h-3 w-3 ml-1" />
                                      </a>
                                    </Button>
                                  ) : (
                                    <span className="text-muted-foreground">Individual Task</span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Link Task Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Link Task</DialogTitle>
            <DialogDescription>Link this task to a transaction or workspace.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link-type" className="text-right">
                Link Type
              </Label>
              <Select onValueChange={(value) => setSelectedLink(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select link type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transaction">Transaction</SelectItem>
                  <SelectItem value="workspace">Workspace</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedLink === "transaction" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transaction" className="text-right">
                  Transaction
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select transaction" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactions.map((tx) => (
                      <SelectItem key={tx.id} value={tx.id}>
                        {tx.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {selectedLink === "workspace" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="workspace" className="text-right">
                  Workspace
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select workspace" />
                  </SelectTrigger>
                  <SelectContent>
                    {workspaces.map((ws) => (
                      <SelectItem key={ws.id} value={ws.id}>
                        {ws.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmLinkTask} disabled={!selectedLink}>
              Link Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert Task Dialog */}
      <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Convert to Transaction Task</DialogTitle>
            <DialogDescription>Convert this workspace task to a transaction task.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transaction" className="text-right">
                Transaction
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select transaction" />
                </SelectTrigger>
                <SelectContent>
                  {transactions.map((tx) => (
                    <SelectItem key={tx.id} value={tx.id}>
                      {tx.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmConvertTask}>Convert Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Past Date Warning Dialog */}
      <Dialog open={pastDateWarningOpen} onOpenChange={setPastDateWarningOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Past Date Selected
            </DialogTitle>
            <DialogDescription>
              You've selected a date in the past. Are you sure you want to set the due date to a past date?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handlePastDateCancel}>
              Cancel
            </Button>
            <Button
              onClick={handlePastDateConfirm}
              className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
            >
              Confirm Past Date
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
