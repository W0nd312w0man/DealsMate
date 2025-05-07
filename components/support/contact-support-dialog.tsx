"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, Send, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ContactSupportDialogProps {
  children?: React.ReactNode
}

export function ContactSupportDialog({ children }: ContactSupportDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Show toast notification
      toast({
        title: "Support Request Sent",
        description: "We'll get back to you as soon as possible.",
        duration: 5000,
      })

      // Reset form after 2 seconds and close dialog
      setTimeout(() => {
        setIsSuccess(false)
        setFormData({ subject: "", message: "" })
        setOpen(false)
      }, 2000)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            className="gap-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
          >
            <HelpCircle className="h-4 w-4" />
            Contact Support
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
          <DialogDescription>
            Send a message to our support team. We'll respond via email as soon as possible.
          </DialogDescription>
        </DialogHeader>
        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Brief description of your issue"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Please describe your issue in detail"
                  className="min-h-[120px]"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="text-xs text-muted-foreground">Your message will be sent to info@lynqre.com</div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="gap-1">
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Support Request Sent</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you for contacting us. We'll get back to you as soon as possible.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
