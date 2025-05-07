"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, MapPin, ArrowLeft, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PropertyAddressSearchProps {
  onBack: () => void
  onAddressSelected: (address: string) => void
}

interface AddressSuggestion {
  id: string
  description: string
  placeId: string
}

export function PropertyAddressSearch({ onBack, onAddressSelected }: PropertyAddressSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [manualEntry, setManualEntry] = useState(false)
  const [manualAddress, setManualAddress] = useState("")
  const [error, setError] = useState("")

  // Mock function to simulate Google Maps API
  const searchAddresses = async (query: string) => {
    setIsSearching(true)
    setError("")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock suggestions
    if (query.length > 3) {
      setSuggestions([
        { id: "1", description: "123 Main St, Anytown, CA 90210", placeId: "place1" },
        { id: "2", description: "456 Oak Ave, Somewhere, CA 90211", placeId: "place2" },
        { id: "3", description: "789 Pine Rd, Nowhere, CA 90212", placeId: "place3" },
      ])
    } else {
      setSuggestions([])
      if (query) {
        setError("Please enter at least 4 characters to search")
      }
    }

    setIsSearching(false)
  }

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery && !manualEntry) {
        searchAddresses(searchQuery)
      }
    }, 500)

    return () => clearTimeout(delaySearch)
  }, [searchQuery, manualEntry])

  const handleManualSubmit = () => {
    if (manualAddress.length < 10) {
      setError("Please enter a complete address")
      return
    }
    onAddressSelected(manualAddress)
  }

  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl font-poppins text-purple-700">Property Address</CardTitle>
        </div>
        <CardDescription>Search for a property address or enter it manually</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!manualEntry ? (
          <>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for an address..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isSearching && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!isSearching && suggestions.length > 0 && (
              <div className="space-y-2">
                <Label>Suggested Addresses</Label>
                <div className="rounded-md border divide-y">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="flex items-center gap-2 p-3 cursor-pointer hover:bg-purple-50/10"
                      onClick={() => onAddressSelected(suggestion.description)}
                    >
                      <MapPin className="h-4 w-4 text-purple-500" />
                      <span>{suggestion.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button variant="outline" className="w-full" onClick={() => setManualEntry(true)}>
                Enter Address Manually
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="manual-address">Enter Complete Address</Label>
              <Input
                id="manual-address"
                placeholder="Enter full property address..."
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setManualEntry(false)
                  setError("")
                }}
              >
                Back to Search
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                onClick={handleManualSubmit}
              >
                Use This Address
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
