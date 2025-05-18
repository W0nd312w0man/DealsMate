"use client"

import { useState, useEffect } from "react"
import { BotIcon, Bell, X, AlertTriangle, FileText, Calendar, CheckCircle2, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"

export type TalosNotificationType =
  | "task_created"
  | "event_created"
  | "document_analyzed"
  | "email_analyzed"
  | "suggestion"
  | "alert"

export interface TalosNotification {
  id: string
  type: TalosNotificationType
  title: string
  description: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
  secondaryAction?: {
    label: string
    url: string
  }
  relatedEntity?: {
    type: "task" | "event" | "document" | "email" | "transaction" | "workspace"
    id: string
    name: string
  }
  priority?: "high" | "medium" | "low"
}

interface TalosNotificationsProps {
  className?: string
}

export function TalosNotifications({ className }: TalosNotificationsProps) {
  const [notifications, setNotifications] = useState<TalosNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  // Add a new notification (this would be called from other components)
  const addNotification = (notification: Omit<TalosNotification, "id" | "timestamp" | "read">) => {
    const newNotification: TalosNotification = {
      ...notification,
      id: `n-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
    setUnreadCount((prev) => prev + 1)

    // Also show a toast for immediate feedback
    toast({
      title: `TALOS AI: ${notification.title}`,
      description: notification.description,
    })

    return newNotification.id
  }

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    setUnreadCount(0)
  }

  // Remove a notification
  const removeNotification = (id: string) => {
    const notification = notifications.find((n) => n.id === id)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }

  // Get icon based on notification type
  const getNotificationIcon = (type: TalosNotificationType) => {
    switch (type) {
      case "task_created":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "event_created":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "document_analyzed":
        return <FileText className="h-4 w-4 text-purple-500" />
      case "email_analyzed":
        return <Mail className="h-4 w-4 text-indigo-500" />
      case "suggestion":
        return <BotIcon className="h-4 w-4 text-cyan-500" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      default:
        return <BotIcon className="h-4 w-4 text-purple-500" />
    }
  }

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) return "just now"
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHour < 24) return `${diffHour}h ago`
    if (diffDay < 7) return `${diffDay}d ago`

    return date.toLocaleDateString()
  }

  // Handle notification click
  const handleNotificationClick = (notification: TalosNotification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }

    // In a real app, this would navigate to the relevant page
    console.log(`Navigating to: ${notification.actionUrl}`)
  }

  // Make this component available globally
  useEffect(() => {
    // @ts-ignore - Add to window for global access
    window.talosNotifications = {
      add: addNotification,
      markAsRead,
      markAllAsRead,
      remove: removeNotification,
    }
  }, [])

  return (
    <div className={className}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-medium text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            <div className="flex items-center">
              <BotIcon className="h-4 w-4 mr-2 text-purple-500" />
              <span>TALOS AI Notifications</span>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-purple-700 hover:text-purple-800 hover:bg-purple-50"
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length > 0 ? (
              <DropdownMenuGroup>
                {notifications.map((notification) => (
                  <div key={notification.id} className="relative">
                    <DropdownMenuItem
                      className={cn(
                        "flex flex-col items-start p-3 cursor-default",
                        !notification.read && "bg-purple-50/50",
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start w-full">
                        <div className="flex-shrink-0 mt-0.5 mr-3">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between w-full">
                            <div className={cn("font-medium text-sm", !notification.read && "text-purple-900")}>
                              {notification.title}
                            </div>
                            <div className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                              {formatRelativeTime(notification.timestamp)}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.description}</p>

                          {/* Priority badge */}
                          {notification.priority && (
                            <div className="mt-1">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs py-0 px-1.5",
                                  notification.priority === "high"
                                    ? "border-pink-200 text-pink-700"
                                    : notification.priority === "medium"
                                      ? "border-amber-200 text-amber-700"
                                      : "border-blue-200 text-blue-700",
                                )}
                              >
                                {notification.priority} priority
                              </Badge>
                            </div>
                          )}

                          {/* Action buttons */}
                          {(notification.actionLabel || notification.secondaryAction) && (
                            <div className="flex gap-2 mt-2">
                              {notification.actionLabel && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                                >
                                  {notification.actionLabel}
                                </Button>
                              )}
                              {notification.secondaryAction && (
                                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                                  {notification.secondaryAction.label}
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </DropdownMenuItem>

                    {/* Dismiss button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 absolute top-2 right-2 text-muted-foreground opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Dismiss</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>Dismiss notification</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </DropdownMenuGroup>
            ) : (
              <div className="py-6 text-center">
                <BotIcon className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No notifications from TALOS AI</p>
              </div>
            )}
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center text-sm text-purple-700 focus:text-purple-700 focus:bg-purple-50">
            View all notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Export the notification types for use in other components
export type { TalosNotification, TalosNotificationType }
