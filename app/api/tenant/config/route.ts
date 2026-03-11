import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Demo tenant UUID - in production this would come from auth session
const DEMO_TENANT_ID = '00000000-0000-0000-0000-000000000001'

export async function POST(req: Request) {
  try {
    const { planType, apiProvider, apiKey } = await req.json()

    const supabase = await createClient()
    const tenantId = DEMO_TENANT_ID

    // Update tenant configuration
    const { error } = await supabase
      .from('tenants')
      .update({
        plan_type: planType,
        api_provider: apiProvider,
        // In production, encrypt the API key before storing
        api_key_encrypted: apiKey ? `encrypted_${apiKey}` : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tenantId)

    if (error) {
      console.error('Error updating tenant config:', error)
      return NextResponse.json(
        { error: 'Failed to update configuration' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Configuration updated successfully',
    })
  } catch (error) {
    console.error('Tenant config error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const tenantId = 'demo-tenant'

    const { data, error } = await supabase
      .from('tenants')
      .select('plan_type, api_provider, google_calendar_connected, widget_greeting')
      .eq('id', tenantId)
      .single()

    if (error) {
      console.error('Error fetching tenant config:', error)
      return NextResponse.json(
        { error: 'Failed to fetch configuration' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      planType: data.plan_type,
      apiProvider: data.api_provider,
      calendarConnected: data.google_calendar_connected,
      widgetGreeting: data.widget_greeting,
    })
  } catch (error) {
    console.error('Tenant config fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
