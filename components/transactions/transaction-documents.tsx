"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Upload, Download, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TransactionDocumentsProps {
  transactionId: string
}

// Mock data - in a real app, this would come from an API
const documents = [
  {
    id: "DOC-001",
    name: "Purchase Agreement",
    type: "Contract",
    status: "Approved",
    uploadedBy: "John Doe",
    uploadDate: "Mar 15, 2025",
    size: "2.4 MB",
  },
  {
    id: "DOC-002",
    name: "Seller Disclosure",
    type: "Disclosure",
    status: "Pending",
    uploadedBy: "John Doe",
    uploadDate: "Mar 16, 2025",
    size: "1.8 MB",
  },
  {
    id: "DOC-003",
    name: "Loan Pre-Approval",
    type: "Financial",
    status: "Approved",
    uploadedBy: "Sarah Smith",
    uploadDate: "Mar 17, 2025",
    size: "1.2 MB",
  },
  {
    id: "DOC-004",
    name: "Property Inspection Report",
    type: "Inspection",
    status: "Missing",
    uploadedBy: "",
    uploadDate: "",
    size: "",
  },
  {
    id: "DOC-005",
    name: "Earnest Money Receipt",
    type: "Financial",
    status: "Approved",
    uploadedBy: "John Doe",
    uploadDate: "Mar 18, 2025",
    size: "0.8 MB",
  },
]

export function TransactionDocuments({ transactionId }: TransactionDocumentsProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Button className="gap-1">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Size</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium">
                  {document.name}
                  <div className="text-xs text-muted-foreground">{document.id}</div>
                </TableCell>
                <TableCell>{document.type}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      document.status === "Approved"
                        ? "default"
                        : document.status === "Pending"
                          ? "outline"
                          : "destructive"
                    }
                  >
                    {document.status}
                  </Badge>
                </TableCell>
                <TableCell>{document.uploadedBy || "—"}</TableCell>
                <TableCell>{document.uploadDate || "—"}</TableCell>
                <TableCell>{document.size || "—"}</TableCell>
                <TableCell>
                  {document.status !== "Missing" ? (
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View History</DropdownMenuItem>
                          <DropdownMenuItem>Replace Document</DropdownMenuItem>
                          <DropdownMenuItem>Request Review</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <Button size="sm" className="gap-1">
                      <Upload className="h-4 w-4" />
                      Upload
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
