"use client"

import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

export function BreadcrumbNav() {
  const pathname = usePathname()

  // Skip rendering on the dashboard
  if (pathname === "/dashboard" || pathname === "/") {
    return null
  }

  // Create breadcrumb segments
  const segments = pathname.split("/").filter(Boolean)

  // Map path segments to readable names
  const pathMap: Record<string, string> = {
    dashboard: "Dashboard",
    workspaces: "Workspaces",
    transactions: "Transactions",
    documents: "Documents",
    calendar: "Calendar",
    communication: "Communication",
    contacts: "Contacts",
    compliance: "Compliance",
    tasks: "Tasks",
    settings: "Settings",
    "ai-document-upload": "AI Document Upload",
  }

  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/dashboard" className="flex items-center hover:text-purple-500 transition-colors">
            <Home className="h-4 w-4" />
            <span className="sr-only">Dashboard</span>
          </Link>
        </li>

        {segments.map((segment, index) => {
          // Create the path up to this segment
          const href = `/${segments.slice(0, index + 1).join("/")}`
          const isLast = index === segments.length - 1
          const displayName = pathMap[segment] || segment

          // For IDs or dynamic segments, try to make them more readable
          const readableSegment = segment.startsWith("WS-") ? "Workspace Details" : displayName

          return (
            <li key={segment} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1" />
              {isLast ? (
                <span className="font-medium text-purple-700">{readableSegment}</span>
              ) : (
                <Link href={href} className="hover:text-purple-500 transition-colors">
                  {readableSegment}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
