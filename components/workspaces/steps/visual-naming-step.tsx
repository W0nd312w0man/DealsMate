"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VisualWorkspaceNaming } from "../visual-workspace-naming"

interface VisualNamingStepProps {
  onBack: () => void
  onNameSelected: (name: string) => void
}

export function VisualNamingStep({ onBack, onNameSelected }: VisualNamingStepProps) {
  const [workspaceName, setWorkspaceName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!workspaceName) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    onNameSelected(workspaceName)
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Create Your Workspace Visually</h2>
        <p className="text-sm text-muted-foreground">
          Use the visual tools below to create a name for your workspace without typing.
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-6 border border-muted">
        <VisualWorkspaceNaming onNameGenerated={setWorkspaceName} />
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="border-purple-800/30 hover:bg-purple-900/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !workspaceName}
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
        >
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  )
}
