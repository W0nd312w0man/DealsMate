"use client"

import { useState } from "react"
import { Search, Filter, ArrowUpDown, FolderOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { NewWorkspaceButton } from "@/components/workspaces/new-workspace-button"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PageNavigation } from "@/components/page-navigation"
import { WorkspaceConversionDialog } from "@/components/workspaces/workspace-conversion-dialog"

export default function WorkspacesPageClient() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null)
  const [showConversionDialog, setShowConversionDialog] = useState(false)
  const [statusFilter, setStatusFilter] = useState("active")

  // Empty workspaces array - no mock data
  const workspaces: any[] = []

  // Filter logic remains but will always return empty array
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

      {/* Always show the empty state since workspaces array is empty */}
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
