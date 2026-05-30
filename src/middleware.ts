import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isLoginPage = req.nextUrl.pathname.startsWith('/login')
  const isApiAuth = req.nextUrl.pathname.startsWith('/api/auth')
  const isPublicFile = req.nextUrl.pathname.match(
    /\.(svg|png|jpg|jpeg|gif|webp|ico|json|js|css)$/
  )
  const isApiFiles = req.nextUrl.pathname.startsWith('/api/files')

  // Allow public routes
  const isMigrateNow = req.nextUrl.pathname.startsWith('/api/migrate-now')
  if (isApiAuth || isPublicFile || isMigrateNow) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn && !isLoginPage) {
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
