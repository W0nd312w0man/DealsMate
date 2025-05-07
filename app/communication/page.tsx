"use client"

import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContactBroker } from "@/components/communication/contact-broker"
import { ContactTransactions } from "@/components/communication/contact-transactions"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PageNavigation } from "@/components/page-navigation"

export default function CommunicationPage() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "broker"

  return (
    <div className="container space-y-6 py-8">
      <BreadcrumbNav />
      <div>
        <p className="text-muted-foreground">Contact your broker and transaction team</p>
      </div>

      <Tabs defaultValue={tab === "transactions" ? "transactions" : "broker"}>
        <TabsList className="mb-4">
          <TabsTrigger value="broker">Contact Broker</TabsTrigger>
          <TabsTrigger value="transactions">Contact Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="broker">
          <ContactBroker />
        </TabsContent>
        <TabsContent value="transactions">
          <ContactTransactions />
        </TabsContent>
      </Tabs>

      <PageNavigation
        prevPage={{ url: "/documents", label: "Documents" }}
        nextPage={{ url: "/dashboard", label: "Dashboard" }}
      />
    </div>
  )
}
