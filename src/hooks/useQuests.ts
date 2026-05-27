'use client'

import { useCallback, useEffect, useState, useMemo } from 'react'
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

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useQuests(options: UseQuestsOptions = {}): UseQuestsReturn {
  const [quests, setQuests]   = useState<QuestWithAssignee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [tick, setTick]       = useState(0)
  const [supabase]            = useState(() => createClient())

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false

    // Fetch initially
    ;(async () => {
      setLoading(true)
      setError(null)

      try {
        let query = supabase
          .from('quests')
          .select(`
            *,
            assignee:assigned_to ( nama ),
            creator:created_by ( nama )
          `)
          .order('created_at', { ascending: false })

        if (options.assignedTo) {
          query = query.eq('assigned_to', options.assignedTo)
        }

        if (options.status) {
          const statuses = Array.isArray(options.status)
            ? options.status
            : [options.status]
          query = query.in('status', statuses)
        }

        if (options.limit) {
          query = query.limit(options.limit)
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
        setLoading(false)
      }
    })()

    // Realtime subscription for automatic syncing
    const channel = supabase
      .channel('quests_changes')
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, options.assignedTo, JSON.stringify(options.status), options.limit])

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
