import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimitMap = new Map<string, number[]>()

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isLoginPage = req.nextUrl.pathname.startsWith('/login')
  const isApiAuth = req.nextUrl.pathname.startsWith('/api/auth')
  const isPublicFile = req.nextUrl.pathname.match(
    /\.(svg|png|jpg|jpeg|gif|webp|ico|json|js|css)$/
  )
  const isApiFiles = req.nextUrl.pathname.startsWith('/api/files')

  // Simple In-Memory Rate Limiting for API routes
  // (Works best in standalone Node.js. For edge/serverless, use Redis)
  if (req.nextUrl.pathname.startsWith('/api/') && !isApiFiles) {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const requestLog = rateLimitMap.get(ip) || []
    
    // Allow 100 requests per 1 minute window
    const windowStart = now - 60 * 1000
    const currentRequests = requestLog.filter(time => time > windowStart)
    
    if (currentRequests.length >= 100) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
    }
    
    currentRequests.push(now)
    rateLimitMap.set(ip, currentRequests)
  }

  if (isApiAuth || isPublicFile) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn && !isLoginPage) {
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = new URL('/login', req.nextUrl.origin)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if already logged in and on login page
  if (isLoggedIn && isLoginPage) {
    const dashboardUrl = new URL('/dashboard', req.nextUrl.origin)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icon.*|apple-icon.*|worker.*|sw.js).*)',
  ],
}
