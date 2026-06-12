'use client'

import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import StatusPill from '@/components/ui/StatusPill'
import { formatDeadline } from '@/lib/utils'
import type { QuestWithAssignee } from '@/hooks/useQuests'

// Local helper for overdue check
function isOverdue(q: QuestWithAssignee) {
  if (!q.deadline) return false
  if (['Approved', 'Completed', 'Cancelled', 'Aborted'].includes(q.status)) return false
  return new Date(q.deadline) < new Date()
}

interface QuestCardProps {
  quest: QuestWithAssignee
  index?: number
}

export default function QuestCard({ quest, index = 0 }: QuestCardProps) {
  const overdue    = isOverdue(quest)
  const missingDetail = !quest.detailCompleted &&
    !['Approved', 'Completed', 'Cancelled', 'Aborted'].includes(quest.status)

  return (
    <Link
      href={`/quests/${quest.id}`}
      className="block group transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-2xl animate-in slide-in-from-bottom-2 fade-in duration-500 fill-mode-both"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className={`relative bg-white dark:bg-[#1C1C1E] border border-gray-100 dark:border-white/5 rounded-2xl transition-all duration-300 group-hover:shadow-lg dark:group-hover:shadow-[0_8px_30px_rgb(255,255,255,0.03)] group-hover:-translate-y-1 overflow-hidden flex flex-col h-full`}
      >
        {/* Accent Bar */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-[4px] transition-colors ${
            overdue ? 'bg-danger' : missingDetail ? 'bg-amber-400' : 'bg-transparent group-hover:bg-gold/50'
          }`}
        />

        <div className="p-5 flex-1 flex flex-col">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-4 pl-1">
            <div className="flex items-start gap-3 min-w-0">
              <div className="shrink-0 pt-0.5">
                <Badge rank={quest.difficulty} size="md" />
              </div>
              <h3 className="text-[15px] font-bold leading-snug text-navy dark:text-white group-hover:text-gold transition-colors line-clamp-2">
                {quest.title}
              </h3>
            </div>
            <div className="shrink-0">
              <StatusPill status={quest.status} size="sm" />
            </div>
          </div>

          {/* Meta row */}
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 pl-1">
            <div className="flex flex-wrap items-center gap-4 text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">
              {/* Assignee */}
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="truncate max-w-[140px]">
                  {(quest as any).assignee?.nama ?? <em className="text-gray-400 opacity-80">Unassigned</em>}
                </span>
              </div>

              {/* Deadline */}
              {quest.deadline && (
                <div className={`flex items-center gap-1.5 ${overdue ? 'text-danger font-bold' : ''}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={overdue ? 'text-danger' : 'text-gray-400 dark:text-gray-500'}>
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  <span>
                    {formatDeadline(quest.deadline)}
                    {overdue && ' — OVERDUE'}
                  </span>
                </div>
              )}
            </div>

            {/* Reward */}
            {quest.rewardPoints != null && (
              <div className="flex items-center gap-1 text-sm font-bold text-gold shrink-0">
                +{quest.rewardPoints} SGD
              </div>
            )}
          </div>
        </div>

        {/* Warning strip */}
        {missingDetail && (
          <div className="px-5 py-2.5 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border-t border-amber-100 dark:border-amber-900/50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
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

