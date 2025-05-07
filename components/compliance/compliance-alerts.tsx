import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, AlertCircle, CheckCircle, Clock, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ComplianceAlertsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ComplianceAlerts({ className, ...props }: ComplianceAlertsProps) {
  // Mock data - in a real app, this would come from an API
  const alerts = [
    {
      id: 1,
      type: "critical",
      icon: AlertTriangle,
      title: "Missing Agency Disclosure",
      description: "Required document missing for 123 Main St transaction",
      transaction: "TX-1234",
      dueDate: "Mar 25, 2025",
    },
    {
      id: 2,
      type: "warning",
      icon: AlertCircle,
      title: "Inspection Contingency Expiring",
      description: "Inspection contingency expires in 3 days for 456 Oak Ave",
      transaction: "TX-1235",
      dueDate: "Mar 23, 2025",
    },
    {
      id: 3,
      type: "success",
      icon: CheckCircle,
      title: "All Compliance Requirements Met",
      description: "789 Pine Rd transaction has met all compliance requirements",
      transaction: "TX-1236",
      dueDate: "Completed",
    },
    {
      id: 4,
      type: "info",
      icon: Clock,
      title: "Broker Review Pending",
      description: "Transaction documents submitted and awaiting broker review",
      transaction: "TX-1238",
      dueDate: "In Progress",
    },
  ]

  return (
    <Card className={cn("shadow-soft card-hover overflow-hidden", className)} {...props}>
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-poppins text-purple-700">Compliance Alerts</CardTitle>
        <CardDescription>Important compliance notifications requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {alerts.map((alert) => (
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
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
