'use client'

import Link from 'next/link'
import { useUser } from '@/hooks/useUser'
import { useQuests, deriveGMStats, isOverdue } from '@/hooks/useQuests'
import { formatDeadline, getRankColor, getStatusColor } from '@/lib/utils'
import type { QuestWithAssignee } from '@/hooks/useQuests'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  accent = false,
  danger = false,
  warning = false,
}: {
  label: string
  value: number
  accent?: boolean
  danger?: boolean
  warning?: boolean
}) {
  const bg    = danger  ? '#FDF2F0' : warning ? '#FFFBEB' : accent ? '#1B2E52' : '#FFFFFF'
  const color = danger  ? '#993C1D' : warning ? '#92400E' : accent ? '#C9A227' : '#1B2E52'
  const sub   = danger  ? '#993C1D99' : warning ? '#92400E88' : accent ? '#C9A22799' : '#1B2E5266'

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-1 border transition-shadow hover:shadow-md"
      style={{
        background: bg,
        borderColor: danger ? '#993C1D22' : warning ? '#F59E0B22' : accent ? 'transparent' : '#E5E2DC',
      }}
    >
      <span className="text-3xl font-bold tabular-nums" style={{ color }}>
        {value}
      </span>
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: sub }}>
        {label}
      </span>
    </div>
  )
}

// ── Status pill ───────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const cls = getStatusColor(status as any)
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      {status}
    </span>
  )
}

// ── Rank badge ────────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: string | null }) {
  if (!rank) return <span className="text-gray-300 text-xs">—</span>
  const cls = getRankColor(rank as any)
  return (
    <span className={`inline-block w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${cls}`}>
      {rank}
    </span>
  )
}

// ── Quest row ─────────────────────────────────────────────────────────────────
function QuestRow({ quest }: { quest: QuestWithAssignee }) {
  const overdue = isOverdue(quest)
  return (
    <Link
      href={`/quests/${quest.id}`}
      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
    >
      <RankBadge rank={quest.difficulty} />

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${overdue ? 'text-danger' : 'text-charcoal'}`}>
          {quest.title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {(quest as any).assignee?.nama ?? 'Unassigned'}
          {quest.deadline && (
            <span className={`ml-2 ${overdue ? 'text-danger font-medium' : ''}`}>
              · {formatDeadline(quest.deadline)}
            </span>
          )}
        </p>
      </div>

      <StatusPill status={quest.status} />

      {!quest.detail_completed && quest.status !== 'Approved' && quest.status !== 'Failed' && (
        <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full whitespace-nowrap">
          Detail kurang
        </span>
      )}
    </Link>
  )
}

// ── Alert banner ─────────────────────────────────────────────────────────────
function AlertBanner({ count, label }: { count: number; label: string }) {
  if (count === 0) return null
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm border"
      style={{ background: '#FDF2F0', borderColor: '#993C1D22', color: '#993C1D' }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
      <span><strong>{count}</strong> {label}</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function GMDashboard() {
  const { user } = useUser()
  const { quests, loading } = useQuests({ limit: 50 })

  const stats = deriveGMStats(quests)
  const recentQuests = quests.slice(0, 10)

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── Greeting ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-charcoal">
          Selamat datang, <span style={{ color: '#1B2E52' }}>{user?.nama}</span>
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Berikut ringkasan operasional guild hari ini.
        </p>
      </div>

      {/* ── Alert banners ─────────────────────────────────────────────── */}
      <div className="space-y-2">
        <AlertBanner
          count={stats.overdue}
          label="quest melewati deadline tanpa penyelesaian"
        />
        <AlertBanner
          count={stats.incomplete}
          label="quest aktif belum memiliki detail lengkap (berisiko penalti 00:00)"
        />
      </div>

      {/* ── Stat grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Submitted" value={stats.submitted} warning={stats.submitted > 0} />
        <StatCard label="Overdue" value={stats.overdue} danger={stats.overdue > 0} />
        <StatCard label="Detail Kurang" value={stats.incomplete} warning={stats.incomplete > 0} />
        <StatCard label="SGD Points" value={user?.total_points ?? 0} accent />
      </div>

      {/* ── Analytics Charts ─────────────────────────────────────────── */}
      {!loading && quests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Quest Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Active', value: stats.active, color: '#1B2E52' },
                      { name: 'Submitted', value: stats.submitted, color: '#F59E0B' },
                      { name: 'Approved', value: quests.filter(q => q.status === 'Approved').length, color: '#0F6E56' },
                      { name: 'Failed', value: quests.filter(q => q.status === 'Failed').length, color: '#993C1D' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { name: 'Active', value: stats.active, color: '#1B2E52' },
                      { name: 'Submitted', value: stats.submitted, color: '#F59E0B' },
                      { name: 'Approved', value: quests.filter(q => q.status === 'Approved').length, color: '#0F6E56' },
                      { name: 'Failed', value: quests.filter(q => q.status === 'Failed').length, color: '#993C1D' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="p-4 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Quest By Difficulty</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'F', count: quests.filter(q => q.difficulty === 'F').length },
                    { name: 'E', count: quests.filter(q => q.difficulty === 'E').length },
                    { name: 'D', count: quests.filter(q => q.difficulty === 'D').length },
                    { name: 'C', count: quests.filter(q => q.difficulty === 'C').length },
                    { name: 'B', count: quests.filter(q => q.difficulty === 'B').length },
                    { name: 'A', count: quests.filter(q => q.difficulty === 'A').length },
                    { name: 'S', count: quests.filter(q => q.difficulty === 'S').length },
                  ].filter(d => d.count > 0)}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="count" fill="#C9A227" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ── Action buttons ────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/quests/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: '#1B2E52', color: '#C9A227' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Buat Quest Baru
        </Link>

        <Link
          href="/quests?status=Submitted"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border transition-all hover:bg-gold/10"
          style={{ borderColor: '#C9A22744', color: '#1B2E52' }}
        >
          Review Approval
          {stats.submitted > 0 && (
            <span
              className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
              style={{ background: '#C9A227', color: '#1B2E52' }}
            >
              {stats.submitted}
            </span>
          )}
        </Link>

        <button
          onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8," 
              + "ID,Title,Status,Difficulty,Reward Points\n"
              + quests.map(q => `${q.id},"${q.title}",${q.status},${q.difficulty},${q.reward_points}`).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "quests_export.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border transition-all hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-700"
          style={{ color: '#1B2E52' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span className="dark:text-gray-300">Export CSV</span>
        </button>
      </div>

      {/* ── Recent quest list ─────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-charcoal/60">
            Quest Terbaru
          </h2>
          <Link href="/quests" className="text-xs font-medium" style={{ color: '#C9A227' }}>
            Lihat semua →
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center">
              <span
                className="inline-block w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: '#1B2E52', borderTopColor: 'transparent' }}
              />
            </div>
          ) : recentQuests.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
              Belum ada quest yang dibuat.
            </div>
          ) : (
            recentQuests.map((q) => <QuestRow key={q.id} quest={q} />)
          )}
        </div>
      </div>
    </div>
  )
}
