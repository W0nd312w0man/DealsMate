"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@supabase/supabase-js"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"

// Initialize Supabase client with placeholder values
// Replace these with your actual values in production
const supabaseUrl = "https://ylpfxtdzizqrzhtxwelk.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlscGZ4dGR6aXpxcnpodHh3ZWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjI1MDgsImV4cCI6MjA2MjgzODUwOH0.Gv623QSJLOZwYrPBhyOkw9Vk-kzrH4PI6qn125gD1Tw"
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface SignInDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/auth/callback",
        },
      })

      if (error) {
        console.error("Error signing in with Google:", error.message)
        return
      }

      // Important: You need to redirect to the URL returned by Supabase
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Unexpected error during Google sign-in:", error)
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
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-purple-500">
            Sign in
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button type="button" variant="outline" onClick={handleGoogleSignIn} className="w-full border-gray-300">
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
            Sign in with Google
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Note: You would need to create a route handler at /auth/callback
// that would handle the OAuth callback and redirect to the dashboard
// Example implementation would be:
//
// // app/auth/callback/route.ts
// import { createClient } from '@supabase/supabase-js'
// import { NextResponse } from 'next/server'
//
// export async function GET(request) {
//   const requestUrl = new URL(request.url)
//   const code = requestUrl.searchParams.get('code')
//
//   if (code) {
//     const supabaseUrl = 'YOUR_SUPABASE_URL'
//     const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
//     const supabase = createClient(supabaseUrl, supabaseAnonKey)
//
//     await supabase.auth.exchangeCodeForSession(code)
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }
//
//   return NextResponse.redirect(new URL('/', request.url))
// }
