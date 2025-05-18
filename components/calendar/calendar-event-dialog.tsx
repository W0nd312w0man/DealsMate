"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"

interface CalendarEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: any | null
  onSave: (eventData: any) => void
  onDelete: (eventId: string) => void
}

export function CalendarEventDialog({ open, onOpenChange, event, onSave, onDelete }: CalendarEventDialogProps) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")

  // Other state variables kept for compatibility
  const [type, setType] = useState<"event" | "task">("event")
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [allDay, setAllDay] = useState(false)
  const [notes, setNotes] = useState("")
  const [location, setLocation] = useState("")
  const [reminder, setReminder] = useState<string | null>("30")
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [clientName, setClientName] = useState<string | null>(null)
  const [syncToExternal, setSyncToExternal] = useState(true)

  // Reset form when dialog opens/closes or event changes
  useEffect(() => {
    if (open && event) {
      setTitle(event.title || "")
      setType(event.type || "event")

      // Format date as YYYY-MM-DD if available
      if (event.date) {
        const eventDate = new Date(event.date)
        setDate(eventDate.toISOString().split("T")[0])
      } else {
        setDate("")
      }

      setAddress(event.address || event.location || "")
      setDescription(event.description || event.notes || "")

      // Keep other fields for compatibility
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
      setTitle("New Event") // Default title since field is removed
      setDate(new Date().toISOString().split("T")[0]) // Today's date in YYYY-MM-DD
      setAddress("")
      setDescription("")

      // Reset other fields
      setType("event")
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
    // Create a proper date object from the date string, handling timezone correctly
    let eventDate: Date

    if (date) {
      // Split the date string into components
      const [year, month, day] = date.split("-").map((num) => Number.parseInt(num, 10))

      // Create date in local timezone (prevents UTC conversion issues)
      eventDate = new Date(year, month - 1, day)

      // Set time to noon to avoid any timezone boundary issues
      eventDate.setHours(12, 0, 0, 0)
    } else {
      eventDate = new Date()
    }

    // Calculate end date (1 hour after start)
    const eventEndDate = endDate || new Date(eventDate.getTime() + 60 * 60 * 1000)

    const eventData = {
      id: event?.id || `event-${Date.now()}`,
      title: description || "New Event", // Use description as the title
      type,
      date: eventDate,
      endDate: eventEndDate,
      address,
      location: address, // For compatibility
      description,
      notes: description, // For compatibility
      allDay,
      reminder,
      transactionId,
      clientName,
      syncToExternal,
    }

    console.log("Saving event with date:", eventDate)
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
          <DialogTitle>{event ? "Edit" : "Create"} Event</DialogTitle>
          <DialogDescription>Fill in the event details below.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Date (YYYY-MM-DD)</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Event location"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description"
              rows={3}
            />
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
            <Button onClick={handleSave}>{event ? "Update" : "Create"}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
