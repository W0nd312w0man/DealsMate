"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, MessageSquare, Upload } from "lucide-react"
// Import useRouter
import { useRouter } from "next/navigation"

export function RecentActivity() {
  const router = useRouter()

  // Mock data - in a real app, this would come from an API
  const activities = [
    {
      id: 1,
      type: "document",
      icon: FileText,
      title: "Purchase Agreement uploaded",
      property: "123 Main St",
      time: "2 hours ago",
      user: {
        id: "contact-1",
        name: "John Doe",
        avatar: "/placeholder-user.jpg",
        initials: "JD",
      },
    },
    {
      id: 2,
      type: "message",
      icon: MessageSquare,
      title: "Message from broker",
      property: "456 Oak Ave",
      time: "4 hours ago",
      user: {
        id: "contact-5",
        name: "Sarah Smith",
        avatar: "/placeholder-user.jpg",
        initials: "SS",
      },
    },
    {
      id: 3,
      type: "document",
      icon: Upload,
      title: "Inspection report uploaded",
      property: "789 Pine Rd",
      time: "Yesterday",
      user: {
        id: "contact-3",
        name: "Mike Johnson",
        avatar: "/placeholder-user.jpg",
        initials: "MJ",
      },
    },
    {
      id: 4,
      type: "document",
      icon: FileText,
      title: "Addendum approved",
      property: "123 Main St",
      time: "Yesterday",
      user: {
        id: "contact-2",
        name: "Lisa Brown",
        avatar: "/placeholder-user.jpg",
        initials: "LB",
      },
    },
  ]

  const navigateToContact = (contactId: string) => {
    router.push(`/contacts/${contactId}`)
  }

  return (
    <Card className="shadow-soft card-hover overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-pink-500 to-pink-300"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-poppins text-purple-700">Recent Activity</CardTitle>
        <CardDescription>Latest updates across your transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-purple-50/50 transition-colors"
            >
              <Avatar
                className="mt-1 h-10 w-10 border-2 border-purple-200/50 cursor-pointer"
                onClick={() => navigateToContact(activity.user.id)}
              >
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback className="bg-purple-400 text-white">{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-purple-100 p-1">
                    <activity.icon className="h-3.5 w-3.5 text-purple-700" />
                  </div>
                  <p className="text-sm font-medium leading-none">{activity.title}</p>
                </div>
                <p className="text-sm text-muted-foreground">{activity.property}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className="cursor-pointer hover:text-purple-600 transition-colors"
                    onClick={() => navigateToContact(activity.user.id)}
                  >
                    {activity.user.name}
                  </span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
