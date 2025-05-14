"use client"

import { useState, useEffect } from "react"
import type {
  LeaderboardUser,
  MetricDetail,
  LeaderboardSortOption,
  LeaderboardFilterOption,
  LeaderboardTimeOption,
} from "@/types/leaderboard"

// Mock data for leaderboard
const mockLeaderboardData: LeaderboardUser[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/stylized-letters-sj.png",
    rank: 1,
    metrics: {
      transactions: 24,
      volume: 5750000,
      income: 187500,
      leads: 32,
    },
    change: 0,
    changeType: "neutral",
    coAgent: null,
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "/microphone-concert-stage.png",
    rank: 2,
    metrics: {
      transactions: 22,
      volume: 5250000,
      income: 168750,
      leads: 28,
    },
    change: 2,
    changeType: "increase",
    coAgent: {
      id: "8",
      name: "Lisa Wong",
      avatar: "/abstract-lw.png",
    },
  },
  {
    id: "3",
    name: "David Rodriguez",
    avatar: "/abstract-geometric-DR.png",
    rank: 3,
    metrics: {
      transactions: 20,
      volume: 4800000,
      income: 156000,
      leads: 26,
    },
    change: 1,
    changeType: "decrease",
    coAgent: null,
  },
  {
    id: "4",
    name: "Emily Taylor",
    avatar: "/et-phone-home.png",
    rank: 4,
    metrics: {
      transactions: 18,
      volume: 4200000,
      income: 142500,
      leads: 24,
    },
    change: 1,
    changeType: "increase",
    coAgent: null,
  },
  {
    id: "5",
    name: "James Wilson",
    avatar: "/intertwined-letters.png",
    rank: 5,
    metrics: {
      transactions: 16,
      volume: 3800000,
      income: 127500,
      leads: 22,
    },
    change: 2,
    changeType: "decrease",
    coAgent: {
      id: "12",
      name: "Robert Garcia",
      avatar: "/abstract-geometric-rg.png",
    },
  },
  {
    id: "6",
    name: "Jessica Martinez",
    avatar: "/abstract-jm.png",
    rank: 6,
    metrics: {
      transactions: 15,
      volume: 3500000,
      income: 112500,
      leads: 20,
    },
    change: 0,
    changeType: "neutral",
    coAgent: null,
  },
  {
    id: "7",
    name: "Thomas Brown",
    avatar: "/abstract-geometric-tb.png",
    rank: 7,
    metrics: {
      transactions: 14,
      volume: 3200000,
      income: 105000,
      leads: 18,
    },
    change: 3,
    changeType: "increase",
    coAgent: null,
  },
  {
    id: "8",
    name: "Lisa Wong",
    avatar: "/abstract-lw.png",
    rank: 8,
    metrics: {
      transactions: 12,
      volume: 2800000,
      income: 92500,
      leads: 16,
    },
    change: 1,
    changeType: "decrease",
    coAgent: {
      id: "2",
      name: "Michael Chen",
      avatar: "/microphone-concert-stage.png",
    },
  },
  {
    id: "9",
    name: "Kevin Lee",
    avatar: "/abstract-geometric-kl.png",
    rank: 9,
    metrics: {
      transactions: 10,
      volume: 2400000,
      income: 78000,
      leads: 14,
    },
    change: 0,
    changeType: "neutral",
    coAgent: null,
  },
  {
    id: "10",
    name: "Amanda Clark",
    avatar: "/air-conditioner-unit.png",
    rank: 10,
    metrics: {
      transactions: 8,
      volume: 1900000,
      income: 62500,
      leads: 12,
    },
    change: 2,
    changeType: "increase",
    coAgent: null,
  },
]

