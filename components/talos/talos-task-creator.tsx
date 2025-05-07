"use client"

import { useEffect, useState } from "react"
import { BotIcon as Robot } from "lucide-react"
import type { Task, TaskOwnerRole } from "@/types/task"
import { useToast } from "@/components/ui/use-toast"

interface TalosTaskCreatorProps {
  onTaskCreated: (task: Task) => void
  currentUserRole: TaskOwnerRole
}

export function TalosTaskCreator({ onTaskCreated, currentUserRole }: TalosTaskCreatorProps) {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  // This would be connected to the Smart Inbox in a real implementation
  // For demo purposes, we'll simulate TALOS creating tasks from emails
  useEffect(() => {
    // Simulate TALOS analyzing emails and creating tasks
    const simulateTalosTaskCreation = () => {
      // Only run this occasionally to simulate real behavior
      if (Math.random() > 0.7) {
        setIsProcessing(true)

        // Simulate processing delay
        setTimeout(() => {
          const talosTask = generateTalosTask(currentUserRole)
          onTaskCreated(talosTask)

          // Use the toast system for a non-blocking notification
          toast({
            title: "TALOS AI",
            description: `Task "${talosTask.title}" created from email analysis.`,
            duration: 4000,
          })

          setIsProcessing(false)
        }, 3000)
      }
    }

    // Set up interval to occasionally check for new tasks
    const interval = setInterval(simulateTalosTaskCreation, 30000)

    // Clean up on unmount
    return () => clearInterval(interval)
  }, [onTaskCreated, toast, currentUserRole])

  return (
    <>
      {isProcessing && (
        <div className="fixed bottom-4 right-4 bg-blue-100 text-blue-800 p-2 rounded-lg flex items-center gap-2 shadow-md animate-pulse z-50">
          <Robot className="h-5 w-5" />
          <span className="text-sm font-medium">TALOS AI analyzing emails...</span>
        </div>
      )}
    </>
  )
}

// Helper function to generate a random TALOS task
function generateTalosTask(preferredRole: TaskOwnerRole): Task {
  const taskTemplates = [
    {
      title: "Follow up with client about document submission",
      details: "Email indicates client has questions about required documents.",
      priority: "medium" as const,
    },
    {
      title: "Schedule property viewing based on client email",
      details: "Client requested to see property this weekend.",
      priority: "high" as const,
    },
    {
      title: "Respond to lender inquiry about verification",
      details: "Lender needs additional verification documents.",
      priority: "high" as const,
    },
    {
      title: "Update listing information per seller request",
      details: "Seller wants to update property description.",
      priority: "low" as const,
    },
    {
      title: "Coordinate with title company on closing date",
      details: "Title company suggested new closing timeline.",
      priority: "medium" as const,
    },
  ]

  const ownerRoles: TaskOwnerRole[] = ["agent", "transaction-coordinator", "broker", "manager"]
  const ownerNames = [
    "John Smith",
    "Sarah Williams",
    "David Wilson",
    "Lisa Johnson",
    "Michael Brown",
    "Jennifer Lopez",
    "Robert Davis",
  ]

  const randomTemplate = taskTemplates[Math.floor(Math.random() * taskTemplates.length)]

  // 70% chance to assign to the current user's role, 30% chance for random role
  const role = Math.random() < 0.7 ? preferredRole : ownerRoles[Math.floor(Math.random() * ownerRoles.length)]
  const randomName = ownerNames[Math.floor(Math.random() * ownerNames.length)]

  // Generate a random due date in the next 7 days
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 7) + 1)

  return {
    id: `talos-${Date.now()}`,
    title: randomTemplate.title,
    details: randomTemplate.details,
    dueDate: dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    completed: false,
    priority: randomTemplate.priority,
    isPastDue: false,
    createdBy: "talos-ai",
    ownerRole: role,
    ownerName: randomName,
    createdAt: new Date().toISOString(),
  }
}
