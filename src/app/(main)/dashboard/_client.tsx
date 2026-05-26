'use client'

import { useUser } from '@/hooks/useUser'
import GMDashboard from '@/components/dashboard/GMDashboard'
import AdventurerDashboard from '@/components/dashboard/AdventurerDashboard'

/**
 * Client component — reads role from context and renders the correct dashboard.
 * Separated from the server page so we can use hooks here.
 */
export default function DashboardClient() {
  const { role, loading } = useUser()

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <span
            className="inline-block w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#1B2E52', borderTopColor: 'transparent' }}
          />
          <p className="text-sm text-gray-400 tracking-wider">Loading guild data…</p>
        </div>
      </div>
    )
  }

  if (role === 'guild_master') {
    return <GMDashboard />
  }

  // Default: adventurer (handles the case where Reza is both GM+Adventurer —
  // use guild_master dashboard as the default since that is their primary role)
  return <AdventurerDashboard />
}
