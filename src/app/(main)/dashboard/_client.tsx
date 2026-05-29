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
      <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          <div className="sm:col-span-2 space-y-3 mt-2">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-100 rounded w-2/3"></div>
          </div>
          <div className="h-28 bg-gray-100 rounded-sm border border-gray-100"></div>
        </div>
        
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-3 bg-gray-200 rounded w-32"></div>
            <div className="flex-1 border-t border-dashed border-gray-200"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-white rounded-sm border border-gray-100 p-4 flex gap-3">
                <div className="w-7 h-7 bg-gray-100 rounded-sm shrink-0"></div>
                <div className="flex-1 space-y-2 mt-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/4 mt-4"></div>
                </div>
              </div>
            ))}
          </div>
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
