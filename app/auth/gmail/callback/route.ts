import { type NextRequest, NextResponse } from "next/server"
import { GmailService } from "@/services/gmail-service"

export async function GET(request: NextRequest) {
  try {
    // Get the authorization code from the URL
    const url = new URL(request.url)
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")

    if (!code) {
      return NextResponse.redirect(new URL("/settings?tab=integrations&error=no_code", request.url))
    }

    // Exchange the code for tokens
    const redirectUri = `${url.origin}/auth/gmail/callback`
    const { accessToken, refreshToken, expiryDate } = await GmailService.exchangeCodeForTokens(code, redirectUri)

    // Redirect to success page with tokens
    const successUrl = new URL("/auth/gmail/success", request.url)
    successUrl.searchParams.set("access_token", accessToken)
    successUrl.searchParams.set("refresh_token", refreshToken)
    successUrl.searchParams.set("expires_in", Math.floor((expiryDate - Date.now()) / 1000).toString())

    if (state) {
      successUrl.searchParams.set("state", state)
    }

    return NextResponse.redirect(successUrl)
  } catch (error) {
    console.error("Error in Gmail callback:", error)
    return NextResponse.redirect(new URL("/settings?tab=integrations&error=auth_failed", request.url))
  }
}
