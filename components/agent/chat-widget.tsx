'use client'

import * as React from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import {
  MessageSquareIcon,
  XIcon,
  SendIcon,
  Loader2Icon,
  BotIcon,
  UserIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

type ChatWidgetProps = {
  greeting: string
  onClose: () => void
}

function getMessageText(message: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts || !Array.isArray(message.parts)) return ''
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text' && typeof p.text === 'string')
    .map((p) => p.text)
    .join('')
}

export function ChatWidget({ greeting, onClose }: ChatWidgetProps) {
  const [input, setInput] = React.useState('')
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const isStreaming = status === 'streaming' || status === 'submitted'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    sendMessage({ text: input })
    setInput('')
  }

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 overflow-hidden rounded-2xl border bg-card shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between bg-primary p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/20">
            <MessageSquareIcon className="size-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-medium text-primary-foreground">AI Assistant</p>
            <p className="text-xs text-primary-foreground/80">
              {isStreaming ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
          onClick={onClose}
        >
          <XIcon className="size-5" />
          <span className="sr-only">Close chat</span>
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="h-80" ref={scrollRef}>
        <div className="flex flex-col gap-4 p-4">
          {/* Greeting */}
          <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <BotIcon className="size-4 text-primary" />
            </div>
            <div className="rounded-lg rounded-tl-none bg-muted px-4 py-2">
              <p className="text-sm">{greeting}</p>
            </div>
          </div>

          {/* Chat Messages */}
          {messages.map((message) => {
            const text = getMessageText(message)
            if (!text) return null
            
            return (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' && 'flex-row-reverse'
                )}
              >
                <div
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full',
                    message.role === 'user'
                      ? 'bg-secondary'
                      : 'bg-primary/10'
                  )}
                >
                  {message.role === 'user' ? (
                    <UserIcon className="size-4 text-secondary-foreground" />
                  ) : (
                    <BotIcon className="size-4 text-primary" />
                  )}
                </div>
                <div
                  className={cn(
                    'max-w-[75%] rounded-lg px-4 py-2',
                    message.role === 'user'
                      ? 'rounded-tr-none bg-primary text-primary-foreground'
                      : 'rounded-tl-none bg-muted'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{text}</p>
                </div>
              </div>
            )
          })}

          {/* Loading indicator */}
          {isStreaming && messages.length > 0 && !getMessageText(messages[messages.length - 1]) && (
            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <BotIcon className="size-4 text-primary" />
              </div>
              <div className="rounded-lg rounded-tl-none bg-muted px-4 py-2">
                <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isStreaming}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isStreaming}
          >
            {isStreaming ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <SendIcon className="size-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
