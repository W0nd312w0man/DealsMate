"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, User } from "lucide-react"

interface WorkspaceCreationTypeSelectorProps {
  onSelect: (type: "property" | "client") => void
}

export function WorkspaceCreationTypeSelector({ onSelect }: WorkspaceCreationTypeSelectorProps) {
  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-poppins text-purple-700">Create New Workspace</CardTitle>
        <CardDescription>Select how you want to name your new workspace</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Card
          className="cursor-pointer border-2 hover:border-purple-500 transition-colors"
          onClick={() => onSelect("property")}
        >
          <CardHeader>
            <div className="flex justify-center">
              <div className="rounded-full bg-purple-100 p-3">
                <Home className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-center">Property Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              Create a workspace based on a property address. Use Google Maps to search for the address.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
              onClick={() => onSelect("property")}
            >
              Select Property Address
            </Button>
          </CardFooter>
        </Card>

        <Card
          className="cursor-pointer border-2 hover:border-purple-500 transition-colors"
          onClick={() => onSelect("client")}
        >
          <CardHeader>
            <div className="flex justify-center">
              <div className="rounded-full bg-purple-100 p-3">
                <User className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-center">Client Name</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              Create a workspace based on a client name. Add buyers and sellers to the workspace.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
              onClick={() => onSelect("client")}
            >
              Select Client Name
            </Button>
          </CardFooter>
        </Card>
      </CardContent>
    </Card>
  )
}
