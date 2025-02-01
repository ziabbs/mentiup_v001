import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

/**
 * Supabase admin client with service role access.
 * IMPORTANT: Only use this on the server side!
 * This client has admin privileges and should never be used on the client side.
 */
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
