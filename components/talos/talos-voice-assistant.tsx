"use client"

import { DialogFooter } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BotIcon as Robot, X, Check, Calendar, Briefcase, ClipboardList, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

// Key for storing actions in sessionStorage
const TALOS_ACTIONS_STORAGE_KEY = "talos_actions"

// Define types for our JSON data
interface ActionBase {
  type: string
  recipient: string
  description: string
}

interface CreateWorkspaceAction extends ActionBase {
  type: "create_workspace"
  address: string
  document_data: {
    has_attachments: boolean
    suggested_fields: {
      document_type: string
      property_address: string
      offer_amount: string
      buyer_name: string
      seller_name: string
      title_company: string | null
    }
  }
}

interface CreateTaskAction extends ActionBase {
  type: "create_task"
}

interface CreateEventAction extends ActionBase {
  type: "create_event"
  address: string
  date: string
}

type Action = CreateWorkspaceAction | CreateTaskAction | CreateEventAction

interface ActionGroup {
  actions: Action[]
}

export function TalosVoiceAssistant() {
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [actionGroups, setActionGroups] = useState<ActionGroup[]>([])
  const [flattenedActions, setFlattenedActions] = useState<Action[]>([])
  const { toast } = useToast()

  // Mock data from the backend
  const mockData: ActionGroup[] = [
    {
      actions: [
        {
          type: "create_workspace",
          recipient: "verde.jenn@gmail.com",
          address: "28 Capen St, Windsor, CT 06095",
          description: "Initiate transaction workspace for offer submission on 28 Capen St, Windsor, CT 06095.",
          document_data: {
            has_attachments: true,
            suggested_fields: {
              document_type: "Real Estate Purchase Contract",
              property_address: "28 Capen St, Windsor, CT 06095",
              offer_amount: "$371,000.00",
              buyer_name: "Nicholas LaChance",
              seller_name: "Redekas Properties, LLC",
              title_company: null,
            },
          },
        },
      ],
    },
    {
      actions: [
        {
          type: "create_workspace",
          recipient: "lanesammy61@gmail.com",
          address: "73 Kent Cornwall Rd, Kent, CT 06757",
          description: "Initiate transaction workspace for accepted offer on 73 Kent Cornwall Rd, Kent, CT 06757.",
          document_data: {
            has_attachments: true,
            suggested_fields: {
              document_type: "Real Estate Purchase Contract",
              property_address: "73 Kent Cornwall Rd, Kent, CT 06757",
              offer_amount: "$381,000.00",
              buyer_name: "Jason Drozd",
              seller_name: "Colleen Mcgrath",
              title_company: null,
            },
          },
        },
      ],
    },
    {
      actions: [
        {
          type: "create_task",
          recipient: "lanesammy61@gmail.com",
          description: "Respond to sender regarding their inquiry about water marks on the ceiling for Main Street.",
        },
      ],
    },
    {
      actions: [
        {
          type: "create_event",
          recipient: "peppercorncottage.la@gmail.com",
          address: "2458 Salzburge Street, Whittier, CA 90601",
          date: "2025-05-22",
          description: "Inspection scheduled for 2458 Salzburge Street, Whittier, CA 90601.",
        },
      ],
    },
  ]

  // Initialize actions from sessionStorage or mock data
  useEffect(() => {
    // Try to get actions from sessionStorage first
    const storedActions = sessionStorage.getItem(TALOS_ACTIONS_STORAGE_KEY)

    if (storedActions) {
      // If we have stored actions, use them
      const parsedActions = JSON.parse(storedActions)
      setActionGroups(parsedActions)

      // Flatten the actions for easier processing in the UI
      const allActions = parsedActions.flatMap((group) => group.actions)
      setFlattenedActions(allActions)

      console.log("Loaded actions from sessionStorage:", parsedActions.length)
    } else {
      // Otherwise use the mock data
      setActionGroups(JSON.parse(JSON.stringify(mockData)))

      // Flatten the actions for easier processing in the UI
      const allActions = mockData.flatMap((group) => group.actions)
      setFlattenedActions(allActions)

      console.log("Initialized actions from mockData:", mockData.length)
    }
  }, [])

  const handleClick = () => {
    setIsActive(!isActive)

    if (!isActive) {
      setShowDialog(true)
      setIsPulsing(false)
    }
  }

  // Function to create a workspace
  const createWorkspace = (action: CreateWorkspaceAction) => {
    try {
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

      console.log("Workspace created:", newWorkspace)

      // Show success toast
      toast({
        title: "Workspace Created",
        description: `Created workspace for ${propertyAddress}`,
        variant: "default",
      })

      return true
    } catch (error) {
      console.error("Error creating workspace:", error)
      toast({
        title: "Error",
        description: "Failed to create workspace",
        variant: "destructive",
      })
      return false
    }
  }

  // Function to create a task
  const createTask = (action: CreateTaskAction) => {
    try {
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

      console.log("Task created:", newTask)

      // Show success toast
      toast({
        title: "Task Created",
        description: description.length > 40 ? description.substring(0, 40) + "..." : description,
        variant: "default",
      })

      return true
    } catch (error) {
      console.error("Error creating task:", error)
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      })
      return false
    }
  }

  // Function to create an event
  const createEvent = (action: CreateEventAction) => {
    try {
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

      console.log("Event created:", newEvent)

      // Show success toast
      toast({
        title: "Event Created",
        description: `Event scheduled for ${dateString}`,
        variant: "default",
      })

      return true
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      })
      return false
    }
  }

  // Function to remove an action from the JSON structure
  const removeActionFromGroups = (actionToRemove: Action) => {
    // Create a deep copy of the action groups
    const updatedGroups = JSON.parse(JSON.stringify(actionGroups))

    // Find the group that contains this action
    let foundAndRemoved = false

    for (let i = 0; i < updatedGroups.length; i++) {
      const group = updatedGroups[i]

      // Find the action in this group
      const actionIndex = group.actions.findIndex(
        (action: Action) =>
          action.type === actionToRemove.type &&
          action.description === actionToRemove.description &&
          action.recipient === actionToRemove.recipient,
      )

      // If found, remove it
      if (actionIndex !== -1) {
        group.actions.splice(actionIndex, 1)
        foundAndRemoved = true

        // If the group is now empty, remove it
        if (group.actions.length === 0) {
          updatedGroups.splice(i, 1)
        }

        break
      }
    }

    if (foundAndRemoved) {
      // Update the state with the modified groups
      setActionGroups(updatedGroups)

      // Also update the flattened actions for the UI
      const newFlattenedActions = updatedGroups.flatMap((group) => group.actions)
      setFlattenedActions(newFlattenedActions)

      // Save the updated groups to sessionStorage
      sessionStorage.setItem(TALOS_ACTIONS_STORAGE_KEY, JSON.stringify(updatedGroups))

      // Log the updated JSON
      console.log("Updated action groups:", JSON.stringify(updatedGroups, null, 2))

      // If no more actions, close the dialog
      if (newFlattenedActions.length === 0) {
        setTimeout(() => {
          setShowDialog(false)
          setIsActive(false)
        }, 300)
      }
    }
  }

  const handleAccept = (action: Action) => {
    let success = false

    // Process the action based on its type
    switch (action.type) {
      case "create_workspace":
        success = createWorkspace(action as CreateWorkspaceAction)
        break
      case "create_task":
        success = createTask(action as CreateTaskAction)
        break
      case "create_event":
        success = createEvent(action as CreateEventAction)
        break
      default:
        toast({
          title: "Unsupported Action",
          description: `Action type ${action.type} is not supported`,
          variant: "destructive",
        })
    }

    // If action was processed successfully
    if (success) {
      // Immediately remove the action from the UI first
      setFlattenedActions((prevActions) =>
        prevActions.filter(
          (a) => !(a.type === action.type && a.description === action.description && a.recipient === action.recipient),
        ),
      )

      // Then update the JSON structure
      removeActionFromGroups(action)

      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event("storage"))

      // Navigate to the appropriate page after a short delay
      setTimeout(() => {
        if (action.type === "create_workspace") router.push("/workspaces")
        else if (action.type === "create_task") router.push("/tasks")
        else if (action.type === "create_event") router.push("/calendar")
      }, 300)
    }
  }

  const handleDismiss = (action: Action) => {
    // Remove the action from the JSON structure
    removeActionFromGroups(action)
  }

  // Helper function to get icon based on action type
  const getActionIcon = (type: string) => {
    switch (type) {
      case "create_workspace":
        return <Home className="h-4 w-4" />
      case "create_task":
        return <ClipboardList className="h-4 w-4" />
      case "create_event":
        return <Calendar className="h-4 w-4" />
      default:
        return <Briefcase className="h-4 w-4" />
    }
  }

  // Helper function to get title based on action type
  const getActionTitle = (type: string) => {
    switch (type) {
      case "create_workspace":
        return "Workspace"
      case "create_task":
        return "Task"
      case "create_event":
        return "Event"
      default:
        return "Action"
    }
  }

  // Helper function to get short description based on action type
  const getActionShortDescription = (action: Action) => {
    switch (action.type) {
      case "create_workspace":
        return action.address
      case "create_event":
        return `${action.date} - ${action.address}`
      case "create_task":
        return action.description.length > 60 ? action.description.substring(0, 60) + "..." : action.description
      default:
        return ""
    }
  }

  // Render workspace details
  const renderWorkspaceDetails = (action: CreateWorkspaceAction) => {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Property Address</h3>
          <p className="text-sm text-muted-foreground">{action.address}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium">Description</h3>
          <p className="text-sm text-muted-foreground">{action.description}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium">Document Type</h3>
          <p className="text-sm text-muted-foreground">{action.document_data.suggested_fields.document_type}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium">Buyer</h3>
            <p className="text-sm text-muted-foreground">{action.document_data.suggested_fields.buyer_name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Seller</h3>
            <p className="text-sm text-muted-foreground">{action.document_data.suggested_fields.seller_name}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium">Offer Amount</h3>
          <p className="text-sm text-muted-foreground">{action.document_data.suggested_fields.offer_amount}</p>
        </div>

        {action.document_data.has_attachments && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
            Has Attachments
          </Badge>
        )}
      </div>
    )
  }

  // Render task details
  const renderTaskDetails = (action: CreateTaskAction) => {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Task Description</h3>
          <p className="text-sm text-muted-foreground">{action.description}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium">Recipient</h3>
          <p className="text-sm text-muted-foreground">{action.recipient}</p>
        </div>
      </div>
    )
  }

  // Render event details
  const renderEventDetails = (action: CreateEventAction) => {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Event Description</h3>
          <p className="text-sm text-muted-foreground">{action.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium">Date</h3>
            <p className="text-sm text-muted-foreground">{action.date}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Recipient</h3>
            <p className="text-sm text-muted-foreground">{action.recipient}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium">Location</h3>
          <p className="text-sm text-muted-foreground">{action.address}</p>
        </div>
      </div>
    )
  }

  // Render action details based on type
  const renderActionDetails = (action: Action) => {
    switch (action.type) {
      case "create_workspace":
        return renderWorkspaceDetails(action as CreateWorkspaceAction)
      case "create_task":
        return renderTaskDetails(action as CreateTaskAction)
      case "create_event":
        return renderEventDetails(action as CreateEventAction)
      default:
        return <p>Unknown action type</p>
    }
  }

  // Add this near the other useEffect hooks
  useEffect(() => {
    // This is just to force a re-render when flattenedActions changes
    console.log("Actions updated, total:", flattenedActions.length)
  }, [flattenedActions])

  return (
    <>
      <button
        onClick={handleClick}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-500",
          isActive
            ? "bg-gradient-to-r from-purple-600 to-pink-500"
            : "bg-gradient-to-r from-purple-500/90 to-indigo-500/90",
          isPulsing && "animate-pulse",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full opacity-30 animate-ping-slow",
            isActive ? "bg-pink-400" : "bg-indigo-400",
          )}
        />
        <div className="relative">
          <Robot className={cn("h-6 w-6 transition-all duration-300", isActive ? "text-white" : "text-white")} />
        </div>
      </button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-poppins text-purple-700">TALOS Suggestions</DialogTitle>
            <DialogDescription>
              I've analyzed your recent communications and have some suggestions for you.
            </DialogDescription>
          </DialogHeader>

          {flattenedActions.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto pr-2 my-4">
              <Accordion type="multiple" defaultValue={["action-0"]} className="space-y-2">
                {flattenedActions.map((action, index) => (
                  <AccordionItem
                    key={`${action.type}-${action.recipient}-${index}-${Math.random()}`}
                    value={`action-${index}`}
                    className="border border-purple-100/50 rounded-lg overflow-hidden transition-all duration-300"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-purple-50/30 hover:no-underline">
                      <div className="flex items-center gap-2 text-left">
                        <div className="p-1.5 rounded-full bg-purple-100/50">{getActionIcon(action.type)}</div>
                        <div className="flex-1">
                          <div className="font-medium">{getActionTitle(action.type)}</div>
                          <div className="text-sm text-muted-foreground">{getActionShortDescription(action)}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 border-t border-purple-100/50">
                      <div className="space-y-4">
                        {renderActionDetails(action)}

                        <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-purple-100/50">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDismiss(action)}
                            className="border-pink-200 text-pink-700 hover:bg-pink-50 hover:text-pink-700"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Dismiss
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAccept(action)}
                            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No suggestions available</p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false)
                setIsActive(false)
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
