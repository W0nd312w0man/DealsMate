"use client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export type PartyRole = "Buyer" | "Seller"

interface ClientNameStepProps {
  onBack: () => void
  onClientSelected: (name: string, role: PartyRole) => void
}

export function ClientNameStep({ onBack, onClientSelected }: ClientNameStepProps) {
  const handleSelect = (role: PartyRole) => {
    // For now, we'll just pass a placeholder name and the selected role
    // The actual client name will be collected in the party entry step
    onClientSelected("New Client", role)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Client Type</h2>

      <RadioGroup
        defaultValue="buyer"
        onValueChange={(value) => handleSelect(value as PartyRole)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <RadioGroupItem value="Buyer" id="buyer" className="sr-only peer" />
          <Label
            htmlFor="buyer"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer"
          >
            <div className="mb-2 rounded-md bg-blue-500/20 p-2">
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
                className="text-blue-500"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <div className="font-semibold">Buyer</div>
            <div className="text-sm text-muted-foreground text-center mt-1">Client is purchasing property</div>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="Seller" id="seller" className="sr-only peer" />
          <Label
            htmlFor="seller"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-500 [&:has([data-state=checked])]:border-green-500 cursor-pointer"
          >
            <div className="mb-2 rounded-md bg-green-500/20 p-2">
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
                className="text-green-500"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div className="font-semibold">Seller</div>
            <div className="text-sm text-muted-foreground text-center mt-1">Client is selling property</div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
