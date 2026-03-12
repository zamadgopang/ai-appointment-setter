'use client'

import * as React from 'react'
import {
  BarChart3Icon,
  MessageSquareIcon,
  CalendarCheckIcon,
  TrendingUpIcon,
  MessagesSquareIcon,
  Loader2Icon,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'

type AnalyticsData = {
  summary: {
    totalConversations: number
    totalAppointments: number
    totalMessages: number
    conversionRate: number
    avgMessagesPerConversation: number
  }
  conversationsByStatus: Record<string, number>
  appointmentsByStatus: Record<string, number>
  dailyConversations: { date: string; count: number }[]
}

const statCards = [
  {
    key: 'totalConversations' as const,
    label: 'Total Conversations',
    icon: MessageSquareIcon,
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    key: 'totalAppointments' as const,
    label: 'Appointments Booked',
    icon: CalendarCheckIcon,
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    key: 'conversionRate' as const,
    label: 'Conversion Rate',
    icon: TrendingUpIcon,
    color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    suffix: '%',
  },
  {
    key: 'avgMessagesPerConversation' as const,
    label: 'Avg Messages / Chat',
    icon: MessagesSquareIcon,
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
]

export default function AnalyticsPage() {
  const [data, setData] = React.useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics')
        if (!res.ok) throw new Error('Failed to fetch')
        const json = await res.json()
        setData(json)
      } catch {
        // Show empty state on error
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track performance metrics and insights for your AI agent.
          </p>
        </div>
        <div className="flex items-center justify-center py-16">
          <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!data || data.summary.totalConversations === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track performance metrics and insights for your AI agent.
          </p>
        </div>
        <Empty className="min-h-[400px] border rounded-xl">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BarChart3Icon />
            </EmptyMedia>
            <EmptyTitle>No analytics data yet</EmptyTitle>
            <EmptyDescription>
              Analytics will be available once your AI agent starts having
              conversations. Embed the widget on your website to get started.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  const maxDailyCount = Math.max(...data.dailyConversations.map((d) => d.count), 1)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track performance metrics and insights for your AI agent.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.key}>
            <CardContent className="flex items-center gap-4 p-4">
              <div
                className={`flex size-12 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon className="size-6" />
              </div>
              <div>
                <p className="text-3xl font-bold animate-count-up">
                  {data.summary[stat.key]}
                  {stat.suffix || ''}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Conversations Over Time — CSS-only bar chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conversations (Last 30 Days)</CardTitle>
            <CardDescription>Daily conversation volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-[2px] h-40">
              {data.dailyConversations.map((day) => (
                <div
                  key={day.date}
                  className="group relative flex-1 flex flex-col justify-end"
                >
                  <div
                    className="w-full rounded-t bg-primary/80 transition-colors hover:bg-primary min-h-[2px]"
                    style={{
                      height: `${Math.max((day.count / maxDailyCount) * 100, 2)}%`,
                    }}
                  />
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                    <div className="rounded bg-foreground px-2 py-1 text-xs text-background whitespace-nowrap">
                      {day.count} chats · {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appointment Status</CardTitle>
            <CardDescription>Breakdown of appointment states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(data.appointmentsByStatus).map(([status, count]) => {
              const total = Object.values(data.appointmentsByStatus).reduce((a, b) => a + b, 0)
              const pct = total > 0 ? Math.round((count / total) * 100) : 0
              const colors: Record<string, string> = {
                scheduled: 'bg-blue-500',
                confirmed: 'bg-emerald-500',
                completed: 'bg-primary',
                cancelled: 'bg-destructive',
              }
              return (
                <div key={status} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize font-medium">{status}</span>
                    <span className="text-muted-foreground">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all ${colors[status] || 'bg-primary'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}

            {data.summary.totalAppointments === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No appointments recorded yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Conversation Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Conversation Status Overview</CardTitle>
            <CardDescription>Current distribution of conversation states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {Object.entries(data.conversationsByStatus).map(([status, count]) => {
                const colors: Record<string, string> = {
                  active: 'border-emerald-500/30 bg-emerald-500/5',
                  closed: 'border-gray-500/30 bg-gray-500/5',
                  archived: 'border-amber-500/30 bg-amber-500/5',
                }
                const dotColors: Record<string, string> = {
                  active: 'bg-emerald-500',
                  closed: 'bg-gray-500',
                  archived: 'bg-amber-500',
                }
                return (
                  <div
                    key={status}
                    className={`rounded-xl border p-4 ${colors[status] || ''}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`size-2 rounded-full ${dotColors[status] || 'bg-primary'}`} />
                      <span className="text-sm font-medium capitalize">{status}</span>
                    </div>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
