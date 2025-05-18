"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

interface Contact {
  id: string
  name: string
  type: string
  workspaceId: string
}

interface WorkspaceContactsProps {
  workspaceId: string
}

export function WorkspaceContacts({ workspaceId }: WorkspaceContactsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [contactName, setContactName] = useState("")
  const [contactType, setContactType] = useState("")
  const [contacts, setContacts] = useState<Contact[]>([])

  // Load contacts for this workspace from sessionStorage
  useEffect(() => {
    const loadContacts = () => {
      try {
        const storedContacts = sessionStorage.getItem("contacts")
        if (storedContacts) {
          const allContacts = JSON.parse(storedContacts) as Contact[]
          // Filter contacts to only show those for this workspace
          const workspaceContacts = allContacts.filter((contact) => contact.workspaceId === workspaceId)
          setContacts(workspaceContacts)
        }
      } catch (error) {
        console.error("Error loading contacts from sessionStorage:", error)
      }
    }

    loadContacts()

    // Add event listener for storage changes
    const handleStorageChange = () => {
      loadContacts()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [workspaceId])

  const saveContact = () => {
    if (!contactName.trim() || !contactType.trim()) return

    try {
      // Create new contact object
      const newContact: Contact = {
        id: Date.now().toString(),
        name: contactName.trim(),
        type: contactType.trim(),
        workspaceId: workspaceId,
      }

      // Get existing contacts or initialize empty array
      const storedContacts = sessionStorage.getItem("contacts")
      const allContacts: Contact[] = storedContacts ? JSON.parse(storedContacts) : []

      // Add new contact
      const updatedContacts = [...allContacts, newContact]

      // Save to sessionStorage
      sessionStorage.setItem("contacts", JSON.stringify(updatedContacts))

      // Update local state
      setContacts((prevContacts) => [...prevContacts, newContact])

      // Reset form
      setContactName("")
      setContactType("")
      setIsDialogOpen(false)

      // Trigger storage event for other components
      window.dispatchEvent(new Event("storage"))

      console.log("Contact saved:", newContact)
    } catch (error) {
      console.error("Error saving contact:", error)
    }
  }

  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-poppins text-purple-700">Contacts</CardTitle>
            <CardDescription>Manage contacts for this workspace</CardDescription>
          </div>
          <Button className="gap-1" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New Contact
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-medium">No Contacts</h3>
            <p className="mt-2 text-sm text-muted-foreground">There are no contacts for this workspace yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground">{contact.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>Enter the details for the new contact.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactName" className="text-right">
                Contact Name
              </Label>
              <Input
                id="contactName"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="col-span-3"
                placeholder="John Doe"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactType" className="text-right">
                Contact Type
              </Label>
              <Input
                id="contactType"
                value={contactType}
                onChange={(e) => setContactType(e.target.value)}
                className="col-span-3"
                placeholder="Buyer, Seller, Agent, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveContact}>Save Contact</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
