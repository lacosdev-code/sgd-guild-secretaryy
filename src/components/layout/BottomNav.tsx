'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, ScrollText, UserCircle, Trophy, Users, MessagesSquare } from 'lucide-react'
import { useUser } from '@/hooks/useUser'

const NAV_ITEMS = [
  { label: 'Dash', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Leader', href: '/leaderboard', icon: <Trophy size={20} /> },
  { label: 'Tavern', href: '/tavern', icon: <MessagesSquare size={20} /> },
  { label: 'Quests', href: '/quests', icon: <ScrollText size={20} /> },
  { label: 'Members', href: '/members', icon: <Users size={20} /> },
  { label: 'Profile', href: '/profile', icon: <UserCircle size={20} /> },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { role } = useUser()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-navy text-white z-50 flex justify-around items-center h-[68px] pb-safe" style={{ boxShadow: '0 -4px 12px rgba(0,0,0,0.1)' }}>
      {NAV_ITEMS.map((item) => {
        if (item.href === '/members' && role !== 'guild_master') return null
        const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center w-full h-full space-y-1 transition-all',
              active ? 'text-gold' : 'text-white/50 hover:text-white/80'
            )}
          >
            <span className={cn('transition-transform duration-200', active ? 'scale-110' : 'scale-100')}>
              {item.icon}
            </span>
            <span className="text-[10px] font-medium tracking-wide">
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
