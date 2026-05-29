'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import { signOut as nextAuthSignOut, useSession } from 'next-auth/react'
import type { UserRole } from '@/types'

// ── Extended user type from our DB ───────────────────────────────────────────
interface UserProfile {
  id: string
  nama: string
  email: string
  role: UserRole
  totalPoints: number
  avatarUrl?: string | null
  createdAt: string
}

interface UserContextType {
  user: UserProfile | null
  role: UserRole | null
  loading: boolean
  signOut: () => Promise<void>
  refetch: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// ── Provider ─────────────────────────────────────────────────────────────────
export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [tick, setTick] = useState(0)
  const router = useRouter()

  const loading = status === 'loading'

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`)
      if (!res.ok) return
      const data = await res.json()
      setUser(data)
      setRole(data.role as UserRole)
    } catch (err) {
      console.error('[useUser] fetchUserProfile error:', err)
    }
  }, [])

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserProfile(session.user.id)
    } else if (status === 'unauthenticated') {
      setUser(null)
      setRole(null)
    }
  }, [status, session?.user?.id, tick, fetchUserProfile])

  const signOut = useCallback(async () => {
    await nextAuthSignOut({ redirect: false })
    setUser(null)
    setRole(null)
    router.push('/login')
  }, [router])

  return (
    <UserContext.Provider value={{ user, role, loading, signOut, refetch }}>
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
