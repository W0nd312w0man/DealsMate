import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CheckCircle } from "lucide-react"

interface ComplianceChecklistProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ComplianceChecklist({ className, ...props }: ComplianceChecklistProps) {
  // Mock data - in a real app, this would come from an API
  const transactions = []

  const checklistItems = []

  // Calculate completion percentage
  const completedRequired = checklistItems.filter((item) => item.required && item.completed).length
  const totalRequired = checklistItems.filter((item) => item.required).length
  const completionPercentage = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0

  return (
    <Card className={cn("shadow-soft card-hover overflow-hidden", className)} {...props}>
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-400"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-poppins text-purple-700">Compliance Checklist</CardTitle>
            <CardDescription>Required documents and compliance items</CardDescription>
          </div>
          <div className="w-40">
            <Select defaultValue="all">
              <SelectTrigger className="h-8 border-purple-200 focus:ring-purple-600">
                <SelectValue placeholder="Filter by transaction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                {transactions.map((tx) => (
                  <SelectItem key={tx.id} value={tx.id}>
                    {tx.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="font-medium">Compliance Progress</div>
              <div className="text-muted-foreground">{completionPercentage}% Complete</div>
            </div>
            <Progress value={completionPercentage} className="h-2 bg-purple-100" indicatorClassName="bg-purple-600" />
          </div>

          <div className="space-y-4">
            {checklistItems.length > 0 ? (
              checklistItems.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 rounded-md border p-3 hover:bg-muted/50">
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={item.completed}
                    className="mt-1 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`item-${item.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item.title}
                        {item.required && <span className="ml-2 text-xs text-red-500">*Required</span>}
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-6 text-xs text-purple-600 hover:text-purple-700"
                      >
                        <Link href={`/transactions/${item.transactionId}?tab=compliance`}>
                          View Transaction
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <div className="text-xs text-muted-foreground mt-1">Transaction: {item.transactionId}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-12 w-12 text-purple-200 mb-4" />
                <h3 className="text-lg font-medium text-purple-700">No Compliance Items</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  No compliance checklist items are currently available.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
