"use client"
import type { Goal } from "@/types/reports"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface PerformanceAlertsProps {
  goals: Goal[]
  visible: boolean
  onDismiss: () => void
}

export function PerformanceAlerts({ goals, visible, onDismiss }: PerformanceAlertsProps) {
  if (!visible || goals.length === 0) return null

  // Get the goal name and how far behind it is
  const getAlertMessage = (goal: Goal) => {
    const now = new Date()
    const startDate = new Date(goal.startDate)
    const endDate = new Date(goal.endDate)

    // Calculate time progress
    const totalDuration = endDate.getTime() - startDate.getTime()
    const elapsedDuration = now.getTime() - startDate.getTime()
    const timeProgress = elapsedDuration / totalDuration

    // Calculate goal progress
    const goalProgress = goal.current / goal.target

    // Calculate how far behind
    const behindPercentage = Math.round((timeProgress - goalProgress) * 100)

    const formatValue = (value: number) => {
      if (goal.unit === "USD") {
        return formatCurrency(value)
      }
      return `${value} ${goal.unit}`
    }

    const remaining = goal.target - goal.current

    return {
      name: goal.name,
      behindPercentage,
      currentValue: formatValue(goal.current),
      targetValue: formatValue(goal.target),
      remainingValue: formatValue(remaining),
      endDate: endDate.toLocaleDateString(),
    }
  }

  return (
    <div className="space-y-3 mb-6">
      {goals.map((goal) => {
        const alert = getAlertMessage(goal)
        return (
          <Alert key={goal.id} variant="destructive" className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <div className="flex justify-between w-full">
              <div>
                <AlertTitle className="text-red-600">Goal Off Track: {alert.name}</AlertTitle>
                <AlertDescription className="text-red-700">
                  You're {alert.behindPercentage}% behind schedule. Current progress: {alert.currentValue} of{" "}
                  {alert.targetValue}. You need to achieve {alert.remainingValue} by {alert.endDate}.
                </AlertDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onDismiss} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        )
      })}
    </div>
  )
}
