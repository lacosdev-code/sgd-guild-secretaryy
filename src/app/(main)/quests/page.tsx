'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import QuestCard from '@/components/quest/QuestCard'
import StatusPill from '@/components/ui/StatusPill'
import { useQuests } from '@/hooks/useQuests'
import { useUser } from '@/hooks/useUser'
import type { QuestStatus } from '@/types'

// ── Filter tabs ───────────────────────────────────────────────────────────────

const ALL_STATUSES: QuestStatus[] = ['Draft', 'Active', 'Submitted', 'Approved', 'Revise', 'Failed']

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
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-widest uppercase border-b-2 transition-all whitespace-nowrap"
      style={{
        borderColor: active ? '#1B2E52' : 'transparent',
        color: active ? '#1B2E52' : '#6B7280',
      }}
    >
      {label}
      {count != null && count > 0 && (
        <span
          className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"
          style={{
            background: active ? '#1B2E52' : '#E5E2DC',
            color: active ? '#C9A227' : '#6B7280',
          }}
        >
          {count > 9 ? '9+' : count}
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
        <div className="flex justify-center py-16">
          <span
            className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#1B2E52', borderTopColor: 'transparent' }}
          />
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
