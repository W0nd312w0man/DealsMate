"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, AlertCircle, Check, ArrowLeft, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock Google Maps Places API response for development
// In production, this would be replaced with actual API calls
const mockPlacesResults = [
  { place_id: "1", description: "123 Main St, San Francisco, CA 94105" },
  { place_id: "2", description: "456 Market St, San Francisco, CA 94105" },
  { place_id: "3", description: "789 Mission St, San Francisco, CA 94103" },
  { place_id: "4", description: "101 California St, San Francisco, CA 94111" },
  { place_id: "5", description: "1 Lombard St, San Francisco, CA 94111" },
]

interface PropertyAddressStepProps {
  onBack: () => void
  onAddressSelected: (address: string) => void
  isSubmitting?: boolean
}

export function PropertyAddressStep({ onBack, onAddressSelected, isSubmitting = false }: PropertyAddressStepProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [predictions, setPredictions] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState("")
  const [isCustomAddress, setIsCustomAddress] = useState(false)
  const [customAddress, setCustomAddress] = useState("")
  const [error, setError] = useState<string | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current && !isCustomAddress) {
      inputRef.current.focus()
    }
  }, [isCustomAddress])

  // Simulate Google Maps Places API with fast response time (under 200ms)
  useEffect(() => {
    if (searchQuery.length > 2 && !isCustomAddress) {
      setIsSearching(true)

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      // Set new timeout to simulate API call with fast response (under 200ms)
      searchTimeoutRef.current = setTimeout(() => {
        const filtered = mockPlacesResults.filter((place) =>
          place.description.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        setPredictions(filtered)
        setIsSearching(false)
      }, 150) // 150ms response time to ensure we're under the 200ms requirement
    } else {
      setPredictions([])
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery, isCustomAddress])

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address)
    setSearchQuery(address)
    setPredictions([])
    setError(null)
  }

  const handleSaveAddress = () => {
    if (isCustomAddress) {
      if (!customAddress.trim()) {
        setError("Please enter a custom address")
        return
      }
      onAddressSelected(customAddress)
    } else {
      if (!selectedAddress) {
        setError("Please select an address from the dropdown")
        return
      }
      onAddressSelected(selectedAddress)
    }
  }

  const toggleCustomAddress = () => {
    setIsCustomAddress(!isCustomAddress)
    if (!isCustomAddress) {
      // Switching to custom address
      setSearchQuery("")
      setPredictions([])
      setSelectedAddress("")
    } else {
      // Switching back to Google Maps search
      setCustomAddress("")
    }
    setError(null)

    // Focus the appropriate input after state update
    setTimeout(() => {
      if (isCustomAddress && inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <h2 className="text-xl font-semibold text-purple-400">Enter Property Address</h2>
      <p className="text-sm text-muted-foreground">
        Search for a property address using Google Maps or enter a custom address.
      </p>

      <div className="space-y-4">
        {!isCustomAddress ? (
          <div className="space-y-2">
            <Label htmlFor="address-search" className="text-sm font-medium">
              Search for an address
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="address-search"
                ref={inputRef}
                type="text"
                placeholder="Start typing an address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-purple-800/30 focus:border-purple-500 focus:ring-purple-500/20"
                aria-label="Search for an address"
                disabled={isSubmitting}
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="animate-spin h-4 w-4 border-2 border-purple-500 rounded-full border-t-transparent" />
                </div>
              )}
            </div>

            {predictions.length > 0 && (
              <Card className="mt-1 absolute z-10 w-full max-w-[calc(100%-2rem)] border-purple-800/20 shadow-lg shadow-purple-900/10">
                <CardContent className="p-0">
                  <ul className="py-1 max-h-60 overflow-auto">
                    {predictions.map((prediction) => (
                      <li
                        key={prediction.place_id}
                        className="px-4 py-2 hover:bg-purple-900/10 cursor-pointer flex items-center transition-colors"
                        onClick={() => handleAddressSelect(prediction.description)}
                      >
                        <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                        {prediction.description}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {selectedAddress && (
              <div className="flex items-center text-sm text-green-500 mt-2">
                <Check className="h-4 w-4 mr-1" />
                Address selected
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="custom-address" className="text-sm font-medium">
              Custom Address
            </Label>
            <Input
              id="custom-address"
              ref={inputRef}
              type="text"
              placeholder="Enter custom address"
              value={customAddress}
              onChange={(e) => {
                setCustomAddress(e.target.value)
                setError(null)
              }}
              className="border-purple-800/30 focus:border-purple-500 focus:ring-purple-500/20"
              aria-label="Enter custom address"
              disabled={isSubmitting}
            />
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={toggleCustomAddress}
          className="mt-2 border-purple-800/30 text-purple-400 hover:bg-purple-900/10 hover:text-purple-300"
          disabled={isSubmitting}
        >
          {isCustomAddress ? "Use Google Maps Search" : "Use Custom Address"}
        </Button>

        {error && (
          <Alert variant="destructive" className="mt-4 bg-red-900/10 border-red-800/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between mt-6 pt-4 border-t border-purple-900/10">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-purple-800/30 hover:bg-purple-900/10"
            disabled={isSubmitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleSaveAddress}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
            disabled={isSubmitting || (!selectedAddress && !isCustomAddress) || (isCustomAddress && !customAddress)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Property Address"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
