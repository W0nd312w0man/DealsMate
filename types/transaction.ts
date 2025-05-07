export type TransactionType = "Listing" | "Purchase" | "Lease Listing" | "Lease" | "Referral" | "Other"

// Standardized Transaction Statuses
export type TransactionStatus =
  | "Active"
  | "Pending"
  | "Closing This Month"
  | "Closed"
  | "Withdrawn"
  | "Canceled"
  | "Archived"

// Transaction Journey Stages (by Type)
export type PurchaseStage = "Nurturing" | "Actively Searching" | "Under Contract" | "Closed"
export type ListingStage = "Nurturing" | "Preparing to List" | "Property Listed" | "Under Contract" | "Closed"
export type LeaseStage = "Nurturing" | "Actively Searching" | "Under Contract" | "Closed"
export type ReferralStage = "Active" | "Closed"

// Helper function to get available stages based on transaction type
export function getStagesByType(type: TransactionType): string[] {
  switch (type) {
    case "Purchase":
      return ["Nurturing", "Actively Searching", "Under Contract", "Closed"]
    case "Listing":
      return ["Nurturing", "Preparing to List", "Property Listed", "Under Contract", "Closed"]
    case "Lease Listing":
    case "Lease":
      return ["Nurturing", "Actively Searching", "Under Contract", "Closed"]
    case "Referral":
    case "Other":
      return ["Active", "Closed"]
    default:
      return ["Active", "Closed"]
  }
}

// Helper function to get status badge color
export function getStatusColor(status: TransactionStatus): string {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    case "Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
    case "Closing This Month":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    case "Closed":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400"
    case "Withdrawn":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    case "Canceled":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    case "Archived":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-500"
    default:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
  }
}

// Helper function to get stage progression visualization
export function getStageProgressClasses(currentStage: string, stageToCheck: string, type: TransactionType): string {
  const stages = getStagesByType(type)
  const currentIndex = stages.indexOf(currentStage)
  const checkIndex = stages.indexOf(stageToCheck)

  if (checkIndex < 0) return ""

  if (checkIndex < currentIndex) {
    return "bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300"
  } else if (checkIndex === currentIndex) {
    return "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300"
  } else {
    return "bg-gray-100 border-gray-300 text-gray-500 dark:bg-gray-800/30 dark:border-gray-700 dark:text-gray-400"
  }
}

// Helper function to get status description
export function getStatusDescription(status: TransactionStatus): string {
  switch (status) {
    case "Active":
      return "Transaction is currently active and in progress."
    case "Pending":
      return "Transaction is pending approval or waiting for next steps."
    case "Closing This Month":
      return "Transaction is scheduled to close within the current month."
    case "Closed":
      return "Transaction has been successfully completed and closed."
    case "Withdrawn":
      return "Transaction has been withdrawn from the market."
    case "Canceled":
      return "Transaction has been canceled and will not proceed."
    case "Archived":
      return "Transaction has been archived for record-keeping."
    default:
      return "Current transaction status."
  }
}

export interface Transaction {
  id: string
  address: string
  type: TransactionType
  status: TransactionStatus
  price: string
  client: string
  dueDate: string
  documents: number
  tasks: number
  complianceStatus: string
  compliancePercentage: number
}
