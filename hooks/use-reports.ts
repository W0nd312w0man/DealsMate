"use client"

import { useState, useEffect } from "react"
import type { Goal, PerformanceMetric, TransactionSummary, LeadSummary, TimeFilter, DateRange } from "@/types/reports"

// Mock data - in a real app, this would come from an API
const mockGoals: Goal[] = [
  {
    id: "1",
    name: "Annual Income",
    target: 250000,
    current: 175000,
    unit: "USD",
    period: "yearly",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
  },
  {
    id: "2",
    name: "Gross Sales Volume",
    target: 5000000,
    current: 3250000,
    unit: "USD",
    period: "yearly",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
  },
  {
    id: "3",
    name: "New Clients",
    target: 24,
    current: 16,
    unit: "clients",
    period: "yearly",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
  },
  {
    id: "4",
    name: "Monthly Listings",
    target: 5,
    current: 3,
    unit: "listings",
    period: "monthly",
    startDate: "2023-05-01",
    endDate: "2023-05-31",
  },
]

const mockMetrics: PerformanceMetric[] = [
  {
    id: "1",
    name: "Active Transactions",
    value: 12,
    previousValue: 10,
    change: 20,
    changeType: "increase",
    unit: "transactions",
  },
  {
    id: "2",
    name: "Active Leads",
    value: 28,
    previousValue: 32,
    change: 12.5,
    changeType: "decrease",
    unit: "leads",
  },
  {
    id: "3",
    name: "Projected Income",
    value: 175000,
    previousValue: 150000,
    change: 16.67,
    changeType: "increase",
    unit: "USD",
  },
  {
    id: "4",
    name: "Gross Sales Volume",
    value: 3250000,
    previousValue: 2800000,
    change: 16.07,
    changeType: "increase",
    unit: "USD",
  },
]

const mockTransactionSummary: TransactionSummary = {
  activeCount: 12,
  pendingCount: 5,
  closedCount: 8,
  totalValue: 3250000,
  projectedIncome: 175000,
}

const mockLeadSummary: LeadSummary = {
  activeCount: 28,
  convertedCount: 16,
  conversionRate: 57.14,
  potentialValue: 4200000,
}

export function useReports() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals)
  const [metrics, setMetrics] = useState<PerformanceMetric[]>(mockMetrics)
  const [transactionSummary, setTransactionSummary] = useState<TransactionSummary>(mockTransactionSummary)
  const [leadSummary, setLeadSummary] = useState<LeadSummary>(mockLeadSummary)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("ytd")
  const [customDateRange, setCustomDateRange] = useState<DateRange | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [alertsVisible, setAlertsVisible] = useState(true)

  // Update goal
  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(goals.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal)))
  }

  // Add new goal
  const addGoal = (goal: Omit<Goal, "id">) => {
    const newGoal = {
      ...goal,
      id: Math.random().toString(36).substring(2, 9),
    }
    setGoals([...goals, newGoal as Goal])
  }

  // Delete goal
  const deleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id))
  }

  // Get goals that are off track (less than 70% progress based on time elapsed)
  const getOffTrackGoals = () => {
    const now = new Date()

    return goals.filter((goal) => {
      const startDate = new Date(goal.startDate)
      const endDate = new Date(goal.endDate)

      // Skip if goal is in the future or already ended
      if (now < startDate || now > endDate) return false

      // Calculate time progress
      const totalDuration = endDate.getTime() - startDate.getTime()
      const elapsedDuration = now.getTime() - startDate.getTime()
      const timeProgress = elapsedDuration / totalDuration

      // Calculate goal progress
      const goalProgress = goal.current / goal.target

      // Goal is off track if progress is significantly behind time elapsed
      return goalProgress < timeProgress * 0.7
    })
  }

  // Fetch data based on time filter
  const fetchData = (filter: TimeFilter, dateRange?: DateRange) => {
    setIsLoading(true)

    // In a real app, this would be an API call with the filter
    setTimeout(() => {
      // Mock data update based on filter
      // This would be replaced with actual API data
      setIsLoading(false)
    }, 800)
  }

  // Effect to fetch data when filter changes
  useEffect(() => {
    if (timeFilter === "custom" && customDateRange) {
      fetchData(timeFilter, customDateRange)
    } else if (timeFilter !== "custom") {
      fetchData(timeFilter)
    }
  }, [timeFilter, customDateRange])

  return {
    goals,
    metrics,
    transactionSummary,
    leadSummary,
    timeFilter,
    customDateRange,
    isLoading,
    alertsVisible,
    setAlertsVisible,
    updateGoal,
    addGoal,
    deleteGoal,
    getOffTrackGoals,
    setTimeFilter,
    setCustomDateRange,
  }
}
