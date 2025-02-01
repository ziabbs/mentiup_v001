import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

export function withRoles(requiredRoles: string[]) {
  return async function middleware(request: NextRequest) {
    try {
      const supabase = createMiddlewareClient<Database>({ req: request, res: NextResponse.next() })
      
      // Get the user's session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        const redirectUrl = new URL('/auth/signin', request.url)
        redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Get user's roles
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', session.user.id)

      if (!userRoles) {
        return new NextResponse(
          JSON.stringify({ success: false, message: 'Unauthorized' }),
          { status: 403, headers: { 'content-type': 'application/json' } }
        )
      }

      // Check if user has any of the required roles
      const hasRequiredRole = userRoles.some(ur => 
        requiredRoles.includes((ur.roles as any).name)
      )

      if (!hasRequiredRole) {
        return new NextResponse(
          JSON.stringify({ success: false, message: 'Insufficient permissions' }),
          { status: 403, headers: { 'content-type': 'application/json' } }
        )
      }

      return NextResponse.next()
    } catch (e) {
      console.error('Role middleware error:', e)
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Internal server error' }),
        { status: 500, headers: { 'content-type': 'application/json' } }
      )
    }
  }
}
