"use client"

import { useState } from "react"
import { MetricsArea } from "@/components/dashboard/metrics-area"
import { MetricsAreaDark } from "@/components/dashboard/metrics-area-dark"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

export default function MetricsDemoPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [filters, setFilters] = useState({
    unreadEmails: false,
    pendingTasks: false,
    todayEvents: false,
  })

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <BreadcrumbNav />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">Metrics Cards Demo</h1>
        <Button variant="outline" size="sm" onClick={toggleTheme}>
          {theme === "light" ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </Button>
      </div>

      <div className={theme === "dark" ? "bg-gray-950 p-6 rounded-lg" : ""}>
        <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
          Side-by-Side Metrics Cards
        </h2>

        {theme === "light" ? (
          <MetricsArea
            onUnreadEmailsClick={handleUnreadEmailsClick}
            onPendingTasksClick={handlePendingTasksClick}
            onTodayEventsClick={handleTodayEventsClick}
            activeFilters={filters}
          />
        ) : (
          <MetricsAreaDark
            onUnreadEmailsClick={handleUnreadEmailsClick}
            onPendingTasksClick={handlePendingTasksClick}
            onTodayEventsClick={handleTodayEventsClick}
            activeFilters={filters}
            theme="dark"
          />
        )}
      </div>

      <div className={theme === "dark" ? "bg-gray-950 p-6 rounded-lg" : ""}>
        <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
          Responsive Behavior
        </h2>
        <p className={`mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          The metrics cards automatically adjust based on screen size:
        </p>
        <ul className={`list-disc pl-5 mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          <li>Large screens (lg): 4 cards in a row</li>
          <li>Medium screens (sm): 2 cards in a row</li>
          <li>Small screens: 1 card per row</li>
        </ul>
        <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Resize your browser window to see the responsive behavior in action.
        </p>
      </div>
    </div>
  )
}
