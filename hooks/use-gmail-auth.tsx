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

  // Mock function without API calls
  const initiateAuth = useCallback(async () => {
    setIsLoading(true)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)

      toast({
        title: "Authentication Initiated",
        description: "This is a mock authentication flow with no actual API calls.",
        variant: "default",
      })
    }, 1000)
  }, [toast])

  // Mock function without API calls
  const checkAuthStatus = useCallback(async (): Promise<GmailAuthStatus> => {
    return { isAuthenticated: false }
  }, [])

  // Mock function without API calls
  const disconnectGmail = useCallback(async () => {
    setIsLoading(true)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)

      toast({
        title: "Disconnected",
        description: "Mock Gmail disconnection (no actual API calls).",
        variant: "default",
      })
    }, 1000)

    return true
  }, [toast])

  // Mock function without API calls
  const isAuthenticated = useCallback(async (): Promise<boolean> => {
    return false
  }, [])

  return {
    initiateAuth,
    disconnectGmail,
    checkAuthStatus,
    isAuthenticated,
    isLoading,
  }
}
