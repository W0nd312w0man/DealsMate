"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserNav } from "@/components/user-nav"
import Image from "next/image"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-2 text-gray-700">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[300px]">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <Image src="/icon-logo.png" alt="Dealsmate.io" width={32} height={32} className="rounded-sm mr-2" />
            <span className="font-bold">Dealsmate.io</span>
          </div>
        </div>
        <div className="p-4 border-b">
          <UserNav />
        </div>
      </SheetContent>
    </Sheet>
  )
}
