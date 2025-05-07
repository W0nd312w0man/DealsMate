"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, RefreshCw } from "lucide-react"
import { format, addMonths, addWeeks, addDays, subMonths, subWeeks, subDays } from "date-fns"

interface CalendarToolbarProps {
  view: "month" | "week" | "day"
  date: Date
  onViewChange: (view: "month" | "week" | "day") => void
  onDateChange: (date: Date) => void
  onAddEvent: () => void
  onOpenIntegrations: () => void
}

export function CalendarToolbar({
  view,
  date,
  onViewChange,
  onDateChange,
  onAddEvent,
  onOpenIntegrations,
}: CalendarToolbarProps) {
  const handlePrevious = () => {
    if (view === "month") {
      onDateChange(subMonths(date, 1))
    } else if (view === "week") {
      onDateChange(subWeeks(date, 1))
    } else {
      onDateChange(subDays(date, 1))
    }
  }

  const handleNext = () => {
    if (view === "month") {
      onDateChange(addMonths(date, 1))
    } else if (view === "week") {
      onDateChange(addWeeks(date, 1))
    } else {
      onDateChange(addDays(date, 1))
    }
  }

  const handleToday = () => {
    onDateChange(new Date())
  }

  const getDateLabel = () => {
    if (view === "month") {
      return format(date, "MMMM yyyy")
    } else if (view === "week") {
      const start = format(date, "MMM d")
      const end = format(addDays(date, 6), "MMM d, yyyy")
      return `${start} - ${end}`
    } else {
      return format(date, "EEEE, MMMM d, yyyy")
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2 mb-2 sm:mb-0">
        <Button variant="outline" size="sm" onClick={handleToday}>
          Today
        </Button>
        <Button variant="outline" size="icon" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">{getDateLabel()}</h2>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1 border-purple-200 text-purple-700 hover:bg-purple-50"
          onClick={onOpenIntegrations}
        >
          <RefreshCw className="h-4 w-4" />
          Sync
        </Button>
        <Button
          className="gap-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
          onClick={onAddEvent}
        >
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>
    </div>
  )
}
