'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { getRankInfo } from '@/lib/rankUtils'

export default function ProfilePage() {
  const { user, role, loading } = useUser()
  const [pointLogs, setPointLogs] = useState<any[]>([])
  const [logsLoading, setLogsLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    async function fetchLogs() {
      if (!user) return
      const { data, error } = await supabase
        .from('point_logs')
        .select(`
          id, delta, reason, created_at,
          quests ( title )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setPointLogs(data)
      }
      setLogsLoading(false)
    }

    if (!loading && user) {
      fetchLogs()
    }
  }, [user, loading, supabase])

  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full border-2 border-navy border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-navy tracking-tight">User Profile</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-navy flex items-center justify-center text-gold text-4xl font-bold shrink-0 shadow-inner">
            {user.nama.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-charcoal">{user.nama}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 bg-gold/10 text-gold font-bold text-xs uppercase tracking-widest rounded-full">
                {role === 'guild_master' ? 'Guild Master' : 'Adventurer'}
              </span>
              <span className="px-3 py-1 bg-navy text-gold text-xs font-bold tracking-widest rounded border border-gold/20 shadow-sm">
                RANK {getRankInfo(user.total_points).currentRank}
              </span>
              <span className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                ID: {user.id.split('-')[0]}...
              </span>
            </div>
          </div>
          <div className="bg-navy rounded-2xl p-5 text-center min-w-[140px] shadow-lg">
            <p className="text-gold/80 text-[10px] uppercase tracking-widest font-bold mb-1">
              Total Points
            </p>
            <p className="text-3xl font-bold text-white">
              {user.total_points.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-white/50 mt-1">SGD</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-navy mb-4">Point History</h3>
        {logsLoading ? (
          <p className="text-sm text-gray-400">Loading logs...</p>
        ) : pointLogs.length === 0 ? (
          <p className="text-sm text-gray-500">No point history found.</p>
        ) : (
          <div className="space-y-3">
            {pointLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-charcoal">
                    {log.reason}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(log.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                    {log.quests?.title && ` • Quest: ${log.quests.title}`}
                  </p>
                </div>
                <div className={`text-lg font-bold ${log.delta > 0 ? 'text-success' : 'text-danger'}`}>
                  {log.delta > 0 ? '+' : ''}{log.delta}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
