"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ChevronRight,
  Home,
  FolderOpen,
  Building2,
  FileText,
  CalendarClock,
  Users,
  MessageSquare,
  ShieldCheck,
  Settings,
  ChevronLeftSquare,
  ChevronRightSquare,
  CheckSquare,
  Code,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function SideBreadcrumbPanel() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Load collapsed state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("sideNavCollapsed")
    if (savedState !== null) {
      setIsCollapsed(savedState === "true")
    }
  }, [])

  // Save collapsed state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sideNavCollapsed", isCollapsed.toString())
  }, [isCollapsed])

  // Handle JSON submission
  const handleSubmit = () => {
    setError(null)
    try {
      // Parse the JSON input
      const jsonData = JSON.parse(inputValue)

      // Track created items
      const createdItems = []

      // Check if jsonData is an array
      if (Array.isArray(jsonData)) {
        // Process each object in the array
        for (const item of jsonData) {
          // Check if the object has actions
          if (item.actions && Array.isArray(item.actions)) {
            // Process each action
            for (const action of item.actions) {
              if (action.type === "create_workspace") {
                // Extract the relevant fields
                const propertyAddress =
                  action.address || action.document_data?.suggested_fields?.property_address || "New Property"
                const buyerName = action.document_data?.suggested_fields?.buyer_name || null
                const sellerName = action.document_data?.suggested_fields?.seller_name || null

                // Create a new workspace
                const workspaceId = `ws-${Date.now()}-${Math.floor(Math.random() * 1000)}`
                const newWorkspace = {
                  id: workspaceId,
                  name: propertyAddress,
                  address: propertyAddress,
                  createdAt: new Date().toISOString(),
                  status: "active",
                  type: "property",
                  parties: [],
                }

                // Add buyer if provided
                if (buyerName) {
                  newWorkspace.parties.push({
                    id: `party-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    name: buyerName,
                    type: "Individual",
                    role: "Buyer",
                    email: action.recipient || "",
                    phone: "",
                    isPrimary: true,
                  })
                }

                // Add seller if provided
                if (sellerName) {
                  newWorkspace.parties.push({
                    id: `party-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    name: sellerName,
                    type: "Individual",
                    role: "Seller",
                    email: "",
                    phone: "",
                    isPrimary: true,
                  })
                }

                // Save to sessionStorage
                const existingWorkspaces = JSON.parse(sessionStorage.getItem("workspaces") || "[]")
                existingWorkspaces.push(newWorkspace)
                sessionStorage.setItem("workspaces", JSON.stringify(existingWorkspaces))

                // Add to created items list
                createdItems.push({
                  type: "workspace",
                  id: workspaceId,
                  address: propertyAddress,
                  buyer: buyerName,
                  seller: sellerName,
                })

                console.log("Workspace created:", newWorkspace)
              }

              // Handle create_task action type
              if (action.type === "create_task") {
                // Extract the description
                const description = action.description || "New Task"

                // Generate a unique ID for the task
                const taskId = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`

                // Create a new task object
                const newTask = {
                  id: taskId,
                  title: description,
                  details: description,
                  dueDate: "Today",
                  completed: false,
                  priority: "medium",
                  createdBy: "manual",
                  ownerRole: "agent",
                  ownerName: "John Smith",
                  createdAt: new Date().toISOString(),
                }

                // Get existing tasks from sessionStorage
                const existingTasks = JSON.parse(sessionStorage.getItem("tasks") || "[]")

                // Add the new task to the array
                existingTasks.unshift(newTask)

                // Save back to sessionStorage
                sessionStorage.setItem("tasks", JSON.stringify(existingTasks))

                // Add to created items list for feedback
                createdItems.push({
                  type: "task",
                  id: taskId,
                  description: description,
                })

                console.log("Task created:", newTask)
              }

              // Handle create_event action type
              if (action.type === "create_event") {
                // Extract the relevant fields
                const description = action.description || "New Event"
                const address = action.address || ""
                const dateString = action.date || new Date().toISOString().split("T")[0]

                // Parse the date string to create a proper Date object
                // Format should be YYYY-MM-DD
                const [year, month, day] = dateString.split("-").map(Number)

                // Create date at noon to avoid timezone issues
                const eventDate = new Date(year, month - 1, day, 12, 0, 0)

                // Create an end date 1 hour after start time
                const endDate = new Date(eventDate)
                endDate.setHours(endDate.getHours() + 1)

                // Generate a unique ID for the event
                const eventId = `event-${Date.now()}-${Math.floor(Math.random() * 1000)}`

                // Create a new event object
                const newEvent = {
                  id: eventId,
                  title: description,
                  date: eventDate,
                  endDate: endDate,
                  type: "event",
                  location: address,
                  notes: description,
                  transactionId: null,
                  clientName: null,
                }

                // Get existing events from sessionStorage
                const existingEvents = JSON.parse(sessionStorage.getItem("calendar_events") || "[]")

                // Add the new event to the array
                existingEvents.push(newEvent)

                // Save back to sessionStorage
                sessionStorage.setItem("calendar_events", JSON.stringify(existingEvents))

                // Add to created items list for feedback
                createdItems.push({
                  type: "event",
                  id: eventId,
                  description: description,
                  date: dateString,
                  address: address,
                })

                console.log("Event created:", newEvent)
              }
            }
          }
        }

        // Dispatch storage event to notify other components
        window.dispatchEvent(new Event("storage"))

        // Clear input and close dialog
        setInputValue("")
        setIsDialogOpen(false)

        // Show success message
        if (createdItems.length > 0) {
          console.log(`Created ${createdItems.length} items:`, createdItems)

          // Navigate based on the type of the first created item
          const firstItemType = createdItems[0].type
          if (firstItemType === "workspace") {
            router.push("/workspaces")
          } else if (firstItemType === "task") {
            router.push("/tasks")
          } else if (firstItemType === "event") {
            router.push("/calendar")
          }
        } else {
          setError("No items were created. Check your JSON format.")
        }
      } else {
        setError("Invalid JSON format. Expected an array of objects with actions.")
      }
    } catch (err) {
      setError("Invalid JSON. Please check your input.")
      console.error("JSON parsing error:", err)
    }
  }

  // Skip on landing page or admin pages
  if (pathname === "/" || pathname.startsWith("/landing") || pathname.startsWith("/admin")) {
    return null
  }

  // Define the main navigation structure with all required pages
  const mainNavigation = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/workspaces", label: "Workspaces", icon: FolderOpen },
    { path: "/transactions", label: "Transactions", icon: Building2 },
    { path: "/compliance", label: "Compliance", icon: ShieldCheck },
    { path: "/tasks", label: "Tasks", icon: CheckSquare },
    { path: "/documents", label: "Documents", icon: FileText },
    { path: "/calendar", label: "Calendar", icon: CalendarClock },
    { path: "/communication", label: "Communication", icon: MessageSquare },
    { path: "/contacts", label: "Contacts", icon: Users },
    { path: "/settings", label: "Settings", icon: Settings },
  ]

  // Split the pathname into segments
  const segments = pathname.split("/").filter(Boolean)

  // Create breadcrumb items for the current path
  const breadcrumbs = segments.map((segment, index) => {
    // Build the URL for this breadcrumb
    const url = `/${segments.slice(0, index + 1).join("/")}`

    // Format the segment for display (capitalize, replace hyphens with spaces)
    const label = segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

    // For transaction ID pages, keep the ID format
    const displayLabel = segment.startsWith("TX-") ? segment : label

    return {
      label: displayLabel,
      url,
      isLast: index === segments.length - 1,
    }
  })

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dev Console</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Textarea
              placeholder="Enter JSON command..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div
        className={cn(
          "bg-exp-deeppurple text-white h-screen sticky top-0 flex flex-col border-r border-exp-purple/30 transition-all duration-300 ease-in-out z-40",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        {/* Toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-exp-deeppurple text-white p-1 rounded-full border border-exp-purple/50 z-50 hover:bg-exp-darkpurple transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRightSquare size={18} /> : <ChevronLeftSquare size={18} />}
        </button>

        <div className={cn("p-4 border-b border-exp-purple/30 flex items-center", isCollapsed ? "justify-center" : "")}>
          <button
            className={cn(
              "flex items-center transition-colors rounded-md bg-exp-darkpurple/20 hover:bg-exp-darkpurple/40",
              isCollapsed ? "justify-center p-2 mx-auto" : "px-3 py-2 text-sm w-full",
            )}
            onClick={() => setIsDialogOpen(true)}
          >
            <Code className={cn(isCollapsed ? "h-5 w-5" : "mr-3 h-4 w-4")} />
            {!isCollapsed && "Dev"}
          </button>
        </div>

        <div className={cn("border-b border-exp-purple/30", isCollapsed ? "py-4" : "p-4")}>
          {!isCollapsed && <h3 className="text-sm font-medium text-exp-lavender/70 mb-3">Main Navigation</h3>}
          <nav className="space-y-1">
            <TooltipProvider>
              {mainNavigation.map((item) => (
                <Tooltip key={item.path} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.path}
                      className={cn(
                        "flex items-center transition-colors rounded-md",
                        isCollapsed ? "justify-center p-2 mx-auto" : "px-3 py-2 text-sm",
                        pathname === item.path || (pathname.startsWith(item.path) && item.path !== "/dashboard")
                          ? "bg-exp-purple text-white"
                          : "text-exp-lavender hover:bg-exp-darkpurple hover:text-white",
                      )}
                    >
                      <item.icon className={cn(isCollapsed ? "h-5 w-5" : "mr-3 h-4 w-4")} />
                      {!isCollapsed && item.label}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" className="bg-exp-darkpurple text-white border-exp-purple/30">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>
        </div>

        {!isCollapsed && breadcrumbs.length > 0 && (
          <div className="p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-exp-lavender/70 mb-3">Current Location</h3>
            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center px-3 py-2 text-sm text-exp-lavender hover:bg-exp-darkpurple hover:text-white rounded-md transition-colors"
              >
                <Home className="mr-3 h-4 w-4" />
                Dashboard
              </Link>

              {breadcrumbs.map((breadcrumb, index) => (
                <div key={breadcrumb.url} className="flex items-center">
                  <div className="border-l-2 border-exp-purple/30 h-6 ml-5 my-1"></div>
                  <Link
                    href={breadcrumb.url}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-md transition-colors ml-6",
                      breadcrumb.isLast
                        ? "bg-exp-purple text-white"
                        : "text-exp-lavender hover:bg-exp-darkpurple hover:text-white",
                    )}
                  >
                    {index === 0 &&
                      mainNavigation.find((item) => item.path === `/${segments[0]}`)?.icon &&
                      React.createElement(mainNavigation.find((item) => item.path === `/${segments[0]}`)?.icon as any, {
                        className: "mr-3 h-4 w-4",
                      })}
                    {index > 0 && <ChevronRight className="mr-3 h-4 w-4" />}
                    {breadcrumb.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        )}

        {isCollapsed && breadcrumbs.length > 0 && (
          <div className="py-4 overflow-y-auto">
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard"
                    className="flex justify-center p-2 mx-auto text-exp-lavender hover:bg-exp-darkpurple hover:text-white rounded-md transition-colors"
                  >
                    <Home className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-exp-darkpurple text-white border-exp-purple/30">
                  Dashboard
                </TooltipContent>
              </Tooltip>

              {breadcrumbs.map((breadcrumb, index) => (
                <div key={breadcrumb.url} className="flex flex-col items-center">
                  <div className="border-l-2 border-exp-purple/30 h-4 my-1"></div>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Link
                        href={breadcrumb.url}
                        className={cn(
                          "flex justify-center p-2 rounded-md transition-colors",
                          breadcrumb.isLast
                            ? "bg-exp-purple text-white"
                            : "text-exp-lavender hover:bg-exp-darkpurple hover:text-white",
                        )}
                      >
                        {index === 0 &&
                          mainNavigation.find((item) => item.path === `/${segments[0]}`)?.icon &&
                          React.createElement(
                            mainNavigation.find((item) => item.path === `/${segments[0]}`)?.icon as any,
                            {
                              className: "h-5 w-5",
                            },
                          )}
                        {index > 0 && <ChevronRight className="h-5 w-5" />}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-exp-darkpurple text-white border-exp-purple/30">
                      {breadcrumb.label}
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </TooltipProvider>
          </div>
        )}
      </div>
    </>
  )
}
