'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Loader2Icon,
  AlertCircleIcon,
  UserIcon,
  CreditCardIcon,
  ClockIcon,
  CheckIcon,
  SparklesIcon,
  ArrowRightIcon,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { PLANS, type PlanId } from '@/lib/plans'

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function SettingsContent() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'profile'
  const [businessName, setBusinessName] = React.useState('')
  const [website, setWebsite] = React.useState('')
  const [timezone, setTimezone] = React.useState('UTC')
  const [isSaving, setIsSaving] = React.useState(false)
  const [savedOk, setSavedOk] = React.useState(false)
  const [saveError, setSaveError] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [currentPlan, setCurrentPlan] = React.useState<PlanId>('free')
  const [isLoadingConfig, setIsLoadingConfig] = React.useState(true)

  React.useEffect(() => {
    fetch('/api/tenant/config')
      .then((r) => r.json())
      .then((data) => {
        const cfg = data.config
        if (cfg?.name) setBusinessName(cfg.name)
        if (cfg?.website_url) setWebsite(cfg.website_url)
        if (cfg?.timezone) setTimezone(cfg.timezone)
        // Map plan types
        const planType = cfg?.plan_type
        if (planType === 'free' || planType === 'starter' || planType === 'pro') {
          setCurrentPlan(planType)
        } else if (planType === 'professional' || planType === 'enterprise') {
          setCurrentPlan('pro')
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingConfig(false))
  }, [])

  const handleSave = async () => {
    setSaveError(null)
    setSavedOk(false)
    if (!businessName.trim()) {
      setSaveError('Business name cannot be empty.')
      return
    }
    setIsSaving(true)
    try {
      const res = await fetch('/api/tenant/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: businessName.trim() }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Save failed')
      }
      setSavedOk(true)
      setTimeout(() => setSavedOk(false), 2000)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await fetch('/api/auth/signout', { method: 'POST' }).catch(() => {})
      window.location.href = '/'
    } finally {
      setIsDeleting(false)
    }
  }

  const plan = PLANS[currentPlan]

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, billing, and application settings.
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <UserIcon className="size-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCardIcon className="size-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="hours" className="gap-2">
            <ClockIcon className="size-4" />
            Business Hours
          </TabsTrigger>
        </TabsList>

        {/* ===== Profile Tab ===== */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your business information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {saveError && (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircleIcon className="size-4 mt-0.5 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}
              {savedOk && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckIcon className="size-4" />
                  Changes saved successfully.
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your business name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourbusiness.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="UTC"
                />
                <p className="text-xs text-muted-foreground">
                  Used for scheduling and business hours display.
                </p>
              </div>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    {isDeleting ? (
                      <>
                        <Loader2Icon className="mr-2 size-4 animate-spin" />
                        Deleting…
                      </>
                    ) : (
                      'Delete Account'
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All your data including the
                      knowledge base, configuration, and conversation history will
                      be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, delete my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Billing Tab ===== */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                Manage your subscription and billing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingConfig ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between rounded-xl border p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                        <SparklesIcon className="size-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold">{plan.name}</h3>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            Active
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">${plan.price}</p>
                      <p className="text-sm text-muted-foreground">/month</p>
                    </div>
                  </div>

                  {/* Plan Features */}
                  <div>
                    <h4 className="mb-3 text-sm font-medium">Included in your plan:</h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          <CheckIcon className="size-4 text-primary shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {currentPlan !== 'pro' && (
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
                      <h4 className="font-semibold">Upgrade for more power</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {currentPlan === 'free'
                          ? 'Upgrade to Starter for managed AI and 500 conversations/month.'
                          : 'Upgrade to Pro for unlimited conversations, custom CSS, and priority support.'}
                      </p>
                      <Button className="mt-4 gap-2">
                        Upgrade Plan
                        <ArrowRightIcon className="size-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Business Hours Tab ===== */}
        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>
                Set your availability schedule. The AI agent will only offer
                appointments during these hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {days.map((day, index) => {
                  const isWeekday = index >= 1 && index <= 5
                  return (
                    <div
                      key={day}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-2.5 rounded-full ${
                            isWeekday ? 'bg-emerald-500' : 'bg-gray-400'
                          }`}
                        />
                        <span className="text-sm font-medium w-24">{day}</span>
                      </div>
                      {isWeekday ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Input
                            type="time"
                            defaultValue="09:00"
                            className="w-28 text-center"
                          />
                          <span className="text-muted-foreground">to</span>
                          <Input
                            type="time"
                            defaultValue="17:00"
                            className="w-28 text-center"
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Closed</span>
                      )}
                    </div>
                  )
                })}
              </div>
              <Button className="mt-4">Save Business Hours</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-16">
          <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  )
}
