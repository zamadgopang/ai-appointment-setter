'use client'

import * as React from 'react'
import { CalendarIcon, CheckCircle2Icon, LinkIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function CalendarIntegrationCard() {
  const [isConnected, setIsConnected] = React.useState(false)
  const [isConnecting, setIsConnecting] = React.useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    
    // Simulate OAuth flow - in production, redirect to Google OAuth
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // For demo purposes, toggle connection
    setIsConnected(true)
    setIsConnecting(false)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Calendar Integration</CardTitle>
        <CardDescription>
          Connect your Google Calendar to let the AI agent book appointments
          directly with your clients.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
              <CalendarIcon className="size-6 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">Google Calendar</p>
                {isConnected && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    <CheckCircle2Icon className="mr-1 size-3" />
                    Connected
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {isConnected
                  ? 'Your calendar is synced and ready for bookings'
                  : 'Connect to enable automatic appointment scheduling'}
              </p>
            </div>
          </div>
          {isConnected ? (
            <Button variant="outline" onClick={handleDisconnect}>
              Disconnect
            </Button>
          ) : (
            <Button onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <LinkIcon className="mr-2 size-4 animate-pulse" />
                  Connecting...
                </>
              ) : (
                <>
                  <LinkIcon className="mr-2 size-4" />
                  Connect
                </>
              )}
            </Button>
          )}
        </div>

        {isConnected && (
          <div className="rounded-lg border p-4 space-y-4">
            <h4 className="text-sm font-medium">Connection Details</h4>
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account</span>
                <span>demo@example.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Calendar</span>
                <span>Primary Calendar</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Synced</span>
                <span>Just now</span>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-muted/50 p-4">
          <h4 className="text-sm font-medium mb-2">How it works</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                1
              </span>
              Connect your Google Calendar account securely via OAuth
            </li>
            <li className="flex items-start gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                2
              </span>
              AI agent checks your availability in real-time
            </li>
            <li className="flex items-start gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                3
              </span>
              Appointments are automatically added to your calendar
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
