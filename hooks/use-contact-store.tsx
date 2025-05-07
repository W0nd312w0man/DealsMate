"use client"

import { create } from "zustand"

interface Contact {
  id: string
  name: string
  type: "Client" | "Partner" | "Team Member" | "Other"
  company?: string
  email: string
  phone: string
  address?: string
  tags?: string[]
  notes?: string
  lastContact?: Date
  transactions?: string[]
  avatar?: string
  initials: string
}

interface ContactStore {
  contacts: Contact[]
  getContactById: (id: string) => Contact | undefined
  addContact: (contact: Contact) => void
  updateContact: (id: string, contact: Partial<Contact>) => void
  deleteContact: (id: string) => void
}

// Mock data for initial state
const mockContacts: Contact[] = [
  {
    id: "contact-1",
    name: "John Smith",
    type: "Client",
    company: "ABC Corporation",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, CA 90210",
    tags: ["Buyer", "Active"],
    lastContact: new Date(2025, 3, 10),
    transactions: ["TX-1234"],
    initials: "JS",
  },
  {
    id: "contact-2",
    name: "Sarah Johnson",
    type: "Client",
    email: "sarah.johnson@example.com",
    phone: "(555) 987-6543",
    address: "456 Oak Ave, Somewhere, CA 90211",
    tags: ["Seller", "Active"],
    lastContact: new Date(2025, 3, 12),
    transactions: ["TX-1235"],
    initials: "SJ",
  },
  {
    id: "contact-3",
    name: "Michael Brown",
    type: "Partner",
    company: "Brown & Associates",
    email: "michael.brown@example.com",
    phone: "(555) 456-7890",
    tags: ["Attorney"],
    lastContact: new Date(2025, 3, 5),
    initials: "MB",
  },
  {
    id: "contact-4",
    name: "Emily Clark",
    type: "Team Member",
    company: "eXp Realty",
    email: "emily.clark@exp.com",
    phone: "(555) 234-5678",
    tags: ["Transaction Coordinator"],
    initials: "EC",
  },
  {
    id: "contact-5",
    name: "David Miller",
    type: "Team Member",
    company: "eXp Realty",
    email: "david.miller@exp.com",
    phone: "(555) 345-6789",
    tags: ["Broker"],
    initials: "DM",
  },
]

export const useContactStore = create<ContactStore>((set, get) => ({
  contacts: mockContacts,
  getContactById: (id) => {
    return get().contacts.find((contact) => contact.id === id)
  },
  addContact: (contact) => {
    set((state) => ({ contacts: [...state.contacts, contact] }))
  },
  updateContact: (id, updatedContact) => {
    set((state) => ({
      contacts: state.contacts.map((contact) => (contact.id === id ? { ...contact, ...updatedContact } : contact)),
    }))
  },
  deleteContact: (id) => {
    set((state) => ({
      contacts: state.contacts.filter((contact) => contact.id !== id),
    }))
  },
}))
