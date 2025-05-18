"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CheckSquare, RefreshCw } from 'lucide-react'

interface CalendarFilters {
  showTasks: boolean
  showEvents: boolean
  showExternalEvents: boolean
  transactionId: string | null
  clientName: string | null
}

interface CalendarSidebarProps {
  filters: CalendarFilters
  onFiltersChange: (filters: CalendarFilters) => void
  onAddEvent: () => void
}

export function CalendarSidebar({ filters, onFiltersChange, onAddEvent }: CalendarSidebarProps) {
  // Mock data for transactions and clients
  const transactions = [
    { id: "TX-1234", address: "123 Main St" },
    { id: "TX-1235", address: "456 Oak Ave" },
    { id: "TX-1236", address: "789 Pine Rd" },
  ]

  const clients = [
    { id: "C-1001", name: "John Smith" },
    { id: "C-1002", name: "Sarah Johnson" },
    { id: "C-1003", name: "Michael Brown" },
  ]

  const handleFilterChange = (key: keyof CalendarFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-soft overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-poppins text-purple-700">Add New</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              className="w-full justify-start gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
              onClick={onAddEvent}
            >
              <Calendar className="h-4 w-4" />
              New Event
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={onAddEvent}
            >
              <CheckSquare className="h-4 w-4" />
              New Task
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-400"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-poppins text-purple-700">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Show/Hide</div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-tasks"
                    checked={filters.showTasks}
                    onCheckedChange={(checked) => handleFilterChange("showTasks", checked === true)}
                  />
                  <Label htmlFor="show-tasks" className="text-sm">
                    Tasks
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-events"
                    checked={filters.showEvents}
                    onCheckedChange={(checked) => handleFilterChange("showEvents", checked === true)}
                  />
                  <Label htmlFor="show-events" className="text-sm">
                    Events
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-external"
                    checked={filters.showExternalEvents}
                    onCheckedChange={(checked) => handleFilterChange("showExternalEvents", checked === true)}
                  />
                  <Label htmlFor="show-external" className="text-sm">
                    External Calendar Events
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Transaction</div>
              <Select
                value={filters.transactionId || "all-transactions"}
                onValueChange={(value) => handleFilterChange("transactionId", value === "all-transactions" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Transactions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-transactions">All Transactions</SelectItem>
                  <SelectItem value="none">No Transaction</SelectItem>
                  {transactions.map((tx) => (
                    <SelectItem key={tx.id} value={tx.id}>
                      {tx.id} - {tx.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Client</div>
              <Select
                value={filters.clientName || "all-clients"}
                onValueChange={(value) => handleFilterChange("clientName", value === "all-clients" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-clients">All Clients</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.name}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="w-full justify-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={() =>
                onFiltersChange({
                  showTasks: true,
                  showEvents: true,
                  showExternalEvents: true,
                  transactionId: null,
                  clientName: null,
                })
              }
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-green-500 to-blue-400"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-poppins text-purple-700">Connected Calendars</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-green-500"></div>
                <span className="text-sm">Google Calendar</span>
              </div>
              <div className="text-xs text-green-600 font-medium">Connected</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                <span className="text-sm">Apple Calendar</span>
              </div>
              <div className="text-xs text-muted-foreground">Not Connected</div>
            </div>

            <Button
              variant="outline"
              className="w-full justify-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <RefreshCw className="h-4 w-4" />
              Sync Calendars
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
