"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"

// Mock auth context with no API calls
interface AuthContextType {
  user: any | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (credentials: { email: string; password: string }) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate auth check without API calls
    setTimeout(() => {
      setUser({ id: "1", name: "Demo User", email: "demo@example.com" })
      setIsLoading(false)
    }, 500)
  }, [])

  const signIn = async () => {
    setIsLoading(true)
    // Simulate sign in without API calls
    setTimeout(() => {
      setUser({ id: "1", name: "Demo User", email: "demo@example.com" })
      setIsLoading(false)
    }, 500)
  }

  const signOut = async () => {
    setIsLoading(true)
    // Simulate sign out without API calls
    setTimeout(() => {
      setUser(null)
      setIsLoading(false)
    }, 500)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
