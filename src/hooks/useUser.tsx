'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
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
  // Use useState instead of useMemo for Supabase client to prevent recreation during concurrent rendering
  const [supabase]            = useState(() => createClient())

  // Fetch the extended user row from public.users
  const fetchUserProfile = useCallback(
    async (authId: string) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authId)
          .single()

        if (error || !data) {
          console.error('[useUser] Could not load user profile:', error?.message)
          setUser(null)
          setRole(null)
        } else {
          setUser(data as User)
          setRole(data.role as UserRole)
        }
      } catch (err: any) {
        console.error('[useUser] Unexpected error fetching profile:', err)
        setUser(null)
        setRole(null)
      }
    },
    [supabase]
  )

  useEffect(() => {
    let isMounted = true

    // ── Initial session check ──────────────────────────────────────────────
    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error

        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          if (isMounted) {
            setUser(null)
            setRole(null)
          }
        }
      } catch (err: any) {
        console.error('[useUser] getSession error:', err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    getInitialSession()

    // ── Auth state listener ────────────────────────────────────────────────
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return

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
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase, fetchUserProfile, router])

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
