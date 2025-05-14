export interface LeaderboardUser {
  id: string
  name: string
  avatar?: string
  rank: number
  metrics: {
    [key: string]: number
  }
  change?: number
  changeType?: "increase" | "decrease" | "neutral"
  coAgent?: {
    id: string
    name: string
    avatar?: string
  } | null
}

export interface LeaderboardData {
  timeFrame: string
  users: LeaderboardUser[]
}

export interface MetricDetail {
  id: string
  name: string
  description: string
  calculation: string
  unit: string
  benchmarks?: {
    low: number
    average: number
    high: number
  }
  tips?: string[]
  historicalData?: {
    date: string
    value: number
  }[]
}

export type LeaderboardSortOption = "rank" | "name" | "transactions" | "volume" | "income" | "leads"
export type LeaderboardFilterOption = "all" | "team" | "office" | "region"
export type LeaderboardTimeOption = "week" | "month" | "quarter" | "year"
