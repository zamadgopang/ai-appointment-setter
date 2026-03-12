import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAuth, getDemoUser } from '@/lib/auth'

/**
 * GET /api/auth/google/callback?code=...&state=...
 * Exchanges the authorization code for tokens, stores the refresh token,
 * and redirects back to the calendar tab.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const appUrl = env.NEXT_PUBLIC_APP_URL || 'https://app.zamdev.me'
  const calendarTab = `${appUrl}/agent-setup?tab=calendar`

  // User denied access or OAuth error
  if (error || !code) {
    const desc = searchParams.get('error_description') ?? error ?? 'Unknown OAuth error'
    return NextResponse.redirect(
      `${calendarTab}&oauth_error=${encodeURIComponent(desc)}`
    )
  }

  // Validate state to prevent CSRF
  if (state !== 'calendar_connect') {
    return NextResponse.redirect(`${calendarTab}&oauth_error=invalid_state`)
  }

  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_REDIRECT_URI) {
    return NextResponse.redirect(`${calendarTab}&oauth_error=not_configured`)
  }

  // Exchange code for tokens
  let tokens: { refresh_token?: string; access_token?: string; error?: string }
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }).toString(),
    })
    tokens = await tokenRes.json()
  } catch {
    return NextResponse.redirect(`${calendarTab}&oauth_error=token_exchange_failed`)
  }

  if (tokens.error || !tokens.refresh_token) {
    return NextResponse.redirect(
      `${calendarTab}&oauth_error=${encodeURIComponent(tokens.error ?? 'no_refresh_token')}`
    )
  }

  // Fetch the user's email address from Google
  let calendarEmail: string | null = null
  try {
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const userInfo = await userRes.json()
    calendarEmail = userInfo.email ?? null
  } catch {
    // Non-fatal — email is informational only
  }

  // Determine tenant ID
  let tenantId: string
  const isDemo = env.ENABLE_DEMO_MODE
  if (isDemo) {
    tenantId = getDemoUser().tenantId
  } else {
    const { error: authErr, tenantId: authTenantId } = await requireAuth(req)
    if (authErr || !authTenantId) {
      return NextResponse.redirect(`${calendarTab}&oauth_error=unauthorized`)
    }
    tenantId = authTenantId
  }

  // Persist the refresh token (and optional email) in the tenants table
  const supabase = createAdminClient()
  const updateData: Record<string, string> = {
    google_calendar_refresh_token: tokens.refresh_token,
  }
  if (calendarEmail) updateData.google_calendar_email = calendarEmail

  const { error: dbError } = await supabase
    .from('tenants')
    .update(updateData)
    .eq('id', tenantId)

  if (dbError) {
    console.error('Failed to store Google refresh token:', dbError)
    return NextResponse.redirect(`${calendarTab}&oauth_error=db_error`)
  }

  return NextResponse.redirect(`${calendarTab}&oauth_success=true`)
}
