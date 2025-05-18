"use client"

import { useState, useCallback, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { GmailService } from "@/services/gmail-service"
import { useRouter } from "next/navigation"

interface GmailAuthStatus {
  isAuthenticated: boolean
  userEmail?: string
}

export function useGmailAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [authStatus, setAuthStatus] = useState<GmailAuthStatus>({ isAuthenticated: false })
  const { toast } = useToast()
  const router = useRouter()

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = sessionStorage.getItem("gmail_access_token")
      const refreshToken = sessionStorage.getItem("gmail_refresh_token")
      const tokenExpiry = sessionStorage.getItem("gmail_token_expiry")

      if (!accessToken || !refreshToken || !tokenExpiry) {
        setAuthStatus({ isAuthenticated: false })
        return
      }

      // Check if token is expired
      if (Date.now() > Number.parseInt(tokenExpiry)) {
        try {
          // Refresh the token
          const { accessToken: newAccessToken, expiryDate } = await GmailService.refreshAccessToken(refreshToken)

          // Update sessionStorage
          sessionStorage.setItem("gmail_access_token", newAccessToken)
          sessionStorage.setItem("gmail_token_expiry", expiryDate.toString())

          // Get user profile
          const userProfile = await GmailService.getUserProfile(newAccessToken)
          setAuthStatus({ isAuthenticated: true, userEmail: userProfile.email })
        } catch (error) {
          console.error("Error refreshing token:", error)
          setAuthStatus({ isAuthenticated: false })

          // Clear invalid tokens
          sessionStorage.removeItem("gmail_access_token")
          sessionStorage.removeItem("gmail_refresh_token")
          sessionStorage.removeItem("gmail_token_expiry")
        }
      } else {
        try {
          // Token is valid, get user profile
          const userProfile = await GmailService.getUserProfile(accessToken)
          setAuthStatus({ isAuthenticated: true, userEmail: userProfile.email })
        } catch (error) {
          console.error("Error getting user profile:", error)
          setAuthStatus({ isAuthenticated: false })
        }
      }
    }

    checkAuth()
  }, [])

  const initiateAuth = useCallback(async () => {
    setIsLoading(true)

    try {
      // Get the redirect URI
      const redirectUri = `${window.location.origin}/auth/gmail/callback`

      // Get the auth URL
      const authUrl = GmailService.getAuthUrl(redirectUri)

      // Redirect to Google's auth page
      window.location.href = authUrl
    } catch (error) {
      console.error("Error initiating auth:", error)
      toast({
        title: "Authentication Failed",
        description: "Failed to initiate Gmail authentication. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }, [toast])

  const disconnectGmail = useCallback(async () => {
    setIsLoading(true)

    try {
      // Clear tokens from sessionStorage
      sessionStorage.removeItem("gmail_access_token")
      sessionStorage.removeItem("gmail_refresh_token")
      sessionStorage.removeItem("gmail_token_expiry")

      // Update auth status
      setAuthStatus({ isAuthenticated: false })

      // Show success toast
      toast({
        title: "Gmail Disconnected",
        description: "Your Gmail account has been disconnected.",
        variant: "default",
      })

      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Error disconnecting Gmail:", error)
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect your Gmail account. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
      return false
    }
  }, [toast])

  const isAuthenticated = useCallback(async (): Promise<boolean> => {
    return authStatus.isAuthenticated
  }, [authStatus.isAuthenticated])

  return {
    initiateAuth,
    disconnectGmail,
    checkAuthStatus: async () => authStatus,
    isAuthenticated,
    isLoading,
    authStatus,
  }
}
