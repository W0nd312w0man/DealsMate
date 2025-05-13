import type React from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import { AuthProvider } from "@/hooks/use-auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <>
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-between py-4">
            <MainNav />
            <div className="hidden md:block">
              <UserNav />
            </div>
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
        <footer className="border-t bg-white/80 backdrop-blur-md py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} DealsMate. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">DealsMate - Next-generation Transaction Management</p>
          </div>
        </footer>
      </>
    </AuthProvider>
  )
}
