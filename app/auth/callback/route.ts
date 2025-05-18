import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    // Get the code and destination from the URL
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")

    // Get the destination from the URL or default to dashboard
    const destination = requestUrl.searchParams.get("destination") || "/dashboard"

    // If there's no code, redirect to the landing page
    if (!code) {
      console.error("No code provided in callback")
      return NextResponse.redirect(new URL("/landing", request.url))
    }

    // Create a Supabase client using the auth-helpers-nextjs
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    // This will automatically set the auth cookie
    await supabase.auth.exchangeCodeForSession(code)

    console.log("Successfully exchanged code for session, redirecting to:", destination)

    // Redirect to the destination (dashboard by default)
    return NextResponse.redirect(new URL(destination, request.url))
  } catch (error) {
    console.error("Error in auth callback:", error)
    return NextResponse.redirect(new URL("/landing?error=Authentication failed", request.url))
  }
}
