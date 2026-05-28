'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getRankInfo } from '@/lib/rankUtils'
import { Trophy, Medal, Award } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import Link from 'next/link'

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [supabase] = useState(() => createClient())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function fetchLeaderboard() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, nama, total_points, avatar_url')
          .eq('role', 'adventurer')
          .order('total_points', { ascending: false })

        if (error) throw error

        if (data && isMounted) {
          setUsers(data)
        }
      } catch (err: any) {
        console.error(err)
        if (isMounted) setError(err.message || 'Gagal memuat leaderboard.')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
    return () => { isMounted = false }
  }, [supabase])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full border-2 border-navy dark:border-white border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400 dark:text-gray-500">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-red-500 text-sm">
          <p>⚠ {error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-navy text-white rounded">Coba Lagi</button>
        </div>
      </div>
    )
  }

  const top3 = users.slice(0, 3)
  const others = users.slice(3)

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-2">
        <Trophy className="text-gold w-8 h-8 drop-shadow-md" />
        <h1 className="text-2xl font-bold text-navy dark:text-white tracking-tight">Guild Leaderboard</h1>
      </div>

      {/* Podium Section */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mt-8">
          {/* Rank 2 (Left) */}
          {top3[1] && (
            <div className="order-2 md:order-1 relative bg-gradient-to-b from-slate-100 to-white dark:from-slate-800 dark:to-[#1C1C1E] border border-slate-200 dark:border-slate-700 rounded-t-2xl shadow-lg flex flex-col items-center pt-8 pb-6 px-4">
              <div className="absolute -top-6 bg-slate-200 dark:bg-slate-700 p-2 rounded-full border-4 border-white dark:border-[#151515] shadow-sm">
                <Medal className="w-6 h-6 text-slate-500 dark:text-slate-300" />
              </div>
              <Link href={`/members/${top3[1].id}`} className="flex flex-col items-center group">
                <Avatar url={top3[1].avatar_url} name={top3[1].nama} size="lg" className="mb-3 ring-4 ring-slate-100 dark:ring-slate-800 shadow-sm group-hover:scale-105 transition-transform" />
                <span className="font-bold text-lg text-charcoal dark:text-gray-200 group-hover:text-slate-500 transition-colors">{top3[1].nama}</span>
              </Link>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">{getRankInfo(top3[1].total_points).currentRank}</span>
              <div className="mt-4 text-xl font-black text-navy dark:text-white">{top3[1].total_points.toLocaleString('id-ID')} <span className="text-xs text-gray-400 font-medium">SGD</span></div>
            </div>
          )}

          {/* Rank 1 (Center) */}
          {top3[0] && (
            <div className="order-1 md:order-2 relative bg-gradient-to-b from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-[#1C1C1E] border-2 border-gold rounded-t-3xl shadow-xl flex flex-col items-center pt-10 pb-8 px-4 z-10 md:-mt-8">
              <div className="absolute -top-8 bg-gradient-to-br from-yellow-300 to-gold p-3 rounded-full border-4 border-white dark:border-[#151515] shadow-md">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <Link href={`/members/${top3[0].id}`} className="flex flex-col items-center group">
                <Avatar url={top3[0].avatar_url} name={top3[0].nama} size="xl" className="mb-3 ring-4 ring-amber-100 dark:ring-amber-900 shadow-md group-hover:scale-105 transition-transform" />
                <span className="font-black text-xl text-charcoal dark:text-gray-100 group-hover:text-gold transition-colors">{top3[0].nama}</span>
              </Link>
              <span className="text-xs font-bold text-gold mt-1 uppercase tracking-widest px-3 py-1 bg-navy/5 dark:bg-black/20 rounded-full">{getRankInfo(top3[0].total_points).currentRank}</span>
              <div className="mt-5 text-3xl font-black text-navy dark:text-gold drop-shadow-sm">{top3[0].total_points.toLocaleString('id-ID')} <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">SGD</span></div>
            </div>
          )}

          {/* Rank 3 (Right) */}
          {top3[2] && (
            <div className="order-3 md:order-3 relative bg-gradient-to-b from-orange-50 to-white dark:from-orange-900/20 dark:to-[#1C1C1E] border border-orange-200 dark:border-orange-900/50 rounded-t-2xl shadow-lg flex flex-col items-center pt-8 pb-6 px-4">
              <div className="absolute -top-6 bg-orange-100 dark:bg-orange-900/50 p-2 rounded-full border-4 border-white dark:border-[#151515] shadow-sm">
                <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <Link href={`/members/${top3[2].id}`} className="flex flex-col items-center group">
                <Avatar url={top3[2].avatar_url} name={top3[2].nama} size="lg" className="mb-3 ring-4 ring-orange-50 dark:ring-orange-900/20 shadow-sm group-hover:scale-105 transition-transform" />
                <span className="font-bold text-lg text-charcoal dark:text-gray-200 group-hover:text-orange-600 transition-colors">{top3[2].nama}</span>
              </Link>
              <span className="text-xs font-bold text-orange-600/70 dark:text-orange-500/70 mt-1 uppercase tracking-widest">{getRankInfo(top3[2].total_points).currentRank}</span>
              <div className="mt-4 text-xl font-black text-navy dark:text-white">{top3[2].total_points.toLocaleString('id-ID')} <span className="text-xs text-gray-400 font-medium">SGD</span></div>
            </div>
          )}
        </div>
      )}

      {/* Rest of the Leaderboard */}
      {others.length > 0 && (
        <div className="bg-white dark:bg-[#1C1C1E] rounded-xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden mt-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Rank</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Adventurer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">Class</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {others.map((user, index) => {
                const rankInfo = getRankInfo(user.total_points)
                const actualRank = index + 4
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-400 dark:text-gray-500 w-6 inline-block text-center group-hover:text-navy dark:group-hover:text-white transition-colors">
                        {actualRank}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/members/${user.id}`} className="flex items-center gap-3">
                        <Avatar url={user.avatar_url} name={user.nama} size="sm" className="opacity-90 group-hover:opacity-100 transition-opacity" />
                        <span className="font-semibold text-charcoal dark:text-gray-300">{user.nama}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-[10px] font-bold tracking-widest rounded border border-gray-200 dark:border-white/10">
                        {rankInfo.currentRank}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="font-bold text-charcoal dark:text-white text-base">
                        {user.total_points.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1 font-medium">SGD</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {users.length === 0 && (
        <div className="text-center py-20 bg-white/50 dark:bg-white/5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 font-medium">No adventurers found on this expedition.</p>
        </div>
      )}
    </div>
  )
}
