"use client"

import { useState, useEffect } from "react"
import { Check, Home, Building, Users, Briefcase, Star, Heart, Sun, Moon, Cloud, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const workspaceTypes = [
  { id: "property", icon: Home, label: "Property", prefix: "Property" },
  { id: "client", icon: Users, label: "Client", prefix: "Client" },
  { id: "project", icon: Briefcase, label: "Project", prefix: "Project" },
]

const workspaceAttributes = [
  { id: "luxury", icon: Star, label: "Luxury", color: "bg-yellow-500", textColor: "text-yellow-500" },
  { id: "family", icon: Heart, label: "Family", color: "bg-red-500", textColor: "text-red-500" },
  { id: "commercial", icon: Building, label: "Commercial", color: "bg-blue-500", textColor: "text-blue-500" },
  { id: "vacation", icon: Sun, label: "Vacation", color: "bg-orange-500", textColor: "text-orange-500" },
  { id: "investment", icon: Zap, label: "Investment", color: "bg-purple-500", textColor: "text-purple-500" },
  { id: "rental", icon: Moon, label: "Rental", color: "bg-indigo-500", textColor: "text-indigo-500" },
  { id: "new", icon: Cloud, label: "New", color: "bg-green-500", textColor: "text-green-500" },
]

const locationOptions = [
  { id: "urban", label: "Urban", emoji: "🏙️" },
  { id: "suburban", label: "Suburban", emoji: "🏘️" },
  { id: "rural", label: "Rural", emoji: "🏡" },
  { id: "coastal", label: "Coastal", emoji: "🌊" },
  { id: "mountain", label: "Mountain", emoji: "⛰️" },
]

interface VisualWorkspaceNamingProps {
  onNameGenerated: (name: string) => void
  initialName?: string
}

export function VisualWorkspaceNaming({ onNameGenerated, initialName }: VisualWorkspaceNamingProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [generatedName, setGeneratedName] = useState<string>(initialName || "")

  // Generate a name based on selections
  useEffect(() => {
    if (selectedType || selectedAttributes.length > 0 || selectedLocation) {
      let name = ""

      // Add attribute
      if (selectedAttributes.length > 0) {
        const attribute = workspaceAttributes.find((a) => a.id === selectedAttributes[0])
        if (attribute) {
          name += attribute.label + " "
        }
      }

      // Add type
      if (selectedType) {
        const type = workspaceTypes.find((t) => t.id === selectedType)
        if (type) {
          name += type.prefix + " "
        }
      }

      // Add location
      if (selectedLocation) {
        const location = locationOptions.find((l) => l.id === selectedLocation)
        if (location) {
          name += location.emoji + " " + location.label
        }
      }

      // If no selections, use a default name
      if (!name) {
        name = "New Workspace"
      }

      setGeneratedName(name.trim())
      onNameGenerated(name.trim())
    }
  }, [selectedType, selectedAttributes, selectedLocation, onNameGenerated])

  const toggleAttribute = (attributeId: string) => {
    setSelectedAttributes((prev) => {
      if (prev.includes(attributeId)) {
        return prev.filter((id) => id !== attributeId)
      } else {
        // Only allow one attribute for simplicity
        return [attributeId]
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Name Your Workspace Visually</h3>
        <p className="text-sm text-muted-foreground">Select options below to generate a workspace name</p>
      </div>

      {/* Generated Name Preview */}
      <div className="bg-muted p-4 rounded-md flex items-center justify-center">
        <h2 className="text-2xl font-bold">{generatedName || "New Workspace"}</h2>
      </div>

      {/* Workspace Type Selection */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Select Workspace Type</h4>
        <div className="grid grid-cols-3 gap-2">
          {workspaceTypes.map((type) => {
            const Icon = type.icon
            const isSelected = selectedType === type.id

            return (
              <Button
                key={type.id}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "h-20 flex flex-col items-center justify-center gap-1",
                  isSelected && "bg-primary text-primary-foreground",
                )}
                onClick={() => setSelectedType(isSelected ? null : type.id)}
              >
                <Icon className={cn("h-6 w-6", isSelected ? "text-primary-foreground" : "text-primary")} />
                <span className="text-xs">{type.label}</span>
                {isSelected && <Check className="h-4 w-4 absolute top-2 right-2" />}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Workspace Attributes */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Select Attributes</h4>
        <div className="grid grid-cols-4 gap-2">
          {workspaceAttributes.map((attribute) => {
            const Icon = attribute.icon
            const isSelected = selectedAttributes.includes(attribute.id)

            return (
              <Card
                key={attribute.id}
                className={cn(
                  "cursor-pointer border-2 transition-all",
                  isSelected
                    ? `border-${attribute.id === "luxury" ? "yellow" : attribute.color.split("-")[1]}-500`
                    : "border-transparent",
                )}
                onClick={() => toggleAttribute(attribute.id)}
              >
                <CardContent className="p-3 flex flex-col items-center justify-center gap-1">
                  <div className={cn("rounded-full p-2", attribute.color)}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs">{attribute.label}</span>
                  {isSelected && <Check className={cn("h-4 w-4 absolute top-2 right-2", attribute.textColor)} />}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Location Selection */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Select Location</h4>
        <div className="flex flex-wrap gap-2">
          {locationOptions.map((location) => {
            const isSelected = selectedLocation === location.id

            return (
              <Badge
                key={location.id}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "text-base py-2 px-3 cursor-pointer",
                  isSelected ? "bg-primary text-primary-foreground" : "",
                )}
                onClick={() => setSelectedLocation(isSelected ? null : location.id)}
              >
                {location.emoji} {location.label}
              </Badge>
            )
          })}
        </div>
      </div>
    </div>
  )
}
