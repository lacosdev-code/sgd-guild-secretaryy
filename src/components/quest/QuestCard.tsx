'use client'

import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import StatusPill from '@/components/ui/StatusPill'
import { formatDeadline } from '@/lib/utils'
import type { QuestWithAssignee } from '@/hooks/useQuests'

// Re-export isOverdue so callers can use it from utils
function isOverdue(q: QuestWithAssignee) {
  if (!q.deadline) return false
  if (q.status === 'Approved' || q.status === 'Failed') return false
  return new Date(q.deadline) < new Date()
}

interface QuestCardProps {
  quest: QuestWithAssignee
}

export default function QuestCard({ quest }: QuestCardProps) {
  const overdue    = isOverdue(quest)
  const missingDetail = !quest.detail_completed &&
    quest.status !== 'Approved' &&
    quest.status !== 'Failed'

  return (
    <Link
      href={`/quests/${quest.id}`}
      className="block group transition-all duration-150 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2"
      style={{ '--tw-ring-color': '#C9A227' } as React.CSSProperties}
    >
      <div
        className="bg-white border transition-shadow group-hover:shadow-md overflow-hidden"
        style={{
          borderColor: overdue ? '#993C1D55' : '#DDD9D3',
          borderLeft: overdue
            ? '3px solid #993C1D'
            : missingDetail
            ? '3px solid #F59E0B'
            : '3px solid transparent',
        }}
      >
        {/* ── Header row ─────────────────────────────────────────────── */}
        <div
          className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b"
          style={{ borderColor: '#F0EFEE' }}
        >
          <div className="flex items-start gap-2.5 min-w-0">
            <Badge rank={quest.difficulty} size="md" />
            <h3
              className="text-sm font-bold leading-snug group-hover:underline"
              style={{ color: overdue ? '#993C1D' : '#1B2E52' }}
            >
              {quest.title}
            </h3>
          </div>
          <div className="shrink-0 mt-0.5">
            <StatusPill status={quest.status} size="sm" />
          </div>
        </div>

        {/* ── Meta row ───────────────────────────────────────────────── */}
        <div className="px-4 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500">
          {/* Assignee */}
          <span className="flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
            </svg>
            <span>{(quest as any).assignee?.nama ?? <em>Unassigned</em>}</span>
          </span>

          {/* Deadline */}
          {quest.deadline && (
            <span
              className="flex items-center gap-1"
              style={{ color: overdue ? '#993C1D' : undefined }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span className={overdue ? 'font-semibold' : ''}>
                {formatDeadline(quest.deadline)}
                {overdue && ' — OVERDUE'}
              </span>
            </span>
          )}

          {/* Reward */}
          {quest.reward_points != null && (
            <span className="flex items-center gap-1 ml-auto font-semibold" style={{ color: '#C9A227' }}>
              +{quest.reward_points} SGD
            </span>
          )}
        </div>

        {/* ── Warning strip ───────────────────────────────────────────── */}
        {missingDetail && (
          <div
            className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 border-t"
            style={{ background: '#FFFBEB', borderColor: '#F59E0B22', color: '#92400E' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
            Detail quest belum lengkap — berisiko penalti 00:00
          </div>
        )}
      </div>
    </Link>
  )
}
