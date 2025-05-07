"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowRight, Brain, FileText, Lightbulb, MessageSquare } from "lucide-react"

export function TalosInsights() {
  // Mock data for TALOS insights
  const insights = [
    {
      id: 1,
      type: "workspace_suggestion",
      icon: Lightbulb,
      title: "New Workspace Suggestion",
      description: "Email from Karen Chen contains property address. Create a workspace?",
      action: "Create Workspace",
      actionLink: "/workspaces/create?email=123",
    },
    {
      id: 2,
      type: "stage_transition",
      icon: ArrowRight,
      title: "Stage Transition Detected",
      description: "Michael Johnson's workspace has a signed listing agreement. Move to 'Property Listed'?",
      action: "Update Stage",
      actionLink: "/workspaces/WS-1235?transition=true",
    },
    {
      id: 3,
      type: "document_suggestion",
      icon: FileText,
      title: "Document Suggestion",
      description: "Emily Brown's transaction may need a Seller's Disclosure form.",
      action: "Generate Form",
      actionLink: "/workspaces/WS-1236/documents/create",
    },
    {
      id: 4,
      type: "communication_reminder",
      icon: MessageSquare,
      title: "Follow-up Reminder",
      description: "No response from Robert Wilson in 5 days. Send a follow-up?",
      action: "Send Message",
      actionLink: "/workspaces/WS-1237/communications",
    },
  ]

  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-indigo-600" />
          <CardTitle className="text-xl font-poppins text-purple-700">TALOS Insights</CardTitle>
        </div>
        <CardDescription>AI-powered suggestions and insights</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="rounded-lg border p-3 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-indigo-100 p-1.5 mt-0.5">
                <insight.icon className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-medium text-sm">{insight.title}</h3>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 h-7 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                  asChild
                >
                  <a href={insight.actionLink}>{insight.action}</a>
                </Button>
              </div>
            </div>
          </div>
        ))}

        {insights.length === 0 && (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
              <AlertCircle className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="mt-3 text-sm font-medium">No insights available</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              TALOS will provide insights as it analyzes your communications and workspaces.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
