'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

import Image from 'next/image'

// Map error messages to user-friendly text
function mapErrorMessage(message: string): string {
  if (message.includes('CredentialsSignin') || message.includes('credentials')) {
    return 'Email atau password salah. Periksa kembali dan coba lagi.'
  }
  if (message.includes('Too many')) {
    return 'Terlalu banyak percobaan login. Coba lagi dalam beberapa menit.'
  }
  return message
}

// ── Decorative divider ───────────────────────────────────────────────────────
function RankDivider() {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
        Authorized Access Only
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  )
}

// ── Eye icon for show/hide password ─────────────────────────────────────────
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  )
}

export default function LoginPage() {
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPwd, setShowPwd]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [loading, setLoading]     = useState(false)
  const router                    = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(mapErrorMessage(result.error))
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan tidak terduga.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">

      {/* ── Card ─────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-md">

        {/* ── Header: brand block ─────────────────────────────────────── */}
        <div
          className="rounded-t-2xl px-10 pt-10 pb-8 text-center"
          style={{ background: '#1B2E52' }}
        >
          {/* Crest / icon placeholder */}
          <div className="flex justify-center mb-5">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center border-2 bg-white"
              style={{ borderColor: '#C9A227' }}
            >
              <Image 
                src="https://ik.imagekit.io/Sgd/sgd.png?updatedAt=1771273258582" 
                alt="SGD Logo" 
                width={48}
                height={48}
                unoptimized
                className="w-12 h-12 object-contain" 
              />
            </div>
          </div>

          <h1
            className="text-2xl font-bold tracking-widest uppercase"
            style={{ color: '#C9A227', letterSpacing: '0.12em' }}
          >
            SGD COMMAND CENTER
          </h1>
          <p className="mt-2 text-xs tracking-[0.25em] uppercase font-medium text-blue-200/70">
            Internal Management Portal
          </p>
        </div>

        {/* ── Form body ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-b-2xl px-10 pb-10 pt-8 shadow-2xl">

          <RankDivider />

          {/* Error banner */}
          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-lg border text-sm flex items-start gap-3"
              style={{
                background: '#FDF2F0',
                borderColor: '#993C1D44',
                color: '#993C1D',
              }}
            >
              <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" noValidate>

            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: '#1B2E52' }}
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                placeholder="name@sgd-corp.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-charcoal placeholder-gray-400 text-sm
                           focus:outline-none focus:ring-2 transition-all bg-gray-50 focus:bg-white"
                style={{ '--tw-ring-color': '#C9A227' } as React.CSSProperties}
                onFocus={(e) => e.target.style.setProperty('--tw-ring-color', '#C9A227')}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: '#1B2E52' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-200 text-charcoal placeholder-gray-400 text-sm
                             focus:outline-none focus:ring-2 transition-all bg-gray-50 focus:bg-white"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPwd} />
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-sm tracking-widest uppercase
                         transition-all duration-200 flex justify-center items-center gap-2 mt-2
                         disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading ? '#1B2E5288' : '#1B2E52',
                color: '#C9A227',
              }}
              onMouseEnter={(e) => !loading && ((e.target as HTMLButtonElement).style.background = '#162544')}
              onMouseLeave={(e) => !loading && ((e.target as HTMLButtonElement).style.background = '#1B2E52')}
            >
              {loading ? (
                <>
                  <span
                    className="inline-block h-4 w-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: '#C9A227', borderTopColor: 'transparent' }}
                  />
                  <span>Authenticating…</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

        </div>


      </div>
    </div>
  )
}
