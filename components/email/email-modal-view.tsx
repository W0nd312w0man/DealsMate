"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { EmailViewBase } from "./email-view-base"

interface EmailModalViewProps {
  email: any
  isOpen: boolean
  onClose: () => void
  onStarToggle: (id: string) => void
}

export function EmailModalView({ email, isOpen, onClose, onStarToggle }: EmailModalViewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] p-6">
        <EmailViewBase
          email={email}
          onClose={onClose}
          onStarToggle={onStarToggle}
          renderContainer={(children) => children}
          variant="modal"
        />
      </DialogContent>
    </Dialog>
  )
}
