"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

interface GmailAuthStatus {
  isAuthenticated: boolean
  userEmail?: string
}

export function useGmailAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Initiate OAuth flow
  const initiateAuth = useCallback(async () => {
    setIsLoading(true)

    try {
      // Get auth URL from API
      const response = await fetch("/api/gmail/auth/url")

      if (!response.ok) {
        throw new Error("Failed to get authentication URL")
      }

      const { url } = await response.json()

      // Redirect to Google OAuth
      window.location.href = url
    } catch (error) {
      console.error("Error initiating auth:", error)
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "Failed to initiate authentication",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }, [toast])

  // Check authentication status
  const checkAuthStatus = useCallback(async (): Promise<GmailAuthStatus> => {
    try {
      const response = await fetch("/api/gmail/auth/status")

      if (!response.ok) {
        return { isAuthenticated: false }
      }

      return await response.json()
    } catch (error) {
      console.error("Error checking auth status:", error)
      return { isAuthenticated: false }
    }
  }, [])

  // Disconnect Gmail
  const disconnectGmail = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/gmail/auth/disconnect", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to disconnect Gmail")
      }

      return true
    } catch (error) {
      console.error("Error disconnecting Gmail:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to disconnect Gmail",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Get authentication status
  const isAuthenticated = useCallback(async (): Promise<boolean> => {
    const status = await checkAuthStatus()
    return status.isAuthenticated
  }, [checkAuthStatus])

  return {
    initiateAuth,
    disconnectGmail,
    checkAuthStatus,
    isAuthenticated,
    isLoading,
  }
}
