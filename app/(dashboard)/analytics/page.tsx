import { BarChart3Icon } from 'lucide-react'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Analytics
        </h1>
        <p className="text-muted-foreground">
          Track performance metrics and insights for your AI agent.
        </p>
      </div>

      <Empty className="min-h-[400px] border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BarChart3Icon />
          </EmptyMedia>
          <EmptyTitle>No analytics data yet</EmptyTitle>
          <EmptyDescription>
            Analytics will be available once your AI agent starts having
            conversations.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
