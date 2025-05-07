import { Badge } from "@/components/ui/badge"
import { getStatusColor, type TransactionStatus } from "@/types/transaction"

interface StatusBadgeProps {
  status: TransactionStatus
  size?: "sm" | "md" | "lg"
  className?: string
}

export function StatusBadge({ status, size = "md", className = "" }: StatusBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-sm",
  }

  return (
    <Badge
      variant="outline"
      className={`${getStatusColor(status)} ${sizeClasses[size]} font-medium rounded-full ${className}`}
    >
      {status}
    </Badge>
  )
}
