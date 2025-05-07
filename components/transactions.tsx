export type TransactionStatus =
  | "initiated"
  | "in-review"
  | "needs-attention"
  | "corrections-required"
  | "file-approved"
  | "processing"
  | "commission-disbursement-released"
  | "payment-issued"
  | "completed"

export type AttentionReason = "documents" | "broker" | "commission" | null

export interface TransactionProgressTrackerProps {
  currentStatus: TransactionStatus
  attentionReason?: AttentionReason
  className?: string
}

export function TransactionProgressTracker(props: TransactionProgressTrackerProps) {
  return null
}
