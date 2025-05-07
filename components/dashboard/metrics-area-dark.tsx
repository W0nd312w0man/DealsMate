"use client"

import React from "react"

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
  theme?: "light" | "dark"
  accentColor?: "purple" | "blue" | "teal" | "pink"
}

function MetricCard({
  title,
  value,
  icon,
  trend,
  className,
  onClick,
  isActive,
  theme = "light",
  accentColor = "purple",
}: MetricCardProps) {
  // Define gradient colors based on accent color
  const gradientMap = {
    purple: "from-purple-600 to-pink-500",
    blue: "from-blue-600 to-indigo-500",
    teal: "from-teal-500 to-emerald-400",
    pink: "from-pink-500 to-rose-400",
  }

  // Define icon background colors based on accent color and theme
  const iconBgMap = {
    purple: theme === "dark" ? "bg-purple-900/40" : "bg-purple-100",
    blue: theme === "dark" ? "bg-blue-900/40" : "bg-blue-100",
    teal: theme === "dark" ? "bg-teal-900/40" : "bg-teal-100",
    pink: theme === "dark" ? "bg-pink-900/40" : "bg-pink-100",
  }

  // Define icon text colors based on accent color
  const iconTextMap = {
    purple: theme === "dark" ? "text-purple-400" : "text-purple-700",
    blue: theme === "dark" ? "text-blue-400" : "text-blue-700",
    teal: theme === "dark" ? "text-teal-400" : "text-teal-700",
    pink: theme === "dark" ? "text-pink-400" : "text-pink-700",
  }

  // Define value text colors based on accent color and theme
  const valueTextMap = {
    purple: theme === "dark" ? "text-purple-400" : "text-purple-700",
    blue: theme === "dark" ? "text-blue-400" : "text-blue-700",
    teal: theme === "dark" ? "text-teal-400" : "text-teal-700",
    pink: theme === "dark" ? "text-pink-400" : "text-pink-700",
  }

  return (
    <Card
      className={cn(
        "shadow-soft overflow-hidden transition-all duration-300",
        onClick && "cursor-pointer hover:shadow-md transform hover:-translate-y-1",
        isActive && `ring-2 ring-${accentColor}-500 ring-offset-2`,
        theme === "dark" && "bg-gray-900 border-gray-800",
        className,
      )}
      onClick={onClick}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${gradientMap[accentColor]}`}></div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={cn("text-sm font-medium", theme === "dark" ? "text-gray-400" : "text-muted-foreground")}>
              {title}
            </p>
            <h3 className={cn("text-2xl font-bold mt-1", valueTextMap[accentColor])}>{value}</h3>
            {trend && (
              <p
                className={cn(
                  "text-xs mt-1",
                  trend.positive
                    ? theme === "dark"
                      ? "text-green-400"
                      : "text-green-600"
                    : theme === "dark"
                      ? "text-pink-400"
                      : "text-pink-600",
                )}
              >
                {trend.positive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", iconBgMap[accentColor])}>
            {React.cloneElement(icon as React.ReactElement, {
              className: cn("h-6 w-6", iconTextMap[accentColor]),
            })}
          </div>
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
  theme?: "light" | "dark"
}

export function MetricsAreaDark({
  onUnreadEmailsClick,
  onPendingTasksClick,
  onTodayEventsClick,
  activeFilters = {},
  className,
  theme = "light",
}: MetricsAreaProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      <MetricCard
        title="Unread Emails"
        value="12"
        icon={<Mail className="h-6 w-6" />}
        trend={{ value: "3 new today", positive: true }}
        onClick={onUnreadEmailsClick}
        isActive={activeFilters.unreadEmails}
        theme={theme}
        accentColor="purple"
      />
      <MetricCard
        title="Pending Tasks"
        value="8"
        icon={<CheckCircle2 className="h-6 w-6" />}
        trend={{ value: "2 due today", positive: false }}
        onClick={onPendingTasksClick}
        isActive={activeFilters.pendingTasks}
        theme={theme}
        accentColor="blue"
      />
      <MetricCard
        title="Today's Events"
        value="4"
        icon={<Calendar className="h-6 w-6" />}
        trend={{ value: "1 starting soon", positive: true }}
        onClick={onTodayEventsClick}
        isActive={activeFilters.todayEvents}
        theme={theme}
        accentColor="teal"
      />
      <MetricCard
        title="Active Clients"
        value="16"
        icon={<Users className="h-6 w-6" />}
        trend={{ value: "2 new this week", positive: true }}
        theme={theme}
        accentColor="pink"
      />
    </div>
  )
}
