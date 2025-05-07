"use client"

import { useState, useEffect } from "react"

// Default card order
const DEFAULT_CARD_ORDER = [
  "smart-inbox",
  "tasks-panel",
  "upcoming-events",
  "client-lifecycle",
  "workspace-stages",
  "talos-insights",
  "recent-activity",
  "upcoming-tasks",
]

// Default collapsed state
const DEFAULT_COLLAPSED_SECTIONS: Record<string, boolean> = {
  "client-lifecycle": false,
  "workspace-stages": false,
  "talos-insights": false,
  "recent-activity": false,
  "upcoming-tasks": false,
  "smart-inbox": false,
  "tasks-panel": false,
  "upcoming-events": false,
}

export function useDashboardPreferences() {
  const [cardOrder, setCardOrder] = useState<string[]>(DEFAULT_CARD_ORDER)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(DEFAULT_COLLAPSED_SECTIONS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const savedCardOrder = localStorage.getItem("dashboardCardOrder")
      const savedCollapsedSections = localStorage.getItem("dashboardCollapsedSections")

      if (savedCardOrder) {
        setCardOrder(JSON.parse(savedCardOrder))
      }

      if (savedCollapsedSections) {
        setCollapsedSections(JSON.parse(savedCollapsedSections))
      }
    } catch (error) {
      console.error("Failed to load dashboard preferences", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Update card order
  const updateCardOrder = (newOrder: string[]) => {
    setCardOrder(newOrder)
    localStorage.setItem("dashboardCardOrder", JSON.stringify(newOrder))
  }

  // Toggle section collapse
  const toggleSectionCollapse = (sectionId: string) => {
    const newCollapsedSections = {
      ...collapsedSections,
      [sectionId]: !collapsedSections[sectionId],
    }
    setCollapsedSections(newCollapsedSections)
    localStorage.setItem("dashboardCollapsedSections", JSON.stringify(newCollapsedSections))
  }

  return {
    cardOrder,
    collapsedSections,
    updateCardOrder,
    toggleSectionCollapse,
    isLoaded,
  }
}
