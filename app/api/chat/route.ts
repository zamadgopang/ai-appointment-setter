import { streamText, convertToModelMessages, tool } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

// RAG: Retrieve relevant knowledge from database
async function retrieveKnowledge(
  query: string,
  tenantId: string
): Promise<string[]> {
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
  try {
    const { messages } = await req.json()

    // For demo purposes, skip knowledge retrieval to avoid tenant ID issues
    // In production, this would come from auth session
    const context = ''

    const systemPrompt = `You are a helpful AI appointment setter assistant. Your role is to:
1. Answer questions about the business using the provided knowledge base
2. Help schedule appointments when requested
3. Be professional, friendly, and concise

${context}

If you don't have specific information to answer a question, politely let the user know and offer to help with something else.`

    const result = streamText({
      model: 'openai/gpt-4o-mini',
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
  } catch (error) {
    console.error('Chat API error:', error)

    // Check if it's an AI Gateway billing error
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    if (
      errorMessage.includes('credit card') ||
      errorMessage.includes('customer_verification')
    ) {
      return Response.json(
        {
          error:
            'AI service requires account verification. Please add a credit card to your Vercel account to unlock free AI credits.',
          type: 'billing_required',
        },
        { status: 402 }
      )
    }

    return Response.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    )
  }
}
