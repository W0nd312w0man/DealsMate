import { NextResponse } from "next/server"
import { validateEnvVars } from "@/lib/env"

export async function GET() {
  // Only allow this endpoint in development or for authenticated admins in production
  if (process.env.NODE_ENV !== "development") {
    // In a real app, check authentication here
    // For demo purposes, we'll allow it
  }

  const results = validateEnvVars()

  return NextResponse.json({
    valid: results.valid,
    missing: results.missing,
    usingFallbacks: results.usingFallbacks,
  })
}
