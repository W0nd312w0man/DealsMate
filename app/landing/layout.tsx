import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "DealMate - Simplify Your Real Estate Transactions",
  description: "Next-generation real estate Transaction Management System",
}

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="min-h-screen w-full">{children}</div>
}
