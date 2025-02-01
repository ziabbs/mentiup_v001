import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    '/onboarding/:path*',
    '/auth/:path*',
    '/'
  ]
}

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  
  // Oturum ve profil bilgilerini al
  const { data: { session } } = await supabase.auth.getSession()
  const { data: profile } = session ? await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', session.user.id)
    .single() : { data: null }

  // Korumalı rotalar
  const protectedRoutes = [
    '/onboarding/mentorship-type',
    '/onboarding/career-development',
    '/onboarding/senior-career',
    '/onboarding/startup',
    '/onboarding/senior-startup'
  ]

  // Public rotalar
  const publicRoutes = [
    '/auth',
    '/auth/forgot-password',
    '/auth/reset-password',
  ]

  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  const isRootRoute = request.nextUrl.pathname === '/'

  // Ana sayfaya erişmeye çalışıyorsa
  if (isRootRoute) {
    // Oturum yoksa onboarding'e yönlendir
    if (!session) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    // Oturum var ama onboarding tamamlanmamışsa mentorship-type'a yönlendir
    if (session && !profile?.onboarding_completed) {
      return NextResponse.redirect(new URL('/onboarding/mentorship-type', request.url))
    }
  }

  // Oturum yoksa ve korumalı rotaya erişmeye çalışıyorsa
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  // Oturum varsa ve public rotaya erişmeye çalışıyorsa
  if (session && isPublicRoute) {
    if (profile?.onboarding_completed) {
      return NextResponse.redirect(new URL('/', request.url))
    } else {
      return NextResponse.redirect(new URL('/onboarding/mentorship-type', request.url))
    }
  }

  return res
}
