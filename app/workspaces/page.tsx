import type { Metadata } from "next"
import WorkspacesPageClient from "./workspaces-page-client"

export const metadata: Metadata = {
  title: "Workspaces | DealMate",
  description: "Manage your workspaces",
}

export default function WorkspacesPage() {
  return <WorkspacesPageClient />
}
