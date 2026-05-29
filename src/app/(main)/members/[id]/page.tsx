'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getRankInfo } from '@/lib/rankUtils'
import { Avatar } from '@/components/ui/Avatar'
import { ArrowLeft, Shield, Users } from 'lucide-react'
import QuestCard from '@/components/quest/QuestCard'
import { useQuests } from '@/hooks/useQuests'

export default function MemberProfilePage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Ambil quest yang dikerjakan oleh member ini
  const { quests, loading: questsLoading } = useQuests({ assignedTo: id })

  useEffect(() => {
    let isMounted = true
    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/${id}`)
        if (!res.ok) throw new Error('User not found')
        const userData = await res.json()
        
        if (userData && isMounted) setUser(userData)
      } catch (err) {
        console.error(err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    if (id) fetchUser()
    return () => { isMounted = false }
  }, [id])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block w-8 h-8 rounded-full border-2 border-navy dark:border-white border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400 dark:text-gray-500">Loading member data...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-20 animate-in fade-in">
        <h2 className="text-xl font-bold text-navy dark:text-white">Member not found</h2>
        <button onClick={() => router.back()} className="mt-4 text-gold font-bold hover:underline">Go back</button>
      </div>
    )
  }

  const rank = user.role === 'adventurer' ? getRankInfo(user.totalPoints) : null

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-gray-500 hover:text-navy dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-bold">Back</span>
      </button>

      {/* Profile Header */}
      <div className="bg-white dark:bg-charcoal rounded-3xl border border-gray-100 dark:border-white/5 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">
        <Avatar url={user.avatarUrl} name={user.nama} size="lg" className="w-28 h-28 text-4xl shadow-md shrink-0" />
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-navy dark:text-white tracking-tight">{user.nama}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
              user.role === 'guild_master' 
                ? 'bg-gold/10 text-gold border-gold/20'
                : 'bg-navy/5 dark:bg-white/5 text-navy dark:text-white border-navy/10 dark:border-white/10'
            }`}>
              {user.role === 'guild_master' ? <Shield className="w-4 h-4" /> : <Users className="w-4 h-4" />}
              {user.role === 'guild_master' ? 'Guild Master' : 'Adventurer'}
            </div>
            
            {rank && (
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-navy dark:bg-white/10 text-gold whitespace-nowrap shadow-sm">
                RANK {rank.currentRank}
              </span>
            )}
          </div>
          
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 font-mono bg-gray-50 dark:bg-white/5 inline-block px-3 py-1.5 rounded-md">
            ID: {user.id}
          </p>
        </div>
        
        {rank && (
          <div className="text-center md:text-right mt-6 md:mt-0 bg-gray-50 dark:bg-white/[0.02] p-6 rounded-2xl border border-gray-100 dark:border-white/5 min-w-[200px]">
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-2">Total Points</p>
            <p className="text-4xl font-bold text-navy dark:text-white tabular-nums tracking-tight">
              {user.totalPoints.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-gold font-bold mt-2">
              Next: {rank.pointsForNextRank !== null ? `${rank.pointsForNextRank - rank.currentPoints} pts to go` : 'MAX LEVEL'}
            </p>
          </div>
        )}
      </div>

      {/* Quests Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold text-navy dark:text-white tracking-tight">Quest History</h2>
          <span className="bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-xs font-bold px-2.5 py-1 rounded-full">
            {quests.length}
          </span>
        </div>
        
        {questsLoading ? (
          <div className="flex justify-center py-10">
             <span className="inline-block w-6 h-6 rounded-full border-2 border-navy dark:border-white border-t-transparent animate-spin" />
          </div>
        ) : quests.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
            <p className="text-gray-500 dark:text-gray-400 font-medium">No quests assigned yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quests.map(quest => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
