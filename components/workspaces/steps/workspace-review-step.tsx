"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, ArrowLeft, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Party } from "../workspace-creation-flow"

interface WorkspaceReviewStepProps {
  workspaceData: {
    namingType: "property" | "client" | ""
    propertyAddress: string
    clientName: string
    workspaceName: string
    stage: string
    notes: string
  }
  workspaceId: string
  parties: Party[]
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function WorkspaceReviewStep({
  workspaceData,
  workspaceId,
  parties,
  onBack,
  onSubmit,
  isSubmitting,
}: WorkspaceReviewStepProps) {
  const getPrimaryParty = (role: "Buyer" | "Seller") => {
    return parties.find((party) => party.role === role && party.isPrimary)
  }

  const primaryBuyer = getPrimaryParty("Buyer")
  const primarySeller = getPrimaryParty("Seller")

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <h2 className="text-xl font-semibold text-purple-400">Review Workspace</h2>
      <p className="text-sm text-muted-foreground">Review the workspace details before finalizing.</p>

      <Card className="p-4 border-purple-800/20 bg-purple-900/5">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-purple-400">Workspace Details</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Workspace ID:</div>
              <div>{workspaceId}</div>
              <div className="text-muted-foreground">Workspace Name:</div>
              <div className="font-medium">{workspaceData.workspaceName}</div>
              <div className="text-muted-foreground">Naming Type:</div>
              <div className="capitalize">{workspaceData.namingType}</div>
              {workspaceData.namingType === "property" && (
                <>
                  <div className="text-muted-foreground">Property Address:</div>
                  <div>{workspaceData.propertyAddress}</div>
                </>
              )}
              <div className="text-muted-foreground">Stage:</div>
              <div className="capitalize">{workspaceData.stage}</div>
              {workspaceData.notes && (
                <>
                  <div className="text-muted-foreground">Notes:</div>
                  <div>{workspaceData.notes}</div>
                </>
              )}
            </div>
          </div>

          {parties.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-purple-400 mt-4">Parties</h3>
              <div className="mt-2 space-y-3">
                {primaryBuyer && (
                  <div className="border border-purple-800/20 rounded-md p-3 bg-purple-900/5">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Primary Buyer</div>
                      <div className="text-xs px-2 py-1 rounded-full bg-blue-900/20 text-blue-400">Buyer</div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1 text-sm">
                      <div className="text-muted-foreground">Name:</div>
                      <div>{primaryBuyer.type === "Individual" ? `${primaryBuyer.name}` : primaryBuyer.entityName}</div>
                      <div className="text-muted-foreground">Email:</div>
                      <div>{primaryBuyer.email}</div>
                      <div className="text-muted-foreground">Phone:</div>
                      <div>{primaryBuyer.phone}</div>
                    </div>
                  </div>
                )}

                {primarySeller && (
                  <div className="border border-purple-800/20 rounded-md p-3 bg-purple-900/5">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Primary Seller</div>
                      <div className="text-xs px-2 py-1 rounded-full bg-red-900/20 text-red-400">Seller</div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1 text-sm">
                      <div className="text-muted-foreground">Name:</div>
                      <div>
                        {primarySeller.type === "Individual" ? `${primarySeller.name}` : primarySeller.entityName}
                      </div>
                      <div className="text-muted-foreground">Email:</div>
                      <div>{primarySeller.email}</div>
                      <div className="text-muted-foreground">Phone:</div>
                      <div>{primarySeller.phone}</div>
                    </div>
                  </div>
                )}

                {parties.filter((p) => !p.isPrimary).length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    +{parties.filter((p) => !p.isPrimary).length} additional parties
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      <Alert className="bg-purple-900/5 border-purple-800/30">
        <Check className="h-4 w-4 text-purple-400" />
        <AlertDescription>
          Your workspace has been created and all parties have been added. Click "Finalize Workspace" to complete the
          setup.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between mt-6 pt-4 border-t border-purple-900/10">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="border-purple-800/30 hover:bg-purple-900/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finalizing...
            </>
          ) : (
            "Finalize Workspace"
          )}
        </Button>
      </div>
    </div>
  )
}
