"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format, addHours } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface ScheduleEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (eventData: any) => void
  defaultValues?: {
    type?: "event" | "appointment" | "task"
    title?: string
    location?: string
    workspaceId?: string
    transactionId?: string
    clientName?: string
  }
}

export function ScheduleEventDialog({ open, onOpenChange, onSave, defaultValues = {} }: ScheduleEventDialogProps) {
  const [title, setTitle] = useState("")
  const [type, setType] = useState<"event" | "appointment" | "task">("event")
  const [date, setDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [allDay, setAllDay] = useState(false)
  const [notes, setNotes] = useState("")
  const [location, setLocation] = useState("")
  const [reminder, setReminder] = useState<string | null>("30")
  const [notifyBefore, setNotifyBefore] = useState<string>("same_day")
  const [customNotifyDays, setCustomNotifyDays] = useState<number>(1)
  const [customNotifyTime, setCustomNotifyTime] = useState<string>("09:00")
  const [syncToExternal, setSyncToExternal] = useState(true)

  // Reset form when dialog opens/closes or defaultValues changes
  useEffect(() => {
    if (open) {
      setTitle(defaultValues.title || "")
      setType(defaultValues.type || "event")
      setDate(new Date())
      setEndDate(addHours(new Date(), 1))
      setAllDay(false)
      setNotes("")
      setLocation(defaultValues.location || "")
      setReminder("30")
      setNotifyBefore("same_day")
      setCustomNotifyDays(1)
      setCustomNotifyTime("09:00")
      setSyncToExternal(true)
    }
  }, [open, defaultValues])

  const handleSave = () => {
    const eventData = {
      id: `event-${Date.now()}`,
      title,
      type,
      date,
      endDate,
      allDay,
      notes,
      location,
      reminder,
      notifyBefore,
      customNotifyDays: notifyBefore === "custom" ? customNotifyDays : null,
      customNotifyTime: notifyBefore === "custom" ? customNotifyTime : null,
      syncToExternal,
      workspaceId: defaultValues.workspaceId,
      transactionId: defaultValues.transactionId,
      clientName: defaultValues.clientName,
    }

    onSave(eventData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Schedule {type === "appointment" ? "Appointment" : type === "task" ? "Task" : "Event"}
          </DialogTitle>
          <DialogDescription>
            Add a new {type === "appointment" ? "appointment" : type === "task" ? "task" : "event"} to your calendar.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="event-type">Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => setType(value as "event" | "appointment" | "task")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="event" id="event-type-event" />
                <Label htmlFor="event-type-event">Event</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="appointment" id="event-type-appointment" />
                <Label htmlFor="event-type-appointment">Appointment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="task" id="event-type-task" />
                <Label htmlFor="event-type-task">Task</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === "appointment" ? "Appointment title" : type === "task" ? "Task title" : "Event title"
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Time</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox id="all-day" checked={allDay} onCheckedChange={(checked) => setAllDay(checked === true)} />
                  <Label htmlFor="all-day" className="text-sm">
                    All day
                  </Label>
                </div>
              </div>

              <div className="flex space-x-2">
                <Select
                  value={allDay ? "00:00" : format(date, "HH:mm")}
                  onValueChange={(value) => {
                    const [hours, minutes] = value.split(":").map(Number)
                    const newDate = new Date(date)
                    newDate.setHours(hours, minutes)
                    setDate(newDate)
                  }}
                  disabled={allDay}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }).map((_, hour) =>
                      Array.from({ length: 4 }).map((_, minuteIdx) => {
                        const minute = minuteIdx * 15
                        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
                        return (
                          <SelectItem key={timeString} value={timeString}>
                            {format(new Date().setHours(hour, minute), "h:mm a")}
                          </SelectItem>
                        )
                      }),
                    )}
                  </SelectContent>
                </Select>

                {type !== "task" && (
                  <Select
                    value={allDay || !endDate ? "00:00" : format(endDate, "HH:mm")}
                    onValueChange={(value) => {
                      const [hours, minutes] = value.split(":").map(Number)
                      const newEndDate = new Date(date)
                      newEndDate.setHours(hours, minutes)
                      setEndDate(newEndDate)
                    }}
                    disabled={allDay}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="End time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, hour) =>
                        Array.from({ length: 4 }).map((_, minuteIdx) => {
                          const minute = minuteIdx * 15
                          const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
                          return (
                            <SelectItem key={timeString} value={timeString}>
                              {format(new Date().setHours(hour, minute), "h:mm a")}
                            </SelectItem>
                          )
                        }),
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>

          {(type === "event" || type === "appointment") && (
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Event location (optional)"
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="reminder">Reminder</Label>
            <Select value={reminder || ""} onValueChange={(value) => setReminder(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="No reminder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No reminder</SelectItem>
                <SelectItem value="0">At time of event</SelectItem>
                <SelectItem value="5">5 minutes before</SelectItem>
                <SelectItem value="15">15 minutes before</SelectItem>
                <SelectItem value="30">30 minutes before</SelectItem>
                <SelectItem value="60">1 hour before</SelectItem>
                <SelectItem value="1440">1 day before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notify-before">Notification Timing</Label>
            <Select value={notifyBefore} onValueChange={(value) => setNotifyBefore(value)}>
              <SelectTrigger id="notify-before">
                <SelectValue placeholder="Select notification timing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="same_day">Same day (default)</SelectItem>
                <SelectItem value="day_before">Day before</SelectItem>
                <SelectItem value="two_days">Two days before</SelectItem>
                <SelectItem value="week_before">Week before</SelectItem>
                <SelectItem value="custom">Custom timing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {notifyBefore === "custom" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="custom-days">Days Before</Label>
                <Input
                  id="custom-days"
                  type="number"
                  min="0"
                  max="30"
                  value={customNotifyDays}
                  onChange={(e) => setCustomNotifyDays(Number.parseInt(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="custom-time">Time of Day</Label>
                <Select value={customNotifyTime} onValueChange={(value) => setCustomNotifyTime(value)}>
                  <SelectTrigger id="custom-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="18:00">6:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes (optional)"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sync-external"
              checked={syncToExternal}
              onCheckedChange={(checked) => setSyncToExternal(checked === true)}
            />
            <Label htmlFor="sync-external">Sync to external calendars</Label>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title}>
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
