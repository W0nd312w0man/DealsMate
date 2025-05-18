"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Home,
  MessageSquare,
  Plus,
  UserCircle,
  Building,
  Mail,
  Phone,
} from "lucide-react"
import { WorkspaceTimeline } from "@/components/workspaces/workspace-timeline"
import { useWorkspaceParties, type WorkspaceParty } from "@/hooks/use-workspace-parties"

interface WorkspaceOverviewProps {
  workspaceId: string
}

// Define a direct party interface for reading from sessionStorage
interface Party {
  id: string
  name: string
  type: string
  role?: string
  email: string
  phone: string
  isPrimary?: boolean
}

export function WorkspaceOverview({ workspaceId }: WorkspaceOverviewProps) {
  const workspaceParties = useWorkspaceParties()
  const [buyers, setBuyers] = useState<WorkspaceParty[]>([])
  const [sellers, setSellers] = useState<WorkspaceParty[]>([])
  const [workspace, setWorkspace] = useState({
    id: workspaceId,
    name: "",
    address: "",
    type: "",
    isArchived: false,
    lastActivity: "",
    tasks: 0,
    messages: 0,
    email: "",
    phone: "",
    firstContactDate: "",
    nextFollowUp: "",
    notes: "",
    prequalified: false,
    prequalifiedAmount: "",
    parties: [] as Party[],
  })

  // Load workspace and parties from sessionStorage
  useEffect(() => {
    // Get workspace data from sessionStorage
    const loadWorkspace = () => {
      try {
        const workspaces = JSON.parse(sessionStorage.getItem("workspaces") || "[]")
        const currentWorkspace = workspaces.find((w: any) => w.id === workspaceId)
        if (currentWorkspace) {
          setWorkspace(currentWorkspace)

          // Extract buyers and sellers directly from workspace parties
          if (currentWorkspace.parties && Array.isArray(currentWorkspace.parties)) {
            const workspaceBuyers = currentWorkspace.parties
              .filter(
                (party: Party) =>
                  party.type === "buyer" ||
                  party.role === "Buyer" ||
                  (party.type === "Individual" && party.role === "Buyer"),
              )
              .map((party: Party) => ({
                ...party,
                type: party.type || "Individual",
                isPrimary: party.isPrimary || false,
                email: party.email || "",
                phone: party.phone || "",
              }))

            const workspaceSellers = currentWorkspace.parties
              .filter(
                (party: Party) =>
                  party.type === "seller" ||
                  party.role === "Seller" ||
                  (party.type === "Individual" && party.role === "Seller"),
              )
              .map((party: Party) => ({
                ...party,
                type: party.type || "Individual",
                isPrimary: party.isPrimary || false,
                email: party.email || "",
                phone: party.phone || "",
              }))

            if (workspaceBuyers.length > 0) {
              setBuyers(workspaceBuyers)
            } else {
              // Fallback to useWorkspaceParties hook
              setBuyers(workspaceParties.getBuyersByWorkspace(workspaceId))
            }

            if (workspaceSellers.length > 0) {
              setSellers(workspaceSellers)
            } else {
              // Fallback to useWorkspaceParties hook
              setSellers(workspaceParties.getSellersByWorkspace(workspaceId))
            }
          } else {
            // Fallback to useWorkspaceParties hook
            setBuyers(workspaceParties.getBuyersByWorkspace(workspaceId))
            setSellers(workspaceParties.getSellersByWorkspace(workspaceId))
          }
        }
      } catch (error) {
        console.error("Error loading workspace:", error)
        // Fallback to useWorkspaceParties hook
        setBuyers(workspaceParties.getBuyersByWorkspace(workspaceId))
        setSellers(workspaceParties.getSellersByWorkspace(workspaceId))
      }
    }

    loadWorkspace()

    // Listen for storage events to update the workspace data
    const handleStorageChange = () => {
      loadWorkspace()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [workspaceId, workspaceParties])

  // Empty tasks array
  const upcomingTasks: any[] = []

  // Empty communications array
  const recentCommunications: any[] = []

  // Empty suggestions array
  const talosSuggestions: any[] = []

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-6 md:col-span-2">
        <Card className="shadow-soft overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-poppins text-purple-700">Workspace Summary</CardTitle>
            <CardDescription>Overview of the workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Property Information</h3>
                <div className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">{workspace.address}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Status</div>
                      <div>{workspace.isArchived ? "Archived" : "Active"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Workspace Activity</h3>
                <div className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Recent Activity</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Last Activity</div>
                      <div>{workspace.lastActivity || "None"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Next Follow-up</div>
                      <div>{workspace.nextFollowUp || "None"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Open Tasks</div>
                      <div>{workspace.tasks || 0}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Unread Messages</div>
                      <div>{workspace.messages || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Buyers</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs text-purple-700 hover:text-purple-800 hover:bg-purple-50"
                    onClick={() => (window.location.href = `${workspaceId}?tab=parties`)}
                  >
                    View All
                  </Button>
                </div>

                {buyers.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-4 text-center">
                    <p className="text-sm text-muted-foreground">No buyers added yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {buyers.map((buyer) => (
                      <div key={buyer.id} className="rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-blue-100 p-1.5">
                            {buyer.type === "Individual" ? (
                              <UserCircle className="h-3.5 w-3.5 text-blue-600" />
                            ) : (
                              <Building className="h-3.5 w-3.5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-sm">{buyer.name}</span>
                              {buyer.isPrimary && <Badge className="bg-blue-100 text-blue-800 text-xs">Primary</Badge>}
                            </div>
                            {buyer.type !== "Individual" && buyer.entityName && (
                              <div className="text-xs text-muted-foreground">
                                {buyer.entityName} - {buyer.authorizedSignorTitle}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-1">
                          <div className="flex items-center gap-1 text-xs">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate">{"No email"}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{buyer.phone || "No phone"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Sellers</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs text-purple-700 hover:text-purple-800 hover:bg-purple-50"
                    onClick={() => (window.location.href = `${workspaceId}?tab=parties`)}
                  >
                    View All
                  </Button>
                </div>

                {sellers.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-4 text-center">
                    <p className="text-sm text-muted-foreground">No sellers added yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sellers.map((seller) => (
                      <div key={seller.id} className="rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-purple-100 p-1.5">
                            {seller.type === "Individual" ? (
                              <UserCircle className="h-3.5 w-3.5 text-purple-600" />
                            ) : (
                              <Building className="h-3.5 w-3.5 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-sm">{seller.name}</span>
                              {seller.isPrimary && (
                                <Badge className="bg-purple-100 text-purple-800 text-xs">Primary</Badge>
                              )}
                            </div>
                            {seller.type !== "Individual" && seller.entityName && (
                              <div className="text-xs text-muted-foreground">
                                {seller.entityName} - {seller.authorizedSignorTitle}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-1">
                          <div className="flex items-center gap-1 text-xs">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate">{"No email"}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{seller.phone || "No phone"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
              <div className="rounded-lg border p-3">
                <p className="text-sm">{workspace.notes || "No notes"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Upcoming Tasks</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs text-purple-700 hover:text-purple-800 hover:bg-purple-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Task
                </Button>
              </div>

              {upcomingTasks.length === 0 && (
                <div className="rounded-lg border border-dashed p-4 text-center">
                  <p className="text-sm text-muted-foreground">No upcoming tasks</p>
                </div>
              )}

              <div className="space-y-2">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-purple-500">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${task.completed ? "bg-purple-500" : "bg-transparent"}`}
                        />
                      </div>
                      <span className="text-sm font-medium">{task.title}</span>
                      <Badge
                        className={`
                        ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                        }
                      `}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Recent Communications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs text-purple-700 hover:text-purple-800 hover:bg-purple-50"
                >
                  View All
                </Button>
              </div>

              {recentCommunications.length === 0 && (
                <div className="rounded-lg border border-dashed p-4 text-center">
                  <p className="text-sm text-muted-foreground">No recent communications</p>
                </div>
              )}

              <div className="space-y-2">
                {recentCommunications.map((comm) => (
                  <div key={comm.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {comm.type === "email" ? (
                          <MessageSquare className="h-4 w-4 text-purple-600" />
                        ) : (
                          <Calendar className="h-4 w-4 text-purple-600" />
                        )}
                        <span className="text-sm font-medium">{comm.subject}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{comm.date}</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{comm.preview}</p>
                  </div>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => alert("Template options: Team Milestones, Suggested Milestones")}
            >
              <FileText className="h-4 w-4" />
              Apply Template(s)
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-poppins text-purple-700">Workspace Timeline</CardTitle>
            <CardDescription>History of activities and stage transitions</CardDescription>
          </CardHeader>
          <CardContent>
            <WorkspaceTimeline workspaceId={workspaceId} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="shadow-soft overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-xl font-poppins text-purple-700">TALOS Suggestions</CardTitle>
            </div>
            <CardDescription>AI-powered suggestions for this workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {talosSuggestions.length === 0 && (
              <div className="rounded-lg border border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground">No suggestions available</p>
              </div>
            )}
            {talosSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="rounded-lg border p-3 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-indigo-100 p-1.5 mt-0.5">
                    <Brain className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h3 className="font-medium text-sm">{suggestion.title}</h3>
                    <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 h-7 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                      asChild
                    >
                      <a href={suggestion.actionLink}>{suggestion.action}</a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-soft overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-poppins text-purple-700">Convert to Transaction</CardTitle>
            <CardDescription>Apply stages and status to this workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground mb-2">
              To apply stages (Nurturing, Actively Searching, Under Contract, etc.) or status (Active, Pending, Closed,
              etc.), convert this workspace into a transaction.
            </p>
            <Button className="w-full justify-start gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity">
              <ArrowRight className="h-4 w-4" />
              Convert to Transaction
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-green-500 to-emerald-400"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-poppins text-purple-700">Quick Actions</CardTitle>
            <CardDescription>Common actions for this workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity">
              <MessageSquare className="h-4 w-4" />
              Send Message
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Appointment
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <FileText className="h-4 w-4" />
              Generate Document
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Clock className="h-4 w-4" />
              Set Reminder
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Create Task
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => alert("Template options: Team Milestones, Suggested Milestones")}
            >
              <FileText className="h-4 w-4" />
              Apply Template(s)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
