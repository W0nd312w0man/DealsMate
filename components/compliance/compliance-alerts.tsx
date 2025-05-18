import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ComplianceAlertsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ComplianceAlerts({ className, ...props }: ComplianceAlertsProps) {
  // Mock data - in a real app, this would come from an API
  const alerts = []

  return (
    <Card className={cn("shadow-soft card-hover overflow-hidden", className)} {...props}>
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-poppins text-purple-700">Compliance Alerts</CardTitle>
        <CardDescription>Important compliance notifications requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "flex items-start gap-4 rounded-lg p-4 transition-colors",
                  alert.type === "critical"
                    ? "bg-red-50"
                    : alert.type === "warning"
                      ? "bg-amber-50"
                      : alert.type === "success"
                        ? "bg-green-50"
                        : "bg-blue-50",
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                    alert.type === "critical"
                      ? "bg-red-100 text-red-600"
                      : alert.type === "warning"
                        ? "bg-amber-100 text-amber-600"
                        : alert.type === "success"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600",
                  )}
                >
                  <alert.icon className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{alert.title}</div>
                    <Badge
                      className={cn(
                        alert.type === "critical"
                          ? "bg-red-500"
                          : alert.type === "warning"
                            ? "bg-amber-500"
                            : alert.type === "success"
                              ? "bg-green-500"
                              : "bg-blue-500",
                      )}
                    >
                      {alert.type === "critical"
                        ? "Critical"
                        : alert.type === "warning"
                          ? "Warning"
                          : alert.type === "success"
                            ? "Completed"
                            : "Info"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{alert.transaction}</span> • Due: {alert.dueDate}
                    </div>
                    {alert.type !== "success" && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="gap-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
                      >
                        <Link href={`/transactions/${alert.transaction}?tab=compliance`}>
                          Resolve
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-purple-200 mb-4" />
              <h3 className="text-lg font-medium text-purple-700">No Compliance Alerts</h3>
              <p className="text-sm text-muted-foreground mt-1">
                All compliance requirements are currently up to date.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
