import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { fileName, content } = await req.json()

    if (!fileName || !content) {
      return NextResponse.json(
        { error: 'fileName and content are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // For demo purposes, use a placeholder tenant ID
    // In production, this would come from the authenticated user's session
    const tenantId = 'demo-tenant'

    // First, ensure we have a tenant record (for demo purposes)
    const { data: existingTenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('id', tenantId)
      .single()

    if (!existingTenant) {
      // Create a demo tenant if it doesn't exist
      // In production, tenants would be created during user signup
      const { error: tenantError } = await supabase.from('tenants').insert({
        id: tenantId,
        user_id: '00000000-0000-0000-0000-000000000000', // Placeholder
        name: 'Demo Tenant',
        plan_type: 'managed',
      })

      if (tenantError) {
        console.error('Error creating tenant:', tenantError)
        // Continue anyway for demo
      }
    }

    // Insert the knowledge document
    const { data, error } = await supabase
      .from('business_knowledge')
      .insert({
        tenant_id: tenantId,
        file_name: fileName,
        content: content,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error inserting knowledge:', error)
      return NextResponse.json(
        { error: 'Failed to upload document' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      message: 'Document uploaded successfully',
    })
  } catch (error) {
    console.error('Knowledge upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('business_knowledge')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting knowledge:', error)
      return NextResponse.json(
        { error: 'Failed to delete document' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully',
    })
  } catch (error) {
    console.error('Knowledge delete error:', error)
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
      .from('business_knowledge')
      .select('id, file_name, created_at')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching knowledge:', error)
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      )
    }

    return NextResponse.json({ documents: data })
  } catch (error) {
    console.error('Knowledge fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
