"use client"

import { Suspense } from "react"
import { GmailIntegrationSettings } from "./gmail-integration-settings"

export function GmailIntegrationClient() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading integration settings...</div>}>
      <GmailIntegrationSettings />
    </Suspense>
  )
}
