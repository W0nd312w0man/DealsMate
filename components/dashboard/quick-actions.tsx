"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { NewWorkspaceButton } from "@/components/workspaces/new-workspace-button"

export function QuickActions() {
  const router = useRouter()
  const { toast } = useToast()
  const [showSupportDialog, setShowSupportDialog] = useState(false)
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the support request
    toast({
      title: "Support request submitted",
      description: "We'll get back to you as soon as possible.",
    })
    setShowSupportDialog(false)
    setSupportForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSupportForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="gap-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
          onClick={() => router.push("/transactions/new")}
        >
          <Plus className="h-4 w-4" />
          New Transaction
        </Button>
        <NewWorkspaceButton className="gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity" />
      </div>

      <Dialog open={showSupportDialog} onOpenChange={setShowSupportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogDescription>Fill out the form below to get help from our support team.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSupportSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={supportForm.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={supportForm.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" value={supportForm.subject} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={supportForm.message}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowSupportDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
