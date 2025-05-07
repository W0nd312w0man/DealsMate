import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, MessageSquare, CheckCircle, AlertCircle, Calendar } from "lucide-react"

interface TransactionTimelineProps {
  transactionId: string
}

// Mock data - in a real app, this would come from an API
const timelineEvents = [
  {
    id: 1,
    type: "document",
    icon: FileText,
    title: "Purchase Agreement uploaded",
    description: "Document has been approved by broker",
    date: "Mar 15, 2025",
    time: "10:23 AM",
    status: "Completed",
  },
  {
    id: 2,
    type: "message",
    icon: MessageSquare,
    title: "Broker comment",
    description: "Please upload the inspection contingency addendum",
    date: "Mar 16, 2025",
    time: "2:45 PM",
    status: "Action Required",
  },
  {
    id: 3,
    type: "document",
    icon: FileText,
    title: "Seller Disclosure uploaded",
    description: "Document is pending broker review",
    date: "Mar 16, 2025",
    time: "4:12 PM",
    status: "Pending",
  },
  {
    id: 4,
    type: "milestone",
    icon: CheckCircle,
    title: "Inspection period started",
    description: "Inspection to be completed by Mar 25",
    date: "Mar 17, 2025",
    time: "9:00 AM",
    status: "In Progress",
  },
  {
    id: 5,
    type: "deadline",
    icon: Calendar,
    title: "Earnest money due",
    description: "$15,000 to be deposited with escrow",
    date: "Mar 22, 2025",
    time: "5:00 PM",
    status: "Upcoming",
  },
  {
    id: 6,
    type: "deadline",
    icon: AlertCircle,
    title: "Inspection deadline",
    description: "All inspections must be completed",
    date: "Mar 25, 2025",
    time: "5:00 PM",
    status: "Upcoming",
  },
]

export function TransactionTimeline({ transactionId }: TransactionTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-8">
            {timelineEvents.map((event) => (
              <div key={event.id} className="relative grid gap-1 pl-10">
                <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                  <event.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-medium">{event.title}</div>
                  <Badge
                    variant={
                      event.status === "Completed"
                        ? "default"
                        : event.status === "Action Required"
                          ? "destructive"
                          : event.status === "Pending"
                            ? "outline"
                            : event.status === "In Progress"
                              ? "secondary"
                              : "outline"
                    }
                  >
                    {event.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">{event.description}</div>
                <div className="text-xs text-muted-foreground">
                  {event.date} at {event.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
