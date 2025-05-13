"use client"

// Update the EmailPanelView to use the EmailViewBase component

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { EmailViewBase } from "./email-view-base"

interface EmailPanelViewProps {
  email: any
  isOpen: boolean
  onClose: () => void
  onStarToggle: (id: string) => void
}

export function EmailPanelView({ email, isOpen, onClose, onStarToggle }: EmailPanelViewProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] p-6 overflow-y-auto">
        <EmailViewBase
          email={email}
          onClose={onClose}
          onStarToggle={onStarToggle}
          renderContainer={(children) => children}
          variant="panel"
        />
      </SheetContent>
    </Sheet>
  )
}
