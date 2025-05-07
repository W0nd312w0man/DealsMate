import type { Metadata } from "next"
import { ContactsList } from "@/components/contacts/contacts-list"
import { ContactFilters } from "@/components/contacts/contact-filters"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PageNavigation } from "@/components/page-navigation"

export const metadata: Metadata = {
  title: "Contacts | DealMate",
  description: "Manage your client and partner contacts",
}

export default function ContactsPage() {
  return (
    <div className="container space-y-6 py-8">
      <BreadcrumbNav />
      <div>
        <p className="text-muted-foreground">Manage your clients, partners, and team contacts</p>
      </div>
      <ContactFilters />
      <ContactsList />
      <PageNavigation
        prevPage={{ url: "/calendar", label: "Calendar" }}
        nextPage={{ url: "/communication", label: "Communication" }}
      />
    </div>
  )
}