// Mock data for metric details
const mockMetricDetails: MetricDetail[] = [
  {
    id: "transactions",
    name: "Transactions",
    description: "The total number of real estate transactions closed within the selected time period.",
    calculation: "Sum of all closed transactions where you are listed as the agent or co-agent.",
    unit: "transactions",
    benchmarks: {
      low: 8,
      average: 16,
      high: 24,
    },
    tips: [
      "Focus on lead generation to increase your transaction pipeline",
      "Improve your closing ratio by enhancing your follow-up process",
      "Consider partnering with other agents on larger deals",
    ],
    historicalData: [
      { date: "Jan", value: 12 },
      { date: "Feb", value: 14 },
      { date: "Mar", value: 16 },
      { date: "Apr", value: 15 },
      { date: "May", value: 18 },
      { date: "Jun", value: 20 },
      { date: "Jul", value: 22 },
      { date: "Aug", value: 24 },
      { date: "Sep", value: 22 },
      { date: "Oct", value: 20 },
      { date: "Nov", value: 18 },
      { date: "Dec", value: 16 },
    ],
  },
  {
    id: "volume",
    name: "Sales Volume",
    description: "The total dollar value of all closed transactions within the selected time period.",
    calculation: "Sum of the sale price of all closed transactions where you are listed as the agent or co-agent.",
    unit: "USD",
    benchmarks: {
      low: 2000000,
      average: 4000000,
      high: 6000000,
    },
    tips: [
      "Focus on higher-value properties to increase your volume",
      "Develop expertise in luxury markets",
      "Build relationships with investors who purchase multiple properties",
    ],
    historicalData: [
      { date: "Jan", value: 2800000 },
      { date: "Feb", value: 3200000 },
      { date: "Mar", value: 3600000 },
      { date: "Apr", value: 3400000 },
      { date: "May", value: 4000000 },
      { date: "Jun", value: 4400000 },
      { date: "Jul", value: 4800000 },
      { date: "Aug", value: 5200000 },
      { date: "Sep", value: 4800000 },
      { date: "Oct", value: 4400000 },
      { date: "Nov", value: 4000000 },
      { date: "Dec", value: 3600000 },
    ],
  },
  {
    id: "income",
    name: "Projected Income",
    description: "The estimated commission income from all closed transactions within the selected time period.",
    calculation: "Sum of (Sale Price × Commission Rate × Your Split) for all closed transactions.",
    unit: "USD",
    benchmarks: {
      low: 65000,
      average: 130000,
      high: 195000,
    },
    tips: [
      "Negotiate higher commission rates when possible",
      "Review your broker split to ensure it's competitive",
      "Focus on both transaction count and property values",
    ],
    historicalData: [
      { date: "Jan", value: 91000 },
      { date: "Feb", value: 104000 },
      { date: "Mar", value: 117000 },
      { date: "Apr", value: 110500 },
      { date: "May", value: 130000 },
      { date: "Jun", value: 143000 },
      { date: "Jul", value: 156000 },
      { date: "Aug", value: 169000 },
      { date: "Sep", value: 156000 },
      { date: "Oct", value: 143000 },
      { date: "Nov", value: 130000 },
      { date: "Dec", value: 117000 },
    ],
  },
  {
    id: "leads",
    name: "Active Leads",
    description: "The total number of potential clients you're actively working with during the selected time period.",
    calculation: "Count of all leads marked as 'active' in your CRM system.",
    unit: "leads",
    benchmarks: {
      low: 12,
      average: 22,
      high: 32,
    },
    tips: [
      "Implement a consistent lead generation strategy",
      "Improve your lead qualification process",
      "Use automation to stay in touch with your lead database",
    ],
    historicalData: [
      { date: "Jan", value: 16 },
      { date: "Feb", value: 18 },
      { date: "Mar", value: 20 },
      { date: "Apr", value: 19 },
      { date: "May", value: 22 },
      { date: "Jun", value: 24 },
      { date: "Jul", value: 26 },
      { date: "Aug", value: 28 },
      { date: "Sep", value: 26 },
      { date: "Oct", value: 24 },
      { date: "Nov", value: 22 },
      { date: "Dec", value: 20 },
    ],
  },
]

export function useLeaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>(mockLeaderboardData)
  const [metricDetails, setMetricDetails] = useState<MetricDetail[]>(mockMetricDetails)
  const [selectedMetric, setSelectedMetric] = useState<MetricDetail | null>(null)
  const [sortOption, setSortOption] = useState<LeaderboardSortOption>("rank")
  const [filterOption, setFilterOption] = useState<LeaderboardFilterOption>("all")
  const [timeOption, setTimeOption] = useState<LeaderboardTimeOption>("month")
  const [isLoading, setIsLoading] = useState(false)
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(mockLeaderboardData[3]) // Mocking current user as Emily Taylor

  // Get metric detail by ID
  const getMetricDetail = (id: string) => {
    return metricDetails.find((metric) => metric.id === id) || null
  }

  // Sort leaderboard data
  const sortLeaderboard = (data: LeaderboardUser[], option: LeaderboardSortOption) => {
    return [...data].sort((a, b) => {
      if (option === "rank") {
        return a.rank - b.rank
      }
      if (option === "name") {
        return a.name.localeCompare(b.name)
      }
      return b.metrics[option] - a.metrics[option]
    })
  }

  // Filter leaderboard data
  const filterLeaderboard = (data: LeaderboardUser[], option: LeaderboardFilterOption) => {
    // In a real app, this would filter based on team, office, or region
    // For now, we'll just return all data
    return data
  }

  // Fetch leaderboard data based on time period
  const fetchLeaderboardData = (timeOption: LeaderboardTimeOption) => {
    setIsLoading(true)

    // In a real app, this would be an API call
    setTimeout(() => {
      // Apply any time-based modifications to the mock data
      // For this demo, we'll just use the same data
      setLeaderboardData(mockLeaderboardData)
      setIsLoading(false)
    }, 800)
  }

  // Effect to fetch data when time option changes
  useEffect(() => {
    fetchLeaderboardData(timeOption)
  }, [timeOption])

  // Get processed leaderboard data with sorting and filtering applied
  const getProcessedLeaderboardData = () => {
    const filtered = filterLeaderboard(leaderboardData, filterOption)
    return sortLeaderboard(filtered, sortOption)
  }

  return {
    leaderboardData: getProcessedLeaderboardData(),
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
    isLoading,
    currentUserRank,
  }
}
