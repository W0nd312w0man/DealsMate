"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, Plus } from "lucide-react"

export function DocumentList() {
  // This is a placeholder component - replace with actual implementation
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction Documents</CardTitle>
            <CardDescription>Manage documents for this transaction</CardDescription>
          </div>
          <Button className="gap-1">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md border p-4">
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="flex-1">
                <h3 className="font-medium">Purchase Agreement</h3>
                <p className="text-sm text-muted-foreground">Uploaded on Nov 10, 2023</p>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          </div>
          <div className="rounded-md border p-4">
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="flex-1">
                <h3 className="font-medium">Inspection Report</h3>
                <p className="text-sm text-muted-foreground">Uploaded on Nov 15, 2023</p>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          </div>
          <div className="rounded-md border p-4">
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="flex-1">
                <h3 className="font-medium">Disclosure Statement</h3>
                <p className="text-sm text-muted-foreground">Uploaded on Nov 12, 2023</p>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          </div>
          <Button variant="outline" className="w-full gap-1">
            <Plus className="h-4 w-4" />
            Add Document
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
