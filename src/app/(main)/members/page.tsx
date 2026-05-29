'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { AddMemberModal } from '@/components/members/AddMemberModal'
import { Avatar } from '@/components/ui/Avatar'
import { UserPlus, Shield, Users } from 'lucide-react'
import { getRankInfo } from '@/lib/rankUtils'
import Link from 'next/link'

export default function MembersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const { data: session } = useSession()
  const currentUserRole = (session?.user as any)?.role || null

  const fetchUsers = useCallback(async (isMounted: boolean) => {
    if (!isMounted) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/users')
      if (!res.ok) throw new Error(await res.text())
      
      const data = await res.json()
      
      // map to snake_case for UI compatibility
      const mapped = data.map((u: any) => ({
        id: u.id,
        nama: u.nama,
        role: u.role,
        totalPoints: u.totalPoints,
        avatarUrl: u.avatarUrl,
        created_at: u.createdAt,
      }))
      
      if (isMounted) setUsers(mapped)
    } catch (err: any) {
      console.error(err)
      if (isMounted) setError(err.message || 'Terjadi kesalahan saat memuat data')
    } finally {
      if (isMounted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    fetchUsers(isMounted)

    return () => {
      isMounted = false
    }
  }, [fetchUsers])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white tracking-tight">Manage Members</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">List of all guild members and adventurers.</p>
        </div>

        {currentUserRole === 'guild_master' && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gold text-navy font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-gold/20"
          >
            <UserPlus className="w-5 h-5" />
            Add Member
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-charcoal rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-navy/20">
                <th className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading data...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-red-500">{error}</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No members registered yet.</td>
                </tr>
              ) : (
                users.map(user => {
                  const rank = user.role === 'adventurer' ? getRankInfo(user.totalPoints) : null

                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/members/${user.id}`} className="flex items-center gap-3 group">
                          <Avatar 
                            url={user.avatarUrl} 
                            name={user.nama} 
                            size="sm" 
                            className="group-hover:ring-2 ring-gold transition-all"
                          />
                          <div>
                            <div className="font-bold text-navy dark:text-white group-hover:text-gold transition-colors">{user.nama}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">ID: {user.id.substring(0,8)}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          user.role === 'guild_master' 
                            ? 'bg-gold/10 text-gold border-gold/20'
                            : 'bg-navy/5 dark:bg-white/5 text-navy dark:text-white border-navy/10 dark:border-white/10'
                        }`}>
                          {user.role === 'guild_master' ? <Shield className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                          {user.role === 'guild_master' ? 'Guild Master' : 'Adventurer'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {rank ? (
                          <span className="px-2 py-1 rounded text-xs font-bold bg-navy dark:bg-white/10 text-gold whitespace-nowrap">
                            RANK {rank.currentRank}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-navy dark:text-white tabular-nums">
                          {user.totalPoints.toLocaleString('id-ID')}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddMemberModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            fetchUsers(true) // Refresh list
          }}
        />
      )}
    </div>
  )
}
