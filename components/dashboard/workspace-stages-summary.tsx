"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Home, Users, Archive } from "lucide-react"

export function WorkspaceStagesSummary() {
  // Mock data for workspaces
  const workspaceData = {
    total: 40,
    active: 35,
    archived: 5,
    byType: {
      buyer: 20,
      seller: 20,
    },
  }

  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-green-500"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-poppins text-purple-700">Workspaces</CardTitle>
        <CardDescription>Overview of your workspaces</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-100 p-2">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">Active</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{workspaceData.active}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Home className="h-3.5 w-3.5 text-blue-500" />
                <span>{workspaceData.byType.buyer} Buyers</span>
              </div>
              <div className="flex items-center gap-1">
                <Building className="h-3.5 w-3.5 text-blue-500" />
                <span>{workspaceData.byType.seller} Sellers</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-gray-100 p-2">
                  <Archive className="h-4 w-4 text-gray-600" />
                </div>
                <span className="font-medium">Archived</span>
              </div>
              <span className="text-2xl font-bold text-gray-600">{workspaceData.archived}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Archived workspaces are hidden by default</span>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-purple-100 p-2">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <span className="font-medium">Total</span>
              </div>
              <span className="text-2xl font-bold text-purple-600">{workspaceData.total}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>All workspaces in your account</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium mb-2">Convert to Transaction</div>
          <p className="text-sm text-muted-foreground">
            To apply stages (Nurturing, Actively Searching, Under Contract, etc.) or status (Active, Pending, Closed,
            etc.), convert a workspace into a transaction. This enables the full Dealsmate.io transaction journey.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
