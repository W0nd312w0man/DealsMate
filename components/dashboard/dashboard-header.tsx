"use client"

import { useEffect, useState } from "react"
import { SearchAutocomplete } from "./search-autocomplete"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

// Safe sessionStorage access
const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(key)
    }
    return null
  },
}

export function DashboardHeader() {
  const { user, isLoading } = useAuth()
  const [gmailUser, setGmailUser] = useState<{ email?: string; name?: string } | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Set mounted state to ensure we only access browser APIs after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Check for Gmail user info on component mount and when window gains focus
  useEffect(() => {
    if (!isMounted) return

    const checkGmailUser = () => {
      const email = safeSessionStorage.getItem("gmail_user_email")
      const name = safeSessionStorage.getItem("gmail_user_name")

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
  }, [isMounted])

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Get user name from Supabase metadata if available
  const getUserName = () => {
    if (!isMounted) return user?.name || "User"

    // First try to get from Supabase metadata in sessionStorage
    const supabaseName = safeSessionStorage.getItem("supabase_user_name")
    if (supabaseName) return supabaseName

    // Then try to get from user object
    if (user?.name && user.name !== "User") return user.name

    // Then try to get from Gmail user
    if (gmailUser?.name) return gmailUser.name

    // Default fallback
    return "User"
  }

  // Get user avatar from Supabase metadata if available
  const getUserAvatar = () => {
    if (!isMounted) return user?.avatar_url

    // First try to get from Supabase metadata in sessionStorage
    const supabaseAvatar = safeSessionStorage.getItem("supabase_user_avatar")
    if (supabaseAvatar) return supabaseAvatar

    // Then try to get from user object
    if (user?.avatar_url) return user.avatar_url

    // Default fallback
    return undefined
  }

  const userName = getUserName()
  const userAvatar = getUserAvatar()

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
              <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
              <AvatarFallback>{getInitials(userName)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome to your dashboard, {userName}
                {user?.email && user.email !== userName && isMounted ? ` (${user.email})` : ""}
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
