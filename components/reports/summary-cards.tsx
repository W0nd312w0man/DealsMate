"use client"

import type { TransactionSummary, LeadSummary } from "@/types/reports"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import { FileText, Users, DollarSign, TrendingUp, Clock } from "lucide-react"

interface SummaryCardsProps {
  transactionSummary: TransactionSummary
  leadSummary: LeadSummary
}

export function SummaryCards({ transactionSummary, leadSummary }: SummaryCardsProps) {
  return (
    <Tabs defaultValue="transactions" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="transactions" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Transactions</CardTitle>
                <CardDescription className="text-2xl font-bold text-foreground">
                  {transactionSummary.activeCount}
                </CardDescription>
              </div>
              <FileText className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {transactionSummary.pendingCount} pending, {transactionSummary.closedCount} closed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
                <CardDescription className="text-2xl font-bold text-foreground">
                  {formatCurrency(transactionSummary.totalValue)}
                </CardDescription>
              </div>
              <DollarSign className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Average: {formatCurrency(transactionSummary.totalValue / (transactionSummary.activeCount || 1))}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Projected Income</CardTitle>
                <CardDescription className="text-2xl font-bold text-foreground">
                  {formatCurrency(transactionSummary.projectedIncome)}
                </CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {((transactionSummary.projectedIncome / transactionSummary.totalValue) * 100).toFixed(1)}% commission
                rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Days to Close</CardTitle>
                <CardDescription className="text-2xl font-bold text-foreground">42</CardDescription>
              </div>
              <Clock className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Industry average: 47 days</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="leads" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Leads</CardTitle>
                <CardDescription className="text-2xl font-bold text-foreground">
                  {leadSummary.activeCount}
                </CardDescription>
              </div>
              <Users className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{leadSummary.convertedCount} converted this period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
                <CardDescription className="text-2xl font-bold text-foreground">
                  {leadSummary.conversionRate.toFixed(1)}%
                </CardDescription>
              </div>
              <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 text-xs font-bold">%</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Industry average: 42%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Potential Value</CardTitle>
                <CardDescription className="text-2xl font-bold text-foreground">
                  {formatCurrency(leadSummary.potentialValue)}
                </CardDescription>
              </div>
              <DollarSign className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Avg: {formatCurrency(leadSummary.potentialValue / leadSummary.activeCount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Days to Convert</CardTitle>
                <CardDescription className="text-2xl font-bold text-foreground">18</CardDescription>
              </div>
              <Clock className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Your best: 7 days</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
