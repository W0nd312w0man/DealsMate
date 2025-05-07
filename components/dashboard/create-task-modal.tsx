"use client"

import { useState } from "react"
import { CalendarIcon, Check, X, User, Users, Building2, Briefcase } from "lucide-react"
import { format, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Task, TaskOwnerRole, TaskPriority } from "@/types/task"

interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreated: (task: Task) => void
  currentUserRole: TaskOwnerRole
  currentUserName: string
}

export function CreateTaskModal({
  open,
  onOpenChange,
  onTaskCreated,
  currentUserRole,
  currentUserName,
}: CreateTaskModalProps) {
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [details, setDetails] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [attachTo, setAttachTo] = useState("")
  const [attachToValue, setAttachToValue] = useState("")
  const [priority, setPriority] = useState<TaskPriority>("medium")
  const [ownerRole, setOwnerRole] = useState<TaskOwnerRole>(currentUserRole)
  const [ownerName, setOwnerName] = useState(currentUserName)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Mock data for transactions and workspaces
  const transactions = [
    { id: "tx-1", address: "123 Main St, Anytown, CA" },
    { id: "tx-2", address: "456 Oak Ave, Somewhere, CA" },
    { id: "tx-3", address: "789 Pine Rd, Elsewhere, CA" },
    { id: "tx-4", address: "15614 Yermo Street, Los Angeles, CA" },
    { id: "tx-5", address: "101 Cedar Lane, San Francisco, CA" },
  ]

  const workspaces = [
    { id: "ws-1", name: "Johnson Property Sale" },
    { id: "ws-2", name: "Chen Home Purchase" },
    { id: "ws-3", name: "Wilson Listing" },
    { id: "ws-4", name: "Brown Property Management" },
    { id: "ws-5", name: "Smith Renovation Project" },
  ]

  // Sample team members for owner name selection
  const teamMembers = [
    { name: "John Smith", role: "agent" },
    { name: "Sarah Williams", role: "transaction-coordinator" },
    { name: "David Wilson", role: "broker" },
    { name: "Lisa Johnson", role: "manager" },
    { name: "Michael Brown", role: "agent" },
    { name: "Jennifer Lopez", role: "broker" },
    { name: "Robert Davis", role: "agent" },
  ]

  const resetForm = () => {
    setTitle("")
    setDetails("")
    setDueDate(undefined)
    setShowDatePicker(false)
    setAttachTo("")
    setAttachToValue("")
    setPriority("medium")
    setOwnerRole(currentUserRole)
    setOwnerName(currentUserName)
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Task title is required"
    }

    if (!dueDate) {
      newErrors.dueDate = "Due date is required"
    }

    if (!attachTo) {
      newErrors.attachTo = "Please select where to attach this task"
    } else if (attachTo !== "individual" && !attachToValue) {
      newErrors.attachToValue = "Please select a specific item"
    }

    if (!ownerName) {
      newErrors.ownerName = "Task owner name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    // Create the new task object
    const newTask: Task = {
      id: `t-${Date.now()}`, // Generate a unique ID
      title,
      details,
      dueDate: dueDate ? format(dueDate, "MMM d, yyyy") : "",
      completed: false,
      priority,
      createdBy: "manual",
      ownerRole,
      ownerName,
      createdAt: new Date().toISOString(),
    }

    // Add attachment information
    if (attachTo === "transaction") {
      const transaction = transactions.find((t) => t.id === attachToValue)
      if (transaction) {
        Object.assign(newTask, {
          transaction: attachToValue,
          transactionAddress: transaction.address,
        })
      }
    } else if (attachTo === "workspace") {
      const workspace = workspaces.find((w) => w.id === attachToValue)
      if (workspace) {
        Object.assign(newTask, {
          workspaceId: attachToValue,
          workspaceName: workspace.name,
        })
      }
    }

    // Call the callback to add the task
    onTaskCreated(newTask)

    // Show success message
    toast({
      title: "Task Created Successfully",
      description: "Your new task has been added to your list.",
      variant: "default",
    })

    // Close the modal
    handleClose()
  }

  const handleSetToday = () => {
    setDueDate(new Date())
    setShowDatePicker(false)
  }

  const handleSetTomorrow = () => {
    setDueDate(addDays(new Date(), 1))
    setShowDatePicker(false)
  }

  const filteredTeamMembers = teamMembers.filter((member) => ownerRole === "all" || member.role === ownerRole)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background border-exp-purple/20 dark:border-exp-lavender/20 shadow-lg shadow-exp-purple/10 dark:shadow-exp-lavender/10">
        <DialogHeader>
          <DialogTitle className="text-xl text-exp-purple dark:text-exp-lavender">Create New Task</DialogTitle>
          <DialogDescription>Add a new task to your workflow. Fill out the details below.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid gap-2">
            <Label htmlFor="title" className={cn(errors.title && "text-destructive")}>
              Task Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className={cn(errors.title && "border-destructive")}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="details">Task Details</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter additional details (optional)"
              className="resize-none"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dueDate" className={cn(errors.dueDate && "text-destructive")}>
              Due Date <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSetToday}
                  className={cn(
                    "border-exp-purple/20 dark:border-exp-lavender/20",
                    dueDate &&
                      format(dueDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") &&
                      "bg-exp-purple/10 dark:bg-exp-lavender/10 border-exp-purple dark:border-exp-lavender",
                  )}
                >
                  Today
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSetTomorrow}
                  className={cn(
                    "border-exp-purple/20 dark:border-exp-lavender/20",
                    dueDate &&
                      format(dueDate, "yyyy-MM-dd") === format(addDays(new Date(), 1), "yyyy-MM-dd") &&
                      "bg-exp-purple/10 dark:bg-exp-lavender/10 border-exp-purple dark:border-exp-lavender",
                  )}
                >
                  Tomorrow
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className={cn(
                    "ml-auto border-exp-purple/20 dark:border-exp-lavender/20",
                    showDatePicker &&
                      "bg-exp-purple/10 dark:bg-exp-lavender/10 border-exp-purple dark:border-exp-lavender",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Other Date
                </Button>
              </div>

              {/* Inline calendar for direct date selection - only shows when Other Date is clicked */}
              {showDatePicker && (
                <div className="border rounded-md p-2 bg-background border-exp-purple/20 dark:border-exp-lavender/20 shadow-sm shadow-exp-purple/10 dark:shadow-exp-lavender/10 transition-all duration-200">
                  <CalendarComponent
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => {
                      setDueDate(date)
                      setShowDatePicker(false)
                    }}
                    className="mx-auto"
                  />
                </div>
              )}

              {dueDate && (
                <div className="text-sm font-medium text-center text-exp-purple dark:text-exp-lavender">
                  Selected: {format(dueDate, "MMMM d, yyyy")}
                </div>
              )}
            </div>
            {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <RadioGroup
              value={priority}
              onValueChange={(value) => setPriority(value as TaskPriority)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="priority-low" />
                <Label htmlFor="priority-low" className="text-green-600">
                  Low
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="priority-medium" />
                <Label htmlFor="priority-medium" className="text-amber-600">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="priority-high" />
                <Label htmlFor="priority-high" className="text-pink-600">
                  High
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ownerRole">Task Owner Role</Label>
            <Select value={ownerRole} onValueChange={(value) => setOwnerRole(value as TaskOwnerRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select owner role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Agent
                </SelectItem>
                <SelectItem value="transaction-coordinator" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Transaction Coordinator
                </SelectItem>
                <SelectItem value="broker" className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  Broker/Compliance Manager
                </SelectItem>
                <SelectItem value="manager" className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Team Lead/Manager
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ownerName" className={cn(errors.ownerName && "text-destructive")}>
              Task Owner Name <span className="text-destructive">*</span>
            </Label>
            <Select
              value={ownerName}
              onValueChange={setOwnerName}
              className={cn(errors.ownerName && "border-destructive")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select owner name" />
              </SelectTrigger>
              <SelectContent>
                {filteredTeamMembers.map((member) => (
                  <SelectItem key={member.name} value={member.name}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ownerName && <p className="text-xs text-destructive">{errors.ownerName}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="attachTo" className={cn(errors.attachTo && "text-destructive")}>
              Attach To <span className="text-destructive">*</span>
            </Label>
            <Select
              value={attachTo}
              onValueChange={(value) => {
                setAttachTo(value)
                setAttachToValue("")
              }}
            >
              <SelectTrigger className={cn(errors.attachTo && "border-destructive")}>
                <SelectValue placeholder="Select where to attach this task" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transaction">Existing Transaction</SelectItem>
                <SelectItem value="workspace">Existing Workspace</SelectItem>
                <SelectItem value="individual">Individual Task</SelectItem>
              </SelectContent>
            </Select>
            {errors.attachTo && <p className="text-xs text-destructive">{errors.attachTo}</p>}
          </div>

          {attachTo === "transaction" && (
            <div className="grid gap-2">
              <Label htmlFor="transactionId" className={cn(errors.attachToValue && "text-destructive")}>
                Select Transaction <span className="text-destructive">*</span>
              </Label>
              <Select value={attachToValue} onValueChange={setAttachToValue}>
                <SelectTrigger className={cn(errors.attachToValue && "border-destructive")}>
                  <SelectValue placeholder="Select a transaction" />
                </SelectTrigger>
                <SelectContent>
                  {transactions.map((transaction) => (
                    <SelectItem key={transaction.id} value={transaction.id}>
                      {transaction.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.attachToValue && <p className="text-xs text-destructive">{errors.attachToValue}</p>}
            </div>
          )}

          {attachTo === "workspace" && (
            <div className="grid gap-2">
              <Label htmlFor="workspaceId" className={cn(errors.attachToValue && "text-destructive")}>
                Select Workspace <span className="text-destructive">*</span>
              </Label>
              <Select value={attachToValue} onValueChange={setAttachToValue}>
                <SelectTrigger className={cn(errors.attachToValue && "border-destructive")}>
                  <SelectValue placeholder="Select a workspace" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.attachToValue && <p className="text-xs text-destructive">{errors.attachToValue}</p>}
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleClose} className="border-exp-purple/20 dark:border-exp-lavender/20">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-exp-purple to-exp-pink text-white">
            <Check className="mr-2 h-4 w-4" />
            Save Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
