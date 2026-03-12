'use client'

import * as React from 'react'
import { KeyIcon, EyeIcon, EyeOffIcon, CheckIcon, Loader2Icon, AlertCircleIcon } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function ApiConfigCard() {
  const [planType, setPlanType] = React.useState<'managed' | 'byok'>('managed')
  const [provider, setProvider] = React.useState('openai')
  const [apiKey, setApiKey] = React.useState('')
  const [showApiKey, setShowApiKey] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasExistingKey, setHasExistingKey] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Load existing config on mount
  React.useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/tenant/config')
        if (!res.ok) return
        const data = await res.json()
        const cfg = data.config
        if (cfg?.plan_type === 'free' || cfg?.plan_type === 'starter') {
          setPlanType('managed')
        } else if (cfg?.plan_type) {
          setPlanType('byok')
        }
        if (cfg?.api_provider) setProvider(cfg.api_provider)
        if (cfg?.hasApiKey) setHasExistingKey(true)
      } catch {
        // Config load failure is non-critical; use defaults
      } finally {
        setIsLoading(false)
      }
    }
    loadConfig()
  }, [])

  const handleSave = async () => {
    setErrorMessage(null)

    // Validate BYOK key is provided
    if (planType === 'byok' && !apiKey.trim() && !hasExistingKey) {
      setErrorMessage('Please enter your API key before saving.')
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/tenant/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType: planType === 'managed' ? 'starter' : 'professional',
          apiProvider: planType === 'byok' ? provider : undefined,
          apiKey: planType === 'byok' && apiKey.trim() ? apiKey.trim() : undefined,
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error ?? 'Save failed')
      }

      setIsSaved(true)
      if (planType === 'byok' && apiKey.trim()) {
        setHasExistingKey(true)
        setApiKey('')
      }
      setTimeout(() => setIsSaved(false), 2000)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save configuration. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
        <CardDescription>
          Choose between our managed service or bring your own API key for
          complete control.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error Banner */}
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

        {/* Plan Type Selection */}
        <div className="space-y-3">
          <Label>Service Plan</Label>
          <RadioGroup
            value={planType}
            onValueChange={(value) => setPlanType(value as 'managed' | 'byok')}
            className="grid grid-cols-2 gap-4"
          >
            <label
              className={`relative flex cursor-pointer rounded-lg border p-4 ${
                planType === 'managed'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/50'
              }`}
            >
              <RadioGroupItem value="managed" className="sr-only" />
              <div className="space-y-1">
                <p className="font-medium">Managed Service</p>
                <p className="text-sm text-muted-foreground">
                  We handle everything. Simple pricing, no API key needed.
                </p>
                <p className="text-sm font-medium text-primary">$29/month</p>
              </div>
              {planType === 'managed' && (
                <CheckIcon className="absolute top-4 right-4 size-5 text-primary" />
              )}
            </label>
            <label
              className={`relative flex cursor-pointer rounded-lg border p-4 ${
                planType === 'byok'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/50'
              }`}
            >
              <RadioGroupItem value="byok" className="sr-only" />
              <div className="space-y-1">
                <p className="font-medium">Bring Your Own Key</p>
                <p className="text-sm text-muted-foreground">
                  Use your own API key for maximum flexibility.
                </p>
                <p className="text-sm font-medium text-primary">$9/month</p>
              </div>
              {planType === 'byok' && (
                <CheckIcon className="absolute top-4 right-4 size-5 text-primary" />
              )}
            </label>
          </RadioGroup>
        </div>

        {/* BYOK Configuration */}
        {planType === 'byok' && (
          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
              <Label htmlFor="provider">AI Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="google">Google AI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">
                API Key
                {hasExistingKey && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    (key saved — enter a new one to replace it)
                  </span>
                )}
              </Label>
              <div className="relative">
                <KeyIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={hasExistingKey ? '••••••••••••••••' : 'sk-…'}
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                  <span className="sr-only">
                    {showApiKey ? 'Hide' : 'Show'} API key
                  </span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your API key is encrypted with AES-256-GCM before storage. We never share it with third parties.
              </p>
            </div>
          </div>
        )}

        <Button onClick={handleSave} className="w-full" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2Icon className="mr-2 size-4 animate-spin" />
              Saving…
            </>
          ) : isSaved ? (
            <>
              <CheckIcon className="mr-2 size-4" />
              Saved!
            </>
          ) : (
            'Save Configuration'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
