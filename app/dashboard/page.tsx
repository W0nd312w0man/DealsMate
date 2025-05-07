"use client"

import { useState } from "react"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MetricsArea } from "@/components/dashboard/metrics-area"
import { SmartInbox } from "@/components/dashboard/smart-inbox"
import { TasksCard } from "@/components/dashboard/tasks-card"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { Toaster } from "@/components/ui/toaster"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { TalosVoiceAssistant } from "@/components/talos/talos-voice-assistant"

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    unreadEmails: false,
    pendingTasks: false,
    todayEvents: false,
  })

  const handleUnreadEmailsClick = () => {
    setFilters({
      ...filters,
      unreadEmails: !filters.unreadEmails,
    })
  }

  const handlePendingTasksClick = () => {
    setFilters({
      ...filters,
      pendingTasks: !filters.pendingTasks,
    })
  }

  const handleTodayEventsClick = () => {
    setFilters({
      ...filters,
      todayEvents: !filters.todayEvents,
    })
  }

  const handleEmailFilterChange = (filterUnreadOnly: boolean) => {
    setFilters({
      ...filters,
      unreadEmails: filterUnreadOnly,
    })
  }

  const handleEventFilterChange = (filterTodayOnly: boolean) => {
    setFilters({
      ...filters,
      todayEvents: filterTodayOnly,
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <BreadcrumbNav />
      <div>
        <DashboardHeader />
      </div>

      {/* Quick Actions Bar */}
      <div className="flex flex-wrap gap-2">
        <QuickActions />
      </div>

      {/* Metrics Area - Side by Side Cards */}
      <MetricsArea
        onUnreadEmailsClick={handleUnreadEmailsClick}
        onPendingTasksClick={handlePendingTasksClick}
        onTodayEventsClick={handleTodayEventsClick}
        activeFilters={filters}
      />

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Column - Takes 8/12 columns on desktop */}
        <div className="md:col-span-8 flex flex-col gap-4">
          {/* Smart Inbox with integrated attachment detection */}
          <SmartInbox
            filterUnreadOnly={filters.unreadEmails}
            onFilterChange={handleEmailFilterChange}
            className="w-full flex-1 flex flex-col"
            showAttachmentDetection={true}
          />
        </div>

        {/* Right Column - Takes 4/12 columns on desktop */}
        <div className="md:col-span-4 flex flex-col gap-4">
          {/* Tasks Card */}
          <TasksCard />

          {/* Upcoming Events */}
          <UpcomingEvents filterTodayOnly={filters.todayEvents} onFilterChange={handleEventFilterChange} />
        </div>
      </div>

      {/* TALOS AI Voice Assistant */}
      <TalosVoiceAssistant />

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
