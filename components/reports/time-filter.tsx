"use client"

import { useState } from "react"
import type { TimeFilter, DateRange } from "@/types/reports"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface TimeFilterProps {
  value: TimeFilter
  onChange: (value: TimeFilter) => void
  customDateRange: DateRange | null
  onCustomDateChange: (range: DateRange | null) => void
}

export function TimeFilterComponent({ value, onChange, customDateRange, onCustomDateChange }: TimeFilterProps) {
  const [date, setDate] = useState<
    | {
        from: Date | undefined
        to: Date | undefined
      }
    | undefined
  >(customDateRange ? { from: new Date(customDateRange.start), to: new Date(customDateRange.end) } : undefined)

  const handleSelect = (filter: TimeFilter) => {
    onChange(filter)
  }

  const handleDateSelect = (selectedDate: { from: Date | undefined; to: Date | undefined } | undefined) => {
    setDate(selectedDate)
    if (selectedDate?.from && selectedDate?.to) {
      onCustomDateChange({
        start: selectedDate.from,
        end: selectedDate.to,
      })
      onChange("custom")
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex bg-muted rounded-md p-1">
        <Button
          variant={value === "mtd" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleSelect("mtd")}
          className="text-xs"
        >
          MTD
        </Button>
        <Button
          variant={value === "qtd" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleSelect("qtd")}
          className="text-xs"
        >
          QTD
        </Button>
        <Button
          variant={value === "ytd" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleSelect("ytd")}
          className="text-xs"
        >
          YTD
        </Button>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={value === "custom" ? "default" : "outline"}
            size="sm"
            className={cn("text-xs", value === "custom" ? "bg-purple-600 hover:bg-purple-700" : "")}
          >
            <CalendarIcon className="mr-2 h-3 w-3" />
            {value === "custom" && date?.from && date?.to
              ? `${format(date.from, "MMM d")} - ${format(date.to, "MMM d, yyyy")}`
              : "Custom Range"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar mode="range" selected={date} onSelect={handleDateSelect} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  )
}
