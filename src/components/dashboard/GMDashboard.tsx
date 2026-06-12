'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { useQuests, deriveGMStats, isOverdue } from '@/hooks/useQuests'
import { formatDeadline, getRankColor, getStatusColor } from '@/lib/utils'
import type { QuestWithAssignee } from '@/hooks/useQuests'

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
  
  // Specific warnings
  const warnings = []
  if (quest.status === 'Draft' || (!quest.detailCompleted && !['Approved', 'Completed', 'Cancelled', 'Aborted'].includes(quest.status))) {
    warnings.push('Detail Kurang')
  }
  if (overdue) {
    warnings.push('Overdue')
  }

  return (
    <Link
      href={`/quests/${quest.id}`}
      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
    >
      <RankBadge rank={quest.difficulty} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {quest.urgency && quest.urgency !== 'Routine' && (
            <span className={`text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded-sm ${
              quest.urgency === 'Emergency' ? 'bg-red-100 text-red-700' : 
              quest.urgency === 'Priority' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {quest.urgency}
            </span>
          )}
          <p className={`text-sm font-semibold truncate ${overdue ? 'text-danger' : 'text-charcoal'}`}>
            {quest.title}
          </p>
        </div>
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

      {warnings.length > 0 && (
        <div className="flex flex-col gap-1 items-end">
          {warnings.map(w => (
            <span key={w} className={`text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
              w === 'Overdue' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
            }`}>
              {w}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}

// ── Alert banner ─────────────────────────────────────────────────────────────
function AlertBanner({ count, label, type = 'warning' }: { count: number; label: string; type?: 'warning' | 'danger' | 'info' }) {
  if (count === 0) return null
  
  const colors = {
    warning: { bg: '#FFFBEB', border: '#F59E0B22', text: '#92400E' },
    danger: { bg: '#FDF2F0', border: '#993C1D22', text: '#993C1D' },
    info: { bg: '#F0F9FF', border: '#BAE6FD', text: '#0369A1' }
  }[type]

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-sm border"
      style={{ background: colors.bg, borderColor: colors.border, color: colors.text }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
      <span className="text-sm"><strong>{count}</strong> {label}</span>
    </div>
  )
}

export default function GMDashboard() {
  const { user } = useUser()
  const { quests } = useQuests({ limit: 100 })
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)

  const stats = deriveGMStats(quests)
  
  // Actionable Lists
  const submittedQuests = quests.filter(q => q.status === 'Submitted')
  const priorityQuests = quests.filter(q => (q.urgency === 'Emergency' || q.urgency === 'Priority') && !['Approved', 'Completed', 'Cancelled', 'Aborted'].includes(q.status))
  const incompleteQuests = quests.filter(q => !q.detailCompleted && !['Approved', 'Completed', 'Cancelled', 'Aborted'].includes(q.status))
  const overdueActiveQuests = quests.filter(q => isOverdue(q))

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── Greeting ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-charcoal">
          Selamat datang, <span style={{ color: '#1B2E52' }}>{user?.nama}</span>
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Fokuskan perhatian Anda pada daftar prioritas operasional hari ini.
        </p>
      </div>

      {/* ── Alert banners ─────────────────────────────────────────────── */}
      <div className="space-y-2">
        <AlertBanner count={stats.submitted} label="quest menunggu persetujuan (Awaiting Approval)" type="info" />
        <AlertBanner count={stats.overdue} label="quest melewati deadline" type="danger" />
        <AlertBanner count={stats.incomplete} label="quest belum memiliki detail operasional lengkap" type="warning" />
      </div>

      {/* ── Stat grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Submitted" value={stats.submitted} warning={stats.submitted > 0} />
        <StatCard label="Overdue" value={stats.overdue} danger={stats.overdue > 0} />
        <StatCard label="Detail Kurang" value={stats.incomplete} warning={stats.incomplete > 0} />
        <StatCard label="SGD Points" value={user?.totalPoints ?? 0} accent />
      </div>

      {/* ── Action buttons ────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/quests/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: '#1B2E52', color: '#C9A227' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Mulai Delegasi Baru
        </Link>

        <button
          onClick={async () => {
            const { default: jsPDF } = await import('jspdf');
            const { default: autoTable } = await import('jspdf-autotable');
            const doc = new jsPDF();
            
            try {
              const img = new window.Image();
              img.src = '/icon-192.png';
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
              });
              doc.addImage(img, 'PNG', 14, 12, 12, 12);
              doc.setFontSize(18);
              doc.text("Laporan Operasional Guild", 29, 20);
            } catch {
              doc.setFontSize(18);
              doc.text("Laporan Operasional Guild", 14, 22);
            }
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            const date = new Date().toLocaleString('id-ID');
            doc.text(`Dicetak pada: ${date}`, 14, 30);
            doc.text(`Oleh: ${user?.nama || 'Guild Master'}`, 14, 35);
            
            const active = quests.filter(q => q.status === 'Active').length;
            const submitted = quests.filter(q => q.status === 'Submitted').length;
            const approved = quests.filter(q => q.status === 'Approved').length;
            const overdue = quests.filter(q => isOverdue(q)).length;
            
            doc.setFontSize(11);
            doc.setTextColor(40);
            doc.text(`Ringkasan: ${active} Active | ${submitted} Menunggu Review | ${approved} Selesai | ${overdue} Overdue`, 14, 45);

            const tableData = quests.map(q => [
              q.title,
              (q as any).assignee?.nama || 'Unassigned',
              q.urgency,
              q.status,
              q.deadline ? new Date(q.deadline).toLocaleDateString('id-ID') : '-',
            ]);

            autoTable(doc, {
              startY: 50,
              head: [['Judul Quest', 'PIC', 'Urgensi', 'Status', 'Deadline']],
              body: tableData,
              theme: 'grid',
              styles: { fontSize: 9, cellPadding: 3 },
              headStyles: { fillColor: [27, 46, 82] }, // Navy color
            });
            
            const pdfBlob = doc.output('blob');
            setPdfPreviewUrl(URL.createObjectURL(pdfBlob));
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold border transition-all hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-700"
          style={{ color: '#1B2E52' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span className="dark:text-gray-300">Export Laporan</span>
        </button>
      </div>

      {/* PDF Preview Modal */}
      {pdfPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-navy">Preview Laporan PDF</h2>
              <div className="flex items-center gap-3">
                <a
                  href={pdfPreviewUrl}
                  download={`Laporan_Guild_${new Date().toISOString().split('T')[0]}.pdf`}
                  className="px-4 py-2 text-sm font-bold text-white bg-navy hover:bg-navy/90 rounded-sm"
                >
                  Download PDF
                </a>
                <button
                  onClick={() => setPdfPreviewUrl(null)}
                  className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-sm"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 bg-gray-100 p-2">
              <iframe
                src={pdfPreviewUrl}
                className="w-full h-full border-0 bg-white"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Actionable Lists Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        
        {/* Awaiting Approval */}
        <div>
          <div className="flex items-center justify-between mb-3 border-b pb-2" style={{ borderColor: '#E8E5E0' }}>
            <h2 className="text-sm font-bold tracking-widest text-charcoal/80 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Awaiting Approval
            </h2>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 rounded-sm">{submittedQuests.length}</span>
          </div>
          <div className="bg-white rounded-sm border border-gray-200 overflow-hidden shadow-sm">
            {submittedQuests.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 italic">Tidak ada quest yang menunggu persetujuan.</div>
            ) : (
              submittedQuests.slice(0, 5).map(q => <QuestRow key={q.id} quest={q} />)
            )}
            {submittedQuests.length > 5 && (
              <Link href="/quests?status=Submitted" className="block text-center py-2 text-xs font-bold text-navy hover:bg-gray-50 border-t">
                Lihat semua ({submittedQuests.length})
              </Link>
            )}
          </div>
        </div>

        {/* Priority & Overdue */}
        <div>
          <div className="flex items-center justify-between mb-3 border-b pb-2" style={{ borderColor: '#E8E5E0' }}>
            <h2 className="text-sm font-bold tracking-widest text-charcoal/80 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              Priority & Kritis
            </h2>
          </div>
          <div className="bg-white rounded-sm border border-gray-200 overflow-hidden shadow-sm">
            {priorityQuests.length === 0 && overdueActiveQuests.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 italic">Situasi aman. Tidak ada quest kritis.</div>
            ) : (
              // Combine and deduplicate
              Array.from(new Set([...overdueActiveQuests, ...priorityQuests])).slice(0, 5).map(q => <QuestRow key={q.id} quest={q} />)
            )}
          </div>
        </div>
        
        {/* Detail Kurang */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3 border-b pb-2" style={{ borderColor: '#E8E5E0' }}>
            <h2 className="text-sm font-bold tracking-widest text-charcoal/80 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              Detail Operasional Kurang (Butuh Perhatian)
            </h2>
            <span className="text-xs font-bold bg-orange-100 text-orange-800 px-2 rounded-sm">{incompleteQuests.length}</span>
          </div>
          <div className="bg-white rounded-sm border border-gray-200 overflow-hidden shadow-sm">
            {incompleteQuests.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 italic">Semua quest memiliki instruksi yang baik.</div>
            ) : (
              incompleteQuests.slice(0, 5).map(q => <QuestRow key={q.id} quest={q} />)
            )}
             {incompleteQuests.length > 5 && (
              <Link href="/quests" className="block text-center py-2 text-xs font-bold text-navy hover:bg-gray-50 border-t">
                Lihat semua di Quest Log
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
