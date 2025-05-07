"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone, Copy, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

interface TransactionPartiesProps {
  transactionId: string
}

// Mock data - in a real app, this would come from an API
const parties = {
  clients: [
    {
      id: 1,
      name: "John Smith",
      role: "Buyer",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
      avatar: "/placeholder-user.jpg",
      initials: "JS",
    },
    {
      id: 2,
      name: "Sarah Smith",
      role: "Buyer",
      email: "sarah.smith@example.com",
      phone: "(555) 123-4568",
      avatar: "/placeholder-user.jpg",
      initials: "SS",
    },
  ],
  agents: [
    {
      id: 3,
      name: "Michael Johnson",
      role: "Listing Agent",
      email: "michael.johnson@example.com",
      phone: "(555) 987-6543",
      company: "ABC Realty",
      avatar: "/placeholder-user.jpg",
      initials: "MJ",
    },
  ],
  service: [
    {
      id: 4,
      name: "First American Title",
      role: "Title Company",
      contactName: "Lisa Brown",
      email: "lisa.brown@firstamerican.com",
      phone: "(555) 456-7890",
      avatar: "/placeholder.svg",
      initials: "FA",
    },
    {
      id: 5,
      name: "Reliable Escrow",
      role: "Escrow Company",
      contactName: "Robert Wilson",
      email: "robert.wilson@reliableescrow.com",
      phone: "(555) 567-8901",
      avatar: "/placeholder.svg",
      initials: "RE",
    },
    {
      id: 6,
      name: "Hometown Mortgage",
      role: "Lender",
      contactName: "Jennifer Davis",
      email: "jennifer.davis@hometownmortgage.com",
      phone: "(555) 678-9012",
      avatar: "/placeholder.svg",
      initials: "HM",
    },
  ],
  internal: [
    {
      id: 7,
      name: "Emily Clark",
      role: "Transaction Coordinator",
      email: "emily.clark@exp.com",
      phone: "(555) 234-5678",
      avatar: "/placeholder-user.jpg",
      initials: "EC",
    },
    {
      id: 8,
      name: "David Miller",
      role: "Broker",
      email: "david.miller@exp.com",
      phone: "(555) 345-6789",
      avatar: "/placeholder-user.jpg",
      initials: "DM",
    },
  ],
}

export function TransactionParties({ transactionId }: TransactionPartiesProps) {
  return (
    <Tabs defaultValue="clients">
      <TabsList className="mb-4">
        <TabsTrigger value="clients">Clients</TabsTrigger>
        <TabsTrigger value="agents">Agents</TabsTrigger>
        <TabsTrigger value="service">Service Providers</TabsTrigger>
        <TabsTrigger value="internal">Internal Team</TabsTrigger>
      </TabsList>
      <TabsContent value="clients">
        <div className="grid gap-4 md:grid-cols-2">
          {parties.clients.map((party) => (
            <PartyCard key={party.id} party={party} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="agents">
        <div className="grid gap-4 md:grid-cols-2">
          {parties.agents.map((party) => (
            <PartyCard key={party.id} party={party} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="service">
        <div className="grid gap-4 md:grid-cols-2">
          {parties.service.map((party) => (
            <PartyCard key={party.id} party={party} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="internal">
        <div className="grid gap-4 md:grid-cols-2">
          {parties.internal.map((party) => (
            <PartyCard key={party.id} party={party} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

interface PartyCardProps {
  party: {
    id: number
    name: string
    role: string
    email?: string
    phone?: string
    company?: string
    contactName?: string
    avatar: string
    initials: string
  }
}

// Update the PartyCard component to include navigation to contact details
function PartyCard({ party }: PartyCardProps) {
  const router = useRouter()

  const navigateToContact = (name: string) => {
    // In a real app, you would use the contact ID instead of name
    const contactId =
      name === "Emily Clark"
        ? "contact-4"
        : name === "David Miller"
          ? "contact-5"
          : name.includes("John")
            ? "contact-1"
            : name.includes("Sarah")
              ? "contact-2"
              : name.includes("Michael")
                ? "contact-3"
                : null

    if (contactId) {
      router.push(`/contacts/${contactId}`)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 cursor-pointer" onClick={() => navigateToContact(party.name)}>
            <AvatarImage src={party.avatar} alt={party.name} />
            <AvatarFallback>{party.initials}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <CardTitle
              className="text-lg cursor-pointer hover:text-purple-600 transition-colors"
              onClick={() => navigateToContact(party.name)}
            >
              {party.name}
            </CardTitle>
            <div className="text-sm text-muted-foreground">{party.role}</div>
            {party.company && <div className="text-sm">{party.company}</div>}
            {party.contactName && <div className="text-sm">Contact: {party.contactName}</div>}
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          {party.email && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{party.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy email</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => (window.location.href = `mailto:${party.email}`)}
                >
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Email</span>
                </Button>
              </div>
            </div>
          )}
          {party.phone && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{party.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy phone</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => (window.location.href = `tel:${party.phone}`)}
                >
                  <Phone className="h-4 w-4" />
                  <span className="sr-only">Call</span>
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full gap-1"
            onClick={() => router.push(`/communication?contact=${party.name}`)}
          >
            <MessageSquare className="h-4 w-4" />
            Send Message
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
