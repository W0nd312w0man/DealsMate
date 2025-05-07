"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

type LifecycleStage = "nurturing" | "preparing" | "under-contract" | "closed" | "archived"

interface ClientLifecycleViewProps {
  clientId: string
  initialStage?: LifecycleStage
  className?: string
}

export function ClientLifecycleView({ clientId, initialStage = "nurturing", className }: ClientLifecycleViewProps) {
  const [currentStage, setCurrentStage] = useState<LifecycleStage>(initialStage)
  const [isEditing, setIsEditing] = useState(false)
  const [editStage, setEditStage] = useState<LifecycleStage>(initialStage)

  const stages: { id: LifecycleStage; label: string; color: string }[] = [
    { id: "nurturing", label: "Nurturing", color: "bg-blue-500" },
    { id: "preparing", label: "Preparing to List / Actively Searching", color: "bg-purple-500" },
    { id: "under-contract", label: "Under Contract", color: "bg-orange-500" },
    { id: "closed", label: "Closed", color: "bg-green-500" },
    { id: "archived", label: "Archived", color: "bg-gray-500" },
  ]

  const handleSaveStage = () => {
    // In a real app, this would call an API to update the client's stage
    setCurrentStage(editStage)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditStage(currentStage)
    setIsEditing(false)
  }

  const currentStageIndex = stages.findIndex((stage) => stage.id === currentStage)

  return (
    <Card className={cn("shadow-soft overflow-hidden", className)}>
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-poppins text-purple-700">Client Lifecycle</CardTitle>
            <CardDescription>Current stage in the client relationship</CardDescription>
          </div>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-pink-200 text-pink-700 hover:bg-pink-50 hover:text-pink-700"
                onClick={handleCancelEdit}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                onClick={handleSaveStage}
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select the current stage for this client:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
              {stages.map((stage) => (
                <Button
                  key={stage.id}
                  variant="outline"
                  className={cn(
                    "justify-start h-auto py-2 px-3 border-purple-100",
                    editStage === stage.id
                      ? "bg-purple-50 border-purple-300 text-purple-700"
                      : "hover:bg-purple-50 hover:text-purple-700",
                  )}
                  onClick={() => setEditStage(stage.id)}
                >
                  <div className={cn("w-3 h-3 rounded-full mr-2", stage.color)} />
                  {stage.label}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={cn("w-3 h-3 rounded-full mr-2", stages[currentStageIndex].color)} />
                <span className="font-medium">{stages[currentStageIndex].label}</span>
              </div>
              <Badge
                className={cn(
                  "px-2 py-1",
                  currentStage === "nurturing"
                    ? "bg-blue-100 text-blue-800"
                    : currentStage === "preparing"
                      ? "bg-purple-100 text-purple-800"
                      : currentStage === "under-contract"
                        ? "bg-orange-100 text-orange-800"
                        : currentStage === "closed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800",
                )}
              >
                {currentStageIndex + 1} of {stages.length}
              </Badge>
            </div>

            <div className="relative pt-2">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div
                  className={cn(
                    "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500",
                    stages[currentStageIndex].color,
                  )}
                  style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                {stages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className={cn(
                      "flex flex-col items-center",
                      index <= currentStageIndex ? "text-purple-700" : "text-gray-400",
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full mb-1",
                        index <= currentStageIndex ? stage.color : "bg-gray-200",
                      )}
                    />
                    <span className="text-xs whitespace-nowrap">
                      {stage.id === "preparing" ? "Preparing" : stage.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
