import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Mail, Phone, MessageSquare, Send } from "lucide-react"
import { format } from "date-fns"

interface ContactCommunicationProps {
  contactId: string
}

export function ContactCommunication({ contactId }: ContactCommunicationProps) {
  // Mock data - in a real app, this would come from an API
  const messages = [
    {
      id: 1,
      sender: "John Smith",
      senderType: "client",
      content: "Hi, I'm interested in scheduling a viewing for the property on Oak Avenue.",
      timestamp: new Date(2025, 3, 10, 14, 30),
      avatar: "/placeholder-user.jpg",
      initials: "JS",
    },
    {
      id: 2,
      sender: "You",
      senderType: "agent",
      content: "Hello John! I'd be happy to arrange that for you. How does tomorrow at 3 PM sound?",
      timestamp: new Date(2025, 3, 10, 15, 45),
      avatar: "/placeholder-user.jpg",
      initials: "ME",
    },
    {
      id: 3,
      sender: "John Smith",
      senderType: "client",
      content: "That works perfectly for me. I'll see you there!",
      timestamp: new Date(2025, 3, 10, 16, 20),
      avatar: "/placeholder-user.jpg",
      initials: "JS",
    },
    {
      id: 4,
      sender: "You",
      senderType: "agent",
      content: "Great! I've sent you a calendar invite with all the details. Looking forward to meeting you.",
      timestamp: new Date(2025, 3, 10, 16, 35),
      avatar: "/placeholder-user.jpg",
      initials: "ME",
    },
  ]

  const calls = [
    {
      id: 1,
      type: "outgoing",
      duration: "5:23",
      timestamp: new Date(2025, 3, 9, 11, 15),
      notes: "Discussed property requirements and budget",
    },
    {
      id: 2,
      type: "incoming",
      duration: "2:47",
      timestamp: new Date(2025, 3, 8, 14, 30),
      notes: "Client had questions about the mortgage pre-approval process",
    },
  ]

  const emails = [
    {
      id: 1,
      subject: "Property Listing Information",
      snippet: "Here are the details of the properties we discussed...",
      timestamp: new Date(2025, 3, 7, 9, 45),
      status: "sent",
    },
    {
      id: 2,
      subject: "Re: Property Listing Information",
      snippet: "Thank you for sending these over. I'm particularly interested in...",
      timestamp: new Date(2025, 3, 7, 13, 20),
      status: "received",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Communication History</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Phone className="h-4 w-4" />
            Call
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <MessageSquare className="h-4 w-4" />
            Message
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h4 className="font-medium">Messages</h4>
            <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderType === "agent" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-[80%] ${
                      message.senderType === "agent" ? "flex-row-reverse" : "flex-row"
                    } items-start gap-2`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.avatar} alt={message.sender} />
                      <AvatarFallback className="bg-purple-100 text-purple-700">{message.initials}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 ${
                        message.senderType === "agent" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {format(message.timestamp, "MMM d, h:mm a")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Input placeholder="Type a message..." className="flex-1" />
              <Button size="icon" className="rounded-full">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h4 className="font-medium mb-4">Recent Calls</h4>
            <div className="space-y-4">
              {calls.map((call) => (
                <div key={call.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Phone
                        className={`h-4 w-4 ${
                          call.type === "outgoing" ? "text-green-500 rotate-90" : "text-blue-500 -rotate-90"
                        }`}
                      />
                      <span className="font-medium">
                        {call.type === "outgoing" ? "Outgoing Call" : "Incoming Call"}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">{call.duration}</div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {format(call.timestamp, "MMM d, yyyy h:mm a")}
                  </div>
                  {call.notes && <div className="mt-2 text-sm">{call.notes}</div>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h4 className="font-medium mb-4">Recent Emails</h4>
            <div className="space-y-4">
              {emails.map((email) => (
                <div key={email.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Mail className={`h-4 w-4 ${email.status === "sent" ? "text-green-500" : "text-blue-500"}`} />
                      <span className="font-medium">{email.subject}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{email.status === "sent" ? "Sent" : "Received"}</div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {format(email.timestamp, "MMM d, yyyy h:mm a")}
                  </div>
                  <div className="mt-2 text-sm">{email.snippet}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
