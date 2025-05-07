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
import { format } from "date-fns"
import { CalendarIcon, Trash2 } from "lucide-react"

interface CalendarEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: any | null
  onSave: (eventData: any) => void
  onDelete: (eventId: string) => void
}

export function CalendarEventDialog({ open, onOpenChange, event, onSave, onDelete }: CalendarEventDialogProps) {
  const [title, setTitle] = useState("")
  const [type, setType] = useState<"event" | "task">("event")
  const [date, setDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [allDay, setAllDay] = useState(false)
  const [notes, setNotes] = useState("")
  const [location, setLocation] = useState("")
  const [reminder, setReminder] = useState<string | null>("30")
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [clientName, setClientName] = useState<string | null>(null)
  const [syncToExternal, setSyncToExternal] = useState(true)

  // Mock data for transactions and clients
  const transactions = [
    { id: "TX-1234", address: "123 Main St" },
    { id: "TX-1235", address: "456 Oak Ave" },
    { id: "TX-1236", address: "789 Pine Rd" },
  ]

  const clients = [
    { id: "C-1001", name: "John Smith" },
    { id: "C-1002", name: "Sarah Johnson" },
    { id: "C-1003", name: "Michael Brown" },
  ]

  // Reset form when dialog opens/closes or event changes
  useEffect(() => {
    if (open && event) {
      setTitle(event.title || "")
      setType(event.type || "event")
      setDate(new Date(event.date) || new Date())
      setEndDate(event.endDate ? new Date(event.endDate) : null)
      setAllDay(event.allDay || false)
      setNotes(event.notes || "")
      setLocation(event.location || "")
      setReminder(event.reminder || "30")
      setTransactionId(event.transactionId || null)
      setClientName(event.clientName || null)
      setSyncToExternal(event.syncToExternal !== false)
    } else if (open) {
      // Default values for new event
      setTitle("")
      setType("event")
      setDate(new Date())
      setEndDate(null)
      setAllDay(false)
      setNotes("")
      setLocation("")
      setReminder("30")
      setTransactionId(null)
      setClientName(null)
      setSyncToExternal(true)
    }
  }, [open, event])

  const handleSave = () => {
    const eventData = {
      id: event?.id || `event-${Date.now()}`,
      title,
      type,
      date,
      endDate,
      allDay,
      notes,
      location,
      reminder,
      transactionId,
      clientName,
      syncToExternal,
    }

    onSave(eventData)
  }

  const handleDelete = () => {
    if (event?.id) {
      onDelete(event.id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {event ? "Edit" : "Create"} {type === "event" ? "Event" : "Task"}
          </DialogTitle>
          <DialogDescription>
            {event ? "Update the details of your event or task." : "Add a new event or task to your calendar."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="event-type">Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => setType(value as "event" | "task")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="event" id="event-type-event" />
                <Label htmlFor="event-type-event">Event</Label>
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
              placeholder={type === "event" ? "Event title" : "Task title"}
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

                {type === "event" && (
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

          {type === "event" && (
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
                <SelectItem value="">No reminder</SelectItem>
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
            <Label>Link to</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Select
                  value={transactionId || ""}
                  onValueChange={(value) => {
                    setTransactionId(value || null)
                    // Clear client name if transaction is selected
                    if (value) {
                      setClientName(null)
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Transaction (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Transaction</SelectItem>
                    {transactions.map((tx) => (
                      <SelectItem key={tx.id} value={tx.id}>
                        {tx.id} - {tx.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={clientName || "no-client"}
                  onValueChange={(value) => {
                    setClientName(value === "no-client" ? null : value)
                    // Clear transaction if client is selected
                    if (value) {
                      setTransactionId(null)
                    }
                  }}
                  disabled={!!transactionId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Client (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-client">No Client</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.name}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

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
          {event && (
            <Button
              variant="outline"
              className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title}>
              {event ? "Update" : "Create"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
