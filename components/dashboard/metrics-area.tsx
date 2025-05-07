"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Mail, CheckCircle2, Calendar, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: string
    positive: boolean
  }
  className?: string
  onClick?: () => void
  isActive?: boolean
}

function MetricCard({ title, value, icon, trend, className, onClick, isActive }: MetricCardProps) {
  return (
    <Card
      className={cn(
        "shadow-soft overflow-hidden transition-all duration-300",
        onClick && "cursor-pointer hover:shadow-md transform hover:-translate-y-1",
        isActive && "ring-2 ring-purple-500 ring-offset-2",
        className,
      )}
      onClick={onClick}
    >
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold text-purple-700 mt-1">{value}</h3>
            {trend && (
              <p className={cn("text-xs mt-1", trend.positive ? "text-green-600" : "text-pink-600")}>
                {trend.positive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MetricsAreaProps {
  onUnreadEmailsClick?: () => void
  onPendingTasksClick?: () => void
  onTodayEventsClick?: () => void
  activeFilters?: {
    unreadEmails?: boolean
    pendingTasks?: boolean
    todayEvents?: boolean
  }
  className?: string
}

export function MetricsArea({
  onUnreadEmailsClick,
  onPendingTasksClick,
  onTodayEventsClick,
  activeFilters = {},
  className,
}: MetricsAreaProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      <MetricCard
        title="Unread Emails"
        value="12"
        icon={<Mail className="h-6 w-6 text-purple-700" />}
        trend={{ value: "3 new today", positive: true }}
        onClick={onUnreadEmailsClick}
        isActive={activeFilters.unreadEmails}
      />
      <MetricCard
        title="Pending Tasks"
        value="8"
        icon={<CheckCircle2 className="h-6 w-6 text-purple-700" />}
        trend={{ value: "2 due today", positive: false }}
        onClick={onPendingTasksClick}
        isActive={activeFilters.pendingTasks}
      />
      <MetricCard
        title="Today's Events"
        value="4"
        icon={<Calendar className="h-6 w-6 text-purple-700" />}
        trend={{ value: "1 starting soon", positive: true }}
        onClick={onTodayEventsClick}
        isActive={activeFilters.todayEvents}
      />
      <MetricCard
        title="Active Clients"
        value="16"
        icon={<Users className="h-6 w-6 text-purple-700" />}
        trend={{ value: "2 new this week", positive: true }}
      />
    </div>
  )
}
