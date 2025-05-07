"use client"

import { create } from "zustand"

interface CalendarFilters {
  showTasks: boolean
  showEvents: boolean
  showExternalEvents: boolean
  transactionId: string | null
  clientName: string | null
}

interface CalendarEvent {
  id: string
  title: string
  type: "event" | "task"
  date: Date
  endDate?: Date | null
  allDay?: boolean
  notes?: string
  location?: string
  reminder?: string | null
  transactionId?: string | null
  clientName?: string | null
  syncToExternal?: boolean
}

interface CalendarStore {
  events: CalendarEvent[]
  tasks: CalendarEvent[]
  externalEvents: CalendarEvent[]
  filters: CalendarFilters
  setFilters: (filters: CalendarFilters) => void
  addEvent: (event: CalendarEvent) => void
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void
}

// Mock data for initial state
const mockEvents = [
  {
    id: "event-1",
    title: "Client Meeting",
    type: "event" as const,
    date: new Date(2025, 3, 15, 10, 0),
    endDate: new Date(2025, 3, 15, 11, 0),
    location: "Office",
    transactionId: "TX-1234",
  },
  {
    id: "event-2",
    title: "Property Showing",
    type: "event" as const,
    date: new Date(2025, 3, 16, 14, 0),
    endDate: new Date(2025, 3, 16, 15, 30),
    location: "123 Main St",
    transactionId: "TX-1235",
  },
]

const mockTasks = [
  {
    id: "task-1",
    title: "Submit Inspection Report",
    type: "task" as const,
    date: new Date(2025, 3, 17, 9, 0),
    transactionId: "TX-1234",
  },
  {
    id: "task-2",
    title: "Call Sarah Johnson",
    type: "task" as const,
    date: new Date(2025, 3, 15, 13, 0),
    clientName: "Sarah Johnson",
  },
]

const mockExternalEvents = [
  {
    id: "ext-1",
    title: "Team Meeting",
    type: "event" as const,
    date: new Date(2025, 3, 15, 15, 0),
    endDate: new Date(2025, 3, 15, 16, 0),
    location: "Conference Room",
  },
  {
    id: "ext-2",
    title: "Dentist Appointment",
    type: "event" as const,
    date: new Date(2025, 3, 18, 11, 0),
    endDate: new Date(2025, 3, 18, 12, 0),
    location: "Dental Office",
  },
]

export const useCalendarStore = create<CalendarStore>((set) => ({
  events: mockEvents,
  tasks: mockTasks,
  externalEvents: mockExternalEvents,
  filters: {
    showTasks: true,
    showEvents: true,
    showExternalEvents: true,
    transactionId: null,
    clientName: null,
  },
  setFilters: (filters) => set({ filters }),
  addEvent: (event) => {
    if (event.type === "task") {
      set((state) => ({ tasks: [...state.tasks, event] }))
    } else {
      set((state) => ({ events: [...state.events, event] }))
    }
  },
  updateEvent: (id, updatedEvent) => {
    set((state) => {
      // Check if it's in events
      const eventIndex = state.events.findIndex((e) => e.id === id)
      if (eventIndex !== -1) {
        const updatedEvents = [...state.events]
        updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], ...updatedEvent }
        return { events: updatedEvents }
      }

      // Check if it's in tasks
      const taskIndex = state.tasks.findIndex((t) => t.id === id)
      if (taskIndex !== -1) {
        const updatedTasks = [...state.tasks]
        updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], ...updatedEvent }
        return { tasks: updatedTasks }
      }

      // Check if it's in external events
      const externalIndex = state.externalEvents.findIndex((e) => e.id === id)
      if (externalIndex !== -1) {
        const updatedExternalEvents = [...state.externalEvents]
        updatedExternalEvents[externalIndex] = { ...updatedExternalEvents[externalIndex], ...updatedEvent }
        return { externalEvents: updatedExternalEvents }
      }

      return {}
    })
  },
  deleteEvent: (id) => {
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
      tasks: state.tasks.filter((t) => t.id !== id),
      externalEvents: state.externalEvents.filter((e) => e.id !== id),
    }))
  },
}))
