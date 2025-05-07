import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ComplianceDocumentsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ComplianceDocuments({ className, ...props }: ComplianceDocumentsProps) {
  // Mock data - in a real app, this would come from an API
  const documents = [
    {
      id: 1,
      name: "Agency Disclosure Template",
      type: "Template",
      description: "Standard agency disclosure form",
      relatedTransactions: ["TX-1234", "TX-1235"],
    },
    {
      id: 2,
      name: "Lead-Based Paint Disclosure",
      type: "Template",
      description: "Required for pre-1978 properties",
      relatedTransactions: ["TX-1234"],
    },
    {
      id: 3,
      name: "Seller's Property Disclosure",
      type: "Template",
      description: "Standard seller disclosure form",
      relatedTransactions: ["TX-1236"],
    },
    {
      id: 4,
      name: "Compliance Guidelines",
      type: "Guide",
      description: "Current compliance requirements",
      updated: "Mar 1, 2025",
      relatedTransactions: [],
    },
    {
      id: 5,
      name: "Broker Compliance Checklist",
      type: "Checklist",
      description: "Broker review requirements",
      relatedTransactions: [],
    },
  ]

  return (
    <Card className={cn("shadow-soft card-hover overflow-hidden", className)} {...props}>
      <div className="h-1 w-full bg-gradient-to-r from-pink-500 to-purple-400"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-poppins text-purple-700">Compliance Resources</CardTitle>
        <CardDescription>Templates and guides for compliance requirements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((document) => (
            <div key={document.id} className="flex flex-col space-y-2 rounded-md border p-3 hover:bg-muted/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-sm">{document.name}</span>
                </div>
                <Badge variant="outline" className="border-purple-200 text-purple-700">
                  {document.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{document.description}</p>
              {document.updated && <p className="text-xs text-muted-foreground">Updated: {document.updated}</p>}

              {document.relatedTransactions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {document.relatedTransactions.map((tx) => (
                    <Badge key={tx} variant="outline" className="text-[10px] bg-purple-50">
                      <Link href={`/transactions/${tx}?tab=compliance`} className="hover:text-purple-700">
                        {tx}
                      </Link>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  <Eye className="h-3 w-3" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  <Download className="h-3 w-3" />
                  Download
                </Button>
                {document.type === "Template" && (
                  <Button variant="outline" size="sm" className="gap-1 text-xs ml-auto">
                    <Upload className="h-3 w-3" />
                    Use Template
                  </Button>
                )}
              </div>
            </div>
          ))}

          <Button className="w-full gap-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity">
            View All Compliance Resources
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
