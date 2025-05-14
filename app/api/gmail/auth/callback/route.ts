import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    // Check for error
    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || ""}/settings/integrations/gmail?error=${encodeURIComponent(error)}`,
      )
    }

    // Verify state for CSRF protection
    const storedState = cookies().get("gmail_auth_state")?.value

    if (!storedState || storedState !== state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || ""}/settings/integrations/gmail?error=${encodeURIComponent("Invalid state parameter")}`,
      )
    }

    // Clear state cookie
    cookies().delete("gmail_auth_state")

    // Verify code
    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || ""}/settings/integrations/gmail?error=${encodeURIComponent("No authorization code provided")}`,
      )
    }

    // Exchange code for tokens
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/gmail/auth/callback`

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID || "",
        client_secret: process.env.GMAIL_CLIENT_SECRET || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || ""}/settings/integrations/gmail?error=${encodeURIComponent(errorData.error_description || "Failed to exchange code for tokens")}`,
      )
    }

    const tokenData = await tokenResponse.json()

    // Get user info
    const userInfoResponse = await fetch("https://www.googleapis.com/gmail/v1/users/me/profile", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || ""}/settings/integrations/gmail?error=${encodeURIComponent("Failed to get user information")}`,
      )
    }

    const userInfo = await userInfoResponse.json()

    // Store tokens in secure HTTP-only cookies
    cookies().set("gmail_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenData.expires_in,
      path: "/",
    })

    if (tokenData.refresh_token) {
      cookies().set("gmail_refresh_token", tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      })
    }

    cookies().set("gmail_user_email", userInfo.emailAddress, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    // Redirect back to Gmail integration page with success
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || ""}/settings/integrations/gmail?success=true`)
  } catch (error) {
    console.error("Error in callback:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || ""}/settings/integrations/gmail?error=${encodeURIComponent("An unexpected error occurred")}`,
    )
  }
}
