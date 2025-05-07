"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Upload, FileText } from "lucide-react"

interface TransactionComplianceProps {
  transactionId: string
}

export function TransactionCompliance({ transactionId }: TransactionComplianceProps) {
  // In a real app, this would fetch compliance data for the specific transaction
  const [checklistItems, setChecklistItems] = useState([
    {
      id: 1,
      title: "Agency Disclosure",
      description: "Signed disclosure of agency relationship",
      required: true,
      completed: false,
      dueDate: "Mar 25, 2025",
    },
    {
      id: 2,
      title: "Purchase Agreement",
      description: "Fully executed purchase agreement",
      required: true,
      completed: true,
      dueDate: "Completed",
    },
    {
      id: 3,
      title: "Seller Disclosures",
      description: "Property condition and other required disclosures",
      required: true,
      completed: true,
      dueDate: "Completed",
    },
    {
      id: 4,
      title: "Lead-Based Paint Disclosure",
      description: "Required for properties built before 1978",
      required: true,
      completed: false,
      dueDate: "Mar 28, 2025",
    },
    {
      id: 5,
      title: "Earnest Money Receipt",
      description: "Documentation of earnest money deposit",
      required: true,
      completed: true,
      dueDate: "Completed",
    },
    {
      id: 6,
      title: "Inspection Reports",
      description: "Home, pest, and other inspection reports",
      required: false,
      completed: true,
      dueDate: "Completed",
    },
    {
      id: 7,
      title: "Loan Pre-Approval",
      description: "Buyer's loan pre-approval documentation",
      required: true,
      completed: true,
      dueDate: "Completed",
    },
    {
      id: 8,
      title: "Closing Disclosure",
      description: "Final closing costs and terms",
      required: true,
      completed: false,
      dueDate: "Apr 10, 2025",
    },
  ])

  // Calculate completion percentage
  const completedRequired = checklistItems.filter((item) => item.required && item.completed).length
  const totalRequired = checklistItems.filter((item) => item.required).length
  const completionPercentage = Math.round((completedRequired / totalRequired) * 100)

  // Toggle completion status
  const toggleCompletion = (id: number) => {
    setChecklistItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  // Get missing required items
  const missingRequiredItems = checklistItems.filter((item) => item.required && !item.completed)

  return (
    <div className="space-y-6">
      {/* Compliance Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-soft overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-purple-700">Compliance Status</h3>
                <Badge className={completionPercentage === 100 ? "bg-green-500" : "bg-amber-500"}>
                  {completionPercentage === 100 ? "Complete" : "In Progress"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">Overall Compliance</div>
                  <div className="text-muted-foreground">{completionPercentage}% Complete</div>
                </div>
                <Progress
                  value={completionPercentage}
                  className="h-2 bg-purple-100"
                  indicatorClassName={completionPercentage === 100 ? "bg-green-500" : "bg-purple-600"}
                />
              </div>

              {missingRequiredItems.length > 0 ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <div className="font-medium text-amber-800">Missing Required Documents</div>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-amber-700">
                    {missingRequiredItems.map((item) => (
                      <li key={item.id} className="flex items-center gap-2">
                        <span>• {item.title}</span>
                        <span className="text-xs text-amber-600">Due: {item.dueDate}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div className="font-medium text-green-800">All Required Documents Completed</div>
                  </div>
                  <p className="mt-1 text-sm text-green-700">This transaction has met all compliance requirements.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-purple-700">Compliance Actions</h3>

              <div className="space-y-3">
                <Button className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity">
                  <Upload className="h-4 w-4" />
                  Upload Compliance Document
                </Button>

                <Button variant="outline" className="w-full gap-2 border-purple-200 text-purple-700 hover:bg-purple-50">
                  <FileText className="h-4 w-4" />
                  Generate Compliance Report
                </Button>

                <Button variant="outline" className="w-full gap-2 border-purple-200 text-purple-700 hover:bg-purple-50">
                  <CheckCircle className="h-4 w-4" />
                  Request Broker Compliance Review
                </Button>
              </div>

              <div className="rounded-lg border border-purple-100 bg-purple-50 p-3 text-sm text-purple-700">
                <p className="font-medium">Compliance Deadline</p>
                <p className="mt-1">All required documents must be completed by April 10, 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Checklist */}
      <Card className="shadow-soft overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-purple-700 mb-4">Compliance Checklist</h3>

          <div className="space-y-4">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start space-x-3 rounded-md border p-3 hover:bg-muted/50"
                onClick={() => toggleCompletion(item.id)}
              >
                <Checkbox
                  id={`item-${item.id}`}
                  checked={item.completed}
                  onCheckedChange={() => toggleCompletion(item.id)}
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
                    <span className="text-xs text-muted-foreground">
                      {item.completed ? "Completed" : `Due: ${item.dueDate}`}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
