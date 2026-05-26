'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User, UserRole } from '@/types'

// ── Context shape ────────────────────────────────────────────────────────────
interface UserContextType {
  user: User | null
  role: UserRole | null
  loading: boolean
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// ── Provider ─────────────────────────────────────────────────────────────────
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [role, setRole]       = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const router                = useRouter()
  const supabase              = useMemo(() => createClient(), [])
  const mountedRef            = useRef(true)

  // Fetch the extended user row from public.users
  const fetchUserProfile = useCallback(
    async (authId: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authId)
        .single()

      if (!mountedRef.current) return

      if (error || !data) {
        console.error('[useUser] Could not load user profile:', error?.message)
        setUser(null)
        setRole(null)
      } else {
        setUser(data as User)
        setRole(data.role as UserRole)
      }
    },
    [supabase]
  )

  useEffect(() => {
    mountedRef.current = true

    // ── Initial session check ──────────────────────────────────────────────
    ;(async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
          setRole(null)
        }
      } catch (err: any) {
        console.error('[useUser] getSession error:', err.message)
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    })()

    // ── Auth state listener ────────────────────────────────────────────────
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        }
        setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setRole(null)
        setLoading(false)
        router.push('/login')
      }
    })

    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [supabase, router, fetchUserProfile])

  const signOut = useCallback(async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    setLoading(false)
    router.push('/login')
  }, [supabase, router])

  return (
    <UserContext.Provider value={{ user, role, loading, signOut }}>
      {children}
    </UserContext.Provider>
  )
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useUser(): UserContextType {
  const ctx = useContext(UserContext)
  if (ctx === undefined) {
    throw new Error('useUser must be used inside <UserProvider>')
  }
  return ctx
}
