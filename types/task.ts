export type TaskPriority = "low" | "medium" | "high"
export type TaskStatus = "past-due" | "today" | "upcoming" | "completed"
export type TaskOwnerRole = "agent" | "transaction-coordinator" | "broker" | "manager" | "system-administrator"
export type TaskCreationType = "manual" | "talos-ai"

export interface Task {
  id: string
  title: string
  details?: string
  dueDate: string
  completed: boolean
  priority: TaskPriority
  transaction?: string
  transactionAddress?: string
  client?: string
  workspaceId?: string
  workspaceName?: string
  isPastDue?: boolean
  createdBy: TaskCreationType
  ownerRole: TaskOwnerRole
  ownerName: string
  createdAt: string
}
