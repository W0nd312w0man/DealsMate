"use client"

import { useState } from "react"
import { BotIcon, ChevronDown, ChevronUp, Lightbulb, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TalosInsight {
  id: string
  title: string
  description: string
  type: "suggestion" | "insight" | "alert"
  actionText?: string
  actionUrl?: string
  dismissed?: boolean
}

export function TalosInsights() {
  const [expanded, setExpanded] = useState(true)
  const [insights, setInsights] = useState<TalosInsight[]>([
    {
      id: "insight-1",
      title: "Transaction volume increased by 15% this month",
      description:
        "Your transaction volume has increased compared to last month. Consider reviewing your capacity and resources.",
      type: "insight",
      actionText: "View Analytics",
      actionUrl: "/reports",
    },
    {
      id: "suggestion-1",
      title: "Optimize your transaction workflow",
      description:
        "Based on your recent activity, you could save 2 hours per transaction by automating document collection.",
      type: "suggestion",
      actionText: "Setup Automation",
      actionUrl: "/settings/automation",
    },
    {
      id: "alert-1",
      title: "3 transactions need attention",
      description: "Three transactions have upcoming deadlines within the next 48 hours that require your attention.",
      type: "alert",
      actionText: "View Transactions",
      actionUrl: "/transactions/filtered?status=attention",
    },
  ])

  const dismissInsight = (id: string) => {
    setInsights((prev) => prev.filter((insight) => insight.id !== id))
  }

  const getIcon = (type: TalosInsight["type"]) => {
    switch (type) {
      case "suggestion":
        return <Lightbulb className="h-5 w-5 text-amber-500" />
      case "insight":
        return <BotIcon className="h-5 w-5 text-purple-500" />
      case "alert":
        return <BotIcon className="h-5 w-5 text-pink-500" />
      default:
        return <BotIcon className="h-5 w-5 text-purple-500" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BotIcon className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg">TALOS AI Insights</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription>AI-powered insights to help optimize your workflow</CardDescription>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-2">
          {insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={cn(
                    "relative rounded-md border p-3",
                    insight.type === "alert"
                      ? "border-pink-200 bg-pink-50"
                      : insight.type === "suggestion"
                        ? "border-amber-200 bg-amber-50"
                        : "border-purple-200 bg-purple-50",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{getIcon(insight.type)}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                      {insight.actionText && (
                        <Button
                          variant="link"
                          className={cn(
                            "h-auto p-0 text-xs font-medium mt-1",
                            insight.type === "alert"
                              ? "text-pink-700"
                              : insight.type === "suggestion"
                                ? "text-amber-700"
                                : "text-purple-700",
                          )}
                        >
                          {insight.actionText}
                        </Button>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 absolute top-2 right-2 text-muted-foreground opacity-70 hover:opacity-100"
                    onClick={() => dismissInsight(insight.id)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <BotIcon className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No insights available at this time</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
