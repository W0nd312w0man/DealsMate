import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Check if access token exists
    const accessToken = cookies().get("gmail_access_token")?.value
    const userEmail = cookies().get("gmail_user_email")?.value

    if (!accessToken) {
      return NextResponse.json({ isAuthenticated: false })
    }

    // Verify token is valid by making a simple API call
    const response = await fetch("https://www.googleapis.com/gmail/v1/users/me/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      // Token might be expired, try to refresh
      const refreshToken = cookies().get("gmail_refresh_token")?.value

      if (!refreshToken) {
        // No refresh token, user needs to re-authenticate
        return NextResponse.json({ isAuthenticated: false })
      }

      // Try to refresh the token
      const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          refresh_token: refreshToken,
          client_id: process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID || "",
          client_secret: process.env.GMAIL_CLIENT_SECRET || "",
          grant_type: "refresh_token",
        }),
      })

      if (!refreshResponse.ok) {
        // Refresh failed, user needs to re-authenticate
        return NextResponse.json({ isAuthenticated: false })
      }

      // Update access token
      const refreshData = await refreshResponse.json()

      cookies().set("gmail_access_token", refreshData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: refreshData.expires_in,
        path: "/",
      })

      return NextResponse.json({
        isAuthenticated: true,
        userEmail,
      })
    }

    return NextResponse.json({
      isAuthenticated: true,
      userEmail,
    })
  } catch (error) {
    console.error("Error checking auth status:", error)
    return NextResponse.json({ isAuthenticated: false })
  }
}
