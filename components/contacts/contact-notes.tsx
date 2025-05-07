"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface ContactNotesProps {
  contactId: string
}

export function ContactNotes({ contactId }: ContactNotesProps) {
  const [newNote, setNewNote] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)

  // Mock data - in a real app, this would come from an API
  const notes = [
    {
      id: 1,
      content: "Client is looking for a 3-bedroom house in the north side of town. Budget is around $750,000.",
      createdBy: "You",
      createdAt: new Date(2025, 3, 10),
      avatar: "/placeholder-user.jpg",
      initials: "ME",
    },
    {
      id: 2,
      content: "Followed up about the property on Oak Avenue. Client is interested in scheduling a viewing.",
      createdBy: "You",
      createdAt: new Date(2025, 3, 8),
      avatar: "/placeholder-user.jpg",
      initials: "ME",
    },
    {
      id: 3,
      content:
        "Client mentioned they might need to sell their current home before purchasing a new one. Should connect them with our listing specialist.",
      createdBy: "Emily Clark",
      createdAt: new Date(2025, 3, 5),
      avatar: "/placeholder-user.jpg",
      initials: "EC",
    },
  ]

  const handleAddNote = () => {
    // In a real app, this would call an API to add the note
    console.log("Adding note:", newNote)
    setNewNote("")
    setIsAddingNote(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Notes</h3>
        <Button size="sm" className="gap-1" onClick={() => setIsAddingNote(true)}>
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>

      {isAddingNote && (
        <Card>
          <CardContent className="p-6">
            <Textarea
              placeholder="Enter your note here..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="mb-4"
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                Save Note
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {notes.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No notes found for this contact.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={note.avatar} alt={note.createdBy} />
                      <AvatarFallback className="bg-purple-100 text-purple-700">{note.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{note.createdBy}</div>
                      <div className="text-xs text-muted-foreground">{format(note.createdAt, "MMMM d, yyyy")}</div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                <div className="mt-3 text-sm">{note.content}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
