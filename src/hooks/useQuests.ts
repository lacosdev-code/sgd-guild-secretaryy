'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Quest, QuestStatus } from '@/types'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface QuestWithAssignee extends Quest {
  assignee?: { nama: string } | null
  creator?: { nama: string } | null
}

interface UseQuestsOptions {
  assignedTo?: string   // filter by assigned_to uuid
  status?: QuestStatus | QuestStatus[]
  limit?: number
}

interface UseQuestsReturn {
  quests: QuestWithAssignee[]
  loading: boolean
  error: string | null
  refetch: () => void
}

// Unique channel ID counter to prevent conflicts when multiple components subscribe
let channelCounter = 0

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useQuests(options: UseQuestsOptions = {}): UseQuestsReturn {
  const [quests, setQuests]   = useState<QuestWithAssignee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [tick, setTick]       = useState(0)
  const [supabase]            = useState(() => createClient())
  
  // Stable refs for options to avoid re-running effect on every render
  const assignedToRef = useRef(options.assignedTo)
  const statusRef     = useRef(options.status)
  const limitRef      = useRef(options.limit)
  assignedToRef.current = options.assignedTo
  statusRef.current     = options.status
  limitRef.current      = options.limit

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false
    const channelId = ++channelCounter
    const isInitialLoad = tick === 0

    // Only show loading spinner on first load, not on realtime refresh
    if (isInitialLoad) setLoading(true)
    setError(null)

    ;(async () => {
      try {
        let query = supabase
          .from('quests')
          .select(`
            *,
            assignee:assigned_to ( nama ),
            creator:created_by ( nama )
          `)
          .order('created_at', { ascending: false })

        if (assignedToRef.current) {
          query = query.eq('assigned_to', assignedToRef.current)
        }

        if (statusRef.current) {
          const statuses = Array.isArray(statusRef.current)
            ? statusRef.current
            : [statusRef.current]
          query = query.in('status', statuses)
        }

        if (limitRef.current) {
          query = query.limit(limitRef.current)
        }

        const { data, error: fetchError } = await query

        if (!cancelled) {
          if (fetchError) {
            setError(fetchError.message)
          } else {
            setQuests((data ?? []) as QuestWithAssignee[])
          }
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    // Realtime subscription with unique channel name to prevent conflicts
    const channel = supabase
      .channel(`quests_changes_${channelId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quests' },
        () => {
          if (!cancelled) setTick(t => t + 1)
        }
      )
      .subscribe()

    return () => { 
      cancelled = true 
      supabase.removeChannel(channel)
    }
  // Only re-run when tick changes (triggered by realtime or manual refetch)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick])

  return { quests, loading, error, refetch }
}

// ── Utility: derive stats from a list of quests ───────────────────────────────

export function deriveGMStats(quests: Quest[]) {
  const now = new Date()
  return {
    total:          quests.length,
    active:         quests.filter((q) => q.status === 'Active').length,
    submitted:      quests.filter((q) => q.status === 'Submitted').length,
    incomplete:     quests.filter((q) => !q.detail_completed && q.status !== 'Approved' && q.status !== 'Failed').length,
    overdue:        quests.filter(
      (q) => q.deadline && new Date(q.deadline) < now &&
             q.status !== 'Approved' && q.status !== 'Failed'
    ).length,
  }
}

export function isOverdue(quest: Quest): boolean {
  if (!quest.deadline) return false
  if (quest.status === 'Approved' || quest.status === 'Failed') return false
  return new Date(quest.deadline) < new Date()
}
