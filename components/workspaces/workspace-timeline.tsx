"use client"

import { ArrowRight, CheckCircle2, Mail, Phone, UserCircle } from "lucide-react"

interface WorkspaceTimelineProps {
  workspaceId: string
}

export function WorkspaceTimeline({ workspaceId }: WorkspaceTimelineProps) {
  // Mock data for timeline events
  const timelineEvents = [
    {
      id: "event-1",
      type: "workspace_created",
      icon: UserCircle,
      title: "Workspace Created",
      description: "Karen Chen workspace was created",
      date: "Apr 20, 2025",
      time: "10:15 AM",
    },
    {
      id: "event-2",
      type: "email_received",
      icon: Mail,
      title: "Email Received",
      description: "Received initial inquiry about 15614 Yermo Street",
      date: "Apr 20, 2025",
      time: "10:00 AM",
    },
    {
      id: "event-3",
      type: "call_scheduled",
      icon: Phone,
      title: "Call Scheduled",
      description: "Initial consultation call scheduled",
      date: "Apr 23, 2025",
      time: "2:00 PM",
    },
    {
      id: "event-4",
      type: "call_completed",
      icon: Phone,
      title: "Call Completed",
      description: "Initial consultation call completed",
      date: "Apr 23, 2025",
      time: "2:45 PM",
    },
    {
      id: "event-5",
      type: "stage_changed",
      icon: ArrowRight,
      title: "Stage Changed",
      description: "Changed from Nurturing to Actively Searching",
      date: "Apr 23, 2025",
      time: "3:00 PM",
    },
    {
      id: "event-6",
      type: "task_created",
      icon: CheckCircle2,
      title: "Task Created",
      description: "Schedule property viewing",
      date: "Apr 24, 2025",
      time: "9:30 AM",
    },
    {
      id: "event-7",
      type: "email_sent",
      icon: Mail,
      title: "Email Sent",
      description: "Sent property listings",
      date: "Apr 24, 2025",
      time: "10:15 AM",
    },
    {
      id: "event-8",
      type: "email_received",
      icon: Mail,
      title: "Email Received",
      description: "Response about property listings",
      date: "Apr 25, 2025",
      time: "3:45 PM",
    },
  ]

  // Helper function to get icon color
  const getIconColor = (type: string) => {
    switch (type) {
      case "workspace_created":
        return "text-purple-600 bg-purple-100"
      case "email_received":
      case "email_sent":
        return "text-blue-600 bg-blue-100"
      case "call_scheduled":
      case "call_completed":
        return "text-green-600 bg-green-100"
      case "stage_changed":
        return "text-amber-600 bg-amber-100"
      case "task_created":
        return "text-pink-600 bg-pink-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Timeline events */}
        <div className="space-y-6">
          {timelineEvents.map((event) => (
            <div key={event.id} className="relative pl-10">
              {/* Timeline dot */}
              <div
                className={`absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full ${getIconColor(event.type)}`}
              >
                <event.icon className="h-4 w-4" />
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{event.title}</h3>
                  <div className="text-xs text-muted-foreground">
                    {event.date} at {event.time}
                  </div>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
