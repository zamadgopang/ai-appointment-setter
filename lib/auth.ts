import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { env } from './env';

/**
 * Get authenticated user from the request
 * Returns null if not authenticated
 */
export async function getAuthUser(request: NextRequest) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Get tenant ID for the authenticated user
 * In demo mode, returns a demo tenant ID
 * Otherwise, fetches from the database
 */
export async function getTenantId(userId: string): Promise<string | null> {
  // Demo mode fallback
  if (env.ENABLE_DEMO_MODE) {
    return '00000000-0000-0000-0000-000000000001';
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase
    .from('tenants')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.id;
}

/**
 * Require authentication for API routes
 * Returns 401 if not authenticated
 */
export async function requireAuth(request: NextRequest) {
  const user = await getAuthUser(request);

  if (!user) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      ),
      user: null,
      tenantId: null,
    };
  }

  const tenantId = await getTenantId(user.id);

  if (!tenantId) {
    return {
      error: NextResponse.json(
        { error: 'Forbidden', message: 'No tenant associated with user' },
        { status: 403 }
      ),
      user: null,
      tenantId: null,
    };
  }

  return {
    error: null,
    user,
    tenantId,
  };
}

/**
 * Demo mode helper - returns demo user info
 */
export function getDemoUser() {
  return {
    id: '00000000-0000-0000-0000-000000000000',
    email: 'demo@example.com',
    tenantId: '00000000-0000-0000-0000-000000000001',
  };
}

/**
 * Check if the current request is a demo session
 */
export async function isDemoUser(request?: NextRequest) {
  if (env.ENABLE_DEMO_MODE) return true;
  if (!request) return false;
  
  const cookieStore = await cookies();
  return cookieStore.get('demo_session')?.value === '1';
}
