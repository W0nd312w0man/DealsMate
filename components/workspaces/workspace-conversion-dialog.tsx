"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Home, ShoppingCart, Building, Users, FileText } from "lucide-react"

interface WorkspaceConversionDialogProps {
  workspaceId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type TransactionType = "listing" | "purchase" | "lease" | "referral" | "other"

export function WorkspaceConversionDialog({ workspaceId, open, onOpenChange }: WorkspaceConversionDialogProps) {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<TransactionType | null>(null)
  const [isConverting, setIsConverting] = useState(false)

  const handleConvert = async () => {
    if (!selectedType || !workspaceId) return

    setIsConverting(true)

    // In a real app, this would call an API to convert the workspace to a transaction
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsConverting(false)
    onOpenChange(false)

    // Redirect to the new transaction
    router.push(`/transactions/new?type=${selectedType}&from=${workspaceId}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-purple-800/20 shadow-soft overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500 absolute top-0 left-0"></div>
        <DialogHeader>
          <DialogTitle className="text-xl font-poppins text-purple-700">Convert to Transaction</DialogTitle>
          <DialogDescription>
            Converting this workspace to a transaction will allow you to track stages, status, and more detailed
            information.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="transaction-type" className="text-base">
                Select Transaction Type
              </Label>
              <RadioGroup
                value={selectedType || ""}
                onValueChange={(value) => setSelectedType(value as TransactionType)}
                className="mt-3 space-y-3"
              >
                <div className="flex items-center space-x-2 rounded-md border border-purple-800/20 p-3 hover:bg-purple-50/50 transition-colors">
                  <RadioGroupItem value="listing" id="listing" />
                  <div className="rounded-full bg-blue-100 p-1.5 mr-2">
                    <Home className="h-4 w-4 text-blue-600" />
                  </div>
                  <Label htmlFor="listing" className="flex-1 cursor-pointer font-normal">
                    <div className="font-medium">Listing</div>
                    <div className="text-sm text-muted-foreground">Property listed for sale</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border border-purple-800/20 p-3 hover:bg-purple-50/50 transition-colors">
                  <RadioGroupItem value="purchase" id="purchase" />
                  <div className="rounded-full bg-green-100 p-1.5 mr-2">
                    <ShoppingCart className="h-4 w-4 text-green-600" />
                  </div>
                  <Label htmlFor="purchase" className="flex-1 cursor-pointer font-normal">
                    <div className="font-medium">Purchase</div>
                    <div className="text-sm text-muted-foreground">Property being purchased</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border border-purple-800/20 p-3 hover:bg-purple-50/50 transition-colors">
                  <RadioGroupItem value="lease" id="lease" />
                  <div className="rounded-full bg-amber-100 p-1.5 mr-2">
                    <Building className="h-4 w-4 text-amber-600" />
                  </div>
                  <Label htmlFor="lease" className="flex-1 cursor-pointer font-normal">
                    <div className="font-medium">Lease</div>
                    <div className="text-sm text-muted-foreground">Property being leased</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border border-purple-800/20 p-3 hover:bg-purple-50/50 transition-colors">
                  <RadioGroupItem value="referral" id="referral" />
                  <div className="rounded-full bg-purple-100 p-1.5 mr-2">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <Label htmlFor="referral" className="flex-1 cursor-pointer font-normal">
                    <div className="font-medium">Referral</div>
                    <div className="text-sm text-muted-foreground">Client referral to another agent</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border border-purple-800/20 p-3 hover:bg-purple-50/50 transition-colors">
                  <RadioGroupItem value="other" id="other" />
                  <div className="rounded-full bg-gray-100 p-1.5 mr-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                  </div>
                  <Label htmlFor="other" className="flex-1 cursor-pointer font-normal">
                    <div className="font-medium">Other</div>
                    <div className="text-sm text-muted-foreground">Other transaction type</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-purple-800/30">
            Cancel
          </Button>
          <Button
            onClick={handleConvert}
            disabled={!selectedType || isConverting}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
          >
            {isConverting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isConverting ? "Converting..." : "Convert to Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
