import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Demo tenant UUID - in production this would come from auth session
const DEMO_TENANT_ID = '00000000-0000-0000-0000-000000000001'
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000'

// Maximum file size in bytes (10MB)
const MAX_CONTENT_SIZE = 10 * 1024 * 1024

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { fileName, content } = body

    // Validate required fields
    if (!fileName || typeof fileName !== 'string') {
      return NextResponse.json(
        { error: 'fileName is required and must be a string' },
        { status: 400 }
      )
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'content is required and must be a string' },
        { status: 400 }
      )
    }

    // Validate file size
    if (content.length > MAX_CONTENT_SIZE) {
      return NextResponse.json(
        { error: 'Content exceeds maximum size of 10MB' },
        { status: 400 }
      )
    }

    // Sanitize filename
    const sanitizedFileName = fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .substring(0, 255)

    const supabase = await createClient()

    // For demo purposes, use a valid UUID tenant ID
    // In production, this would come from the authenticated user's session
    const tenantId = DEMO_TENANT_ID

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
        user_id: DEMO_USER_ID,
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
        file_name: sanitizedFileName,
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
    
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper to validate UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
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

    // Validate UUID format to prevent injection
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Invalid document ID format' },
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
    const tenantId = DEMO_TENANT_ID

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
