"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface WorkspaceNamingStepProps {
  onSelect: (type: "property" | "client") => void
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
        onValueChange={(value) => onSelect(value as "property" | "client")}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
      >
        <div>
          <RadioGroupItem value="property" id="property" className="sr-only peer" />
          <Label
            htmlFor="property"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500 cursor-pointer"
          >
            <div className="mb-2 rounded-md bg-purple-500/20 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-500"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-pink-500"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="font-semibold">Client Name</div>
            <div className="text-sm text-muted-foreground text-center mt-1">Name workspace by client name</div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
