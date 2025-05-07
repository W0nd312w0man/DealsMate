"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CalendarIntegrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CalendarIntegrationDialog({ open, onOpenChange }: CalendarIntegrationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Calendar Integrations</DialogTitle>
          <DialogDescription>Connect and manage your external calendars</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="google">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="google">Google Calendar</TabsTrigger>
            <TabsTrigger value="apple">Apple Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="google" className="py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Google Calendar</h3>
                  <p className="text-sm text-muted-foreground">Connected as john.doe@gmail.com</p>
                </div>
                <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Disconnect
                </Button>
              </div>

              <div className="space-y-2 border-t pt-4">
                <h4 className="text-sm font-medium">Sync Settings</h4>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="google-two-way" defaultChecked />
                    <Label htmlFor="google-two-way">Enable two-way sync</Label>
                  </div>
                  <p className="text-xs text-muted-foreground pl-6">
                    Changes made in either calendar will be reflected in both
                  </p>
                </div>

                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium">Calendars to Import</h4>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="google-primary" defaultChecked />
                      <Label htmlFor="google-primary">Primary Calendar</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="google-work" defaultChecked />
                      <Label htmlFor="google-work">Work Calendar</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="google-family" />
                      <Label htmlFor="google-family">Family Calendar</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium">Default Privacy</h4>

                  <RadioGroup defaultValue="public">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="google-public" />
                      <Label htmlFor="google-public">Public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="google-private" />
                      <Label htmlFor="google-private">Private</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="apple" className="py-4">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-6">
                <p className="text-center mb-4">Connect your Apple Calendar to sync events</p>
                <Button>Connect Apple Calendar</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
