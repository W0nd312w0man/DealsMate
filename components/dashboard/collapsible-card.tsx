"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp, GripVertical, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGrid } from "./grid-system"

interface CollapsibleCardProps {
  id: string
  children: React.ReactNode
  isCollapsed: boolean
  onToggleCollapse: () => void
  dragHandleProps?: any
  isResizable?: boolean
  onResize?: (newSpan: number) => void
}

export function CollapsibleCard({
  id,
  children,
  isCollapsed,
  onToggleCollapse,
  dragHandleProps,
  isResizable = false,
  onResize,
}: CollapsibleCardProps) {
  const { getColumnSpan, columns, getFontSize, getPadding } = useGrid()
  const [isExpanded, setIsExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const currentSpan = getColumnSpan(id)

  // Get dynamic font size and padding classes
  const fontSize = getFontSize(id)
  const padding = getPadding(id)

  // Handle expand/collapse toggle
  const toggleExpand = () => {
    if (isResizable && onResize) {
      if (isExpanded) {
        // Restore to previous size
        onResize(Math.min(6, columns))
      } else {
        // Expand to full width
        onResize(columns)
      }
      setIsExpanded(!isExpanded)
    }
  }

  // Handle resize
  const handleResize = (direction: "increase" | "decrease") => {
    if (isResizable && onResize) {
      if (direction === "increase") {
        onResize(Math.min(currentSpan + 1, columns))
      } else {
        onResize(Math.max(currentSpan - 1, 3))
      }
    }
  }

  // Apply dynamic classes to child content
  useEffect(() => {
    if (contentRef.current) {
      const cardHeaders = contentRef.current.querySelectorAll('.card-header, [class*="CardHeader"]')
      const cardContents = contentRef.current.querySelectorAll('.card-content, [class*="CardContent"]')

      // Apply font size classes
      cardHeaders.forEach((header) => {
        if (header instanceof HTMLElement) {
          header.classList.remove("text-sm", "text-md", "text-lg")
          header.classList.add(fontSize)
        }
      })

      // Apply padding classes
      cardContents.forEach((content) => {
        if (content instanceof HTMLElement) {
          content.classList.remove("p-4", "p-5", "p-6")
          content.classList.add(padding)
        }
      })
    }
  }, [fontSize, padding, isCollapsed])

  return (
    <div className={cn("relative transition-all duration-300", isCollapsed && "h-12 overflow-hidden")}>
      {/* Drag handle */}
      <div
        {...dragHandleProps}
        className="absolute top-0 left-0 h-8 w-8 flex items-center justify-center cursor-grab z-10 text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Collapse/expand button */}
      <button
        onClick={onToggleCollapse}
        className="absolute top-0 right-8 h-8 w-8 flex items-center justify-center z-10 text-muted-foreground hover:text-foreground"
        aria-label={isCollapsed ? "Expand" : "Collapse"}
      >
        {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>

      {/* Resize button */}
      {isResizable && (
        <button
          onClick={toggleExpand}
          className="absolute top-0 right-0 h-8 w-8 flex items-center justify-center z-10 text-muted-foreground hover:text-foreground"
          aria-label={isExpanded ? "Minimize" : "Maximize"}
        >
          {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      )}

      {/* Resize controls */}
      {isResizable && !isCollapsed && (
        <div className="absolute bottom-2 right-2 flex items-center gap-1 z-10">
          <button
            onClick={() => handleResize("decrease")}
            disabled={currentSpan <= 3}
            className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center bg-white/80 text-muted-foreground hover:text-foreground",
              currentSpan <= 3 && "opacity-50 cursor-not-allowed",
            )}
            aria-label="Decrease size"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
          <button
            onClick={() => handleResize("increase")}
            disabled={currentSpan >= columns}
            className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center bg-white/80 text-muted-foreground hover:text-foreground",
              currentSpan >= columns && "opacity-50 cursor-not-allowed",
            )}
            aria-label="Increase size"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Card content */}
      <div ref={contentRef} className={cn(fontSize, padding)}>
        {children}
      </div>
    </div>
  )
}
