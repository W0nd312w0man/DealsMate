import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(2)

    // Store state in cookies for verification
    cookies().set("gmail_auth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    })

    // Redirect URI
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/gmail/auth/callback`

    // OAuth scopes
    const scopes = [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.compose",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.labels",
    ]

    // Build OAuth URL
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    authUrl.searchParams.append("client_id", process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID || "")
    authUrl.searchParams.append("redirect_uri", redirectUri)
    authUrl.searchParams.append("response_type", "code")
    authUrl.searchParams.append("scope", scopes.join(" "))
    authUrl.searchParams.append("access_type", "offline")
    authUrl.searchParams.append("prompt", "consent")
    authUrl.searchParams.append("state", state)

    return NextResponse.json({ url: authUrl.toString() })
  } catch (error) {
    console.error("Error generating auth URL:", error)
    return NextResponse.json({ error: "Failed to generate authentication URL" }, { status: 500 })
  }
}
