import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

/**
 * Creates a Supabase client for server components.
 * This client is safe to use in Server Components and API routes.
 */
export const createServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({
    cookies: () => cookieStore
  })
}
