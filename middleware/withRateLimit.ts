import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60 // 60 requests per minute

interface RateLimitConfig {
  windowMs?: number
  max?: number
  message?: string
}

export function withRateLimit(config: RateLimitConfig = {}) {
  const windowMs = config.windowMs || RATE_LIMIT_WINDOW
  const max = config.max || MAX_REQUESTS_PER_WINDOW
  const message = config.message || 'Too many requests, please try again later.'

  const requests = new Map<string, { count: number; resetTime: number }>()

  return async function middleware(request: NextRequest) {
    try {
      const supabase = createMiddlewareClient<Database>({ req: request, res: NextResponse.next() })
      const { data: { session } } = await supabase.auth.getSession()

      // Get identifier (user ID or IP address)
      const forwardedFor = request.headers.get('x-forwarded-for')
      const clientIp = forwardedFor ? forwardedFor.split(',')[0] : request.headers.get('x-real-ip')
      const identifier = session?.user?.id || clientIp || 'anonymous'
      const now = Date.now()

      // Get or create rate limit entry
      let rateLimit = requests.get(identifier)
      if (!rateLimit || now > rateLimit.resetTime) {
        rateLimit = {
          count: 0,
          resetTime: now + windowMs
        }
      }

      // Increment request count
      rateLimit.count++
      requests.set(identifier, rateLimit)

      // Check if rate limit exceeded
      if (rateLimit.count > max) {
        // Log rate limit violation
        await supabase.from('security_logs').insert({
          user_id: session?.user?.id || null,
          event_type: 'rate_limit_exceeded',
          ip_address: clientIp || null,
          user_agent: request.headers.get('user-agent') || null,
          details: {
            path: request.nextUrl.pathname,
            method: request.method,
            count: rateLimit.count,
            limit: max,
            window: windowMs
          }
        })

        return new NextResponse(
          JSON.stringify({ success: false, message }),
          { 
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': max.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimit.resetTime.toString(),
              'Retry-After': ((rateLimit.resetTime - now) / 1000).toString()
            }
          }
        )
      }

      // Add rate limit headers to response
      const response = NextResponse.next()
      response.headers.set('X-RateLimit-Limit', max.toString())
      response.headers.set('X-RateLimit-Remaining', (max - rateLimit.count).toString())
      response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString())

      return response
    } catch (e) {
      console.error('Rate limit middleware error:', e)
      return NextResponse.next()
    }
  }
}
