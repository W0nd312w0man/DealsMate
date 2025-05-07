"use client"

import { useMemo } from "react"
import { format, addHours, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"

interface DayViewProps {
  date: Date
  events: any[]
  onEventClick: (event: any) => void
}

export function DayView({ date, events, onEventClick }: DayViewProps) {
  // Generate hours for the day
  const hours = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => i)
  }, [])

  // Filter events for the selected day
  const dayEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return isSameDay(eventDate, date)
    })
  }, [events, date])

  // Group events by hour
  const eventsByHour = useMemo(() => {
    const grouped: Record<number, any[]> = {}

    hours.forEach((hour) => {
      grouped[hour] = []
    })

    dayEvents.forEach((event) => {
      const eventDate = new Date(event.date)
      const hour = eventDate.getHours()

      if (grouped[hour]) {
        grouped[hour].push(event)
      }
    })

    return grouped
  }, [hours, dayEvents])

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-center">{format(date, "EEEE, MMMM d, yyyy")}</h2>

      <div className="grid grid-cols-1 gap-1">
        {hours.map((hour) => {
          const hourEvents = eventsByHour[hour] || []

          return (
            <div key={hour} className={cn("flex border-b p-2", hour >= 9 && hour < 17 ? "bg-white" : "bg-gray-50/50")}>
              <div className="w-16 text-right pr-4 font-medium">
                {format(addHours(new Date().setHours(0, 0, 0, 0), hour), "h a")}
              </div>

              <div className="flex-1">
                {hourEvents.length === 0 ? (
                  <div className="h-10 border border-dashed border-gray-200 rounded-md"></div>
                ) : (
                  <div className="space-y-2">
                    {hourEvents.map((event, idx) => (
                      <div
                        key={event.id || idx}
                        className={cn(
                          "p-2 rounded",
                          event.type === "task"
                            ? "bg-amber-100 text-amber-800"
                            : event.type === "event"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800",
                          event.transactionId && "border-l-2 border-pink-500",
                        )}
                        onClick={() => onEventClick(event)}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs mt-1">
                          {event.transactionId ? (
                            <span className="mr-2">Transaction: {event.transactionId}</span>
                          ) : event.clientName ? (
                            <span className="mr-2">Client: {event.clientName}</span>
                          ) : null}

                          {format(new Date(event.date), "h:mm a")}
                          {event.endDate && ` - ${format(new Date(event.endDate), "h:mm a")}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
