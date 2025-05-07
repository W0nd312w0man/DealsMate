"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Bell, Calendar, MessageSquare, Clock, AlertCircle, Mail } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function NotificationSettings() {
  const [calendarSettings, setCalendarSettings] = useState({
    enabled: true,
    defaultTiming: "same_day",
    customDays: 1,
    customTime: "09:00",
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
  })

  const [messageSettings, setMessageSettings] = useState({
    emailEnabled: true,
    smsEnabled: false,
    smsPhone: "",
    pushEnabled: true,
    soundEnabled: true,
  })

  const { toast } = useToast()

  const handleCalendarSettingChange = (key: string, value: any) => {
    setCalendarSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleMessageSettingChange = (key: string, value: any) => {
    setMessageSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    })
  }

  return (
    <Tabs defaultValue="calendar" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="calendar">
          <Calendar className="h-4 w-4 mr-2" />
          Calendar Events
        </TabsTrigger>
        <TabsTrigger value="messages">
          <MessageSquare className="h-4 w-4 mr-2" />
          Messages
        </TabsTrigger>
      </TabsList>

      <TabsContent value="calendar">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-600" />
              Calendar Notification Settings
            </CardTitle>
            <CardDescription>
              Configure when and how you receive notifications for calendar events and appointments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="calendar-notifications" className="flex flex-col space-y-1">
                <span>Calendar Notifications</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Receive notifications for events and appointments
                </span>
              </Label>
              <Switch
                id="calendar-notifications"
                checked={calendarSettings.enabled}
                onCheckedChange={(checked) => handleCalendarSettingChange("enabled", checked)}
              />
            </div>

            <div className="space-y-3">
              <Label>Default Notification Timing</Label>
              <RadioGroup
                value={calendarSettings.defaultTiming}
                onValueChange={(value) => handleCalendarSettingChange("defaultTiming", value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="same_day" id="same-day" />
                  <Label htmlFor="same-day" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-purple-600" />
                    Same day (default)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="day_before" id="day-before" />
                  <Label htmlFor="day-before" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    Day before
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom-timing" />
                  <Label htmlFor="custom-timing" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-pink-600" />
                    Custom timing
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {calendarSettings.defaultTiming === "custom" && (
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="custom-days">Days Before</Label>
                  <Input
                    id="custom-days"
                    type="number"
                    min="0"
                    max="30"
                    value={calendarSettings.customDays}
                    onChange={(e) => handleCalendarSettingChange("customDays", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-time">Time of Day</Label>
                  <Select
                    value={calendarSettings.customTime}
                    onValueChange={(value) => handleCalendarSettingChange("customTime", value)}
                  >
                    <SelectTrigger id="custom-time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="18:00">6:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label>Notification Methods</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-600" />
                    Email Notifications
                  </Label>
                  <Switch
                    id="email-notifications"
                    checked={calendarSettings.emailNotifications}
                    onCheckedChange={(checked) => handleCalendarSettingChange("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="flex items-center">
                    <Bell className="h-4 w-4 mr-2 text-purple-600" />
                    Push Notifications
                  </Label>
                  <Switch
                    id="push-notifications"
                    checked={calendarSettings.pushNotifications}
                    onCheckedChange={(checked) => handleCalendarSettingChange("pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-green-600" />
                    SMS Notifications
                  </Label>
                  <Switch
                    id="sms-notifications"
                    checked={calendarSettings.smsNotifications}
                    onCheckedChange={(checked) => handleCalendarSettingChange("smsNotifications", checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="messages">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
              Message Notification Settings
            </CardTitle>
            <CardDescription>Configure how you receive notifications for messages and chats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Notification Methods</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-message-notifications" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-600" />
                    Email Notifications
                  </Label>
                  <Switch
                    id="email-message-notifications"
                    checked={messageSettings.emailEnabled}
                    onCheckedChange={(checked) => handleMessageSettingChange("emailEnabled", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="push-message-notifications" className="flex items-center">
                    <Bell className="h-4 w-4 mr-2 text-purple-600" />
                    Push Notifications
                  </Label>
                  <Switch
                    id="push-message-notifications"
                    checked={messageSettings.pushEnabled}
                    onCheckedChange={(checked) => handleMessageSettingChange("pushEnabled", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-message-notifications" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-green-600" />
                    SMS Notifications
                  </Label>
                  <Switch
                    id="sms-message-notifications"
                    checked={messageSettings.smsEnabled}
                    onCheckedChange={(checked) => handleMessageSettingChange("smsEnabled", checked)}
                  />
                </div>
              </div>
            </div>

            {messageSettings.smsEnabled && (
              <div className="space-y-2">
                <Label htmlFor="sms-phone">SMS Phone Number</Label>
                <Input
                  id="sms-phone"
                  placeholder="Enter your phone number"
                  value={messageSettings.smsPhone}
                  onChange={(e) => handleMessageSettingChange("smsPhone", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Standard SMS rates may apply based on your carrier</p>
              </div>
            )}

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="sound-notifications" className="flex flex-col space-y-1">
                <span>Sound Notifications</span>
                <span className="font-normal text-sm text-muted-foreground">Play a sound when new messages arrive</span>
              </Label>
              <Switch
                id="sound-notifications"
                checked={messageSettings.soundEnabled}
                onCheckedChange={(checked) => handleMessageSettingChange("soundEnabled", checked)}
              />
            </div>

            <div className="rounded-lg border p-4 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">SMS Integration</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    To enable SMS messaging with clients, please set up the SMS integration in the Integrations tab.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
