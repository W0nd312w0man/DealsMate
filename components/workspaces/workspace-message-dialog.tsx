"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { useWorkspaceParties } from "@/hooks/use-workspace-parties"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Circle, MessageCircle, Send } from "lucide-react"

interface WorkspaceMessageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
}

export function WorkspaceMessageDialog({ open, onOpenChange, workspaceId }: WorkspaceMessageDialogProps) {
  const [activeTab, setActiveTab] = useState("chat")
  const [message, setMessage] = useState("")
  const [selectedParties, setSelectedParties] = useState<Record<string, boolean>>({})
  const workspaceParties = useWorkspaceParties()
  const { toast } = useToast()

  // Get all parties for this workspace
  const allParties = [
    ...workspaceParties.getBuyersByWorkspace(workspaceId),
    ...workspaceParties.getSellersByWorkspace(workspaceId),
  ]

  // Mock online status for demo
  const onlineStatus: Record<string, boolean> = {
    "party-1": true, // John Smith (Buyer)
    "party-2": false, // Jane Doe (Seller)
  }

  // Initialize selected parties
  useEffect(() => {
    if (open) {
      const initialSelected: Record<string, boolean> = {}
      allParties.forEach((party) => {
        initialSelected[party.id] = true
      })
      setSelectedParties(initialSelected)
      setMessage("")
    }
  }, [open, workspaceId])

  const handleToggleParty = (partyId: string) => {
    setSelectedParties((prev) => ({
      ...prev,
      [partyId]: !prev[partyId],
    }))
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Get selected parties
    const recipients = allParties.filter((party) => selectedParties[party.id])

    if (recipients.length === 0) {
      toast({
        title: "No recipients selected",
        description: "Please select at least one recipient for your message.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would send the message to the selected parties
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${recipients.length} recipient(s).`,
    })

    setMessage("")
    onOpenChange(false)
  }

  // Mock chat history for demo
  const chatHistory = [
    {
      id: "msg1",
      sender: "You",
      content: "Hi everyone, I've uploaded the latest inspection report to the documents section.",
      timestamp: "10:30 AM",
      isYou: true,
    },
    {
      id: "msg2",
      sender: "John Smith",
      content: "Thanks for the update. I'll take a look at it this afternoon.",
      timestamp: "10:32 AM",
      isYou: false,
      senderId: "party-1",
    },
    {
      id: "msg3",
      sender: "You",
      content: "Great! Let me know if you have any questions.",
      timestamp: "10:33 AM",
      isYou: true,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Workspace Communication</DialogTitle>
          <DialogDescription>Chat with or message parties associated with this workspace.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Internal Chat</TabsTrigger>
            <TabsTrigger value="message">Send Message</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <div className="border rounded-md h-[300px] overflow-y-auto p-4 space-y-4">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isYou ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] ${msg.isYou ? "bg-purple-100 text-purple-900" : "bg-gray-100"} rounded-lg p-3`}
                  >
                    {!msg.isYou && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{msg.sender}</span>
                        {onlineStatus[msg.senderId || ""] ? (
                          <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                        ) : null}
                      </div>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs text-muted-foreground mt-1 text-right">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[80px]"
              />
              <Button className="self-end" size="icon" disabled={!message.trim()} onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="border rounded-md p-3">
              <h4 className="text-sm font-medium mb-2">Online Parties</h4>
              <div className="space-y-2">
                {allParties.map((party) => (
                  <div key={party.id} className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{party.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{party.name}</span>
                    {onlineStatus[party.id] ? (
                      <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                    ) : (
                      <Circle className="h-2 w-2 fill-gray-300 text-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="message" className="space-y-4">
            <div className="border rounded-md p-3">
              <h4 className="text-sm font-medium mb-2">Select Recipients</h4>
              <div className="space-y-2">
                {allParties.map((party) => (
                  <div key={party.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`party-${party.id}`}
                      checked={selectedParties[party.id] || false}
                      onCheckedChange={() => handleToggleParty(party.id)}
                    />
                    <Label htmlFor={`party-${party.id}`} className="text-sm">
                      {party.name} ({party.role})
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Message subject" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message-content">Message</Label>
              <Textarea
                id="message-content"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || (activeTab === "message" && Object.values(selectedParties).every((v) => !v))}
          >
            {activeTab === "chat" ? (
              <>
                <MessageCircle className="mr-2 h-4 w-4" />
                Send Chat
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
