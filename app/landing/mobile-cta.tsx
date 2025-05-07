"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function MobileCTA() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 md:hidden z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90">
            <Menu className="h-6 w-6 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-xl bg-purple-950 border-purple-800 text-white">
          <div className="py-6 px-4">
            <h3 className="text-xl font-bold text-white mb-4">Get Started with DealMate</h3>
            <p className="text-purple-300 mb-4">
              Enter your email to start your free 14-day trial. No credit card required.
            </p>
            <form className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-purple-900/50 border-purple-700/50 text-white placeholder:text-purple-300"
                required
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white"
              >
                Get Started Free
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
