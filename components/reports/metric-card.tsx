import type { PerformanceMetric } from "@/types/reports"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Minus, Activity, Users, DollarSign, TrendingUp } from "lucide-react"
import { formatCurrency, cn } from "@/lib/utils"

interface MetricCardProps {
  metric: PerformanceMetric
}

export function MetricCard({ metric }: MetricCardProps) {
  const formatValue = (value: number) => {
    if (metric.unit === "USD") {
      return formatCurrency(value)
    }
    return value.toString()
  }

  const renderChangeIcon = () => {
    if (metric.changeType === "increase") {
      return <ArrowUp className="h-4 w-4 text-green-500" />
    } else if (metric.changeType === "decrease") {
      return <ArrowDown className="h-4 w-4 text-red-500" />
    }
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const changeTextColor =
    metric.changeType === "increase"
      ? "text-green-600"
      : metric.changeType === "decrease"
        ? "text-red-600"
        : "text-gray-600"

  // Determine icon based on metric name
  const getIcon = () => {
    if (metric.name.includes("Transaction")) return <Activity className="h-5 w-5 text-purple-700" />
    if (metric.name.includes("Lead")) return <Users className="h-5 w-5 text-purple-700" />
    if (metric.name.includes("Income")) return <DollarSign className="h-5 w-5 text-purple-700" />
    if (metric.name.includes("Sales")) return <TrendingUp className="h-5 w-5 text-purple-700" />
    return <Activity className="h-5 w-5 text-purple-700" />
  }

  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
            <h3 className="text-2xl font-bold text-purple-700 mt-1">{formatValue(metric.value)}</h3>
            <div className="flex items-center mt-1">
              {renderChangeIcon()}
              <p className={cn("text-xs ml-1", changeTextColor)}>{metric.change}% from previous period</p>
            </div>
          </div>
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">{getIcon()}</div>
        </div>
      </CardContent>
    </Card>
  )
}
