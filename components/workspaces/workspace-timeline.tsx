"use client"

interface WorkspaceTimelineProps {
  workspaceId: string
}

export function WorkspaceTimeline({ workspaceId }: WorkspaceTimelineProps) {
  // Empty timeline events array
  const timelineEvents: any[] = []

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
      {timelineEvents.length > 0 ? (
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
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No Timeline Events</h3>
          <p className="mt-2 text-sm text-muted-foreground">There are no timeline events for this workspace yet.</p>
        </div>
      )}
    </div>
  )
}
