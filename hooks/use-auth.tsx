"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define user type
export type User = {
  id: string
  name: string
  email: string
  role: "agent" | "admin" | "broker"
  avatar?: string
}

// Mock user data
const MOCK_USER: User = {
  id: "1",
  name: "Matt Johnson",
  email: "matt@example.com",
  role: "agent",
  avatar: "/avatar-matt.png", // We'll create this image
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate checking for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // In a real app, this would check for an existing session/token
        // For demo purposes, we'll just set our mock user after a delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        setUser(MOCK_USER)
      } catch (error) {
        console.error("Session check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // In a real app, this would validate credentials with a backend
      // For demo purposes, we'll just set our mock user
      setUser(MOCK_USER)
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // In a real app, this would clear tokens/session
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
