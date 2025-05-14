import { type NextRequest, NextResponse } from "next/server"
import { GmailService } from "@/services/gmail-service"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  // Handle error
  if (error) {
    return NextResponse.redirect(
      new URL(`/settings/integrations/gmail?error=${encodeURIComponent(error)}`, request.url),
    )
  }

  // Validate state and code
  if (!code || !state) {
    return NextResponse.redirect(new URL("/settings/integrations/gmail?error=missing_params", request.url))
  }

  try {
    // Exchange code for tokens
    const redirectUri = `${new URL(request.url).origin}/api/gmail/callback`
    const credentials = await GmailService.exchangeCodeForTokens(code, redirectUri)

    // Redirect to Gmail integration page with success
    const redirectUrl = new URL("/settings/integrations/gmail", request.url)
    redirectUrl.searchParams.set("success", "true")
    redirectUrl.searchParams.set("credentials", JSON.stringify(credentials))

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("Error exchanging code for tokens:", error)

    // Redirect with error
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.redirect(
      new URL(`/settings/integrations/gmail?error=${encodeURIComponent(errorMessage)}`, request.url),
    )
  }
}
