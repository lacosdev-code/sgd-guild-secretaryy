import { createClient } from '@supabase/supabase-js'

/**
 * Supabase admin client using the service role key.
 * ONLY use this in API routes / server-side code — NEVER on the client.
 * This bypasses RLS, so only use for trusted server-to-server operations.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable'
    )
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
