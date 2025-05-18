import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Get the URL and extract the code and next parameters
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  // If there's no code, redirect to the login page
  if (!code) {
    return NextResponse.redirect(new URL("/landing", request.url))
  }

  try {
    // Create a Supabase client using the route handler helper
    const supabase = createRouteHandlerClient({ cookies })

    // Exchange the code for a session
    // This will automatically set the necessary cookies
    await supabase.auth.exchangeCodeForSession(code)

    // Redirect to the dashboard after successful authentication
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("Error during OAuth callback:", error)
    // Redirect to the login page with an error parameter
    return NextResponse.redirect(new URL("/landing?error=Authentication failed", request.url))
  }
}
