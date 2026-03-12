import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAuth, getDemoUser, isDemoUser } from '@/lib/auth'
import { env } from '@/lib/env'

/**
 * GET /api/analytics
 * Returns aggregated analytics data for the tenant
 */
export async function GET(req: NextRequest) {
  try {
    let tenantId: string
    let useAdmin = false

    if (await isDemoUser(req)) {
      tenantId = getDemoUser().tenantId
      useAdmin = true
    } else {
      const { error, tenantId: authTenantId } = await requireAuth(req)
      if (error) return error
      tenantId = authTenantId!
    }

    const supabase = useAdmin ? createAdminClient() : await createClient()

    // Fetch all stats in parallel
    const [conversationsResult, appointmentsResult, messagesResult, recentConversations] = await Promise.all([
      // Total conversations
      supabase
        .from('conversations')
        .select('id, created_at, status', { count: 'exact' })
        .eq('tenant_id', tenantId),

      // Total appointments
      supabase
        .from('appointments')
        .select('id, created_at, status, appointment_date', { count: 'exact' })
        .eq('tenant_id', tenantId),

      // Total messages
      supabase
        .from('messages')
        .select('id, created_at, role', { count: 'exact' })
        .in('conversation_id',
          supabase
            .from('conversations')
            .select('id')
            .eq('tenant_id', tenantId) as any
        ),

      // Recent conversations (last 30 days) for chart
      supabase
        .from('conversations')
        .select('created_at')
        .eq('tenant_id', tenantId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true }),
    ])

    // Build daily conversations chart data (last 30 days)
    const dailyConversations: Record<string, number> = {}
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const key = date.toISOString().split('T')[0]
      dailyConversations[key] = 0
    }

    if (recentConversations.data) {
      for (const conv of recentConversations.data) {
        const key = new Date(conv.created_at).toISOString().split('T')[0]
        if (dailyConversations[key] !== undefined) {
          dailyConversations[key]++
        }
      }
    }

    // Calculate stats
    const totalConversations = conversationsResult.count || 0
    const totalAppointments = appointmentsResult.count || 0
    const totalMessages = messagesResult.count || 0

    // Appointment statuses
    const appointmentsByStatus: Record<string, number> = { scheduled: 0, confirmed: 0, cancelled: 0, completed: 0 }
    if (appointmentsResult.data) {
      for (const apt of appointmentsResult.data) {
        if (appointmentsByStatus[apt.status] !== undefined) {
          appointmentsByStatus[apt.status]++
        }
      }
    }

    // Conversation statuses
    const conversationsByStatus: Record<string, number> = { active: 0, closed: 0, archived: 0 }
    if (conversationsResult.data) {
      for (const conv of conversationsResult.data) {
        if (conversationsByStatus[conv.status] !== undefined) {
          conversationsByStatus[conv.status]++
        }
      }
    }

    // Conversion rate (appointments / conversations)
    const conversionRate = totalConversations > 0
      ? Math.round((totalAppointments / totalConversations) * 100)
      : 0

    return NextResponse.json({
      summary: {
        totalConversations,
        totalAppointments,
        totalMessages,
        conversionRate,
        avgMessagesPerConversation:
          totalConversations > 0
            ? Math.round(totalMessages / totalConversations)
            : 0,
      },
      conversationsByStatus,
      appointmentsByStatus,
      dailyConversations: Object.entries(dailyConversations).map(([date, count]) => ({
        date,
        count,
      })),
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
