"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, TrendingUp, Calculator, Lightbulb, BarChart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { MetricDetail } from "@/types/leaderboard"

interface MetricDetailProps {
  metric: MetricDetail
  onClose: () => void
}

export function MetricDetailView({ metric, onClose }: MetricDetailProps) {
  const formatValue = (value: number) => {
    if (metric.unit === "USD") {
      return formatCurrency(value)
    }
    return value.toString()
  }

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{metric.name}</CardTitle>
            <CardDescription>{metric.description}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calculation">Calculation</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p>{metric.description}</p>
              </div>

              {metric.historicalData && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                    <BarChart className="h-4 w-4 mr-1" />
                    Historical Trend
                  </h3>
                  <div className="h-48 w-full">
                    <div className="flex h-40 items-end space-x-2">
                      {metric.historicalData.map((data, index) => {
                        const maxValue = Math.max(...metric.historicalData!.map((d) => d.value))
                        const height = (data.value / maxValue) * 100

                        return (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div
                              className="w-full bg-purple-200 dark:bg-purple-950/50 rounded-t"
                              style={{ height: `${height}%` }}
                            >
                              <div className="h-1 w-full bg-purple-600 rounded-t"></div>
                            </div>
                            <div className="text-xs mt-2 text-muted-foreground">{data.date}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="calculation" className="pt-4">
            <div className="space-y-4">
              <div className="flex items-start">
                <Calculator className="h-5 w-5 mr-2 mt-0.5 text-purple-700" />
                <div>
                  <h3 className="text-sm font-medium mb-1">Calculation Method</h3>
                  <p>{metric.calculation}</p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Unit of Measurement</h3>
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                  {metric.unit === "USD" ? "Currency (USD)" : metric.unit}
                </Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="benchmarks" className="pt-4">
            {metric.benchmarks ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Performance Benchmarks</h3>
                  <p className="mb-4">Compare your performance against these industry benchmarks:</p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Low Performer</span>
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                        {formatValue(metric.benchmarks.low)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Performer</span>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        {formatValue(metric.benchmarks.average)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>High Performer</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        {formatValue(metric.benchmarks.high)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="relative pt-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted-foreground/20"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white dark:bg-gray-950 px-2 text-xs text-muted-foreground">
                      Performance Scale
                    </span>
                  </div>
                </div>

                <div className="h-8 w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-md relative">
                  {[metric.benchmarks.low, metric.benchmarks.average, metric.benchmarks.high].map((value, index) => {
                    const maxValue = metric.benchmarks!.high * 1.2
                    const position = (value / maxValue) * 100

                    return (
                      <div
                        key={index}
                        className="absolute -top-6 transform -translate-x-1/2"
                        style={{ left: `${position}%` }}
                      >
                        <div className="h-4 w-0.5 bg-gray-400 mb-1 mx-auto"></div>
                        <div className="text-xs whitespace-nowrap">{formatValue(value)}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No benchmark data available for this metric.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tips" className="pt-4">
            {metric.tips ? (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Tips to Improve
                </h3>

                <ul className="space-y-3">
                  {metric.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        <TrendingUp className="h-3 w-3" />
                      </div>
                      <p>{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No tips available for this metric.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
