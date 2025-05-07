"use client"

import { useMemo } from "react"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
} from "date-fns"
import { cn } from "@/lib/utils"

interface MonthViewProps {
  date: Date
  events: any[]
  onEventClick: (event: any) => void
  onDateClick: (date: Date) => void
}

export function MonthView({ date, events, onEventClick, onDateClick }: MonthViewProps) {
  // Generate days for the month view
  const days = useMemo(() => {
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [date])

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, any[]> = {}

    events.forEach((event) => {
      const dateKey = format(new Date(event.date), "yyyy-MM-dd")
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(event)
    })

    return grouped
  }, [events])

  return (
    <div className="p-4">
      <div className="grid grid-cols-7 gap-px">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium py-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd")
          const dayEvents = eventsByDate[dateKey] || []
          const isCurrentMonth = isSameMonth(day, date)

          return (
            <div
              key={dateKey}
              className={cn(
                "min-h-[100px] border p-1",
                isCurrentMonth ? "bg-white" : "bg-gray-50",
                isToday(day) && "bg-purple-50",
                "hover:bg-purple-50/50 cursor-pointer transition-colors",
              )}
              onClick={() => onDateClick(day)}
            >
              <div className="flex justify-between items-center mb-1">
                <span
                  className={cn(
                    "text-sm font-medium",
                    !isCurrentMonth && "text-gray-400",
                    isToday(day) && "bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center",
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>

              <div className="space-y-1 overflow-y-auto max-h-[80px]">
                {dayEvents.slice(0, 3).map((event, idx) => (
                  <div
                    key={event.id || idx}
                    className={cn(
                      "text-xs p-1 rounded truncate",
                      event.type === "task"
                        ? "bg-amber-100 text-amber-800"
                        : event.type === "event"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800",
                      event.transactionId && "border-l-2 border-pink-500",
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                  >
                    {event.title}
                  </div>
                ))}

                {dayEvents.length > 3 && (
                  <div className="text-xs text-center text-muted-foreground">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
