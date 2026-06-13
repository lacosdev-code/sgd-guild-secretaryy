'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, ScrollText, UserCircle, Trophy, Users, MessagesSquare, MoreHorizontal, FolderGit2, Folders } from 'lucide-react'
import { useUser } from '@/hooks/useUser'

export default function BottomNav() {
  const pathname = usePathname()
  const { role } = useUser()
  const [showMore, setShowMore] = useState(false)

  const isGM = role === 'guild_master'

  const MAIN_NAV_ITEMS = isGM 
    ? [
        { label: 'Dash', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { label: 'Quests', href: '/quests', icon: <ScrollText size={20} /> },
        { label: 'Arcs', href: '/arcs', icon: <FolderGit2 size={20} /> },
        { label: 'Projects', href: '/projects', icon: <Folders size={20} /> },
      ]
    : [
        { label: 'Dash', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { label: 'Quests', href: '/quests', icon: <ScrollText size={20} /> },
        { label: 'Arcs', href: '/arcs', icon: <FolderGit2 size={20} /> },
        { label: 'Projects', href: '/projects', icon: <Folders size={20} /> },
      ]

  const MORE_ITEMS = isGM
    ? [
        { label: 'Members', href: '/members', icon: <Users size={18} /> },
        { label: 'Tavern', href: '/tavern', icon: <MessagesSquare size={18} /> },
        { label: 'Ranks', href: '/leaderboard', icon: <Trophy size={18} /> },
        { label: 'Profile', href: '/profile', icon: <UserCircle size={18} /> },
      ]
    : [
        { label: 'Tavern', href: '/tavern', icon: <MessagesSquare size={18} /> },
        { label: 'Ranks', href: '/leaderboard', icon: <Trophy size={18} /> },
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
        className={`
          lg:hidden fixed bottom-[80px] right-4
          bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden
          transition-all duration-200 ease-out origin-bottom-right
          ${showMore
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
          }
        `}
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
              className="nav-item flex flex-col items-center justify-center w-full h-full transition-transform duration-200 active:scale-90"
            >
              <div className={`
                flex flex-col items-center gap-1 px-4 py-2 rounded-2xl
                transition-all duration-300 ease-in-out
                ${active ? 'bg-[#C9A227]/15 scale-105' : 'scale-100'}
              `}>
                <span className={cn('transition-all duration-300', active ? 'text-[#C9A227]' : 'text-gray-400')}>
                  {item.icon}
                </span>
                <span className={cn('text-[10px] font-semibold tracking-wide transition-all duration-300', active ? 'text-[#C9A227]' : 'text-gray-400')}>
                  {item.label}
                </span>
              </div>
            </Link>
          )
        })}

        {/* More Button */}
        <button
          onClick={() => setShowMore(!showMore)}
          className="nav-item flex flex-col items-center justify-center w-full h-full transition-transform duration-200 active:scale-90"
        >
          <div className={`
            flex flex-col items-center gap-1 px-4 py-2 rounded-2xl
            transition-all duration-300 ease-in-out
            ${showMore ? 'bg-[#C9A227]/15 scale-105' : 'scale-100'}
          `}>
            <span className={cn('transition-all duration-300', showMore ? 'text-[#C9A227] rotate-90' : 'text-gray-400')}>
              <MoreHorizontal size={20} />
            </span>
            <span className={cn('text-[10px] font-semibold tracking-wide transition-all duration-300', showMore ? 'text-[#C9A227]' : 'text-gray-400')}>
              More
            </span>
          </div>
        </button>
      </nav>
    </>
  )
}
