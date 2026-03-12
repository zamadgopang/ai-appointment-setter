import { streamText, convertToModelMessages, tool } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

// Helper to validate UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

// Create OpenAI provider instance
function getOpenAIModel() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set')
  }
  
  const openai = createOpenAI({
    apiKey,
  })
  
  return openai('gpt-4o-mini')
}

// RAG: Retrieve relevant knowledge from database
async function retrieveKnowledge(
  query: string,
  tenantId: string | null
): Promise<string[]> {
  // Skip if no valid tenant ID
  if (!tenantId || !isValidUUID(tenantId)) {
    return []
  }

  const supabase = await createClient()

  // For now, do a simple text search since we don't have vector embeddings set up
  // In production, you would use pgvector with embeddings
  const { data, error } = await supabase
    .from('business_knowledge')
    .select('content, file_name')
    .eq('tenant_id', tenantId)
    .limit(3)

  if (error || !data) {
    console.error('Error retrieving knowledge:', error)
    return []
  }

  return data.map((doc) => `[From ${doc.file_name}]: ${doc.content}`)
}

export async function POST(req: Request) {
  const { messages, tenantId: requestTenantId } = await req.json()

  // Use provided tenant ID or null for demo mode
  // In production, this would come from auth session
  const tenantId: string | null = requestTenantId || null

  // Get the last user message for RAG
  const lastUserMessage = messages
    .filter((m: { role: string }) => m.role === 'user')
    .pop()

  let context = ''

  if (lastUserMessage) {
    // Extract text from message parts
    const userQuery = lastUserMessage.parts
      ?.filter((p: { type: string }) => p.type === 'text')
      .map((p: { text: string }) => p.text)
      .join(' ')

    if (userQuery) {
      const relevantDocs = await retrieveKnowledge(userQuery, tenantId)
      if (relevantDocs.length > 0) {
        context = `\n\nRelevant information from knowledge base:\n${relevantDocs.join('\n\n')}`
      }
    }
  }

  const systemPrompt = `You are a helpful AI appointment setter assistant. Your role is to:
1. Answer questions about the business using the provided knowledge base
2. Help schedule appointments when requested
3. Be professional, friendly, and concise

${context}

If you don't have specific information to answer a question, politely let the user know and offer to help with something else.`

  const result = streamText({
    model: getOpenAIModel(),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools: {
      scheduleAppointment: tool({
        description:
          'Schedule an appointment for the user. Use this when the user wants to book a meeting or appointment.',
        inputSchema: z.object({
          date: z.string().describe('The preferred date for the appointment'),
          time: z.string().describe('The preferred time for the appointment'),
          name: z.string().describe('Name of the person booking'),
          email: z.string().email().describe('Email of the person booking'),
          purpose: z
            .string()
            .describe('Purpose or reason for the appointment'),
        }),
        execute: async ({ date, time, name, email, purpose }) => {
          // In production, this would integrate with Google Calendar via MCP
          // For now, return a confirmation
          return {
            success: true,
            message: `Appointment scheduled for ${name} on ${date} at ${time}. Purpose: ${purpose}. Confirmation sent to ${email}.`,
            appointmentId: `apt_${Date.now()}`,
          }
        },
      }),
      checkAvailability: tool({
        description:
          'Check available time slots for appointments on a specific date.',
        inputSchema: z.object({
          date: z.string().describe('The date to check availability for'),
        }),
        execute: async ({ date }) => {
          // In production, this would check Google Calendar
          // For demo, return mock availability
          return {
            date,
            availableSlots: [
              '9:00 AM',
              '10:00 AM',
              '11:00 AM',
              '2:00 PM',
              '3:00 PM',
              '4:00 PM',
            ],
          }
        },
      }),
    },
  })

  return result.toUIMessageStreamResponse()
}
