"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

// Safe sessionStorage access
const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(key)
    }
    return null
  },
  removeItem: (key: string): void => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(key)
    }
  },
}

export function UserNav() {
  const { user, signOut, isLoading } = useAuth()
  const router = useRouter()
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

  const handleSignOut = async () => {
    // Clear Gmail session data
    if (typeof window !== "undefined") {
      safeSessionStorage.removeItem("gmail_access_token")
      safeSessionStorage.removeItem("gmail_refresh_token")
      safeSessionStorage.removeItem("gmail_token_expiry")
      safeSessionStorage.removeItem("gmail_user_email")
      safeSessionStorage.removeItem("gmail_user_name")
    }

    await signOut()
    router.push("/landing")
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

  // Get user email from Supabase metadata if available
  const getUserEmail = () => {
    if (!isMounted) return user?.email || "user@example.com"

    // First try to get from Supabase metadata in sessionStorage
    const supabaseEmail = safeSessionStorage.getItem("supabase_user_email")
    if (supabaseEmail) return supabaseEmail

    // Then try to get from user object
    if (user?.email) return user.email

    // Then try to get from Gmail user
    if (gmailUser?.email) return gmailUser.email

    // Default fallback
    return "user@example.com"
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
  const userEmail = getUserEmail()
  const userAvatar = getUserAvatar()

  if (isLoading) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
            <AvatarFallback>{getInitials(userName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
          {gmailUser && (
            <DropdownMenuItem onClick={() => router.push("/settings?tab=integrations")}>
              Gmail Settings
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
