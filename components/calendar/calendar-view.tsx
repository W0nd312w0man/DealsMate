"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarToolbar } from "@/components/calendar/calendar-toolbar"
import { MonthView } from "@/components/calendar/month-view"
import { WeekView } from "@/components/calendar/week-view"
import { DayView } from "@/components/calendar/day-view"
import { CalendarSidebar } from "@/components/calendar/calendar-sidebar"
import { CalendarEventDialog } from "@/components/calendar/calendar-event-dialog"
import { CalendarIntegrationDialog } from "@/components/calendar/calendar-integration-dialog"
import { useCalendarStore } from "@/hooks/use-calendar-store"

export function CalendarView() {
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [date, setDate] = useState<Date>(new Date())
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  const { events, tasks, externalEvents, filters, setFilters, addEvent, updateEvent, deleteEvent } = useCalendarStore()

  const handleDateChange = (newDate: Date) => {
    setDate(newDate)
  }

  const handleViewChange = (newView: "month" | "week" | "day") => {
    setView(newView)
  }

  const handleAddEvent = () => {
    setSelectedEvent(null)
    setShowEventDialog(true)
  }

  const handleEditEvent = (event: any) => {
    setSelectedEvent(event)
    setShowEventDialog(true)
  }

  const handleSaveEvent = (eventData: any) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, eventData)
    } else {
      addEvent(eventData)
    }
    setShowEventDialog(false)
  }

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId)
    setShowEventDialog(false)
  }

  const handleOpenIntegrations = () => {
    setShowIntegrationDialog(true)
  }

  // Combine all events based on filters
  const filteredEvents = [
    ...(filters.showTasks ? tasks : []),
    ...(filters.showEvents ? events : []),
    ...(filters.showExternalEvents ? externalEvents : []),
  ].filter((event) => {
    // Filter by transaction if selected
    if (filters.transactionId && event.transactionId !== filters.transactionId) {
      return false
    }

    // Filter by client if selected
    if (filters.clientName && event.clientName !== filters.clientName) {
      return false
    }

    return true
  })

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-3/4">
        <Card className="shadow-soft overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
          <CalendarToolbar
            view={view}
            date={date}
            onViewChange={handleViewChange}
            onDateChange={handleDateChange}
            onAddEvent={handleAddEvent}
            onOpenIntegrations={handleOpenIntegrations}
          />
          <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
            </TabsList>
            <TabsContent value="month">
              <MonthView
                date={date}
                events={filteredEvents}
                onEventClick={handleEditEvent}
                onDateClick={(date) => {
                  setDate(date)
                  setView("day")
                }}
              />
            </TabsContent>
            <TabsContent value="week">
              <WeekView
                date={date}
                events={filteredEvents}
                onEventClick={handleEditEvent}
                onDateClick={(date) => {
                  setDate(date)
                  setView("day")
                }}
              />
            </TabsContent>
            <TabsContent value="day">
              <DayView date={date} events={filteredEvents} onEventClick={handleEditEvent} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <div className="lg:w-1/4">
        <CalendarSidebar filters={filters} onFiltersChange={setFilters} onAddEvent={handleAddEvent} />
      </div>

      {/* Event Dialog */}
      <CalendarEventDialog
        open={showEventDialog}
        onOpenChange={setShowEventDialog}
        event={selectedEvent}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />

      {/* Integration Dialog */}
      <CalendarIntegrationDialog open={showIntegrationDialog} onOpenChange={setShowIntegrationDialog} />
    </div>
  )
}
