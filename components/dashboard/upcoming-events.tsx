"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Clock, MapPin, Users, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Event {
  id: string
  title: string
  date: string
  time: string
  location?: string
  type: "showing" | "meeting" | "closing" | "other"
  participants?: string[]
  workspaceId: string
  workspaceName: string
}

interface UpcomingEventsProps {
  className?: string
  filterTodayOnly?: boolean
  onFilterChange?: (filterTodayOnly: boolean) => void
}

export function UpcomingEvents({ className, filterTodayOnly = false, onFilterChange }: UpcomingEventsProps) {
  const [showTodayOnly, setShowTodayOnly] = useState(filterTodayOnly)

  // Update filter when prop changes
  useEffect(() => {
    setShowTodayOnly(filterTodayOnly)
  }, [filterTodayOnly])

  // Events array - to be populated from API
  const events: Event[] = []

  // Filter events based on today filter
  const filteredEvents = events.filter((event) => {
    if (showTodayOnly) {
      return event.date === "Today"
    }
    return true
  })

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "showing":
        return "bg-blue-100 text-blue-800"
      case "meeting":
        return "bg-purple-100 text-purple-800"
      case "closing":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const toggleTodayFilter = () => {
    const newValue = !showTodayOnly
    setShowTodayOnly(newValue)
    if (onFilterChange) {
      onFilterChange(newValue)
    }
  }

  return (
    <Card className={cn("shadow-soft card-hover overflow-hidden", className)}>
      <div className="h-1 w-full bg-gradient-to-r from-pink-500 to-orange-500"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-poppins text-purple-700">Upcoming Events</CardTitle>
            <CardDescription>{showTodayOnly ? "Showing today's events only" : "No events today"}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "border-purple-200 hover:bg-purple-50 hover:text-purple-700",
                showTodayOnly ? "bg-purple-100 text-purple-700" : "text-purple-700",
              )}
              onClick={toggleTodayFilter}
            >
              {showTodayOnly ? "Show All" : "Today Only"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="gap-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="p-3 rounded-lg border border-purple-100/50 hover:bg-purple-50/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link
                      href={`/workspaces/${event.workspaceId}`}
                      className="font-medium hover:text-purple-700 hover:underline transition-colors"
                    >
                      {event.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {event.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-purple-600 font-medium">{event.time.split(" - ")[0]}</div>
                </div>

                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                    {event.time}
                  </div>
                  {event.location && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      {event.location}
                    </div>
                  )}
                  {event.participants && event.participants.length > 0 && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                      {event.participants.join(", ")}
                    </div>
                  )}
                  <div className="text-xs text-purple-600">
                    <Link href={`/workspaces/${event.workspaceId}`} className="hover:underline">
                      {event.workspaceName}
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-muted-foreground">No events found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
