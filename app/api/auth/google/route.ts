import { NextResponse } from 'next/server'
import { env } from '@/lib/env'

/**
 * GET /api/auth/google
 * Initiates the Google OAuth 2.0 flow for Calendar access.
 * Requires GOOGLE_CLIENT_ID and GOOGLE_REDIRECT_URI to be set.
 */
export async function GET() {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_REDIRECT_URI) {
    return NextResponse.json(
      { error: 'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_REDIRECT_URI.' },
      { status: 503 }
    )
  }

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
    // state could include an anti-CSRF token in production;
    // keep simple for now and validate on callback
    state: 'calendar_connect',
  })

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

  return NextResponse.redirect(authUrl)
}
