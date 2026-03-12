'use client'

import * as React from 'react'
import {
  MessageSquareIcon,
  SearchIcon,
  Loader2Icon,
  UserIcon,
  CalendarIcon,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'

type Conversation = {
  id: string
  visitor_name: string | null
  visitor_email: string | null
  status: string
  created_at: string
  updated_at: string
  messages: { count: number }[]
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  closed: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
  archived: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
}

export default function ConversationsPage() {
  const [conversations, setConversations] = React.useState<Conversation[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [total, setTotal] = React.useState(0)

  const fetchConversations = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (statusFilter !== 'all') params.set('status', statusFilter)

      const res = await fetch(`/api/conversations?${params}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setConversations(data.conversations || [])
      setTotal(data.total || 0)
    } catch {
      // Silently handle errors - show empty state
      setConversations([])
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, statusFilter])

  React.useEffect(() => {
    const timer = setTimeout(fetchConversations, 300)
    return () => clearTimeout(timer)
  }, [fetchConversations])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Conversations
        </h1>
        <p className="text-muted-foreground">
          View and manage chat conversations with your visitors.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquareIcon className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{total}</p>
              <p className="text-xs text-muted-foreground">Total Conversations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <div className="size-2.5 rounded-full bg-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {conversations.filter((c) => c.status === 'active').length}
              </p>
              <p className="text-xs text-muted-foreground">Active Now</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gray-500/10">
              <CalendarIcon className="size-5 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {conversations.filter((c) => {
                  const d = new Date(c.created_at)
                  const now = new Date()
                  return d.toDateString() === now.toDateString()
                }).length}
              </p>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Conversation List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : conversations.length === 0 ? (
        <Empty className="min-h-[400px] border rounded-xl">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageSquareIcon />
            </EmptyMedia>
            <EmptyTitle>No conversations yet</EmptyTitle>
            <EmptyDescription>
              When visitors chat with your AI agent, their conversations will
              appear here. Embed the widget on your website to get started.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <Card
              key={conv.id}
              className="transition-all hover:shadow-md hover:border-primary/30 cursor-pointer"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-secondary">
                  <UserIcon className="size-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">
                      {conv.visitor_name || 'Anonymous Visitor'}
                    </p>
                    <Badge
                      variant="secondary"
                      className={statusColors[conv.status] || ''}
                    >
                      {conv.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.visitor_email || 'No email provided'}
                  </p>
                </div>
                <div className="hidden sm:flex flex-col items-end text-sm text-muted-foreground">
                  <span>{conv.messages?.[0]?.count || 0} messages</span>
                  <span className="text-xs">
                    {new Date(conv.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
