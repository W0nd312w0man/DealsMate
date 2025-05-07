"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data - in a real app, this would come from an API
const documents = [
  {
    id: "DOC-001",
    name: "Purchase Agreement",
    transaction: "123 Main St",
    transactionId: "TX-1234",
    type: "Contract",
    status: "Approved",
    uploadedBy: "John Doe",
    uploadDate: "Mar 15, 2025",
    size: "2.4 MB",
  },
  {
    id: "DOC-002",
    name: "Seller Disclosure",
    transaction: "123 Main St",
    transactionId: "TX-1234",
    type: "Disclosure",
    status: "Pending",
    uploadedBy: "John Doe",
    uploadDate: "Mar 16, 2025",
    size: "1.8 MB",
  },
  {
    id: "DOC-003",
    name: "Loan Pre-Approval",
    transaction: "123 Main St",
    transactionId: "TX-1234",
    type: "Financial",
    status: "Approved",
    uploadedBy: "Sarah Smith",
    uploadDate: "Mar 17, 2025",
    size: "1.2 MB",
  },
  {
    id: "DOC-004",
    name: "Purchase Agreement",
    transaction: "456 Oak Ave",
    transactionId: "TX-1235",
    type: "Contract",
    status: "Approved",
    uploadedBy: "John Doe",
    uploadDate: "Mar 10, 2025",
    size: "2.1 MB",
  },
  {
    id: "DOC-005",
    name: "Inspection Report",
    transaction: "456 Oak Ave",
    transactionId: "TX-1235",
    type: "Inspection",
    status: "Pending",
    uploadedBy: "Mike Johnson",
    uploadDate: "Mar 12, 2025",
    size: "3.5 MB",
  },
]

export function DocumentList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [transactionFilter, setTransactionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.transaction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTransaction = transactionFilter === "all" || doc.transactionId === transactionFilter

    const matchesStatus = statusFilter === "all" || doc.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesTransaction && matchesStatus
  })

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
        <div className="flex flex-wrap items-center gap-2">
          <Select value={transactionFilter} onValueChange={setTransactionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Transaction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="TX-1234">123 Main St</SelectItem>
              <SelectItem value="TX-1235">456 Oak Ave</SelectItem>
              <SelectItem value="TX-1236">789 Pine Rd</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Transaction</TableHead>
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
                <TableCell>{document.transaction}</TableCell>
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
                <TableCell>{document.uploadedBy}</TableCell>
                <TableCell>{document.uploadDate}</TableCell>
                <TableCell>{document.size}</TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
