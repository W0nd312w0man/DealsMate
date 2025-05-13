"use client"

// Update the EmailInlineView to use the EmailViewBase component

import { EmailViewBase } from "./email-view-base"

interface EmailInlineViewProps {
  email: any
  onClose: () => void
  onStarToggle: (id: string) => void
}

export function EmailInlineView({ email, onClose, onStarToggle }: EmailInlineViewProps) {
  return (
    <div className="ml-12 mt-2 mb-4 bg-white p-4 rounded-md border border-purple-100 shadow-md">
      <EmailViewBase
        email={email}
        onClose={onClose}
        onStarToggle={onStarToggle}
        renderContainer={(children) => children}
        variant="inline"
      />
    </div>
  )
}
