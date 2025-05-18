"use client"

import { useEffect, useState } from "react"
import { SearchAutocomplete } from "./search-autocomplete"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardHeader() {
  const { user, isLoading } = useAuth()
  const [gmailUser, setGmailUser] = useState<{ email?: string; name?: string } | null>(null)

  // Check for Gmail user info on component mount and when window gains focus
  useEffect(() => {
    const checkGmailUser = () => {
      const email = sessionStorage.getItem("gmail_user_email")
      const name = sessionStorage.getItem("gmail_user_name")

      if (email) {
        setGmailUser({ email, name: name || email.split("@")[0] })
      }
    }

    // Check on mount
    checkGmailUser()

    // Also check when window gains focus (helps after auth redirect)
    window.addEventListener("focus", checkGmailUser)

    return () => {
      window.removeEventListener("focus", checkGmailUser)
    }
  }, [])

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Use Gmail user info if available, otherwise fall back to regular user
  const displayUser = gmailUser || user

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
              <AvatarImage
                src={
                  displayUser?.email
                    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUser.name || displayUser.email)}&background=random`
                    : user?.avatar_url || "/bruce-wayne.png"
                }
                alt={displayUser?.name || "User"}
              />
              <AvatarFallback>{displayUser?.name ? getInitials(displayUser.name) : "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome to your dashboard, {displayUser?.name || "User"}
                {displayUser?.email && displayUser.email !== displayUser.name ? ` (${displayUser.email})` : ""}
              </p>
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
