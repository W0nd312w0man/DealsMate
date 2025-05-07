import type { Metadata } from "next"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { AIDocumentUpload } from "@/components/documents/ai-document-upload"
import { PageNavigation } from "@/components/page-navigation"

export const metadata: Metadata = {
  title: "AI Document Upload | DealMate",
  description: "Upload and process documents with AI",
}

export default function AIDocumentUploadPage() {
  return (
    <div className="container space-y-6 py-8">
      <BreadcrumbNav />
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-purple-700 font-poppins">AI Document Upload</h1>
        <p className="text-muted-foreground">Upload and process documents with AI-powered data extraction</p>
      </div>
      <AIDocumentUpload />
      <PageNavigation
        prevPage={{ url: "/documents", label: "Documents" }}
        nextPage={{ url: "/transactions", label: "Transactions" }}
      />
    </div>
  )
}
