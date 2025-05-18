import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")

  // If there's an error, redirect to settings with error parameter
  if (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.redirect(new URL("/settings?tab=integrations&error=auth_failed", requestUrl.origin))
  }

  // If we have a code, exchange it for tokens
  if (code) {
    try {
      // Google API credentials
      const clientId = "1076146557292-34uhdpoavubdhjs02isk4imnrfcljing.apps.googleusercontent.com"
      const clientSecret = "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"
      const redirectUri = `${requestUrl.origin}/auth/gmail/callback`

      // Exchange the code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      })

      if (!tokenResponse.ok) {
        throw new Error(`Token exchange failed: ${tokenResponse.statusText}`)
      }

      const tokenData = await tokenResponse.json()

      // Store tokens in sessionStorage (client-side storage will be handled in the client component)
      // We'll redirect to a client component that will handle storing the tokens

      // Redirect to a client component with the tokens as URL parameters
      // In a production app, you'd want to use a more secure method to transfer tokens
      return NextResponse.redirect(
        new URL(
          `/auth/gmail/success?access_token=${tokenData.access_token}&refresh_token=${tokenData.refresh_token}&expires_in=${tokenData.expires_in}`,
          requestUrl.origin,
        ),
      )
    } catch (error) {
      console.error("Error exchanging code for tokens:", error)
      return NextResponse.redirect(new URL("/settings?tab=integrations&error=token_exchange", requestUrl.origin))
    }
  }

  // If there's no code or error, redirect back to settings
  return NextResponse.redirect(new URL("/settings?tab=integrations", requestUrl.origin))
}
