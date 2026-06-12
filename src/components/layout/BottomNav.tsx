'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, ScrollText, UserCircle, Trophy, Users, MessagesSquare, MoreHorizontal, FolderGit2, Folders } from 'lucide-react'
import { useUser } from '@/hooks/useUser'

const MAIN_NAV_ITEMS = [
  { label: 'Dash', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Quests', href: '/quests', icon: <ScrollText size={20} /> },
  { label: 'Tavern', href: '/tavern', icon: <MessagesSquare size={20} /> },
  { label: 'Ranks', href: '/leaderboard', icon: <Trophy size={20} /> },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { role } = useUser()
  const [showMore, setShowMore] = useState(false)

  const MORE_ITEMS = [
    { label: 'Arcs', href: '/arcs', icon: <FolderGit2 size={18} /> },
    { label: 'Projects', href: '/projects', icon: <Folders size={18} /> },
    ...(role === 'guild_master' ? [{ label: 'Members', href: '/members', icon: <Users size={18} /> }] : []),
    { label: 'Profile', href: '/profile', icon: <UserCircle size={18} /> },
  ]

  // Close the more menu when a link is clicked
  const handleLinkClick = () => setShowMore(false)

  return (
    <>
      {/* Backdrop for the 'More' menu */}
      {showMore && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* The 'More' Menu Popup */}
      <div 
        className={cn(
          "lg:hidden fixed bottom-[80px] right-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden transition-all duration-200 transform origin-bottom-right",
          showMore ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col py-2 min-w-[160px]">
          {MORE_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors',
                  active ? 'bg-indigo-50/50 dark:bg-white/5 text-navy dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                )}
              >
                <span className={active ? 'text-navy dark:text-white' : 'text-gray-400'}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-navy text-white z-50 flex justify-around items-center h-[68px] pb-safe" style={{ boxShadow: '0 -4px 12px rgba(0,0,0,0.1)' }}>
        {MAIN_NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
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

        {/* More Button */}
        <button
          onClick={() => setShowMore(!showMore)}
          className={cn(
            'flex flex-col items-center justify-center w-full h-full space-y-1 transition-all',
            showMore ? 'text-gold' : 'text-white/50 hover:text-white/80'
          )}
        >
          <span className={cn('transition-transform duration-200', showMore ? 'scale-110 rotate-90' : 'scale-100')}>
            <MoreHorizontal size={20} />
          </span>
          <span className="text-[10px] font-medium tracking-wide">
            More
          </span>
        </button>
      </nav>
    </>
  )
}
