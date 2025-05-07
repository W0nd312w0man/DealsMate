import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  type TransactionStatus,
  type TransactionType,
  getStagesByType,
  getStatusColor,
  getStatusDescription,
} from "@/types/transaction"

interface TransactionDetailsProps {
  transaction: {
    id: string
    address: string
    type: TransactionType
    status: TransactionStatus
    stage: string
    price: string
    client: string
    dueDate: string
    description: string
    mlsNumber: string
    closeDate: string
    needsAttention?: boolean
    attentionReason?: string
    attentionDetails?: string
  }
}

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  // Get all stages for this transaction type
  const allStages = getStagesByType(transaction.type)

  // Map attention reason
  const getAttentionReason = () => {
    if (!transaction.attentionReason) return null

    switch (transaction.attentionReason) {
      case "documents":
        return "documents"
      case "broker":
        return "broker"
      case "commission":
        return "commission"
      default:
        return "other"
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Address</dt>
              <dd className="mt-1">{transaction.address}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">MLS Number</dt>
              <dd className="mt-1">{transaction.mlsNumber}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Transaction Type</dt>
              <dd className="mt-1">{transaction.type}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Price</dt>
              <dd className="mt-1">{transaction.price}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">Description</dt>
              <dd className="mt-1">{transaction.description}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Dates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Closing Date</div>
                <div className="mt-1">{transaction.closeDate}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Inspection Deadline</div>
                <div className="mt-1">Mar 25, 2025</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Financing Deadline</div>
                <div className="mt-1">Apr 1, 2025</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Appraisal Deadline</div>
                <div className="mt-1">Apr 5, 2025</div>
              </div>
            </div>
            <Separator />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Earnest Money Due</div>
              <div className="mt-1">$15,000 - Due Mar 22, 2025</div>
            </div>
            <Separator />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Final Walkthrough</div>
              <div className="mt-1">Apr 14, 2025 at 10:00 AM</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Transaction Status & Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {transaction.needsAttention && transaction.attentionDetails && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div className="font-medium text-amber-800">Attention Required</div>
                  <Badge className="ml-auto bg-amber-500">{transaction.attentionReason || "Issue"}</Badge>
                </div>
                <p className="mt-2 text-sm text-amber-700">{transaction.attentionDetails}</p>
                <div className="mt-4 flex justify-end">
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                    Resolve Issue
                  </Button>
                </div>
              </div>
            )}

            {/* Transaction Stage Progress */}
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-4">Transaction Journey: {transaction.type}</h3>
              <div className="flex items-center justify-between mb-6">
                {allStages.map((stage, index) => (
                  <div key={stage} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border ${
                        allStages.indexOf(transaction.stage) >= index
                          ? "bg-purple-100 border-purple-300 text-purple-800"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < allStages.length - 1 && (
                      <div
                        className={`h-0.5 w-12 ${
                          allStages.indexOf(transaction.stage) > index ? "bg-purple-300" : "bg-gray-200"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mb-2">
                {allStages.map((stage, index) => (
                  <div
                    key={stage}
                    className={`text-xs font-medium ${
                      transaction.stage === stage
                        ? "text-purple-700"
                        : allStages.indexOf(transaction.stage) > index
                          ? "text-purple-500"
                          : "text-gray-500"
                    }`}
                  >
                    {stage}
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction Status */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Current Status</div>
                  <div className="flex items-center mt-2">
                    <div
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                        transaction.status,
                      )}`}
                    >
                      {transaction.status}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  Update Status
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{getStatusDescription(transaction.status)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
