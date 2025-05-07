import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { LogoSvg } from "./logo-svg"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <LogoSvg size={32} showText />
      <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
        Dashboard
      </Link>
      <Link
        href="/workspaces"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Workspaces
      </Link>
      <Link
        href="/transactions"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Transactions
      </Link>
      <Link href="/tasks" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Tasks
      </Link>
      <Link href="/calendar" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Calendar
      </Link>
      <Link
        href="/documents"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Documents
      </Link>
      <Link href="/contacts" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Contacts
      </Link>
      <Link
        href="/communication"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Communication
      </Link>
      <Link
        href="/compliance"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Compliance
      </Link>
    </nav>
  )
}
