"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { GmailService } from "@/services/gmail-service"

export default function GmailAuthSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    // Get tokens from URL parameters
    const accessToken = searchParams.get("access_token")
    const refreshToken = searchParams.get("refresh_token")
    const expiresIn = searchParams.get("expires_in")

    if (accessToken && refreshToken && expiresIn) {
      // Calculate expiry time
      const expiryTime = Date.now() + Number.parseInt(expiresIn) * 1000

      // Store tokens in sessionStorage
      sessionStorage.setItem("gmail_access_token", accessToken)
      sessionStorage.setItem("gmail_refresh_token", refreshToken)
      sessionStorage.setItem("gmail_token_expiry", expiryTime.toString())

      // Fetch and store user profile
      const fetchUserProfile = async () => {
        try {
          const userProfile = await GmailService.getUserProfile(accessToken)
          sessionStorage.setItem("gmail_user_email", userProfile.email)
          sessionStorage.setItem("gmail_user_name", userProfile.name)

          console.log("Stored user profile:", userProfile)
        } catch (error) {
          console.error("Error fetching user profile:", error)
        }
      }

      fetchUserProfile()

      // Show success toast
      toast({
        title: "Gmail Connected",
        description: "Your Gmail account has been successfully connected.",
        variant: "default",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } else {
      // Show error toast
      toast({
        title: "Connection Failed",
        description: "Failed to connect your Gmail account. Please try again.",
        variant: "destructive",
      })

      // Redirect to settings
      router.push("/settings?tab=integrations")
    }
  }, [router, searchParams, toast])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Connecting your Gmail account...</h1>
        <p className="text-muted-foreground">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  )
}
