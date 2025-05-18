"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { GmailService } from "@/services/gmail-service"
import { useAuth } from "@/hooks/use-auth"

// Safe sessionStorage access
const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(key)
    }
    return null
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, value)
    }
  },
}

export default function GmailAuthSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { restoreUserMetadata } = useAuth()

  useEffect(() => {
    const storeTokensAndRedirect = async () => {
      try {
        // Get tokens from URL parameters
        const accessToken = searchParams.get("access_token")
        const refreshToken = searchParams.get("refresh_token")
        const expiresIn = searchParams.get("expires_in")

        console.log("Auth success page - tokens received:", {
          accessToken: accessToken ? "Present" : "Not present",
          refreshToken: refreshToken ? "Present" : "Not present",
          expiresIn,
        })

        if (accessToken && refreshToken && expiresIn) {
          // Calculate expiry time
          const expiryTime = Date.now() + Number.parseInt(expiresIn) * 1000

          // Store tokens in sessionStorage
          safeSessionStorage.setItem("gmail_access_token", accessToken)
          safeSessionStorage.setItem("gmail_refresh_token", refreshToken)
          safeSessionStorage.setItem("gmail_token_expiry", expiryTime.toString())

          console.log("Tokens stored in sessionStorage")

          // Fetch and store user profile
          try {
            console.log("Fetching user profile...")
            const userProfile = await GmailService.getUserProfile(accessToken)

            // Store Gmail user info in sessionStorage
            safeSessionStorage.setItem("gmail_user_email", userProfile.email)
            safeSessionStorage.setItem("gmail_user_name", userProfile.name || userProfile.email.split("@")[0])

            console.log("Gmail user profile stored:", userProfile)

            // Restore the original Supabase user metadata
            restoreUserMetadata()
            console.log("Restored Supabase user metadata")

            // Show success toast
            toast({
              title: "Gmail Connected",
              description: "Your Gmail account has been successfully connected.",
              variant: "default",
            })

            // Force a window reload to ensure all components pick up the restored user info
            if (typeof window !== "undefined") {
              window.location.href = "/dashboard"
            } else {
              router.push("/dashboard")
            }
            return // Stop execution after redirect
          } catch (error) {
            console.error("Error fetching user profile:", error)
          }

          // Redirect to dashboard
          router.push("/dashboard")
        } else {
          console.error("Missing tokens in URL parameters")
          // Show error toast
          toast({
            title: "Connection Failed",
            description: "Failed to connect your Gmail account. Please try again.",
            variant: "destructive",
          })

          // Redirect to settings
          router.push("/settings?tab=integrations")
        }
      } catch (error) {
        console.error("Error in storeTokensAndRedirect:", error)
        toast({
          title: "Connection Failed",
          description: "An error occurred while connecting your Gmail account.",
          variant: "destructive",
        })
        router.push("/settings?tab=integrations")
      }
    }

    storeTokensAndRedirect()
  }, [router, searchParams, toast, restoreUserMetadata])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Connecting your Gmail account...</h1>
        <p className="text-muted-foreground">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  )
}
