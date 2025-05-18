"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { createClient } from "@supabase/supabase-js"

// Define user type
interface User {
  id: string
  name: string
  email: string
  avatar_url?: string
}

// Auth context type
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (credentials: { email: string; password: string }) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a singleton Supabase client
const createSupabaseClient = () => {
  const supabaseUrl = "https://ylpfxtdzizqrzhtxwelk.supabase.co"
  const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlscGZ4dGR6aXpxcnpodHh3ZWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjI1MDgsImV4cCI6MjA2MjgzODUwOH0.Gv623QSJLOZwYrPBhyOkw9Vk-kzrH4PI6qn125gD1Tw"
  return createClient(supabaseUrl, supabaseAnonKey)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      setIsLoading(true)

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          setUser(null)
        } else if (session) {
          // Extract user data from session
          const userData = session.user

          // Format user data
          setUser({
            id: userData.id,
            name: userData.user_metadata?.full_name || userData.user_metadata?.name || "User",
            email: userData.email || "",
            avatar_url: userData.user_metadata?.avatar_url || userData.user_metadata?.picture,
          })
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Session check error:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const userData = session.user
        setUser({
          id: userData.id,
          name: userData.user_metadata?.full_name || userData.user_metadata?.name || "User",
          email: userData.email || "",
          avatar_url: userData.user_metadata?.avatar_url || userData.user_metadata?.picture,
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    checkSession()

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Sign in error:", error)
      }
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsLoading(false)
    }
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
