import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAuth, getDemoUser, isDemoUser } from '@/lib/auth'
import { knowledgeDocumentSchema, uuidSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/rate-limit'
import { env } from '@/lib/env'

export async function POST(req: NextRequest) {
  try {
    // Authentication
    let tenantId: string
    let userId: string
    let useAdmin = false

    if (await isDemoUser(req)) {
      const demo = getDemoUser()
      tenantId = demo.tenantId
      userId = demo.id
      useAdmin = true  // Use admin client to bypass RLS in demo mode
    } else {
      const { error, tenantId: authTenantId, user } = await requireAuth(req)
      if (error) return error
      tenantId = authTenantId!
      userId = user!.id
    }

    // Rate limiting
    const rateLimitResult = rateLimit(`knowledge-upload:${userId}`, 10, 60000) // 10 uploads per minute
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: rateLimitResult.reset },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = knowledgeDocumentSchema.parse(body)

    // Use admin client in demo mode to bypass RLS
    const supabase = useAdmin ? createAdminClient() : await createClient()

    // Ensure demo tenant exists before inserting documents
    if (useAdmin) {
      await supabase
        .from('tenants')
        .upsert({ id: tenantId, name: 'Demo Business' }, { onConflict: 'id', ignoreDuplicates: true })
    }

    // Insert the knowledge document
    const { data, error } = await supabase
      .from('business_knowledge')
      .insert({
        tenant_id: tenantId,
        file_name: validatedData.fileName,
        content: validatedData.content,
        file_size: validatedData.fileSize ?? null,
        file_type: validatedData.fileType ?? null,
      })
      .select('id, file_name, file_size, file_type, created_at')
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
      document: data,
      message: 'Document uploaded successfully',
    })
  } catch (error) {
    console.error('Knowledge upload error:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.message },
        { status: 400 }
      )
    }

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

export async function DELETE(req: NextRequest) {
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

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    const validatedId = uuidSchema.parse(id)
    const supabase = useAdmin ? createAdminClient() : await createClient()

    // Delete only if document belongs to this tenant
    const { error } = await supabase
      .from('business_knowledge')
      .delete()
      .eq('id', validatedId)
      .eq('tenant_id', tenantId)

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

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid document ID' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    const { data, error } = await supabase
      .from('business_knowledge')
      .select('id, file_name, file_size, file_type, created_at')
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
