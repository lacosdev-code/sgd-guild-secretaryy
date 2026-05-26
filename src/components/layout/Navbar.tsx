'use client'

import { useUser } from '@/hooks/useUser'
import { ThemeToggle } from './ThemeToggle'
import { NotificationsDropdown } from './NotificationsDropdown'
import { Avatar } from '@/components/ui/Avatar'

interface NavbarProps {
  onMenuClick?: () => void
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CoinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v2M12 16v2M9.5 9A2.5 2.5 0 0 1 12 7.5h.5a2 2 0 0 1 0 4H12a2 2 0 0 0 0 4h.5A2.5 2.5 0 0 0 14.5 14" />
    </svg>
  )
}

function LogOutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, role, loading, signOut } = useUser()

  const roleLabel = role === 'guild_master' ? 'Guild Master' : 'Adventurer'

  return (
    <header className="h-14 bg-white dark:bg-[#151515] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      {/* Left — hamburger (mobile) + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-md text-charcoal/60 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
        <img 
          src="https://ik.imagekit.io/Sgd/Logo%20Landscape.png?updatedAt=1771273586511" 
          alt="SGD Care" 
          className="hidden sm:block h-6 object-contain" 
        />
        <span
          className="hidden sm:block text-xs font-bold tracking-[0.18em] uppercase border-l border-gray-300 dark:border-gray-700 pl-3 ml-1"
          style={{ color: '#1B2E52' }}
        >
          <span className="dark:text-gray-300">Guild Secretary</span>
        </span>
      </div>

      {/* Right — user info + points + logout */}
      <div className="flex items-center gap-3">
        {!loading && user && (
          <>
            <ThemeToggle />
            <NotificationsDropdown userId={user.id} />
            
            {/* Points badge */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: '#1B2E5210', color: '#1B2E52' }}
            >
              <span style={{ color: '#C9A227' }}><CoinIcon /></span>
              <span className="dark:text-gray-300">{user.total_points.toLocaleString('id-ID')}</span>
              <span className="text-charcoal/40 dark:text-gray-500">SGD</span>
            </div>

            {/* Name + role */}
            <div className="flex flex-col items-end leading-none">
              <span className="text-sm font-semibold text-charcoal dark:text-gray-200">{user.nama}</span>
              <span
                className="text-[10px] font-bold tracking-widest uppercase mt-0.5"
                style={{ color: '#C9A227' }}
              >
                {roleLabel}
              </span>
            </div>

            {/* Avatar */}
            <Avatar url={user.avatar_url} name={user.nama} size="md" />

            {/* Logout */}
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-charcoal/60 dark:text-gray-400 hover:border-danger hover:text-danger dark:hover:border-danger transition-all"
              aria-label="Sign Out"
            >
              <LogOutIcon />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </>
        )}
      </div>
    </header>
  )
}
