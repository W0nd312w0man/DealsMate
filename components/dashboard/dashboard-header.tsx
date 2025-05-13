"use client"

import { SearchAutocomplete } from "./search-autocomplete"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardHeader() {
  const { isLoading } = useAuth()

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        {isLoading ? (
          <>
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
          </>
        ) : (
          <>
            <Avatar className="h-12 w-12 border-2 border-purple-200">
              <AvatarImage src="/bruce-wayne.png" alt="Bruce Wayne" />
              <AvatarFallback>BW</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome to your dashboard, Bruce Wayne</p>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="w-full sm:w-64">
          <SearchAutocomplete />
        </div>
      </div>
    </div>
  )
}
