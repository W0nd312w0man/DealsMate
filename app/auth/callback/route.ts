import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Initialize Supabase client with placeholders for environment variables
// Replace these placeholders with your actual Supabase URL and anon key
const supabaseUrl = "https://ylpfxtdzizqrzhtxwelk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlscGZ4dGR6aXpxcnpodHh3ZWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjI1MDgsImV4cCI6MjA2MjgzODUwOH0.Gv623QSJLOZwYrPBhyOkw9Vk-kzrH4PI6qn125gD1Tw"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    try {
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code)

      // Redirect to dashboard after successful authentication
      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
    } catch (error) {
      console.error("Error exchanging code for session:", error)
      // Redirect to landing page with error parameter
      return NextResponse.redirect(new URL("/?auth=error", requestUrl.origin))
    }
  }

  // If there's no code, redirect back to the landing page
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}
