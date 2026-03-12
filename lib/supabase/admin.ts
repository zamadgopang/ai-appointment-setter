import { createClient } from '@supabase/supabase-js'
import { env } from '../env'

/**
 * Creates a Supabase admin client using the service role key
 * This bypasses Row Level Security - use only for server-side operations
 * where RLS-protected data needs to be accessed without user authentication
 */
export function createAdminClient() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin client')
  }

  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
