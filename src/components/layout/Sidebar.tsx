'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

import { LayoutDashboard, ScrollText, UserCircle, Trophy, Users } from 'lucide-react'

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Leaderboard', href: '/leaderboard', icon: <Trophy size={18} /> },
  { label: 'Quests',    href: '/quests',    icon: <ScrollText size={18} /> },
  { label: 'Members',   href: '/members',   icon: <Users size={18} /> },
  { label: 'Profile',   href: '/profile',   icon: <UserCircle size={18} /> },
]

interface SidebarProps {
  /** Pass true on mobile when sidebar is open (drawer mode) */
  open?: boolean
  onClose?: () => void
}

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [role, setRole] = useState<string | null>(null)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    async function fetchRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('users').select('role').eq('id', user.id).single()
        if (data) setRole(data.role)
      }
    }
    fetchRole()
  }, [supabase])

  return (
    <>
      {/* ── Mobile overlay ─────────────────────────────────────────── */}
      {open && onClose && (
        <div
          className="fixed inset-0 bg-charcoal/40 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar panel ──────────────────────────────────────────── */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-40 flex flex-col',
          'w-56 bg-navy text-white',
          'transform transition-transform duration-200 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="px-5 py-6 border-b border-white/10 flex flex-col items-center text-center">
          <div className="bg-white/90 p-2 rounded-xl mb-3 w-28 flex justify-center">
            <img 
              src="https://ik.imagekit.io/Sgd/Logo%20Potrait.png?updatedAt=1771273586419" 
              alt="SGD Care" 
              className="h-12 object-contain" 
            />
          </div>
          <h2 className="text-base font-bold tracking-wide text-white leading-snug">
            Guild Secretary
          </h2>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-2 mb-2 text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">
            Navigation
          </p>
          {NAV_ITEMS.map((item) => {
            if (item.href === '/members' && role !== 'guild_master') return null
            const active = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-gold text-navy'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}
              >
                <span className={active ? 'text-navy' : 'text-white/50'}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer version */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-[10px] text-white/25 tracking-wider">v1.0 MVP</p>
        </div>
      </aside>
    </>
  )
}
