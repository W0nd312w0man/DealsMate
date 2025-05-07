"use client"

import { useState } from "react"
import { Search, Filter, ArrowUpDown, FolderOpen, Eye, ArrowRight, Archive, ArchiveRestore } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { NewWorkspaceButton } from "@/components/workspaces/new-workspace-button"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PageNavigation } from "@/components/page-navigation"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { WorkspaceConversionDialog } from "@/components/workspaces/workspace-conversion-dialog"

// Sample workspaces data
const workspaces = [
  {
    id: "WS-1234",
    name: "15614 Yermo Street Property",
    primaryClient: "John Smith (Buyer)",
    isArchived: false,
    createdDate: "Apr 25, 2025",
    updatedDate: "Apr 26, 2025",
  },
  {
    id: "WS-1235",
    name: "Oak Avenue Listing",
    primaryClient: "Sarah Johnson (Seller)",
    isArchived: false,
    createdDate: "Apr 24, 2025",
    updatedDate: "Apr 26, 2025",
  },
  {
    id: "WS-1236",
    name: "Pine Road Property",
    primaryClient: "Michael Brown (Buyer)",
    isArchived: false,
    createdDate: "Apr 23, 2025",
    updatedDate: "Apr 25, 2025",
  },
  {
    id: "WS-1237",
    name: "Maple Street Condo",
    primaryClient: "Emily Davis (Seller)",
    isArchived: false,
    createdDate: "Apr 20, 2025",
    updatedDate: "Apr 24, 2025",
  },
  {
    id: "WS-1238",
    name: "Sunset Boulevard Apartment",
    primaryClient: "Robert Wilson (Buyer)",
    isArchived: true,
    createdDate: "Apr 15, 2025",
    updatedDate: "Apr 22, 2025",
  },
]

export default function WorkspacesPageClient() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null)
  const [showConversionDialog, setShowConversionDialog] = useState(false)
  const [statusFilter, setStatusFilter] = useState("active")

  const filteredWorkspaces = workspaces.filter((workspace) => {
    if (statusFilter === "active") return !workspace.isArchived
    if (statusFilter === "archived") return workspace.isArchived
    return true
  })

  return (
    <div className="container mx-auto p-4 space-y-6">
      <BreadcrumbNav />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div></div>
        <NewWorkspaceButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by Property Address, Buyer Name, or Seller Name"
              className="pl-10 bg-background/50 border-purple-800/30 focus:border-purple-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Select defaultValue="active" value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-background/50 border-purple-800/30">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Filter</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="all">All Workspaces</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <Select defaultValue="newest">
              <SelectTrigger className="bg-background/50 border-purple-800/30">
                <div className="flex items-center">
                  <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Sort</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredWorkspaces.length === 0 ? (
        <Card className="border-dashed border-2 border-purple-800/30 shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-purple-900/10 p-4 mb-4">
              <FolderOpen className="h-10 w-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-exp-purple">No Workspaces Found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {statusFilter === "active"
                ? "No active workspaces found. Create a new workspace to get started."
                : statusFilter === "archived"
                  ? "No archived workspaces found."
                  : "No workspaces found. Create your first workspace to start managing your real estate transactions."}
            </p>
            <NewWorkspaceButton />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-purple-800/20 shadow-soft overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-poppins text-purple-700">Your Workspaces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workspace</TableHead>
                    <TableHead>Primary Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkspaces.map((workspace) => (
                    <TableRow key={workspace.id} className="group">
                      <TableCell>
                        <div className="font-medium group-hover:text-purple-400 transition-colors">
                          {workspace.name}
                        </div>
                        <div className="text-sm text-muted-foreground">{workspace.id}</div>
                      </TableCell>
                      <TableCell>{workspace.primaryClient}</TableCell>
                      <TableCell>
                        {workspace.isArchived ? (
                          <Badge variant="outline" className="border-gray-500/50 text-gray-500 bg-gray-500/10">
                            Archived
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-green-500/50 text-green-500 bg-green-500/10">
                            Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{workspace.createdDate}</TableCell>
                      <TableCell>{workspace.updatedDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 border-purple-800/30 text-purple-400 hover:bg-purple-900/10 hover:text-purple-300"
                                  asChild
                                >
                                  <Link href={`/workspaces/${workspace.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 border-blue-800/30 text-blue-400 hover:bg-blue-900/10 hover:text-blue-300"
                                  onClick={() => {
                                    setSelectedWorkspace(workspace.id)
                                    setShowConversionDialog(true)
                                  }}
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Convert to Transaction</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className={`h-8 w-8 ${
                                    workspace.isArchived
                                      ? "border-green-800/30 text-green-400 hover:bg-green-900/10 hover:text-green-300"
                                      : "border-red-800/30 text-red-400 hover:bg-red-900/10 hover:text-red-300"
                                  }`}
                                >
                                  {workspace.isArchived ? (
                                    <ArchiveRestore className="h-4 w-4" />
                                  ) : (
                                    <Archive className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{workspace.isArchived ? "Unarchive" : "Archive"}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-purple-900/10 pt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredWorkspaces.length} {statusFilter !== "all" ? statusFilter : ""} workspaces
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Workspace Conversion Dialog */}
      <WorkspaceConversionDialog
        workspaceId={selectedWorkspace}
        open={showConversionDialog}
        onOpenChange={setShowConversionDialog}
      />

      {/* Add PageNavigation component */}
      <PageNavigation
        prevPage={{ url: "/dashboard", label: "Dashboard" }}
        nextPage={{ url: "/transactions", label: "Transactions" }}
      />
    </div>
  )
}
