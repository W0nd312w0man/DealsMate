import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Get access token
    const accessToken = cookies().get("gmail_access_token")?.value

    if (accessToken) {
      // Revoke token at Google
      await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
    }

    // Clear cookies regardless of revocation success
    cookies().delete("gmail_access_token")
    cookies().delete("gmail_refresh_token")
    cookies().delete("gmail_user_email")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error disconnecting Gmail:", error)
    return NextResponse.json({ error: "Failed to disconnect Gmail" }, { status: 500 })
  }
}
