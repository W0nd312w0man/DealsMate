"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type EntityType = "Individual" | "Trust" | "Corporation" | "LLC" | "Partnership" | "Estate" | "Power of Attorney"

export interface ContactPerson {
  id: string
  name: string
  email: string
  phone: string
  address: string
  type: EntityType
  isPrimary?: boolean
  role: "Buyer" | "Seller"
  entityName?: string
  authorizedSignorName?: string
  authorizedSignorTitle?: string
}

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  type: string
  tags: string[]
  initials: string
  entityType?: EntityType
  entityName?: string
  authorizedSignorName?: string
  authorizedSignorTitle?: string
}

interface ContactManagerStore {
  contacts: Contact[]
  addContact: (contact: Omit<Contact, "id" | "initials">) => string
  updateContact: (id: string, contact: Partial<Contact>) => void
  removeContact: (id: string) => void
  getContactById: (id: string) => Contact | undefined
  findDuplicateContact: (name: string, email: string) => Contact | undefined
}

export const useContactManager = create<ContactManagerStore>()(
  persist(
    (set, get) => ({
      contacts: [],

      addContact: (contactData) => {
        // Check for duplicates based on name and email
        const existingContact = get().findDuplicateContact(contactData.name, contactData.email)

        if (existingContact) {
          return existingContact.id
        }

        // Generate a unique ID
        const id = `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Generate initials
        const initials = contactData.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)

        // Create a new contact
        const newContact: Contact = {
          id,
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          address: contactData.address,
          type: contactData.type,
          tags: contactData.tags || [],
          initials,
          entityType: contactData.entityType,
          entityName: contactData.entityName,
          authorizedSignorName: contactData.authorizedSignorName,
          authorizedSignorTitle: contactData.authorizedSignorTitle,
        }

        set((state) => ({
          contacts: [...state.contacts, newContact],
        }))

        return id
      },

      updateContact: (id, contactData) => {
        set((state) => ({
          contacts: state.contacts.map((contact) => (contact.id === id ? { ...contact, ...contactData } : contact)),
        }))
      },

      removeContact: (id) => {
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
        }))
      },

      getContactById: (id) => {
        return get().contacts.find((contact) => contact.id === id)
      },

      findDuplicateContact: (name, email) => {
        return get().contacts.find(
          (c) => c.name.toLowerCase() === name.toLowerCase() && c.email.toLowerCase() === email.toLowerCase(),
        )
      },
    }),
    {
      name: "dealsmate-contacts",
    },
  ),
)
