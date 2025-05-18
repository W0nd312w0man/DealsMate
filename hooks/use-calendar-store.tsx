"use client"

import { useState, useEffect } from "react"

// Define the filter interface
interface CalendarFilters {
  showTasks: boolean
  showEvents: boolean
  showExternalEvents: boolean
  transactionId: string | null
  clientName: string | null
}

// Default filters
const defaultFilters: CalendarFilters = {
  showTasks: true,
  showEvents: true,
  showExternalEvents: true,
  transactionId: null,
  clientName: null,
}

export function useCalendarStore() {
  // State for events, tasks, and external events - initialize with empty arrays
  const [events, setEvents] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [externalEvents, setExternalEvents] = useState<any[]>([])
  const [filters, setFilters] = useState<CalendarFilters>(defaultFilters)

  // Function to add a new event
  const addEvent = (eventData: any) => {
    console.log("Adding event:", eventData)
    if (eventData.type === "task") {
      setTasks((prevTasks) => [...prevTasks, eventData])
    } else {
      setEvents((prevEvents) => [...prevEvents, eventData])
    }

    // Save to sessionStorage for persistence
    try {
      const storageKey = eventData.type === "task" ? "calendar_tasks" : "calendar_events"
      const existingData = JSON.parse(sessionStorage.getItem(storageKey) || "[]")
      sessionStorage.setItem(storageKey, JSON.stringify([...existingData, eventData]))
    } catch (error) {
      console.error("Error saving event to sessionStorage:", error)
    }
  }

  // Function to update an existing event
  const updateEvent = (eventId: string, eventData: any) => {
    if (eventData.type === "task") {
      setTasks(tasks.map((task) => (task.id === eventId ? { ...task, ...eventData } : task)))
    } else {
      setEvents(events.map((event) => (event.id === eventId ? { ...event, ...eventData } : event)))
    }
  }

  // Function to delete an event
  const deleteEvent = (eventId: string) => {
    setTasks(tasks.filter((task) => task.id !== eventId))
    setEvents(events.filter((event) => event.id !== eventId))
  }

  // Load events from sessionStorage on initialization
  useEffect(() => {
    try {
      const storedEvents = JSON.parse(sessionStorage.getItem("calendar_events") || "[]")
      const storedTasks = JSON.parse(sessionStorage.getItem("calendar_tasks") || "[]")

      if (storedEvents.length > 0) {
        setEvents(storedEvents)
      }

      if (storedTasks.length > 0) {
        setTasks(storedTasks)
      }
    } catch (error) {
      console.error("Error loading events from sessionStorage:", error)
    }
  }, [])

  return {
    events,
    tasks,
    externalEvents,
    filters,
    setFilters,
    addEvent,
    updateEvent,
    deleteEvent,
  }
}
