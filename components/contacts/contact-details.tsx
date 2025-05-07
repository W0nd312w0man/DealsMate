"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Calendar, Edit } from "lucide-react"
import { format } from "date-fns"

interface ContactDetailsProps {
  contact: any
}

export function ContactDetails({ contact }: ContactDetailsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 border-4 border-purple-100">
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback className="bg-purple-400 text-white text-xl">{contact.initials}</AvatarFallback>
            </Avatar>
            <h3 className="mt-4 text-xl font-medium">{contact.name}</h3>
            <p className="text-sm text-muted-foreground">{contact.company}</p>

            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {contact.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline" className="bg-purple-50">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-6 w-full space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-purple-200 text-blue-500 hover:bg-purple-50 hover:text-blue-500"
                onClick={() => (window.location.href = `mailto:${contact.email}`)}
              >
                <Mail className="h-4 w-4" />
                {contact.email}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-purple-200 text-pink-500 hover:bg-purple-50 hover:text-pink-500"
                onClick={() => (window.location.href = `tel:${contact.phone}`)}
              >
                <Phone className="h-4 w-4" />
                {contact.phone}
              </Button>
              {contact.address && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
                  onClick={() =>
                    window.open(`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`, "_blank")
                  }
                >
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{contact.address}</span>
                </Button>
              )}
            </div>

            <div className="mt-6">
              <Button className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Contact
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="mt-4 grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                    <div>{contact.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Type</div>
                    <div>{contact.type}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Email</div>
                    <div>{contact.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Phone</div>
                    <div>{contact.phone}</div>
                  </div>
                </div>

                {contact.company && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Company</div>
                    <div>{contact.company}</div>
                  </div>
                )}

                {contact.address && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Address</div>
                    <div>{contact.address}</div>
                  </div>
                )}

                {contact.lastContact && (
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-muted-foreground">Last Contact:</div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      {format(new Date(contact.lastContact), "MMMM d, yyyy")}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {contact.notes && (
              <div>
                <h3 className="text-lg font-medium">Notes</h3>
                <div className="mt-2 rounded-md border p-3">
                  <p className="text-sm">{contact.notes}</p>
                </div>
              </div>
            )}

            {contact.transactions && contact.transactions.length > 0 && (
              <div>
                <h3 className="text-lg font-medium">Related Transactions</h3>
                <div className="mt-2 space-y-2">
                  {contact.transactions.map((txId: string) => (
                    <div key={txId} className="rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{txId}</div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/transactions/${txId}`}>View</a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
