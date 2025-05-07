"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Plus, ArrowRight, Mail, X, Link } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AttachmentNotificationProps {
  analysisResult: any
  onDismiss: () => void
  onActionComplete: () => void
}

export function AttachmentNotification({ analysisResult, onDismiss, onActionComplete }: AttachmentNotificationProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("suggested")
  const { toast } = useToast()

  if (!analysisResult?.hasRelevantAttachments) {
    return null
  }

  // Ensure these properties exist with fallbacks
  const suggestedActions = analysisResult.suggestedActions || []
  const emailData = analysisResult.emailData || {}
  const relevantAttachments = analysisResult.relevantAttachments || []

  const handleActionSelect = (actionType: string) => {
    setSelectedAction(actionType)
    setIsDialogOpen(true)
  }

  const handleActionComplete = () => {
    setIsDialogOpen(false)
    setIsProcessing(false)
    toast({
      title: "Action completed",
      description: "The email attachment has been processed successfully.",
    })
    onActionComplete()
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence > 0.9) {
      return <Badge className="bg-green-500">High Confidence</Badge>
    } else if (confidence > 0.7) {
      return <Badge className="bg-amber-500">Medium Confidence</Badge>
    } else {
      return <Badge className="bg-gray-500">Low Confidence</Badge>
    }
  }

  const createTransactionAction = suggestedActions.find((a) => a.type === "create_transaction")
  const createWorkspaceAction = suggestedActions.find((a) => a.type === "create_workspace")
  const addToTransactionActions = suggestedActions.filter((a) => a.type === "add_to_transaction")

  const handleCreateTransaction = () => {
    // In a real app, this would open a modal or navigate to a form
    console.log("Create transaction with attachments:", relevantAttachments)
    onActionComplete()
  }

  const handleAddToTransaction = () => {
    // In a real app, this would open a modal to select a transaction
    console.log("Add to existing transaction:", relevantAttachments)
    onActionComplete()
  }

  const handleCreateWorkspace = () => {
    // In a real app, this would open a modal or navigate to a form
    console.log("Create workspace with attachments:", relevantAttachments)
    onActionComplete()
  }

  // Check if we have a first attachment to display
  const firstAttachment = relevantAttachments.length > 0 ? relevantAttachments[0] : null

  return (
    <>
      <Card className="shadow-soft overflow-hidden mb-6 border-purple-200 border-l-4 border-l-purple-500">
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl font-poppins text-purple-700 flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5" />
                Email Attachment Detected
              </CardTitle>
              <CardDescription>
                TALOS has detected relevant attachments in an email from {emailData.from?.name || "a sender"}
              </CardDescription>
            </div>
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">TALOS AI</Badge>
            <Button variant="ghost" size="sm" onClick={onDismiss} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-3 bg-purple-50/50">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <span className="font-medium">Email Subject: {emailData.subject || "No subject"}</span>
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              Received {emailData.receivedAt ? new Date(emailData.receivedAt).toLocaleString() : "recently"}
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Attachments:</div>
              <div className="grid gap-2">
                {relevantAttachments.map((attachment: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded-md">
                    <FileText className="h-5 w-5 text-purple-500" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {attachment.fileName || `Attachment ${index + 1}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {attachment.documentType ? attachment.documentType.replace("_", " ") : "Document"} •
                        {attachment.fileSize ? ` ${(attachment.fileSize / 1024 / 1024).toFixed(1)} MB` : ""}
                      </div>
                    </div>
                    {attachment.relevanceScore && (
                      <div className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                        {Math.round(attachment.relevanceScore * 100)}% match
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Tabs defaultValue="suggested" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="suggested">Suggested Actions</TabsTrigger>
              <TabsTrigger value="all">All Options</TabsTrigger>
            </TabsList>

            <TabsContent value="suggested" className="space-y-4 pt-4">
              {suggestedActions.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No suggested actions available</div>
              ) : (
                <div className="space-y-3">
                  {createTransactionAction && (
                    <div className="rounded-lg border p-3 hover:border-purple-200 hover:bg-purple-50/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-purple-100 p-1.5">
                            <Plus className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">Create New Transaction</div>
                            <div className="text-sm text-muted-foreground">
                              Create a transaction for {createTransactionAction.data?.suggestedTitle || "this property"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getConfidenceBadge(createTransactionAction.confidence || 0.5)}
                          <Button
                            size="sm"
                            className="gap-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                            onClick={() => handleActionSelect("create_transaction")}
                          >
                            Select
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {createWorkspaceAction && (
                    <div className="rounded-lg border p-3 hover:border-purple-200 hover:bg-purple-50/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-blue-100 p-1.5">
                            <Plus className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">Create New Workspace</div>
                            <div className="text-sm text-muted-foreground">
                              Create a workspace for {createWorkspaceAction.data?.suggestedTitle || "this client"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getConfidenceBadge(createWorkspaceAction.confidence || 0.5)}
                          <Button
                            size="sm"
                            className="gap-1 bg-gradient-to-r from-blue-600 to-indigo-500 hover:opacity-90 transition-opacity"
                            onClick={() => handleActionSelect("create_workspace")}
                          >
                            Select
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {addToTransactionActions.map((action, index) => {
                    // Check if transactions array exists and has items
                    const hasTransactions = action.data?.transactions && action.data.transactions.length > 0
                    const firstTransaction = hasTransactions ? action.data.transactions[0] : null
                    const transactionCount = hasTransactions ? action.data.transactions.length : 0

                    return (
                      <div
                        key={index}
                        className="rounded-lg border p-3 hover:border-purple-200 hover:bg-purple-50/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-green-100 p-1.5">
                              <FileText className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium">Add to Existing Transaction</div>
                              <div className="text-sm text-muted-foreground">
                                {firstTransaction ? (
                                  <>
                                    Add to {firstTransaction.address || "transaction"}
                                    {transactionCount > 1 && ` and ${transactionCount - 1} more`}
                                  </>
                                ) : (
                                  "Add to an existing transaction"
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getConfidenceBadge(action.confidence || 0.5)}
                            <Button
                              size="sm"
                              className="gap-1 bg-gradient-to-r from-green-600 to-teal-500 hover:opacity-90 transition-opacity"
                              onClick={() => handleActionSelect("add_to_transaction")}
                            >
                              Select
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4 pt-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border p-3 hover:border-purple-200 hover:bg-purple-50/30 transition-colors">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="rounded-full bg-purple-100 p-1.5">
                        <Plus className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="font-medium">Create New Transaction</div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 flex-grow">
                      Create a new transaction and attach the document automatically
                    </p>
                    <Button
                      size="sm"
                      className="gap-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity w-full"
                      onClick={() => handleActionSelect("create_transaction")}
                    >
                      Create Transaction
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-3 hover:border-purple-200 hover:bg-purple-50/30 transition-colors">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="rounded-full bg-blue-100 p-1.5">
                        <Plus className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="font-medium">Create New Workspace</div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 flex-grow">
                      Create a new workspace and attach the document automatically
                    </p>
                    <Button
                      size="sm"
                      className="gap-1 bg-gradient-to-r from-blue-600 to-indigo-500 hover:opacity-90 transition-opacity w-full"
                      onClick={() => handleActionSelect("create_workspace")}
                    >
                      Create Workspace
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-3 hover:border-purple-200 hover:bg-purple-50/30 transition-colors">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="rounded-full bg-green-100 p-1.5">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="font-medium">Add to Existing Transaction</div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 flex-grow">
                      Add the document to an existing transaction
                    </p>
                    <Button
                      size="sm"
                      className="gap-1 bg-gradient-to-r from-green-600 to-teal-500 hover:opacity-90 transition-opacity w-full"
                      onClick={() => handleActionSelect("add_to_transaction")}
                    >
                      Add to Transaction
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-3 hover:border-purple-200 hover:bg-purple-50/30 transition-colors">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="rounded-full bg-amber-100 p-1.5">
                        <FileText className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="font-medium">Save to Documents</div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 flex-grow">
                      Save the document without linking to a transaction or workspace
                    </p>
                    <Button
                      size="sm"
                      className="gap-1 bg-gradient-to-r from-amber-600 to-orange-500 hover:opacity-90 transition-opacity w-full"
                      onClick={() => handleActionSelect("save_document")}
                    >
                      Save Document
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4 flex-wrap gap-2">
          {suggestedActions.map((action: any, index: number) => {
            if (action.type === "create_transaction") {
              return (
                <Button key={index} onClick={handleCreateTransaction} className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Create Transaction
                </Button>
              )
            } else if (action.type === "add_to_transaction") {
              return (
                <Button
                  key={index}
                  variant="outline"
                  onClick={handleAddToTransaction}
                  className="flex items-center gap-1"
                >
                  <Link className="h-4 w-4" />
                  Add to Transaction
                </Button>
              )
            } else if (action.type === "create_workspace") {
              return (
                <Button
                  key={index}
                  variant="outline"
                  onClick={handleCreateWorkspace}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Create Workspace
                </Button>
              )
            }
            return null
          })}
          <Button variant="outline" onClick={onDismiss}>
            Dismiss
          </Button>
          <Button
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={() => emailData.from?.email && window.open(`mailto:${emailData.from.email}`, "_blank")}
          >
            Reply to Email
          </Button>
        </CardFooter>
      </Card>

      {/* Action Dialogs */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedAction === "create_transaction" && (
            <>
              <DialogHeader>
                <DialogTitle>Create New Transaction</DialogTitle>
                <DialogDescription>Create a new transaction and automatically attach the document.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-lg border p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">{firstAttachment ? firstAttachment.fileName : "Document"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This document will be attached to the new transaction.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleActionComplete}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                  >
                    Create Transaction
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedAction === "create_workspace" && (
            <>
              <DialogHeader>
                <DialogTitle>Create New Workspace</DialogTitle>
                <DialogDescription>Create a new workspace and automatically attach the document.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-lg border p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">{firstAttachment ? firstAttachment.fileName : "Document"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">This document will be attached to the new workspace.</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleActionComplete}
                    className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:opacity-90 transition-opacity"
                  >
                    Create Workspace
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedAction === "add_to_transaction" && (
            <>
              <DialogHeader>
                <DialogTitle>Add to Existing Transaction</DialogTitle>
                <DialogDescription>Add the document to an existing transaction.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-lg border p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">{firstAttachment ? firstAttachment.fileName : "Document"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Select a transaction to add this document to.</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleActionComplete}
                    className="bg-gradient-to-r from-green-600 to-teal-500 hover:opacity-90 transition-opacity"
                  >
                    Add to Transaction
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedAction === "save_document" && (
            <>
              <DialogHeader>
                <DialogTitle>Save Document</DialogTitle>
                <DialogDescription>Save the document to your document library.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-lg border p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">{firstAttachment ? firstAttachment.fileName : "Document"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This document will be saved to your document library without being linked to any transaction or
                    workspace.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleActionComplete}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                  >
                    Save Document
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
