"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Palette, Home, User } from "lucide-react"

interface WorkspaceNamingStepProps {
  onSelect: (type: "property" | "client" | "visual") => void
}

export function WorkspaceNamingStep({ onSelect }: WorkspaceNamingStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">How would you like to name your workspace?</h2>
      <p className="text-sm text-muted-foreground">
        Choose how you want to identify this workspace. This will determine the next steps in the creation process.
      </p>

      <RadioGroup
        defaultValue="property"
        onValueChange={(value) => onSelect(value as "property" | "client" | "visual")}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
      >
        <div>
          <RadioGroupItem value="property" id="property" className="sr-only peer" />
          <Label
            htmlFor="property"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500 cursor-pointer"
          >
            <div className="mb-2 rounded-md bg-purple-500/20 p-2">
              <Home className="h-5 w-5 text-purple-500" />
            </div>
            <div className="font-semibold">Property Address</div>
            <div className="text-sm text-muted-foreground text-center mt-1">Name workspace by property address</div>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="client" id="client" className="sr-only peer" />
          <Label
            htmlFor="client"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-pink-500 [&:has([data-state=checked])]:border-pink-500 cursor-pointer"
          >
            <div className="mb-2 rounded-md bg-pink-500/20 p-2">
              <User className="h-5 w-5 text-pink-500" />
            </div>
            <div className="font-semibold">Client Name</div>
            <div className="text-sm text-muted-foreground text-center mt-1">Name workspace by client name</div>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="visual" id="visual" className="sr-only peer" />
          <Label
            htmlFor="visual"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-500 [&:has([data-state=checked])]:border-green-500 cursor-pointer"
          >
            <div className="mb-2 rounded-md bg-green-500/20 p-2">
              <Palette className="h-5 w-5 text-green-500" />
            </div>
            <div className="font-semibold">Visual Selection</div>
            <div className="text-sm text-muted-foreground text-center mt-1">Create a name visually without typing</div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
