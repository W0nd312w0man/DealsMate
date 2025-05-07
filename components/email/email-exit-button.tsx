"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EmailExitButtonProps {
  onClose: () => void
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function EmailExitButton({ onClose, className = "", size = "icon", variant = "ghost" }: EmailExitButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={`text-gray-400 hover:text-gray-100 hover:bg-gray-800 focus:ring-1 focus:ring-purple-500 focus:ring-offset-1 focus:ring-offset-gray-900 ${className}`}
            onClick={onClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">Close</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
