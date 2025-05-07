import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { LogoSvg } from "./logo-svg"

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-6 px-2">
          <div className="flex items-center justify-start p-2">
            <LogoSvg size={40} showText />
          </div>
          <nav className="flex flex-col gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-lg font-medium">
              Dashboard
            </Link>
            <Link href="/workspaces" className="flex items-center gap-2 text-lg font-medium">
              Workspaces
            </Link>
            <Link href="/transactions" className="flex items-center gap-2 text-lg font-medium">
              Transactions
            </Link>
            <Link href="/tasks" className="flex items-center gap-2 text-lg font-medium">
              Tasks
            </Link>
            <Link href="/calendar" className="flex items-center gap-2 text-lg font-medium">
              Calendar
            </Link>
            <Link href="/documents" className="flex items-center gap-2 text-lg font-medium">
              Documents
            </Link>
            <Link href="/contacts" className="flex items-center gap-2 text-lg font-medium">
              Contacts
            </Link>
            <Link href="/communication" className="flex items-center gap-2 text-lg font-medium">
              Communication
            </Link>
            <Link href="/compliance" className="flex items-center gap-2 text-lg font-medium">
              Compliance
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
