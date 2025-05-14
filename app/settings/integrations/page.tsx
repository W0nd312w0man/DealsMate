import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Calendar, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Integrations | DealMate",
  description: "Connect your accounts to enhance your DealMate experience",
}

export default function IntegrationsPage() {
  return (
    <div className="container space-y-6 py-8">
      <BreadcrumbNav />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">Connect your accounts to enhance your DealMate experience</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Gmail Integration Card */}
        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-red-500 to-pink-500"></div>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2">
                <Mail className="h-5 w-5 text-red-600" />
              </div>
              <CardTitle>Gmail</CardTitle>
            </div>
            <CardDescription>
              Connect your Gmail account to send and receive emails directly within DealMate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Integrate your Gmail account to manage email communications, attachments, and notifications within the
              platform.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/settings/integrations/gmail" className="w-full">
              <Button className="w-full">Configure</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Text Message Integration Card */}
        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle>Text Messages</CardTitle>
            </div>
            <CardDescription>Send and receive text messages through DealMate</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect your phone number to send and receive SMS messages directly from the platform.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Coming Soon</Button>
          </CardFooter>
        </Card>

        {/* Calendar Integration Card */}
        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle>Calendar</CardTitle>
            </div>
            <CardDescription>Sync your calendar with DealMate</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect your Google Calendar or Outlook Calendar to manage appointments and events.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Coming Soon</Button>
          </CardFooter>
        </Card>

        {/* Document Storage Integration Card */}
        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-yellow-500 to-amber-500"></div>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-yellow-100 p-2">
                <FileText className="h-5 w-5 text-yellow-600" />
              </div>
              <CardTitle>Document Storage</CardTitle>
            </div>
            <CardDescription>Connect cloud storage for documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Integrate with Google Drive, Dropbox, or OneDrive to manage transaction documents.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Coming Soon</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
