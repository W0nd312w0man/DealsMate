"use client"

import { useState, useEffect } from "react"
import type { Goal } from "@/types/reports"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface GoalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal?: Goal
  onSave: (goal: Omit<Goal, "id"> | Goal) => void
}

export function GoalFormDialog({ open, onOpenChange, goal, onSave }: GoalFormDialogProps) {
  const [name, setName] = useState("")
  const [target, setTarget] = useState("")
  const [current, setCurrent] = useState("")
  const [unit, setUnit] = useState("USD")
  const [period, setPeriod] = useState<"monthly" | "quarterly" | "yearly">("yearly")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when dialog opens/closes or goal changes
  useEffect(() => {
    if (open && goal) {
      setName(goal.name)
      setTarget(goal.target.toString())
      setCurrent(goal.current.toString())
      setUnit(goal.unit)
      setPeriod(goal.period)
      setStartDate(new Date(goal.startDate))
      setEndDate(new Date(goal.endDate))
      setErrors({})
    } else if (open) {
      // Default values for new goal
      setName("")
      setTarget("")
      setCurrent("0")
      setUnit("USD")
      setPeriod("yearly")
      setStartDate(new Date())
      setErrors({})

      // Set default end date based on period
      const end = new Date()
      if (period === "monthly") {
        end.setMonth(end.getMonth() + 1)
      } else if (period === "quarterly") {
        end.setMonth(end.getMonth() + 3)
      } else {
        end.setFullYear(end.getFullYear() + 1)
      }
      setEndDate(end)
    }
  }, [open, goal, period])

  // Update end date when period changes
  useEffect(() => {
    if (startDate) {
      const end = new Date(startDate)
      if (period === "monthly") {
        end.setMonth(end.getMonth() + 1)
      } else if (period === "quarterly") {
        end.setMonth(end.getMonth() + 3)
      } else {
        end.setFullYear(end.getFullYear() + 1)
      }
      setEndDate(end)
    }
  }, [period, startDate])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = "Goal name is required"
    if (!target) newErrors.target = "Target value is required"
    else if (isNaN(Number(target)) || Number(target) <= 0) newErrors.target = "Target must be a positive number"

    if (current && (isNaN(Number(current)) || Number(current) < 0))
      newErrors.current = "Current value must be a non-negative number"

    if (!startDate) newErrors.startDate = "Start date is required"
    if (!endDate) newErrors.endDate = "End date is required"
    else if (startDate && endDate && startDate >= endDate) newErrors.endDate = "End date must be after start date"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const newGoal = {
      ...(goal ? { id: goal.id } : {}),
      name,
      target: Number.parseFloat(target),
      current: Number.parseFloat(current || "0"),
      unit,
      period,
      startDate: startDate!.toISOString(),
      endDate: endDate!.toISOString(),
    }

    onSave(newGoal as Goal)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
          <DialogDescription>
            {goal
              ? "Update your performance goal details below."
              : "Set a new performance goal to track your progress."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className={errors.name ? "text-red-500" : ""}>
              Goal Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Annual Income"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="target" className={errors.target ? "text-red-500" : ""}>
                Target Value
              </Label>
              <Input
                id="target"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                type="number"
                min="0"
                placeholder="e.g., 250000"
                className={errors.target ? "border-red-500" : ""}
              />
              {errors.target && <p className="text-xs text-red-500">{errors.target}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="current" className={errors.current ? "text-red-500" : ""}>
                Current Value
              </Label>
              <Input
                id="current"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                type="number"
                min="0"
                placeholder="e.g., 125000"
                className={errors.current ? "border-red-500" : ""}
              />
              {errors.current && <p className="text-xs text-red-500">{errors.current}</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="unit">Unit</Label>
            <RadioGroup
              id="unit"
              value={unit}
              onValueChange={setUnit as (value: string) => void}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="USD" id="unit-usd" />
                <Label htmlFor="unit-usd">USD ($)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="clients" id="unit-clients" />
                <Label htmlFor="unit-clients">Clients</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="listings" id="unit-listings" />
                <Label htmlFor="unit-listings">Listings</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="period">Time Period</Label>
            <RadioGroup
              id="period"
              value={period}
              onValueChange={setPeriod as (value: string) => void}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="period-monthly" />
                <Label htmlFor="period-monthly">Monthly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="quarterly" id="period-quarterly" />
                <Label htmlFor="period-quarterly">Quarterly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yearly" id="period-yearly" />
                <Label htmlFor="period-yearly">Yearly</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className={errors.startDate ? "text-red-500" : ""}>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                      errors.startDate && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
              {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
            </div>

            <div className="grid gap-2">
              <Label className={errors.endDate ? "text-red-500" : ""}>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                      errors.endDate && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{goal ? "Update Goal" : "Create Goal"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
