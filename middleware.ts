import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip auth for API routes that should be publicly accessible (e.g., widget chat)
  const isPublicApiRoute = request.nextUrl.pathname.startsWith('/api/chat')
  
  // Update Supabase session for authenticated routes
  // This handles token refresh and cookie management
  if (!isPublicApiRoute) {
    try {
      return await updateSession(request)
    } catch {
      // If session refresh fails, continue without auth
      // The individual route handlers will check auth as needed
      return NextResponse.next()
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
