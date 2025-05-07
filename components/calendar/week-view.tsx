"use client"

import { useMemo } from "react"
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isToday, addHours } from "date-fns"
import { cn } from "@/lib/utils"

interface WeekViewProps {
  date: Date
  events: any[]
  onEventClick: (event: any) => void
  onDateClick: (date: Date) => void
}

export function WeekView({ date, events, onEventClick, onDateClick }: WeekViewProps) {
  // Generate days for the week view
  const days = useMemo(() => {
    const weekStart = startOfWeek(date)
    const weekEnd = endOfWeek(date)

    return eachDayOfInterval({ start: weekStart, end: weekEnd })
  }, [date])

  // Generate hours for the day
  const hours = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => i)
  }, [])

  // Group events by date and hour
  const eventsByDateAndHour = useMemo(() => {
    const grouped: Record<string, Record<number, any[]>> = {}

    days.forEach((day) => {
      const dateKey = format(day, "yyyy-MM-dd")
      grouped[dateKey] = {}

      hours.forEach((hour) => {
        grouped[dateKey][hour] = []
      })
    })

    events.forEach((event) => {
      const eventDate = new Date(event.date)
      const dateKey = format(eventDate, "yyyy-MM-dd")
      const hour = eventDate.getHours()

      if (grouped[dateKey] && grouped[dateKey][hour]) {
        grouped[dateKey][hour].push(event)
      }
    })

    return grouped
  }, [days, hours, events])

  return (
    <div className="p-4 overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-8 gap-px">
          {/* Time column */}
          <div className="border-r pr-2">
            <div className="h-10"></div> {/* Empty cell for header row */}
            {hours.map((hour) => (
              <div key={hour} className="h-20 text-xs text-right pr-2 pt-1">
                {format(addHours(new Date().setHours(0, 0, 0, 0), hour), "h a")}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd")

            return (
              <div key={dateKey} className="flex flex-col">
                {/* Day header */}
                <div
                  className={cn("text-center py-2 font-medium border-b", isToday(day) && "bg-purple-100")}
                  onClick={() => onDateClick(day)}
                >
                  <div>{format(day, "EEE")}</div>
                  <div
                    className={cn(
                      "text-sm",
                      isToday(day) &&
                        "bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto",
                    )}
                  >
                    {format(day, "d")}
                  </div>
                </div>

                {/* Hour cells */}
                {hours.map((hour) => {
                  const hourEvents = eventsByDateAndHour[dateKey][hour] || []

                  return (
                    <div
                      key={`${dateKey}-${hour}`}
                      className={cn(
                        "h-20 border-b border-r p-1",
                        hour >= 9 && hour < 17 ? "bg-white" : "bg-gray-50/50",
                      )}
                      onClick={() => {
                        const clickedDate = new Date(day)
                        clickedDate.setHours(hour)
                        onDateClick(clickedDate)
                      }}
                    >
                      <div className="space-y-1 overflow-y-auto max-h-[76px]">
                        {hourEvents.map((event, idx) => (
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
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
