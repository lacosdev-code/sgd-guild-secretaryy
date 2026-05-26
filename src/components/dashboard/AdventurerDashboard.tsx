'use client'

import Link from 'next/link'
import { useUser } from '@/hooks/useUser'
import { useQuests, isOverdue } from '@/hooks/useQuests'
import { formatDeadline, getRankColor, getStatusColor } from '@/lib/utils'
import type { QuestWithAssignee } from '@/hooks/useQuests'
import type { QuestStatus } from '@/types'

// ── Points display ────────────────────────────────────────────────────────────
function PointsCard({ points }: { points: number }) {
  return (
    <div
      className="rounded-xl p-6 flex flex-col items-center justify-center text-center border"
      style={{ background: '#1B2E52', borderColor: 'transparent' }}
    >
      <span
        className="text-4xl font-bold tabular-nums"
        style={{ color: '#C9A227' }}
      >
        {points.toLocaleString('id-ID')}
      </span>
      <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-200/60 mt-1">
        SGD Points
      </span>
    </div>
  )
}

// ── Status pill ───────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: QuestStatus }) {
  const cls = getStatusColor(status)
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      {status}
    </span>
  )
}

// ── Rank badge ────────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: string | null }) {
  if (!rank) return <span className="text-gray-300 text-xs w-7 h-7 flex items-center justify-center">—</span>
  const cls = getRankColor(rank as any)
  return (
    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${cls}`}>
      {rank}
    </span>
  )
}

// ── Quest card ────────────────────────────────────────────────────────────────
function QuestCard({ quest }: { quest: QuestWithAssignee }) {
  const overdue = isOverdue(quest)

  return (
    <Link
      href={`/quests/${quest.id}`}
      className={`block bg-white rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5 overflow-hidden ${
        overdue ? 'border-danger/40' : 'border-gray-200'
      }`}
    >
      {/* Overdue banner */}
      {overdue && (
        <div
          className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"
          style={{ background: '#993C1D', color: 'white' }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Overdue
        </div>
      )}

      <div className="p-4 flex items-start gap-3">
        <RankBadge rank={quest.difficulty} />

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-snug truncate ${overdue ? 'text-danger' : 'text-charcoal'}`}>
            {quest.title}
          </p>

          {quest.deadline && (
            <p className={`text-xs mt-1 ${overdue ? 'text-danger/70' : 'text-gray-400'}`}>
              Deadline: {formatDeadline(quest.deadline)}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <StatusPill status={quest.status} />
            {quest.reward_points != null && (
              <span className="text-xs font-semibold" style={{ color: '#C9A227' }}>
                +{quest.reward_points} SGD
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal/50 mb-3">
      {children}
    </h2>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdventurerDashboard() {
  const { user } = useUser()
  const { quests, loading } = useQuests({ assignedTo: user?.id })

  const activeQuests    = quests.filter((q) => ['Active', 'Submitted', 'Revise', 'Draft'].includes(q.status))
  const overdueQuests   = activeQuests.filter(isOverdue)
  const completedQuests = quests.filter((q) => q.status === 'Approved' || q.status === 'Failed')

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* ── Greeting + points ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
        <div className="sm:col-span-2">
          <h1 className="text-xl font-bold text-charcoal">
            Halo, <span style={{ color: '#1B2E52' }}>{user?.nama}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {activeQuests.length} quest aktif menunggu penyelesaianmu.
          </p>

          {overdueQuests.length > 0 && (
            <div
              className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border"
              style={{ background: '#FDF2F0', borderColor: '#993C1D22', color: '#993C1D' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
              <strong>{overdueQuests.length}</strong>&nbsp;quest melewati deadline!
            </div>
          )}
        </div>

        <PointsCard points={user?.total_points ?? 0} />
      </div>

      {/* ── Active quests ─────────────────────────────────────────────── */}
      <div>
        <SectionLabel>Quest Aktif</SectionLabel>
        {loading ? (
          <div className="py-10 flex justify-center">
            <span
              className="inline-block w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#1B2E52', borderTopColor: 'transparent' }}
            />
          </div>
        ) : activeQuests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-12 text-center text-sm text-gray-400">
            Tidak ada quest aktif. Hubungi Guild Master untuk assignment baru.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeQuests.map((q) => (
              <QuestCard key={q.id} quest={q} />
            ))}
          </div>
        )}
      </div>

      {/* ── Completed quests ──────────────────────────────────────────── */}
      {completedQuests.length > 0 && (
        <div>
          <SectionLabel>Riwayat Quest ({completedQuests.length})</SectionLabel>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {completedQuests.map((q) => (
              <Link
                key={q.id}
                href={`/quests/${q.id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <RankBadge rank={q.difficulty} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">{q.title}</p>
                </div>
                <StatusPill status={q.status} />
                {q.status === 'Approved' && q.reward_points != null && (
                  <span className="text-xs font-semibold whitespace-nowrap" style={{ color: '#0F6E56' }}>
                    +{q.reward_points} SGD
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
