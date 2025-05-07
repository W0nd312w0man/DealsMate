"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useEmailViewPreferences, type EmailViewPreference } from "@/hooks/use-email-view-preferences"

export function EmailViewSettings() {
  const { emailViewPreference, updateEmailViewPreference, isLoaded } = useEmailViewPreferences()
  const [selectedPreference, setSelectedPreference] = useState<EmailViewPreference>("popup-modal")
  const { toast } = useToast()

  useEffect(() => {
    if (isLoaded) {
      setSelectedPreference(emailViewPreference)
    }
  }, [emailViewPreference, isLoaded])

  const handleSave = () => {
    updateEmailViewPreference(selectedPreference)
    toast({
      title: "Settings saved",
      description: "Your email view preference has been updated.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Inbox Settings</CardTitle>
        <CardDescription>Configure how emails are displayed when opened</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-3">View Emails</h3>
            <RadioGroup
              value={selectedPreference}
              onValueChange={(value) => setSelectedPreference(value as EmailViewPreference)}
              className="space-y-3"
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="popup-modal" id="popup-modal" />
                <div className="grid gap-1.5">
                  <Label htmlFor="popup-modal" className="font-medium">
                    Popup Modal
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Open emails in a centered modal overlay on the current page
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="expanded-inline" id="expanded-inline" />
                <div className="grid gap-1.5">
                  <Label htmlFor="expanded-inline" className="font-medium">
                    Expanded Inline Box
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Expand emails directly within the inbox list for quick reading
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="bottom-right-panel" id="bottom-right-panel" />
                <div className="grid gap-1.5">
                  <Label htmlFor="bottom-right-panel" className="font-medium">
                    Bottom Right Preview Panel
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Open emails in a panel at the bottom right corner of the screen while you continue working
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
          <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90">
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
