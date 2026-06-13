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
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<'all'|'guild_master'|'adventurer'>('all')
  const { data: session } = useSession()
  const currentUserRole = (session?.user as { role?: string })?.role || null

  const fetchUsers = useCallback(async (isMounted: boolean) => {
    if (!isMounted) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/users')
      if (!res.ok) throw new Error(await res.text())
      
      const data = await res.json()
      
      // map to snake_case for UI compatibility
      const mapped = data.map((u: { id: string, [key: string]: any }) => ({
        id: u.id,
        nama: u.nama,
        role: u.role,
        totalPoints: u.totalPoints,
        avatarUrl: u.avatarUrl,
        created_at: u.createdAt,
      }))
      
      if (isMounted) setUsers(mapped)
    } catch (error: unknown) {
    const err = error as Error;

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

      <div className="space-y-3">
        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-focus-within:text-navy transition-colors">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama member..." 
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#1B2E52] border border-gray-200 dark:border-[#2A3F6B] rounded-2xl focus:outline-none focus:ring-2 focus:ring-navy/20 dark:focus:ring-[#C9A227]/30 transition-all text-sm placeholder-gray-400"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
          <button
            onClick={() => setFilterRole('all')}
            className={`snap-center flex items-center gap-2 px-4 py-2 text-[11px] font-bold tracking-widest uppercase border rounded-full transition-all duration-300 whitespace-nowrap ${
              filterRole === 'all' 
              ? 'bg-navy border-navy text-white shadow-md dark:bg-white dark:border-white dark:text-navy' 
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:text-gray-400'
            }`}
          >
            Semua
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${filterRole === 'all' ? 'bg-white/20 dark:bg-navy/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
              {users.length}
            </span>
          </button>
          <button
            onClick={() => setFilterRole('guild_master')}
            className={`snap-center flex items-center gap-2 px-4 py-2 text-[11px] font-bold tracking-widest uppercase border rounded-full transition-all duration-300 whitespace-nowrap ${
              filterRole === 'guild_master' 
              ? 'bg-gold border-gold text-navy shadow-md' 
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:text-gray-400'
            }`}
          >
            Guild Masters
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${filterRole === 'guild_master' ? 'bg-navy/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
              {users.filter(u => u.role === 'guild_master').length}
            </span>
          </button>
          <button
            onClick={() => setFilterRole('adventurer')}
            className={`snap-center flex items-center gap-2 px-4 py-2 text-[11px] font-bold tracking-widest uppercase border rounded-full transition-all duration-300 whitespace-nowrap ${
              filterRole === 'adventurer' 
              ? 'bg-navy/10 border-navy/20 text-navy shadow-md dark:bg-white/10 dark:text-white dark:border-white/20' 
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:text-gray-400'
            }`}
          >
            Adventurers
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${filterRole === 'adventurer' ? 'bg-white/50 dark:bg-black/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
              {users.filter(u => u.role === 'adventurer').length}
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-charcoal rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-hidden sm:overflow-x-auto">
          <table className="w-full text-left block sm:table">
            <thead className="hidden sm:table-header-group">
              <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-navy/20">
                <th className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Points</th>
              </tr>
            </thead>
            <tbody className="block sm:table-row-group divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <tr className="block sm:table-row">
                  <td colSpan={4} className="block sm:table-cell px-6 py-8 text-center text-gray-500">Loading data...</td>
                </tr>
              ) : error ? (
                <tr className="block sm:table-row">
                  <td colSpan={4} className="block sm:table-cell px-6 py-8 text-center text-red-500">{error}</td>
                </tr>
              ) : users.length === 0 ? (
                <tr className="block sm:table-row">
                  <td colSpan={4} className="block sm:table-cell px-6 py-8 text-center text-gray-500">No members registered yet.</td>
                </tr>
              ) : (
                users.filter(u => {
                  if (filterRole !== 'all' && u.role !== filterRole) return false
                  if (search.trim() && !u.nama.toLowerCase().includes(search.toLowerCase())) return false
                  return true
                }).map((user, index) => {
                  const rank = user.role === 'adventurer' ? getRankInfo(user.totalPoints) : null

                  return (
                    <tr 
                      key={user.id} 
                      className="block sm:table-row p-4 sm:p-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors animate-in slide-in-from-bottom-2 fade-in duration-500 fill-mode-both"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="block sm:table-cell sm:px-6 sm:py-4 mb-3 sm:mb-0">
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
                      <td className="flex sm:table-cell justify-between items-center sm:px-6 sm:py-4 py-1.5 border-t border-gray-50 dark:border-white/5 sm:border-t-0">
                        <span className="sm:hidden text-xs font-bold text-gray-500 uppercase tracking-widest">Role</span>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          user.role === 'guild_master' 
                            ? 'bg-gold/10 text-gold border-gold/20'
                            : 'bg-navy/5 dark:bg-white/5 text-navy dark:text-white border-navy/10 dark:border-white/10'
                        }`}>
                          {user.role === 'guild_master' ? <Shield className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                          {user.role === 'guild_master' ? 'Guild Master' : 'Adventurer'}
                        </div>
                      </td>
                      <td className="flex sm:table-cell justify-between items-center sm:px-6 sm:py-4 py-1.5">
                        <span className="sm:hidden text-xs font-bold text-gray-500 uppercase tracking-widest">Rank</span>
                        {rank ? (
                          <span className="px-2 py-1 rounded text-xs font-bold bg-navy dark:bg-white/10 text-gold whitespace-nowrap">
                            RANK {rank.currentRank}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="flex sm:table-cell justify-between items-center sm:px-6 sm:py-4 py-1.5">
                        <span className="sm:hidden text-xs font-bold text-gray-500 uppercase tracking-widest">Points</span>
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
