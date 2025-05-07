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

interface ComplianceChecklistProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ComplianceChecklist({ className, ...props }: ComplianceChecklistProps) {
  // Mock data - in a real app, this would come from an API
  const transactions = [
    { id: "tx-1234", address: "123 Main St (TX-1234)" },
    { id: "tx-1235", address: "456 Oak Ave (TX-1235)" },
    { id: "tx-1236", address: "789 Pine Rd (TX-1236)" },
  ]

  const checklistItems = [
    {
      id: 1,
      title: "Agency Disclosure",
      description: "Signed disclosure of agency relationship",
      required: true,
      completed: false,
      transactionId: "TX-1234",
    },
    {
      id: 2,
      title: "Purchase Agreement",
      description: "Fully executed purchase agreement",
      required: true,
      completed: true,
      transactionId: "TX-1234",
    },
    {
      id: 3,
      title: "Seller Disclosures",
      description: "Property condition and other required disclosures",
      required: true,
      completed: true,
      transactionId: "TX-1234",
    },
    {
      id: 4,
      title: "Lead-Based Paint Disclosure",
      description: "Required for properties built before 1978",
      required: true,
      completed: false,
      transactionId: "TX-1234",
    },
    {
      id: 5,
      title: "Earnest Money Receipt",
      description: "Documentation of earnest money deposit",
      required: true,
      completed: true,
      transactionId: "TX-1235",
    },
    {
      id: 6,
      title: "Inspection Reports",
      description: "Home, pest, and other inspection reports",
      required: false,
      completed: true,
      transactionId: "TX-1235",
    },
    {
      id: 7,
      title: "Loan Pre-Approval",
      description: "Buyer's loan pre-approval documentation",
      required: true,
      completed: true,
      transactionId: "TX-1236",
    },
    {
      id: 8,
      title: "Closing Disclosure",
      description: "Final closing costs and terms",
      required: true,
      completed: false,
      transactionId: "TX-1236",
    },
  ]

  // Calculate completion percentage
  const completedRequired = checklistItems.filter((item) => item.required && item.completed).length
  const totalRequired = checklistItems.filter((item) => item.required).length
  const completionPercentage = Math.round((completedRequired / totalRequired) * 100)

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
            {checklistItems.map((item) => (
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
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
