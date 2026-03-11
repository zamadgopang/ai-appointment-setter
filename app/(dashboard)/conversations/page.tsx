import { MessageSquareIcon } from 'lucide-react'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'

export default function ConversationsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Conversations
        </h1>
        <p className="text-muted-foreground">
          View and manage chat conversations with your customers.
        </p>
      </div>

      <Empty className="min-h-[400px] border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageSquareIcon />
          </EmptyMedia>
          <EmptyTitle>No conversations yet</EmptyTitle>
          <EmptyDescription>
            When visitors chat with your AI agent, their conversations will
            appear here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
