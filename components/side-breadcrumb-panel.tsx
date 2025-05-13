"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function SideBreadcrumbPanel() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

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

      <div
        className={cn("p-4 border-b border-exp-purple/30 flex items-center", isCollapsed ? "justify-center" : "")}
      ></div>

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
  )
}
