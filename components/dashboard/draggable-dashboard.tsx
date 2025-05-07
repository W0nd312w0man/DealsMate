"use client"

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useDashboardPreferences } from "@/hooks/use-dashboard-preferences"
import { CollapsibleCard } from "./collapsible-card"
import { ClientLifecycleOverview } from "./client-lifecycle-overview"
import { WorkspaceStagesSummary } from "./workspace-stages-summary"
import { TalosInsights } from "./talos-insights"
import { RecentActivity } from "./recent-activity"
import { UpcomingTasks } from "./upcoming-tasks"
import { SmartInbox } from "./smart-inbox"
import { TasksPanel } from "./tasks-panel"
import { UpcomingEvents } from "./upcoming-events"
import { useEffect } from "react"
import { GridContainer, GridItem, GridProvider, useGrid } from "./grid-system"

export function DraggableDashboard() {
  const { cardOrder, collapsedSections, updateCardOrder, toggleSectionCollapse, isLoaded } = useDashboardPreferences()

  // Ensure Workspace Stages card is positioned next to Client Lifecycle card by default
  useEffect(() => {
    if (isLoaded) {
      const clientLifecycleIndex = cardOrder.indexOf("client-lifecycle")
      const workspaceStagesIndex = cardOrder.indexOf("workspace-stages")

      // If they're not adjacent, update the order
      if (workspaceStagesIndex !== clientLifecycleIndex + 1) {
        const newOrder = [...cardOrder]

        // Remove workspace-stages from its current position
        newOrder.splice(workspaceStagesIndex, 1)

        // Insert it after client-lifecycle
        newOrder.splice(clientLifecycleIndex + 1, 0, "workspace-stages")

        updateCardOrder(newOrder)
      }
    }
  }, [isLoaded, cardOrder, updateCardOrder])

  // Only render once preferences are loaded from localStorage
  if (!isLoaded) {
    return <div className="animate-pulse">Loading dashboard preferences...</div>
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(cardOrder)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    updateCardOrder(items)
  }

  // Default spans for our grid system
  const defaultSpans = {
    "client-lifecycle": 6,
    "workspace-stages": 6,
    "talos-insights": 3,
    "recent-activity": 4,
    "upcoming-tasks": 4,
    "smart-inbox": 8,
    "tasks-panel": 4,
    "upcoming-events": 4,
  }

  return (
    <GridProvider defaultSpans={defaultSpans}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard-cards" direction="horizontal" type="column">
          {(provided) => (
            <GridContainer {...provided.droppableProps} ref={provided.innerRef}>
              {cardOrder.map((cardId, index) => (
                <Draggable key={cardId} draggableId={cardId} index={index}>
                  {(provided) => (
                    <GridItem id={cardId} ref={provided.innerRef} {...provided.draggableProps}>
                      <CardComponent
                        id={cardId}
                        isCollapsed={collapsedSections[cardId]}
                        onToggleCollapse={() => toggleSectionCollapse(cardId)}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </GridItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </GridContainer>
          )}
        </Droppable>
      </DragDropContext>
    </GridProvider>
  )
}

// Separate component to render the appropriate card based on ID
function CardComponent({ id, isCollapsed, onToggleCollapse, dragHandleProps }: any) {
  const { setColumnSpan } = useGrid()

  const handleResize = (newSpan: number) => {
    setColumnSpan(id, newSpan)
  }

  // Render the appropriate component based on the card ID
  const renderCardContent = () => {
    switch (id) {
      case "client-lifecycle":
        return <ClientLifecycleOverview />
      case "workspace-stages":
        return <WorkspaceStagesSummary />
      case "talos-insights":
        return <TalosInsights />
      case "recent-activity":
        return <RecentActivity />
      case "upcoming-tasks":
        return <UpcomingTasks />
      case "smart-inbox":
        return <SmartInbox />
      case "tasks-panel":
        return <TasksPanel />
      case "upcoming-events":
        return <UpcomingEvents />
      default:
        return <div>Unknown card type</div>
    }
  }

  return (
    <CollapsibleCard
      id={id}
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
      dragHandleProps={dragHandleProps}
      isResizable={true}
      onResize={handleResize}
    >
      {renderCardContent()}
    </CollapsibleCard>
  )
}
