"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, X } from "lucide-react"

export function TransactionFilters() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="grid gap-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Input id="search" placeholder="Search by address, client, or ID..." className="w-full md:w-[300px]" />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="closed-month">Closed This Month</SelectItem>
            <SelectItem value="withdrawn">Withdrawn</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Transaction Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="listing">Listing</SelectItem>
            <SelectItem value="purchase">Purchase</SelectItem>
            <SelectItem value="lease">Lease</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-between">
              <span>Date Range</span>
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="range" numberOfMonths={2} />
          </PopoverContent>
        </Popover>
        <Button variant="outline" size="icon" className="rounded-full">
          <X className="h-4 w-4" />
          <span className="sr-only">Clear filters</span>
        </Button>
      </div>
    </div>
  )
}
