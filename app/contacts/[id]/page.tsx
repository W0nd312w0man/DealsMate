"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PageNavigation } from "@/components/page-navigation"
import { ContactDetails } from "@/components/contacts/contact-details"
import { ContactTransactions } from "@/components/contacts/contact-transactions"
import { ContactCommunication } from "@/components/contacts/contact-communication"
import { ContactNotes } from "@/components/contacts/contact-notes"
import { ClientLifecycleView } from "@/components/contacts/client-lifecycle-view"
import { WorkspaceStagesView } from "@/components/contacts/workspace-stages-view"
import { ChevronLeft, Mail, Phone, MessageSquare } from "lucide-react"
import { useContactStore } from "@/hooks/use-contact-store"
import { TalosVoiceAssistant } from "@/components/talos/talos-voice-assistant"

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getContactById } = useContactStore()
  const [contact, setContact] = useState<any>(null)

  useEffect(() => {
    const contactData = getContactById(params.id)
    if (contactData) {
      setContact(contactData)
    } else {
      // If contact not found, redirect to contacts page
      router.push("/contacts")
    }
  }, [params.id, getContactById, router])

  if (!contact) {
    return <div className="container py-8">Loading contact information...</div>
  }

  return (
    <div className="container py-8 space-y-6">
      <BreadcrumbNav />
      <div className="flex justify-between items-center">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <a href="/contacts">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Contacts
            </a>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{contact.name}</h1>
          <p className="text-muted-foreground">
            {contact.type} • {contact.company}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => (window.location.href = `mailto:${contact.email}`)}
          >
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => (window.location.href = `tel:${contact.phone}`)}>
            <Phone className="h-4 w-4" />
            Call
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => router.push(`/communication?contact=${contact.id}`)}
          >
            <MessageSquare className="h-4 w-4" />
            Message
          </Button>
        </div>
      </div>

      {/* Client Lifecycle and Workspace Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientLifecycleView clientId={contact.id} initialStage="nurturing" />
        <WorkspaceStagesView clientId={contact.id} />
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <ContactDetails contact={contact} />
        </TabsContent>
        <TabsContent value="transactions">
          <ContactTransactions contactId={contact.id} />
        </TabsContent>
        <TabsContent value="communication">
          <ContactCommunication contactId={contact.id} />
        </TabsContent>
        <TabsContent value="notes">
          <ContactNotes contactId={contact.id} />
        </TabsContent>
      </Tabs>

      <PageNavigation
        prevPage={{ url: "/contacts", label: "Contacts" }}
        nextPage={{ url: "/communication", label: "Communication" }}
      />

      {/* TALOS AI Voice Assistant */}
      <TalosVoiceAssistant />
    </div>
  )
}
