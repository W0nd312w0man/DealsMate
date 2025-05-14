"use client"

import type { Goal } from "@/types/reports"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface GoalProgressCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
  onDelete: (id: string) => void
}

export function GoalProgressCard({ goal, onEdit, onDelete }: GoalProgressCardProps) {
  const progressPercentage = Math.min(Math.round((goal.current / goal.target) * 100), 100)
  const remaining = goal.target - goal.current
  const isCompleted = goal.current >= goal.target

  const formatValue = (value: number) => {
    if (goal.unit === "USD") {
      return formatCurrency(value)
    }
    return `${value} ${goal.unit}`
  }

  // Calculate if goal is on track based on time elapsed
  const getGoalStatus = () => {
    const now = new Date()
    const startDate = new Date(goal.startDate)
    const endDate = new Date(goal.endDate)

    // If goal is completed or not started yet
    if (isCompleted) return "completed"
    if (now < startDate) return "not-started"
    if (now > endDate) return "expired"

    // Calculate time progress
    const totalDuration = endDate.getTime() - startDate.getTime()
    const elapsedDuration = now.getTime() - startDate.getTime()
    const timeProgress = elapsedDuration / totalDuration

    // Calculate goal progress
    const goalProgress = goal.current / goal.target

    // Determine status
    if (goalProgress >= timeProgress) return "on-track"
    if (goalProgress >= timeProgress * 0.7) return "at-risk"
    return "off-track"
  }

  const status = getGoalStatus()
  const statusColors = {
    completed: "bg-green-500",
    "on-track": "bg-purple-600",
    "at-risk": "bg-amber-500",
    "off-track": "bg-red-500",
    "not-started": "bg-blue-500",
    expired: "bg-gray-500",
  }

  return (
    <Card className="overflow-hidden">
      <div className={`h-1 w-full ${statusColors[status]}`} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{goal.name}</CardTitle>
            <CardDescription>{goal.period.charAt(0).toUpperCase() + goal.period.slice(1)} Goal</CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(goal)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(goal.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-4">
            <div>
              <p className="text-xs text-muted-foreground">Current</p>
              <p className="font-semibold">{formatValue(goal.current)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Target</p>
              <p className="font-semibold">{formatValue(goal.target)}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        {status === "completed" ? (
          <p className="text-sm text-green-600 font-medium">Goal completed! 🎉</p>
        ) : status === "off-track" ? (
          <p className="text-sm text-red-600 font-medium">Significantly behind schedule</p>
        ) : status === "at-risk" ? (
          <p className="text-sm text-amber-600 font-medium">Slightly behind schedule</p>
        ) : (
          <p className="text-sm text-muted-foreground">{formatValue(remaining)} remaining to reach your goal</p>
        )}
      </CardFooter>
    </Card>
  )
}
