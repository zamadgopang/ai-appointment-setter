'use client'

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KnowledgeBaseCard } from '@/components/agent/knowledge-base-card'
import { CalendarIntegrationCard } from '@/components/agent/calendar-integration-card'
import { ApiConfigCard } from '@/components/agent/api-config-card'
import { WidgetPreviewCard } from '@/components/agent/widget-preview-card'
import { ChatWidget } from '@/components/agent/chat-widget'

export default function AgentSetupPage() {
  const [greeting, setGreeting] = React.useState(
    'Hi there! How can I help you today?'
  )
  const [showWidget, setShowWidget] = React.useState(false)

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

      <Tabs defaultValue="knowledge" className="space-y-6">
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
    </div>
  )
}
