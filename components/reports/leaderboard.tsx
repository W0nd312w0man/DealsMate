"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Minus, Info, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatCurrency } from "@/lib/utils"
import type {
  LeaderboardUser,
  LeaderboardSortOption,
  LeaderboardFilterOption,
  LeaderboardTimeOption,
} from "@/types/leaderboard"

interface LeaderboardProps {
  data: LeaderboardUser[]
  currentUser: LeaderboardUser | null
  isLoading: boolean
  sortOption: LeaderboardSortOption
  onSortChange: (option: LeaderboardSortOption) => void
  filterOption: LeaderboardFilterOption
  onFilterChange: (option: LeaderboardFilterOption) => void
  timeOption: LeaderboardTimeOption
  onTimeChange: (option: LeaderboardTimeOption) => void
  onMetricInfoClick: (metricId: string) => void
}

export function Leaderboard({
  data,
  currentUser,
  isLoading,
  sortOption,
  onSortChange,
  filterOption,
  onFilterChange,
  timeOption,
  onTimeChange,
  onMetricInfoClick,
}: LeaderboardProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const renderRankChange = (user: LeaderboardUser) => {
    if (!user.change || user.change === 0) {
      return <Minus className="h-4 w-4 text-gray-500" />
    }

    if (user.changeType === "increase") {
      return (
        <div className="flex items-center text-green-600">
          <ArrowUp className="h-4 w-4 mr-1" />
          <span className="text-xs">{user.change}</span>
        </div>
      )
    }

    return (
      <div className="flex items-center text-red-600">
        <ArrowDown className="h-4 w-4 mr-1" />
        <span className="text-xs">{user.change}</span>
      </div>
    )
  }

  const formatMetricValue = (metricId: string, value: number) => {
    if (metricId === "volume" || metricId === "income") {
      return formatCurrency(value)
    }
    return value.toString()
  }

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl font-semibold">Performance Leaderboard</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Select value={timeOption} onValueChange={(value) => onTimeChange(value as LeaderboardTimeOption)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterOption} onValueChange={(value) => onFilterChange(value as LeaderboardFilterOption)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Filter By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="team">My Team</SelectItem>
                <SelectItem value="office">My Office</SelectItem>
                <SelectItem value="region">My Region</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={sortOption === "rank" ? "font-bold text-purple-700" : ""}
                      onClick={() => onSortChange("rank")}
                    >
                      Rank
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={sortOption === "name" ? "font-bold text-purple-700" : ""}
                      onClick={() => onSortChange("name")}
                    >
                      Agent
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={sortOption === "transactions" ? "font-bold text-purple-700" : ""}
                        onClick={() => onSortChange("transactions")}
                      >
                        Transactions
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1"
                              onClick={() => onMetricInfoClick("transactions")}
                            >
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Transactions Info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View transaction metric details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={sortOption === "volume" ? "font-bold text-purple-700" : ""}
                        onClick={() => onSortChange("volume")}
                      >
                        Volume
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1"
                              onClick={() => onMetricInfoClick("volume")}
                            >
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Volume Info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View volume metric details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={sortOption === "income" ? "font-bold text-purple-700" : ""}
                        onClick={() => onSortChange("income")}
                      >
                        Income
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1"
                              onClick={() => onMetricInfoClick("income")}
                            >
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Income Info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View income metric details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={sortOption === "leads" ? "font-bold text-purple-700" : ""}
                        onClick={() => onSortChange("leads")}
                      >
                        Leads
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1"
                              onClick={() => onMetricInfoClick("leads")}
                            >
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Leads Info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View leads metric details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((user) => (
                  <TableRow
                    key={user.id}
                    className={
                      currentUser && user.id === currentUser.id
                        ? "bg-purple-50 dark:bg-purple-950/20"
                        : hoveredRow === user.id
                          ? "bg-gray-50 dark:bg-gray-800/50"
                          : ""
                    }
                    onMouseEnter={() => setHoveredRow(user.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <span className="mr-2">{user.rank}</span>
                        {renderRankChange(user)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.name}
                            {currentUser && user.id === currentUser.id && (
                              <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-800 border-purple-200">
                                You
                              </Badge>
                            )}
                          </div>
                          {user.coAgent && (
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Users className="h-3 w-3 mr-1" />
                              <span>Co-Agent: {user.coAgent.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatMetricValue("transactions", user.metrics.transactions)}
                    </TableCell>
                    <TableCell className="text-right">{formatMetricValue("volume", user.metrics.volume)}</TableCell>
                    <TableCell className="text-right">{formatMetricValue("income", user.metrics.income)}</TableCell>
                    <TableCell className="text-right">{formatMetricValue("leads", user.metrics.leads)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
