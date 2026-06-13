'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { QuestStatus, DifficultyRank } from '@/types'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface QuestWithAssignee {
  id: string
  title: string
  description: string | null
  assignedTo: string | null
  createdBy: string
  urgency: string
  difficulty: DifficultyRank | null
  deadline: string | null
  successParameter: string | null
  rewardPoints: number | null
  status: QuestStatus
  briefAttachmentUrl: string | null
  detailCompleted: boolean
  detailCompletedAt: string | null
  createdAt: string
  updatedAt: string
  assignee?: { id: string; nama: string; avatarUrl?: string | null } | null
  creator?: { id: string; nama: string } | null
}

interface UseQuestsOptions {
  assignedTo?: string
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
  const [quests, setQuests] = useState<QuestWithAssignee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const optionsRef = useRef(options)
  optionsRef.current = options

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false

    async function fetchQuests() {
      if (tick === 0) setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        if (optionsRef.current.assignedTo) params.set('assignedTo', optionsRef.current.assignedTo)
        if (optionsRef.current.limit) params.set('limit', String(optionsRef.current.limit))
        if (optionsRef.current.status) {
          const s = Array.isArray(optionsRef.current.status)
            ? optionsRef.current.status[0]
            : optionsRef.current.status
          params.set('status', s)
        }

        const res = await fetch(`/api/quests?${params.toString()}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!cancelled) setQuests(data)
      } catch (error: unknown) {
    const err = error as Error;
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchQuests()

    // Poll every 30s for updates (no WebSocket needed for quests)
    const interval = setInterval(() => {
      if (!cancelled) setTick((t) => t + 1)
    }, 30_000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [tick])

  return { quests, loading, error, refetch }
}

// ── Utility: derive stats from quest list ─────────────────────────────────────
export function deriveGMStats(quests: QuestWithAssignee[]) {
  const now = new Date()
  return {
    total:      quests.length,
    active:     quests.filter((q) => q.status === 'Active').length,
    submitted:  quests.filter((q) => q.status === 'Submitted').length,
    incomplete: quests.filter((q) => !q.detailCompleted && !['Approved', 'Completed', 'Cancelled', 'Aborted'].includes(q.status)).length,
    overdue:    quests.filter(
      (q) => q.deadline && new Date(q.deadline) < now && !['Approved', 'Completed', 'Cancelled', 'Aborted'].includes(q.status)
    ).length,
  }
}

export function isOverdue(quest: { deadline: string | null; status: string }): boolean {
  if (!quest.deadline) return false
  if (['Approved', 'Completed', 'Cancelled', 'Aborted'].includes(quest.status)) return false
  return new Date(quest.deadline) < new Date()
}
