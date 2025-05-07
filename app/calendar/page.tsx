import type { Metadata } from "next"
import { CalendarView } from "@/components/calendar/calendar-view"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PageNavigation } from "@/components/page-navigation"

export const metadata: Metadata = {
  title: "Calendar | DealMate",
  description: "Manage your schedule, tasks, and events",
}

export default function CalendarPage() {
  return (
    <div className="container space-y-6 py-8">
      <BreadcrumbNav />
      <div>
        <p className="text-muted-foreground">Manage your schedule, tasks, and events across all your transactions</p>
      </div>
      <CalendarView />
      <PageNavigation
        prevPage={{ url: "/documents", label: "Documents" }}
        nextPage={{ url: "/communication", label: "Communication" }}
      />
    </div>
  )
}
