"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, Mail, MessageSquare, Clock } from "lucide-react"

export function ContactBroker() {
  const [contactMethod, setContactMethod] = useState("message")
  const [urgency, setUrgency] = useState("normal")

  // Mock broker data - in a real app, this would come from an API
  const broker = {
    name: "David Miller",
    title: "Managing Broker",
    email: "david.miller@example.com",
    phone: "(555) 345-6789",
    avatar: "/placeholder-user.jpg",
    initials: "DM",
    availability: "Available",
    responseTime: "Typically responds within 2 hours",
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2 shadow-soft card-hover overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-poppins text-purple-700">Contact Your Broker</CardTitle>
          <CardDescription>Get assistance with compliance questions or transaction issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label className="text-purple-700">Contact Method</Label>
              <RadioGroup value={contactMethod} onValueChange={setContactMethod} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="message" id="message" className="text-purple-600" />
                  <Label htmlFor="message" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    In-app Message
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" className="text-purple-600" />
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-500" />
                    Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone" className="text-purple-600" />
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-pink-500" />
                    Phone Call (Trillo)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="transaction" className="text-purple-700">
                Related Transaction
              </Label>
              <Select>
                <SelectTrigger className="border-purple-200 focus:ring-purple-600">
                  <SelectValue placeholder="Select transaction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tx-1234">123 Main St (TX-1234)</SelectItem>
                  <SelectItem value="tx-1235">456 Oak Ave (TX-1235)</SelectItem>
                  <SelectItem value="tx-1236">789 Pine Rd (TX-1236)</SelectItem>
                  <SelectItem value="none">Not related to a transaction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject" className="text-purple-700">
                Subject
              </Label>
              <Input
                id="subject"
                placeholder="Brief description of your inquiry"
                className="border-purple-200 focus:ring-purple-600"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="message" className="text-purple-700">
                  Message
                </Label>
                <div className="flex items-center gap-2">
                  <Label htmlFor="urgency" className="text-sm text-purple-700">
                    Urgency:
                  </Label>
                  <Select value={urgency} onValueChange={setUrgency}>
                    <SelectTrigger className="h-8 w-[120px] border-purple-200 focus:ring-purple-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Textarea
                id="message"
                placeholder="Describe your question or issue in detail"
                rows={5}
                className="border-purple-200 focus:ring-purple-600"
              />
            </div>

            {contactMethod === "phone" && (
              <div className="rounded-lg border border-purple-200 p-4 bg-purple-50">
                <div className="font-medium text-purple-700">Phone Call Request</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Your broker will receive a notification to call you back. Make sure your contact information is up to
                  date.
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity">
                {contactMethod === "message"
                  ? "Send Message"
                  : contactMethod === "email"
                    ? "Send Email"
                    : "Request Call"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft card-hover overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-400"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-poppins text-purple-700">Your Broker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 blur-sm opacity-50"></div>
              <Avatar className="h-24 w-24 border-4 border-white relative">
                <AvatarImage src={broker.avatar} alt={broker.name} />
                <AvatarFallback className="bg-purple-400 text-white text-xl">{broker.initials}</AvatarFallback>
              </Avatar>
            </div>
            <h3 className="mt-4 text-lg font-medium text-purple-700 font-poppins">{broker.name}</h3>
            <p className="text-sm text-muted-foreground">{broker.title}</p>

            <div className="mt-6 w-full space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-purple-200 p-3 bg-purple-50">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${broker.availability === "Available" ? "bg-green-500" : "bg-amber-500"}`}
                  ></div>
                  <span className="text-sm">{broker.availability}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-purple-600" />
                <span>{broker.responseTime}</span>
              </div>

              <div className="mt-4 grid gap-2">
                <Button
                  variant="outline"
                  className="w-full gap-2 border-purple-200 text-blue-500 hover:bg-purple-50 hover:text-blue-500"
                >
                  <Mail className="h-4 w-4" />
                  {broker.email}
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 border-purple-200 text-pink-500 hover:bg-purple-50 hover:text-pink-500"
                >
                  <Phone className="h-4 w-4" />
                  {broker.phone}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
