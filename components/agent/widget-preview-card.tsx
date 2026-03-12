'use client'

import * as React from 'react'
import { MessageSquareIcon, CopyIcon, CheckIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type WidgetPreviewCardProps = {
  greeting: string
  onGreetingChange: (greeting: string) => void
  onPreview: () => void
}

export function WidgetPreviewCard({
  greeting,
  onGreetingChange,
  onPreview,
}: WidgetPreviewCardProps) {
  const [copied, setCopied] = React.useState(false)

  const embedCode = `<script src="https://yoursite.com/widget.js" data-tenant-id="YOUR_TENANT_ID"></script>`

  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(embedCode).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => fallbackCopy())
    } else {
      fallbackCopy()
    }
  }

  const fallbackCopy = () => {
    const textArea = document.createElement('textarea')
    textArea.value = embedCode
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } finally {
      document.body.removeChild(textArea)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat Widget</CardTitle>
        <CardDescription>
          Customize the appearance and behavior of your chat widget, then embed
          it on your website.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Widget Preview */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="greeting">Welcome Message</Label>
              <Textarea
                id="greeting"
                value={greeting}
                onChange={(e) => onGreetingChange(e.target.value)}
                placeholder="Enter the greeting message for your chat widget"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                This message appears when users first open the chat widget.
              </p>
            </div>

            <Button onClick={onPreview} className="w-full">
              <MessageSquareIcon className="mr-2 size-4" />
              Preview Widget
            </Button>
          </div>

          {/* Preview */}
          <div className="rounded-lg bg-muted/30 p-4">
            <p className="text-sm font-medium mb-3">Widget Preview</p>
            <div className="overflow-hidden rounded-lg border bg-card shadow-lg">
              {/* Header */}
              <div className="flex items-center gap-3 bg-primary p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/20">
                  <MessageSquareIcon className="size-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-primary-foreground">
                    AI Assistant
                  </p>
                  <p className="text-xs text-primary-foreground/80">Online</p>
                </div>
              </div>
              {/* Message */}
              <div className="p-4">
                <div className="inline-block rounded-lg rounded-tl-none bg-muted px-4 py-2">
                  <p className="text-sm">{greeting || 'Your greeting message here...'}</p>
                </div>
              </div>
              {/* Input */}
              <div className="border-t p-4">
                <Input
                  placeholder="Type a message..."
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Embed Code */}
        <div className="space-y-2">
          <Label>Embed Code</Label>
          <div className="relative">
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              <code>{embedCode}</code>
            </pre>
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-2 top-2"
              onClick={handleCopy}
            >
              {copied ? (
                <CheckIcon className="size-4" />
              ) : (
                <CopyIcon className="size-4" />
              )}
              <span className="sr-only">Copy embed code</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Add this code to your website before the closing{' '}
            <code className="rounded bg-muted px-1">{'</body>'}</code> tag.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
