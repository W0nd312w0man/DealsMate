"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { NewWorkspaceModal } from "./new-workspace-modal"
import { Plus } from "lucide-react"

export function NewWorkspaceButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Workspace
      </Button>
      <NewWorkspaceModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}
