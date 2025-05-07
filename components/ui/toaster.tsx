"use client"

import { useToast } from "./use-toast"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  id: string
  title: string
  description?: string
  duration?: number
}

export function Toaster() {
  const { toast } = useToast()
  const [toasts, setToasts] = useState<ToastProps[]>([])

  // Listen for toast events
  useEffect(() => {
    // Listen for toast events from the custom event
    const handleToast = (event: CustomEvent<ToastProps>) => {
      const { title, description, duration = 5000, id } = event.detail
      const newToast = { id, title, description, duration }

      setToasts((prev) => [...prev, newToast])

      // Auto-dismiss after duration
      setTimeout(() => {
        dismissToast(id)
      }, duration)
    }

    // Add event listener
    window.addEventListener("toast", handleToast as EventListener)

    // Clean up
    return () => {
      window.removeEventListener("toast", handleToast as EventListener)
    }
  }, [])

  // Dismiss a toast
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-4",
            "transform transition-all duration-300 ease-in-out",
            "flex items-start gap-3",
          )}
        >
          <div className="flex-1">
            <h3 className="font-medium">{toast.title}</h3>
            {toast.description && <p className="text-sm text-muted-foreground mt-1">{toast.description}</p>}
          </div>
          <button onClick={() => dismissToast(toast.id)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      ))}
    </div>
  )
}
