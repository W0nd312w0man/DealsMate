"use client"

import { useState } from "react"
import { useReports } from "@/hooks/use-reports"
import { useLeaderboard } from "@/hooks/use-leaderboard"
import type { Goal } from "@/types/reports"
import { GoalProgressCard } from "@/components/reports/goal-progress-card"
import { MetricCard } from "@/components/reports/metric-card"
import { GoalFormDialog } from "@/components/reports/goal-form-dialog"
import { TimeFilterComponent } from "@/components/reports/time-filter"
import { SummaryCards } from "@/components/reports/summary-cards"
import { ExportOptions } from "@/components/reports/export-options"
import { PerformanceAlerts } from "@/components/reports/performance-alerts"
import { Leaderboard } from "@/components/reports/leaderboard"
import { MetricDetailView } from "@/components/reports/metric-detail"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  const {
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
  } = useReports()

  const {
    leaderboardData,
    metricDetails,
    selectedMetric,
    setSelectedMetric,
    getMetricDetail,
    sortOption,
    setSortOption,
    filterOption,
    setFilterOption,
    timeOption,
    setTimeOption,
    isLoading: isLeaderboardLoading,
    currentUserRank,
  } = useLeaderboard()

  const [goalFormOpen, setGoalFormOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>(undefined)
  const offTrackGoals = getOffTrackGoals()
  const [showMetricDetail, setShowMetricDetail] = useState(false)

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal)
    setGoalFormOpen(true)
  }

  const handleSaveGoal = (goal: Omit<Goal, "id"> | Goal) => {
    if ("id" in goal) {
      updateGoal(goal.id, goal)
    } else {
      addGoal(goal)
    }
  }

  const handleExport = (format: "pdf" | "csv") => {
    // In a real app, this would trigger an API call to generate the export
    console.log(`Exporting as ${format}...`)
    alert(`Your ${format.toUpperCase()} report is being generated and will download shortly.`)
  }

  const handleMetricInfoClick = (metricId: string) => {
    const metric = getMetricDetail(metricId)
    if (metric) {
      setSelectedMetric(metric)
      setShowMetricDetail(true)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Reports</h1>
          <p className="text-muted-foreground">Track your performance metrics and progress toward your goals</p>
        </div>
        <div className="flex items-center space-x-2">
          <TimeFilterComponent
            value={timeFilter}
            onChange={setTimeFilter}
            customDateRange={customDateRange}
            onCustomDateChange={setCustomDateRange}
          />
          <ExportOptions onExport={handleExport} />
        </div>
      </div>

      {/* Performance Alerts */}
      <PerformanceAlerts goals={offTrackGoals} visible={alertsVisible} onDismiss={() => setAlertsVisible(false)} />

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto mb-4">
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-8">
          {/* Performance Metrics */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                  ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric) => (
                  <MetricCard key={metric.id} metric={metric} />
                ))}
              </div>
            )}
          </div>

          {/* Summary Cards */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Performance Summary</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-28" />
                  ))}
              </div>
            ) : (
              <SummaryCards transactionSummary={transactionSummary} leadSummary={leadSummary} />
            )}
          </div>

          {/* Metric Detail View */}
          {showMetricDetail && selectedMetric && (
            <div className="mt-6">
              <MetricDetailView
                metric={selectedMetric}
                onClose={() => {
                  setShowMetricDetail(false)
                  setSelectedMetric(null)
                }}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-8">
          {/* Leaderboard */}
          <Leaderboard
            data={leaderboardData}
            currentUser={currentUserRank}
            isLoading={isLeaderboardLoading}
            sortOption={sortOption}
            onSortChange={setSortOption}
            filterOption={filterOption}
            onFilterChange={setFilterOption}
            timeOption={timeOption}
            onTimeChange={setTimeOption}
            onMetricInfoClick={handleMetricInfoClick}
          />

          {/* Metric Detail View */}
          {showMetricDetail && selectedMetric && (
            <div className="mt-6">
              <MetricDetailView
                metric={selectedMetric}
                onClose={() => {
                  setShowMetricDetail(false)
                  setSelectedMetric(null)
                }}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-8">
          {/* Goals Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Goals</h2>
              <Button
                onClick={() => {
                  setSelectedGoal(undefined)
                  setGoalFormOpen(true)
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Goal
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-48" />
                  ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {goals.map((goal) => (
                  <GoalProgressCard key={goal.id} goal={goal} onEdit={handleEditGoal} onDelete={deleteGoal} />
                ))}
                {goals.length === 0 && (
                  <div className="col-span-full text-center py-12 bg-muted/50 rounded-lg">
                    <h3 className="text-lg font-medium">No goals set yet</h3>
                    <p className="text-muted-foreground mb-4">Set your first goal to start tracking your progress</p>
                    <Button
                      onClick={() => {
                        setSelectedGoal(undefined)
                        setGoalFormOpen(true)
                      }}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Goal
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Goal Form Dialog */}
      <GoalFormDialog open={goalFormOpen} onOpenChange={setGoalFormOpen} goal={selectedGoal} onSave={handleSaveGoal} />
    </div>
  )
}
