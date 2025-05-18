"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { createClient } from "@supabase/supabase-js"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => {
  const [profilePicture, setProfilePicture] = React.useState<string | null>(props.src || null)

  React.useEffect(() => {
    // Check for user profile picture from Supabase
    const checkUserProfile = async () => {
      try {
        // Create a singleton Supabase client
        const supabaseUrl = "https://ylpfxtdzizqrzhtxwelk.supabase.co"
        const supabaseAnonKey =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlscGZ4dGR6aXpxcnpodHh3ZWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjI1MDgsImV4cCI6MjA2MjgzODUwOH0.Gv623QSJLOZwYrPBhyOkw9Vk-kzrH4PI6qn125gD1Tw"
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        // Get the current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          // Get profile picture from user metadata
          const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null

          if (avatarUrl) {
            console.log("Found user profile picture:", avatarUrl)
            setProfilePicture(avatarUrl)
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }

    checkUserProfile()
  }, [props.src])

  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn("aspect-square h-full w-full", className)}
      src={profilePicture || "/bruce-wayne.png"}
      {...props}
    />
  )
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, children, ...props }, ref) => {
  // Check for Gmail user name in sessionStorage
  const [initials, setInitials] = React.useState<string | null>(null)

  React.useEffect(() => {
    const gmailUserName = sessionStorage.getItem("gmail_user_name")
    const gmailUserEmail = sessionStorage.getItem("gmail_user_email")

    if (gmailUserName) {
      const userInitials = gmailUserName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
      setInitials(userInitials)
    } else if (gmailUserEmail) {
      setInitials(gmailUserEmail.substring(0, 2).toUpperCase())
    }
  }, [])

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
      {...props}
    >
      {initials || children}
    </AvatarPrimitive.Fallback>
  )
})
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
