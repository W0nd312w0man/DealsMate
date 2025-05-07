"use client"

import { SearchAutocomplete } from "./search-autocomplete"

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your DealsMate dashboard.</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="w-full sm:w-64">
          <SearchAutocomplete />
        </div>
      </div>
    </div>
  )
}
