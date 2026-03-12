import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAuth, getDemoUser } from '@/lib/auth'
import { tenantConfigSchema } from '@/lib/validations'
import { encrypt, decrypt } from '@/lib/encryption'
import { env } from '@/lib/env'

export async function GET(req: NextRequest) {
  try {
    // Authentication
    let tenantId: string
    let useAdmin = false

    if (env.ENABLE_DEMO_MODE) {
      tenantId = getDemoUser().tenantId
      useAdmin = true
    } else {
      const { error, tenantId: authTenantId } = await requireAuth(req)
      if (error) return error
      tenantId = authTenantId!
    }

    const supabase = useAdmin ? createAdminClient() : await createClient()

    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single()

    if (error) {
      console.error('Error fetching tenant config:', error)
      return NextResponse.json(
        { error: 'Failed to fetch configuration' },
        { status: 500 }
      )
    }

    // Never expose encrypted API keys
    const { api_key_encrypted, google_calendar_refresh_token, ...safeData } = data || {}

    return NextResponse.json({
      config: {
        ...safeData,
        hasApiKey: !!api_key_encrypted,
        hasGoogleRefreshToken: !!google_calendar_refresh_token,
      }
    })
  } catch (error) {
    console.error('Tenant config fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Authentication
    let tenantId: string
    let useAdmin = false

    if (env.ENABLE_DEMO_MODE) {
      tenantId = getDemoUser().tenantId
      useAdmin = true
    } else {
      const { error, tenantId: authTenantId } = await requireAuth(req)
      if (error) return error
      tenantId = authTenantId!
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = tenantConfigSchema.parse(body)

    const supabase = useAdmin ? createAdminClient() : await createClient()

    // Build update object
    const updateData: Record<string, any> = {}

    if (validatedData.name) updateData.name = validatedData.name
    if (validatedData.planType) updateData.plan_type = validatedData.planType
    if (validatedData.apiProvider) updateData.api_provider = validatedData.apiProvider
    if (validatedData.widgetGreeting) updateData.widget_greeting = validatedData.widgetGreeting

    // Encrypt API key if provided
    if (validatedData.apiKey) {
      updateData.api_key_encrypted = encrypt(validatedData.apiKey)
    }

    const { data, error } = await supabase
      .from('tenants')
      .update(updateData)
      .eq('id', tenantId)
      .select()
      .single()

    if (error) {
      console.error('Error updating tenant config:', error)
      return NextResponse.json(
        { error: 'Failed to update configuration' },
        { status: 500 }
      )
    }

    // Never expose encrypted API keys
    const { api_key_encrypted, google_calendar_refresh_token, ...safeData } = data || {}

    return NextResponse.json({
      success: true,
      config: {
        ...safeData,
        hasApiKey: !!api_key_encrypted,
        hasGoogleRefreshToken: !!google_calendar_refresh_token,
      },
      message: 'Configuration updated successfully',
    })
  } catch (error) {
    console.error('Tenant config update error:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// REMOVED: POST endpoint that exposed API keys
// For server-side API key retrieval, access the database directly with admin client
// Never expose decrypted API keys to client-side code
