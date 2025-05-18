import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("Gmail callback route handler called")

    // Get the authorization code from the URL
    const url = new URL(request.url)
    const code = url.searchParams.get("code")
    const error = url.searchParams.get("error")

    console.log("Code present:", !!code)
    console.log("Error present:", !!error)

    // If there's an error, redirect to settings with error parameter
    if (error) {
      console.error("Google OAuth error:", error)
      return NextResponse.redirect(new URL(`/settings?tab=integrations&error=${error}`, url.origin))
    }

    // If we don't have a code, redirect back to settings
    if (!code) {
      console.error("No authorization code received")
      return NextResponse.redirect(new URL("/settings?tab=integrations&error=no_code", url.origin))
    }

    // Google API credentials
    const clientId = "1076146557292-34uhdpoavubdhjs02isk4imnrfcljing.apps.googleusercontent.com"
    const clientSecret = "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"
    const redirectUri = `${url.origin}/auth/gmail/callback`

    console.log("Exchanging code for tokens...")

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
      const errorText = await tokenResponse.text()
      console.error(`Token exchange failed: ${tokenResponse.status} ${tokenResponse.statusText}`, errorText)
      return NextResponse.redirect(
        new URL(`/settings?tab=integrations&error=token_exchange_${tokenResponse.status}`, url.origin),
      )
    }

    const tokenData = await tokenResponse.json()
    console.log("Token exchange successful")

    // Redirect to a client component with the tokens as URL parameters
    const successUrl = new URL("/auth/gmail/success", url.origin)
    successUrl.searchParams.set("access_token", tokenData.access_token)

    if (tokenData.refresh_token) {
      successUrl.searchParams.set("refresh_token", tokenData.refresh_token)
    } else {
      // If no refresh token is provided, we need to use a placeholder
      // This can happen if the user has already authorized the app
      console.warn("No refresh token received - user may have already authorized the app")
      successUrl.searchParams.set("refresh_token", "placeholder_refresh_token")
    }

    successUrl.searchParams.set("expires_in", tokenData.expires_in.toString())

    console.log("Redirecting to success page")
    return NextResponse.redirect(successUrl)
  } catch (error) {
    console.error("Error in Gmail callback:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.redirect(
      new URL(
        `/settings?tab=integrations&error=callback_error&message=${encodeURIComponent(errorMessage)}`,
        new URL(request.url).origin,
      ),
    )
  }
}
