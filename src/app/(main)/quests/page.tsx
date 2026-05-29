'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import QuestCard from '@/components/quest/QuestCard'

import { useQuests } from '@/hooks/useQuests'
import { useUser } from '@/hooks/useUser'
import type { QuestStatus } from '@/types'

// ── Filter tabs ───────────────────────────────────────────────────────────────

const ALL_STATUSES: QuestStatus[] = ['Draft', 'Active', 'Submitted', 'Approved', 'Revise', 'Failed']

const STATUS_COLORS: Record<string, string> = {
  Semua: 'text-navy dark:text-white',
  Draft: 'text-gray-600 dark:text-gray-400',
  Active: 'text-blue-600 dark:text-blue-400',
  Submitted: 'text-amber-600 dark:text-amber-400',
  Approved: 'text-emerald-600 dark:text-emerald-400',
  Revise: 'text-orange-600 dark:text-orange-400',
  Failed: 'text-red-600 dark:text-red-400',
}

const BADGE_COLORS: Record<string, string> = {
  Semua: 'bg-navy text-gold dark:bg-white dark:text-navy',
  Draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-400',
  Active: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  Submitted: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  Approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Revise: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
  Failed: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
}

const ACTIVE_BORDER: Record<string, string> = {
  Semua: 'border-navy dark:border-white',
  Draft: 'border-gray-400 dark:border-gray-500',
  Active: 'border-blue-500 dark:border-blue-400',
  Submitted: 'border-amber-500 dark:border-amber-400',
  Approved: 'border-emerald-500 dark:border-emerald-400',
  Revise: 'border-orange-500 dark:border-orange-400',
  Failed: 'border-red-500 dark:border-red-400',
}

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count?: number
  active: boolean
  onClick: () => void
}) {
  const badgeColor = BADGE_COLORS[label] || BADGE_COLORS.Semua
  const textColor = active 
    ? (STATUS_COLORS[label] || STATUS_COLORS.Semua) 
    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
  const borderColor = active 
    ? (ACTIVE_BORDER[label] || ACTIVE_BORDER.Semua) 
    : 'border-transparent hover:border-gray-200 dark:hover:border-gray-800'

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-widest uppercase border-b-2 transition-all whitespace-nowrap ${textColor} ${borderColor}`}
    >
      {label}
      {count != null && count > 0 && (
        <span
          className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold ${badgeColor}`}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}

// ── Search bar ────────────────────────────────────────────────────────────────

function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari quest…"
        className="w-full pl-9 pr-4 py-2 text-sm border bg-white focus:outline-none focus:ring-2 transition-all"
        style={{ borderColor: '#DDD9D3', '--tw-ring-color': '#C9A227' } as React.CSSProperties}
      />
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function QuestsPage() {
  const { role, user } = useUser()
  const isGM = role === 'guild_master'

  const [activeFilter, setActiveFilter] = useState<QuestStatus | 'Semua'>('Semua')
  const [search, setSearch]             = useState('')

  // GMs see all quests; Adventurers see only their assigned quests
  const { quests, loading, error } = useQuests(
    isGM ? {} : { assignedTo: user?.id }
  )

  // Count per status (for tab badges)
  const countByStatus = useMemo(() => {
    const map: Partial<Record<QuestStatus, number>> = {}
    for (const q of quests) {
      map[q.status] = (map[q.status] ?? 0) + 1
    }
    return map
  }, [quests])

  // Apply filter + search
  const filtered = useMemo(() => {
    return quests.filter((q) => {
      if (activeFilter !== 'Semua' && q.status !== activeFilter) return false
      if (search.trim()) {
        const s = search.toLowerCase()
        const inTitle    = q.title.toLowerCase().includes(s)
        const inAssignee = (q as any).assignee?.nama?.toLowerCase().includes(s)
        return inTitle || inAssignee
      }
      return true
    })
  }, [quests, activeFilter, search])

  return (
    <div className="max-w-4xl mx-auto space-y-4">

      {/* ── Page header ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-charcoal">Quest Log</h1>
          <p className="text-xs text-gray-400 mt-0.5 tracking-wide">
            {isGM ? 'Seluruh quest operasional guild' : 'Quest yang di-assign kepadamu'}
          </p>
        </div>

        {isGM && (
          <Link
            href="/quests/new"
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-[0.12em] uppercase transition-opacity hover:opacity-80"
            style={{ background: '#1B2E52', color: '#C9A227' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Quest Baru
          </Link>
        )}
      </div>

      {/* ── Search + filter bar ─────────────────────────────────────────── */}
      <div className="space-y-0">
        <SearchBar value={search} onChange={setSearch} />

        {/* Filter tabs */}
        <div
          className="flex gap-0 overflow-x-auto border-b"
          style={{ borderColor: '#E8E5E0' }}
        >
          <FilterTab
            label="Semua"
            count={quests.length}
            active={activeFilter === 'Semua'}
            onClick={() => setActiveFilter('Semua')}
          />
          {ALL_STATUSES.map((s) => (
            <FilterTab
              key={s}
              label={s}
              count={countByStatus[s]}
              active={activeFilter === s}
              onClick={() => setActiveFilter(s)}
            />
          ))}
        </div>
      </div>

      {/* ── Quest list ─────────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-2 animate-pulse">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="bg-white border border-gray-100 p-4 flex items-center gap-4">
              <div className="w-7 h-7 rounded-sm bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
              <div className="h-5 w-16 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div
          className="px-5 py-4 border text-sm"
          style={{ background: '#FDF2F0', borderColor: '#993C1D22', color: '#993C1D' }}
        >
          ⚠ Gagal memuat quest: {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border py-16 text-center" style={{ borderColor: '#E8E5E0' }}>
          <p className="text-sm text-gray-400">
            {search ? `Tidak ada quest yang cocok dengan "${search}"` : 'Tidak ada quest di kategori ini.'}
          </p>
          {isGM && (
            <Link
              href="/quests/new"
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase underline"
              style={{ color: '#1B2E52' }}
            >
              Buat quest baru
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((q) => (
            <QuestCard key={q.id} quest={q} />
          ))}
          <p className="text-right text-[11px] text-gray-400 pt-1">
            Menampilkan {filtered.length} dari {quests.length} quest
          </p>
        </div>
      )}
    </div>
  )
}
