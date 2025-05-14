import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// GET settings
export async function GET() {
  try {
    // Check if user is authenticated
    const userEmail = cookies().get("gmail_user_email")?.value

    if (!userEmail) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // In a real implementation, you would fetch settings from a database
    // For now, return default settings
    return NextResponse.json({
      signature: {
        enabled: true,
        content: `<p>${userEmail.split("@")[0]}</p><p>Real Estate Agent</p><p>${userEmail}</p><p>+1 (555) 123-4567</p>`,
      },
      sending: {
        defaultSenderName: userEmail.split("@")[0],
        replyToAddress: userEmail,
        ccBehavior: "none",
        sendBehavior: "immediate",
        attachmentLimit: "25",
      },
      receiving: {
        syncEnabled: true,
        syncFrequency: "5",
        syncLabels: "all",
        syncPeriod: "30",
        autoCategorize: true,
        autoLink: true,
        extractAttachments: true,
      },
      notifications: {
        enabled: true,
        sound: "chime",
        filters: {
          all: false,
          important: true,
          transactions: true,
          leads: true,
        },
        previewType: "subject-sender",
        browserNotifications: true,
        mobileNotifications: false,
      },
      security: {
        dataAccessLevel: "read_write",
        retentionPeriod: "30_days",
        privacyMode: "standard_extraction",
      },
    })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

// POST settings
export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const userEmail = cookies().get("gmail_user_email")?.value

    if (!userEmail) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get settings from request
    const settings = await request.json()

    // In a real implementation, you would save settings to a database
    // For now, just return success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}
