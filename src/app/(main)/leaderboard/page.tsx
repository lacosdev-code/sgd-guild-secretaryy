'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getRankInfo } from '@/lib/rankUtils'
import { Trophy, Medal, Award } from 'lucide-react'

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    async function fetchLeaderboard() {
      // Fetch all adventurers ordered by points descending
      const { data, error } = await supabase
        .from('users')
        .select('id, nama, total_points')
        .eq('role', 'adventurer')
        .order('total_points', { ascending: false })

      if (!error && data) {
        setUsers(data)
      }
      setLoading(false)
    }

    fetchLeaderboard()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full border-2 border-navy border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="text-gold w-8 h-8" />
        <h1 className="text-2xl font-bold text-navy tracking-tight">Guild Leaderboard</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Rank</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Adventurer</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Class</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Total Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user, index) => {
              const rankInfo = getRankInfo(user.total_points)
              let rowClass = 'hover:bg-gray-50/50 transition-colors'
              
              if (index === 0) rowClass += ' bg-amber-50/30'
              else if (index === 1) rowClass += ' bg-slate-50/50'
              else if (index === 2) rowClass += ' bg-orange-50/30'

              return (
                <tr key={user.id} className={rowClass}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-400 w-4 text-center">
                        {index + 1}
                      </span>
                      {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                      {index === 1 && <Medal className="w-5 h-5 text-slate-400" />}
                      {index === 2 && <Award className="w-5 h-5 text-amber-600" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-gold text-xs font-bold shrink-0">
                        {user.nama.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-charcoal">{user.nama}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-3 py-1 bg-navy text-gold text-xs font-bold tracking-widest rounded border border-gold/20 shadow-sm">
                      RANK {rankInfo.currentRank}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="font-bold text-charcoal text-lg">
                      {user.total_points.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-gray-400 ml-1 font-medium">SGD</span>
                  </td>
                </tr>
              )
            })}
            
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                  No adventurers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
