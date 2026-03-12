'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KnowledgeBaseCard } from '@/components/agent/knowledge-base-card'
import { CalendarIntegrationCard } from '@/components/agent/calendar-integration-card'
import { ApiConfigCard } from '@/components/agent/api-config-card'
import { WidgetPreviewCard } from '@/components/agent/widget-preview-card'
import { ChatWidget } from '@/components/agent/chat-widget'

const VALID_TABS = ['knowledge', 'calendar', 'api', 'widget'] as const
type TabValue = typeof VALID_TABS[number]

function AgentSetupContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const defaultTab: TabValue = VALID_TABS.includes(tabParam as TabValue)
    ? (tabParam as TabValue)
    : 'knowledge'

  const [greeting, setGreeting] = React.useState(
    'Hi there! How can I help you today?'
  )
  const [showWidget, setShowWidget] = React.useState(false)

  return (
    <>
      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="api">API Settings</TabsTrigger>
          <TabsTrigger value="widget">Widget</TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge" className="space-y-6">
          <KnowledgeBaseCard />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <CalendarIntegrationCard />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <ApiConfigCard />
        </TabsContent>

        <TabsContent value="widget" className="space-y-6">
          <WidgetPreviewCard
            greeting={greeting}
            onGreetingChange={setGreeting}
            onPreview={() => setShowWidget(true)}
          />
        </TabsContent>
      </Tabs>

      {showWidget && (
        <ChatWidget greeting={greeting} onClose={() => setShowWidget(false)} />
      )}
    </>
  )
}

export default function AgentSetupPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Agent Setup
        </h1>
        <p className="text-muted-foreground">
          Configure your AI appointment setter with knowledge base, calendar
          integration, and chat widget settings.
        </p>
      </div>

      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <AgentSetupContent />
      </Suspense>
    </div>
  )
}
