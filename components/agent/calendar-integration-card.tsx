'use client'

import * as React from 'react'
import { CalendarIcon, CheckCircle2Icon, LinkIcon, Loader2Icon, AlertCircleIcon } from 'lucide-react'
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
  const [isLoading, setIsLoading] = React.useState(true)
  const [isDisconnecting, setIsDisconnecting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [connectedEmail, setConnectedEmail] = React.useState<string | null>(null)

  // Load connection status from config API
  React.useEffect(() => {
    fetch('/api/tenant/config')
      .then((r) => r.json())
      .then((data) => {
        setIsConnected(!!data.config?.hasGoogleRefreshToken)
        if (data.config?.google_calendar_email) {
          setConnectedEmail(data.config.google_calendar_email)
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const handleConnect = () => {
    // Redirect to Google OAuth flow; the callback route will return here
    window.location.href = '/api/auth/google'
  }

  const handleDisconnect = async () => {
    setErrorMessage(null)
    setIsDisconnecting(true)
    try {
      const res = await fetch('/api/auth/google/disconnect', { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Disconnect failed')
      }
      setIsConnected(false)
      setConnectedEmail(null)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to disconnect. Please try again.')
    } finally {
      setIsDisconnecting(false)
    }
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
        {errorMessage && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircleIcon className="size-4 mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
            <button
              className="ml-auto shrink-0 opacity-70 hover:opacity-100"
              onClick={() => setErrorMessage(null)}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

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
                {isLoading
                  ? 'Checking connection…'
                  : isConnected
                  ? `Your calendar is synced and ready for bookings`
                  : 'Connect to enable automatic appointment scheduling'}
              </p>
            </div>
          </div>
          {isLoading ? (
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          ) : isConnected ? (
            <Button
              variant="outline"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
            >
              {isDisconnecting ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Disconnecting…
                </>
              ) : (
                'Disconnect'
              )}
            </Button>
          ) : (
            <Button onClick={handleConnect}>
              <LinkIcon className="mr-2 size-4" />
              Connect with Google
            </Button>
          )}
        </div>

        {isConnected && (
          <div className="rounded-lg border p-4 space-y-4">
            <h4 className="text-sm font-medium">Connection Details</h4>
            <div className="grid gap-3 text-sm">
              {connectedEmail && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account</span>
                  <span>{connectedEmail}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Calendar</span>
                <span>Primary Calendar</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="text-green-600">Active</span>
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
              Connect your Google Calendar account securely via OAuth 2.0
            </li>
            <li className="flex items-start gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                2
              </span>
              AI agent checks your real-time availability
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
