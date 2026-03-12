import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAuth, getDemoUser } from '@/lib/auth'

/**
 * DELETE /api/auth/google/disconnect
 * Removes the stored Google Calendar refresh token for the current tenant,
 * effectively disconnecting the calendar integration.
 */
export async function DELETE(req: NextRequest) {
  try {
    let tenantId: string

    if (env.ENABLE_DEMO_MODE) {
      tenantId = getDemoUser().tenantId
    } else {
      const { error, tenantId: authTenantId } = await requireAuth(req)
      if (error) return error
      tenantId = authTenantId!
    }

    const supabase = createAdminClient()

    const { error: dbError } = await supabase
      .from('tenants')
      .update({
        google_calendar_refresh_token: null,
        google_calendar_email: null,
      })
      .eq('id', tenantId)

    if (dbError) {
      console.error('Failed to remove Google refresh token:', dbError)
      return NextResponse.json(
        { error: 'Failed to disconnect calendar' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Google Calendar disconnected' })
  } catch (err) {
    console.error('Calendar disconnect error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
