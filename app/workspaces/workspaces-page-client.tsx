"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ArrowUpDown, FolderOpen, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { NewWorkspaceButton } from "@/components/workspaces/new-workspace-button"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PageNavigation } from "@/components/page-navigation"
import { WorkspaceConversionDialog } from "@/components/workspaces/workspace-conversion-dialog"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface Workspace {
  id: string
  name: string
  property_address: string
  status: string
  created_at: string
  workspace_type: string
}

export default function WorkspacesPageClient() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null)
  const [showConversionDialog, setShowConversionDialog] = useState(false)
  const [statusFilter, setStatusFilter] = useState("active")
  const [isNewWorkspaceModalOpen, setIsNewWorkspaceModalOpen] = useState(false)

  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)

  // Add a key to force refresh when the component mounts
  useEffect(() => {
    const fetchWorkspaces = async () => {
      setLoading(true)
      try {
        const supabaseUrl = "https://ylpfxtdzizqrzhtxwelk.supabase.co"
        const supabaseAnonKey =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlscGZ4dGR6aXpxcnpodHh3ZWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjI1MDgsImV4cCI6MjA2MjgzODUwOH0.Gv623QSJLOZwYrPBhyOkw9Vk-kzrH4PI6qn125gD1Tw"
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        console.log("Fetching workspaces...")
        const { data, error } = await supabase.from("workspaces").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching workspaces:", error)
          throw error
        }

        console.log("Workspaces fetched:", data)
        setWorkspaces(data || [])
      } catch (error) {
        console.error("Error fetching workspaces:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkspaces()
  }, [])

  // Filter logic
  const filteredWorkspaces = workspaces.filter((workspace) => {
    if (statusFilter === "active") return workspace.status === "active"
    if (statusFilter === "archived") return workspace.status === "archived"
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

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : filteredWorkspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkspaces.map((workspace) => (
            <Link href={`/workspaces/${workspace.id}`} key={workspace.id}>
              <Card className="h-full hover:shadow-md transition-shadow duration-200 border-purple-800/20 hover:border-purple-500/30 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-purple-400">{workspace.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{workspace.property_address}</p>
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                          {workspace.workspace_type === "property" ? "Property" : "Client"}
                        </Badge>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          Created {new Date(workspace.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-900 mb-4">
            <FolderOpen className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium">No workspaces yet</h3>
          <p className="text-muted-foreground mt-2 mb-6">Create your first workspace to get started</p>
          <Button
            onClick={() => setIsNewWorkspaceModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-500"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Workspace
          </Button>
        </div>
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
