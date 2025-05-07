import type { Metadata } from "next"
import { DocumentUpload } from "@/components/documents/document-upload"
import { DocumentList } from "@/components/documents/document-list"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PageNavigation } from "@/components/page-navigation"

export const metadata: Metadata = {
  title: "Documents | DealMate",
  description: "Manage and upload transaction documents",
}

export default function DocumentsPage() {
  return (
    <div className="container space-y-6 py-8">
      <BreadcrumbNav />
      <div>
        <p className="text-muted-foreground">Upload and manage transaction documents</p>
      </div>
      <DocumentUpload />
      <DocumentList />
      <PageNavigation
        prevPage={{ url: "/transactions", label: "Transactions" }}
        nextPage={{ url: "/communication", label: "Communication" }}
      />
    </div>
  )
}
