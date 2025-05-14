export interface Goal {
  id: string
  name: string
  target: number
  current: number
  unit: string
  period: "monthly" | "quarterly" | "yearly"
  startDate: string
  endDate: string
}

export interface PerformanceMetric {
  id: string
  name: string
  value: number
  previousValue: number
  change: number
  changeType: "increase" | "decrease" | "neutral"
  unit: string
  icon?: string
}

export interface TransactionSummary {
  activeCount: number
  pendingCount: number
  closedCount: number
  totalValue: number
  projectedIncome: number
}

export interface LeadSummary {
  activeCount: number
  convertedCount: number
  conversionRate: number
  potentialValue: number
}

export interface DateRange {
  start: Date
  end: Date
}

export type TimeFilter = "mtd" | "qtd" | "ytd" | "custom"
