"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"

interface SignInDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Create a Supabase client using the auth-helpers-nextjs package
  // This is better for Next.js integration than the standard client
  const supabase = createClientComponentClient({
    supabaseUrl: "https://ylpfxtdzizqrzhtxwelk.supabase.co",
    supabaseKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlscGZ4dGR6aXpxcnpodHh3ZWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjI1MDgsImV4cCI6MjA2MjgzODUwOH0.Gv623QSJLOZwYrPBhyOkw9Vk-kzrH4PI6qn125gD1Tw",
  })

  // Check if user is already signed in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        router.push("/dashboard")
      }
    }

    if (open) {
      checkUser()
    }
  }, [open, router, supabase.auth])

  // Handle email/password sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setAuthError(error.message)
      } else {
        router.push("/dashboard")
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setAuthError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setAuthError(null)

    try {
      // This approach uses a custom flow with a state parameter to track the redirect
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          redirectTo: `${window.location.origin}/auth/callback?destination=/dashboard`,
        },
      })

      if (error) {
        setAuthError(error.message)
        setIsLoading(false)
        return
      }

      // Redirect to the Google OAuth URL
      if (data?.url) {
        // Using window.location.href for a full page redirect
        window.location.href = data.url
      } else {
        setAuthError("Failed to get authentication URL")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Google sign in error:", error)
      setAuthError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Sign in to DealsMate</DialogTitle>
          <DialogDescription>Access your account to manage your real estate transactions</DialogDescription>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{authError}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail className="h-5 w-5" />
              </div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="Email address"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                placeholder="Password"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-purple-500" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full border-gray-300"
            disabled={isLoading}
          >
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            {isLoading ? "Connecting..." : "Sign in with Google"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
