"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"
import type { TransactionStatus } from "@/types/transaction"

interface StatusFilterProps {
  onStatusChange: (statuses: TransactionStatus[]) => void
  selectedStatuses: TransactionStatus[]
  label?: string
  buttonVariant?: "default" | "outline" | "ghost"
}

export function StatusFilter({
  onStatusChange,
  selectedStatuses,
  label = "Status",
  buttonVariant = "outline",
}: StatusFilterProps) {
  // All available statuses
  const allStatuses: TransactionStatus[] = [
    "Active",
    "Pending",
    "Closing This Month",
    "Closed",
    "Withdrawn",
    "Canceled",
    "Archived",
  ]

  const handleStatusToggle = (status: TransactionStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status))
    } else {
      onStatusChange([...selectedStatuses, status])
    }
  }

  const handleSelectAll = () => {
    onStatusChange(allStatuses)
  }

  const handleClearAll = () => {
    onStatusChange([])
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={buttonVariant}
          size="sm"
          className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-1"
        >
          <Filter className="h-4 w-4 mr-1" />
          {label} {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[220px]">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allStatuses.map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={selectedStatuses.includes(status)}
            onCheckedChange={() => handleStatusToggle(status)}
          >
            {status}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <div className="flex justify-between px-2 py-1.5">
          <Button variant="ghost" size="sm" onClick={handleSelectAll} className="text-xs h-8">
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-xs h-8">
            Clear All
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
