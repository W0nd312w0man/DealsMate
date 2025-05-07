"use client"

import { useState, useEffect } from "react"
import { Mic, X, Check, Edit } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import type { TalosNotification } from "./talos-notifications"

interface Suggestion {
  id: string
  type: "task" | "event"
  title: string
  description: string
  dueDate?: string
  workspace?: {
    id: string
    name: string
  }
  priority?: "high" | "medium" | "low"
  confidence: number // 0-100
}

export function TalosVoiceAssistant() {
  const [isActive, setIsActive] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const { toast } = useToast()

  // Mock suggestions that TALOS would generate
  const mockSuggestions: Suggestion[] = [
    {
      id: "s1",
      type: "task",
      title: "Schedule home inspection for 456 Oak Avenue",
      description: "Based on email from Michael Johnson about inspection requirements",
      dueDate: "Tomorrow, 5:00 PM",
      workspace: {
        id: "ws-2",
        name: "Michael Johnson - 456 Oak Avenue",
      },
      priority: "high",
      confidence: 92,
    },
    {
      id: "s2",
      type: "event",
      title: "Property Showing - 15614 Yermo Street",
      description: "Karen Chen requested a showing for potential buyers",
      dueDate: "Today, 2:00 PM - 3:30 PM",
      workspace: {
        id: "ws-1",
        name: "Karen Chen - 15614 Yermo Street",
      },
      confidence: 87,
    },
    {
      id: "s3",
      type: "task",
      title: "Review closing documents for Cedar Lane property",
      description: "Title company sent closing documents that need review",
      dueDate: "Apr 28, 2025",
      workspace: {
        id: "ws-4",
        name: "Robert Wilson - 101 Cedar Lane",
      },
      priority: "medium",
      confidence: 78,
    },
  ]

  // Simulate TALOS detecting new emails and generating suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly decide if TALOS should pulse to indicate new suggestions
      if (Math.random() > 0.7 && !isPulsing && !showDialog) {
        setIsPulsing(true)
        setTimeout(() => setIsPulsing(false), 5000)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [isPulsing, showDialog])

  const handleClick = () => {
    setIsActive(!isActive)

    if (!isActive) {
      // When activating, show suggestions dialog
      setSuggestions(mockSuggestions)
      setShowDialog(true)
      setIsPulsing(false)
    }
  }

  const handleAcceptSuggestion = (suggestion: Suggestion) => {
    // In a real app, this would create the task or event
    toast({
      title: `${suggestion.type === "task" ? "Task" : "Event"} created`,
      description: suggestion.title,
      variant: "default",
    })

    // Add to TALOS notifications
    if (window.talosNotifications) {
      const notificationType = suggestion.type === "task" ? "task_created" : "event_created"
      const notification: Omit<TalosNotification, "id" | "timestamp" | "read"> = {
        type: notificationType,
        title: suggestion.type === "task" ? "Task created" : "Event created",
        description: `TALOS AI created ${suggestion.type}: "${suggestion.title}" based on communication analysis.`,
        actionUrl: suggestion.type === "task" ? "/tasks" : "/calendar",
        actionLabel: suggestion.type === "task" ? "View Task" : "View Calendar",
        priority: suggestion.priority,
        relatedEntity: {
          type: suggestion.type,
          id: suggestion.id,
          name: suggestion.title,
        },
      }

      // @ts-ignore - Add to global notifications
      window.talosNotifications.add(notification)
    }

    // Remove from suggestions list
    setSuggestions(suggestions.filter((s) => s.id !== suggestion.id))

    // Close dialog if no more suggestions
    if (suggestions.length === 1) {
      setShowDialog(false)
      setIsActive(false)
    }
  }

  const handleDismissSuggestion = (suggestion: Suggestion) => {
    // Remove from suggestions list
    setSuggestions(suggestions.filter((s) => s.id !== suggestion.id))

    // Close dialog if no more suggestions
    if (suggestions.length === 1) {
      setShowDialog(false)
      setIsActive(false)
    }
  }

  const handleEditSuggestion = (suggestion: Suggestion) => {
    // In a real app, this would open an edit form
    toast({
      title: "Edit mode",
      description: `Editing ${suggestion.type}: ${suggestion.title}`,
      variant: "default",
    })
  }

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
          <Mic className={cn("h-6 w-6 transition-all duration-300", isActive ? "text-white" : "text-white")} />
        </div>
      </button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-poppins text-purple-700">TALOS Suggestions</DialogTitle>
            <DialogDescription>
              I've analyzed your recent communications and have some suggestions for you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 my-4">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-4 rounded-lg border border-purple-100/50 hover:bg-purple-50/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium">
                      {suggestion.type === "task" ? "📋 Task: " : "📅 Event: "}
                      {suggestion.title}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{suggestion.description}</div>
                    {suggestion.dueDate && (
                      <div className="text-sm mt-1">
                        <span className="font-medium">Due: </span>
                        {suggestion.dueDate}
                      </div>
                    )}
                    {suggestion.workspace && (
                      <div className="text-sm text-purple-600 mt-1">Workspace: {suggestion.workspace.name}</div>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <div
                      className={cn(
                        "text-xs px-2 py-1 rounded-full mb-2",
                        suggestion.confidence >= 90
                          ? "bg-green-100 text-green-800"
                          : suggestion.confidence >= 75
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-orange-100 text-orange-800",
                      )}
                    >
                      {suggestion.confidence}% match
                    </div>
                    {suggestion.priority && (
                      <div
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          suggestion.priority === "high"
                            ? "bg-pink-100 text-pink-800"
                            : suggestion.priority === "medium"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800",
                        )}
                      >
                        {suggestion.priority} priority
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDismissSuggestion(suggestion)}
                    className="border-pink-200 text-pink-700 hover:bg-pink-50 hover:text-pink-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Dismiss
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditSuggestion(suggestion)}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAcceptSuggestion(suggestion)}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </div>

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
