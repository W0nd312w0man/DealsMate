"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

// Grid context to manage column spans and breakpoints
type GridContextType = {
  columns: number
  getColumnSpan: (id: string) => number
  setColumnSpan: (id: string, span: number) => void
  breakpoint: "mobile" | "tablet" | "desktop"
  getFontSize: (id: string) => string
  getPadding: (id: string) => string
}

const GridContext = createContext<GridContextType>({
  columns: 12,
  getColumnSpan: () => 3,
  setColumnSpan: () => {},
  breakpoint: "desktop",
  getFontSize: () => "text-sm",
  getPadding: () => "p-4",
})

export const useGrid = () => useContext(GridContext)

interface GridProviderProps {
  children: React.ReactNode
  defaultSpans?: Record<string, number>
}

export function GridProvider({ children, defaultSpans = {} }: GridProviderProps) {
  // Default column spans for different card types
  const initialSpans: Record<string, number> = {
    "client-lifecycle": 6,
    "workspace-stages": 6,
    "talos-insights": 3,
    "quick-actions": 3,
    "recent-activity": 4,
    "upcoming-tasks": 4,
    "smart-inbox": 8,
    "tasks-panel": 4,
    "upcoming-events": 4,
    ...defaultSpans,
  }

  const [columnSpans, setColumnSpans] = useState<Record<string, number>>(initialSpans)
  const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [columns, setColumns] = useState(12)

  // Update breakpoint and columns based on window size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width >= 1280) {
        setBreakpoint("desktop")
        setColumns(12)
      } else if (width >= 768) {
        setBreakpoint("tablet")
        setColumns(8)
      } else {
        setBreakpoint("mobile")
        setColumns(4)
      }
    }

    // Initial call
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Load saved spans from localStorage
  useEffect(() => {
    const savedSpans = localStorage.getItem("dashboardColumnSpans")
    if (savedSpans) {
      try {
        setColumnSpans(JSON.parse(savedSpans))
      } catch (e) {
        console.error("Failed to parse saved column spans", e)
      }
    }
  }, [])

  // Save spans to localStorage when they change
  useEffect(() => {
    localStorage.setItem("dashboardColumnSpans", JSON.stringify(columnSpans))
  }, [columnSpans])

  const getColumnSpan = (id: string) => {
    // Apply responsive adjustments
    const baseSpan = columnSpans[id] || initialSpans[id] || 3

    if (breakpoint === "mobile") {
      return Math.min(baseSpan, 4) // Max 4 columns on mobile
    } else if (breakpoint === "tablet") {
      return Math.min(baseSpan, 8) // Max 8 columns on tablet
    }

    return baseSpan // Desktop uses the full span
  }

  const setColumnSpan = (id: string, span: number) => {
    // Enforce min/max constraints
    const constrainedSpan = Math.max(3, Math.min(span, columns))
    setColumnSpans((prev) => ({ ...prev, [id]: constrainedSpan }))
  }

  // Dynamic font sizing based on column span
  const getFontSize = (id: string) => {
    const span = getColumnSpan(id)

    if (span >= 9) return "text-lg"
    if (span >= 6) return "text-md"
    return "text-sm"
  }

  // Dynamic padding based on column span
  const getPadding = (id: string) => {
    const span = getColumnSpan(id)

    if (span >= 9) return "p-6"
    if (span >= 6) return "p-5"
    return "p-4"
  }

  return (
    <GridContext.Provider
      value={{
        columns,
        getColumnSpan,
        setColumnSpan,
        breakpoint,
        getFontSize,
        getPadding,
      }}
    >
      {children}
    </GridContext.Provider>
  )
}

interface GridContainerProps {
  children: React.ReactNode
  className?: string
}

export function GridContainer({ children, className }: GridContainerProps) {
  const { columns } = useGrid()

  return (
    <div
      className={cn(
        "grid gap-4 w-full",
        columns === 12 ? "grid-cols-12" : columns === 8 ? "grid-cols-8" : "grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  )
}

interface GridItemProps {
  children: React.ReactNode
  id: string
  className?: string
}

export function GridItem({ children, id, className, ...props }: GridItemProps & React.HTMLAttributes<HTMLDivElement>) {
  const { getColumnSpan } = useGrid()
  const span = getColumnSpan(id)
  const ref = useRef<HTMLDivElement>(null)

  // Apply dynamic classes based on span
  useEffect(() => {
    if (ref.current) {
      // Add data attributes for potential JS manipulation
      ref.current.setAttribute("data-grid-id", id)
      ref.current.setAttribute("data-column-span", span.toString())
    }
  }, [id, span])

  return (
    <div ref={ref} className={cn("transition-all duration-300", `col-span-${span}`, className)} {...props}>
      {children}
    </div>
  )
}

// Add the GridSystem component that combines GridProvider and GridContainer
interface GridSystemProps {
  children: React.ReactNode
  className?: string
  defaultSpans?: Record<string, number>
}

export function GridSystem({ children, className, defaultSpans }: GridSystemProps) {
  return (
    <GridProvider defaultSpans={defaultSpans}>
      <GridContainer className={className}>{children}</GridContainer>
    </GridProvider>
  )
}
