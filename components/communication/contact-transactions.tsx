"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, Mail, DollarSign, FileText } from "lucide-react"

export function ContactTransactions() {
  const [contactReason, setContactReason] = useState("splits")

  // Mock transaction team data - in a real app, this would come from an API
  const transactionTeam = [
    {
      id: 1,
      name: "Emily Clark",
      title: "Transaction Coordinator",
      email: "emily.clark@example.com",
      phone: "(555) 234-5678",
      avatar: "/placeholder-user.jpg",
      initials: "EC",
      region: "West Region",
    },
    {
      id: 2,
      name: "Robert Wilson",
      title: "Transaction Settlement Specialist",
      email: "robert.wilson@example.com",
      phone: "(555) 345-6789",
      avatar: "/placeholder-user.jpg",
      initials: "RW",
      region: "West Region",
    },
  ]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="splits">
        <TabsList className="mb-4">
          <TabsTrigger value="splits">Splits & Disbursements</TabsTrigger>
          <TabsTrigger value="tsa">Transaction Settlement</TabsTrigger>
        </TabsList>

        <TabsContent value="splits">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 shadow-soft card-hover overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-poppins text-purple-700">
                  Splits & Disbursement Adjustments
                </CardTitle>
                <CardDescription>Request changes to commission splits or disbursement authorizations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="transaction" className="text-purple-700">
                      Transaction
                    </Label>
                    <Select>
                      <SelectTrigger className="border-purple-200 focus:ring-purple-600">
                        <SelectValue placeholder="Select transaction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tx-1234">123 Main St (TX-1234)</SelectItem>
                        <SelectItem value="tx-1235">456 Oak Ave (TX-1235)</SelectItem>
                        <SelectItem value="tx-1236">789 Pine Rd (TX-1236)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-purple-700">Adjustment Type</Label>
                    <RadioGroup
                      value={contactReason}
                      onValueChange={setContactReason}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="splits" id="splits" className="text-purple-600" />
                        <Label htmlFor="splits" className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-purple-600" />
                          Commission Split Adjustment
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="da" id="da" className="text-purple-600" />
                        <Label htmlFor="da" className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          Disbursement Authorization (DA) Change
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="current" className="text-purple-700">
                      Current Amount/Split
                    </Label>
                    <Input
                      id="current"
                      placeholder="e.g., $10,000 or 80/20 split"
                      className="border-purple-200 focus:ring-purple-600"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="new" className="text-purple-700">
                      New Amount/Split
                    </Label>
                    <Input
                      id="new"
                      placeholder="e.g., $12,500 or 70/30 split"
                      className="border-purple-200 focus:ring-purple-600"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="reason" className="text-purple-700">
                      Reason for Change
                    </Label>
                    <Textarea
                      id="reason"
                      placeholder="Explain why this adjustment is needed"
                      rows={3}
                      className="border-purple-200 focus:ring-purple-600"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="documents" className="text-purple-700">
                      Supporting Documents (Optional)
                    </Label>
                    <Input id="documents" type="file" className="border-purple-200 focus:ring-purple-600" />
                    <p className="text-xs text-muted-foreground">
                      Upload any documents that support this adjustment request
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity">
                      Submit Request
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft card-hover overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-400"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-poppins text-purple-700">Transaction Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {transactionTeam.map((member) => (
                    <div key={member.id} className="flex flex-col items-center text-center">
                      <Avatar className="h-16 w-16 border-2 border-purple-200">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-purple-400 text-white">{member.initials}</AvatarFallback>
                      </Avatar>
                      <h3 className="mt-2 text-sm font-medium text-purple-700">{member.name}</h3>
                      <p className="text-xs text-muted-foreground">{member.title}</p>
                      <p className="text-xs text-muted-foreground">{member.region}</p>

                      <div className="mt-2 grid w-full grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 border-purple-200 text-blue-500 hover:bg-purple-50 hover:text-blue-500"
                        >
                          <Mail className="h-3 w-3" />
                          Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 border-purple-200 text-pink-500 hover:bg-purple-50 hover:text-pink-500"
                        >
                          <Phone className="h-3 w-3" />
                          Call
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tsa">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 shadow-soft card-hover overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-poppins text-purple-700">
                  Transaction Settlement Specialist (TSA) Support
                </CardTitle>
                <CardDescription>Get help with transaction settlement issues or escalations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="transaction" className="text-purple-700">
                      Transaction
                    </Label>
                    <Select>
                      <SelectTrigger className="border-purple-200 focus:ring-purple-600">
                        <SelectValue placeholder="Select transaction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tx-1234">123 Main St (TX-1234)</SelectItem>
                        <SelectItem value="tx-1235">456 Oak Ave (TX-1235)</SelectItem>
                        <SelectItem value="tx-1236">789 Pine Rd (TX-1236)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="issue-type" className="text-purple-700">
                      Issue Type
                    </Label>
                    <Select>
                      <SelectTrigger id="issue-type" className="border-purple-200 focus:ring-purple-600">
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="commission">Commission Payment</SelectItem>
                        <SelectItem value="closing">Closing Coordination</SelectItem>
                        <SelectItem value="documents">Missing Documents</SelectItem>
                        <SelectItem value="escalation">Escalation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="subject" className="text-purple-700">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      className="border-purple-200 focus:ring-purple-600"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description" className="text-purple-700">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Provide details about your issue or request"
                      rows={5}
                      className="border-purple-200 focus:ring-purple-600"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="documents" className="text-purple-700">
                      Supporting Documents (Optional)
                    </Label>
                    <Input id="documents" type="file" multiple className="border-purple-200 focus:ring-purple-600" />
                    <p className="text-xs text-muted-foreground">Upload any relevant documents (max 5 files)</p>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity">
                      Submit Request
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft card-hover overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-400"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-poppins text-purple-700">Your TSA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 border-4 border-purple-100">
                    <AvatarImage src={transactionTeam[1].avatar} alt={transactionTeam[1].name} />
                    <AvatarFallback className="bg-purple-400 text-white">{transactionTeam[1].initials}</AvatarFallback>
                  </Avatar>
                  <h3 className="mt-4 text-lg font-medium text-purple-700 font-poppins">{transactionTeam[1].name}</h3>
                  <p className="text-sm text-muted-foreground">{transactionTeam[1].title}</p>
                  <p className="text-sm text-muted-foreground">{transactionTeam[1].region}</p>

                  <div className="mt-6 w-full space-y-2">
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-purple-200 text-blue-500 hover:bg-purple-50 hover:text-blue-500"
                    >
                      <Mail className="h-4 w-4" />
                      {transactionTeam[1].email}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-purple-200 text-pink-500 hover:bg-purple-50 hover:text-pink-500"
                    >
                      <Phone className="h-4 w-4" />
                      {transactionTeam[1].phone}
                    </Button>
                  </div>

                  <div className="mt-4 rounded-lg border border-purple-200 p-3 text-sm bg-purple-50">
                    <p className="font-medium text-purple-700">Office Hours</p>
                    <p className="text-muted-foreground">Monday - Friday</p>
                    <p className="text-muted-foreground">9:00 AM - 5:00 PM PT</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
