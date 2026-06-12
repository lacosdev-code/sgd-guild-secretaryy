'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import StatusPill from '@/components/ui/StatusPill'
import { formatDeadline } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import type { Quest, Attachment, User } from '@/types'
import type { UserRole } from '@/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseSuccessCriteria(raw: string | null): string[] {
  if (!raw || raw.trim() === '') return []
  // Split by newline, bullet, or semicolon
  return raw
    .split(/\n|•|;/)
    .map((s) => s.replace(/^[-–—*✓✗\s]+/, '').trim())
    .filter(Boolean)
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DocDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-0">
      <span
        className="text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap shrink-0"
        style={{ color: '#1B2E5280' }}
      >
        {label}
      </span>
      <div className="flex-1 border-t border-dashed" style={{ borderColor: '#1B2E5230' }} />
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <span
        className="text-[10px] font-bold tracking-[0.18em] uppercase w-28 shrink-0"
        style={{ color: '#1B2E5260' }}
      >
        {label}
      </span>
      <span className="text-sm font-medium text-charcoal">{value}</span>
    </div>
  )
}

function SectionBlock({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <DocDivider label={label} />
      <div className="pt-1 pl-1">{children}</div>
    </div>
  )
}

function ActionButton({
  onClick,
  loading,
  variant = 'primary',
  children,
}: {
  onClick: () => void
  loading?: boolean
  variant?: 'primary' | 'danger' | 'ghost'
  children: React.ReactNode
}) {
  const styles = {
    primary: { background: '#1B2E52', color: '#C9A227', border: 'none' },
    danger:  { background: '#993C1D', color: '#FFFFFF', border: 'none' },
    ghost:   { background: 'transparent', color: '#1B2E52', border: '1px solid #1B2E5230' },
  }[variant]

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold tracking-[0.12em] uppercase transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
      style={styles}
    >
      {loading ? (
        <span
          className="inline-block w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'currentColor', borderTopColor: 'transparent' }}
        />
      ) : null}
      {children}
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface QuestSheetProps {
  quest: Quest
  assignee: User | null
  creator: User | null
  attachments: Attachment[]
  comments?: any[]
  currentUserId: string
  currentUserRole: UserRole
}

export default function QuestSheet({
  quest,
  assignee,
  creator,
  attachments,
  comments = [],
  currentUserId,
  currentUserRole,
}: QuestSheetProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)
  const router                = useRouter()
  const criteria              = parseSuccessCriteria(quest.success_parameter)

  const isGM          = currentUserRole === 'guild_master'
  const isAssignee    = quest.assignedTo === currentUserId
  const canSubmit     = isAssignee && (quest.status === 'Active' || quest.status === 'ActiveStar') && attachments.length > 0
  const canSubmitWarn = isAssignee && (quest.status === 'Active' || quest.status === 'ActiveStar') && attachments.length === 0
  const canApprove    = isGM && quest.status === 'Submitted'
  const isIncomplete  = !quest.detailCompleted && !['Approved', 'Completed', 'Cancelled', 'Aborted'].includes(quest.status)

  // ── Submit: update status + notify GM via N8N ──────────────────────────
  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/quests/${quest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Submitted' })
      })
      if (!res.ok) throw new Error('Gagal submit quest')

      // Fire-and-forget N8N webhook
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_SUBMISSION
      if (webhookUrl) {
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questId:   quest.id,
            questTitle: quest.title,
            assignedTo: quest.assignedTo,
          }),
        }).catch(() => {})
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Claim Quest (Adventurer claims unassigned quest) ────────────────────
  async function handleClaimQuest() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/quests/${quest.id}/claim`, { method: 'POST' })
      if (!res.ok) {
        const { error: msg } = await res.json()
        throw new Error(msg || 'Gagal mengambil quest ini.')
      }
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── GM action: calls API route (service role needed for points) ──────────
  async function handleGMAction(action: 'Approved' | 'Rejected' | 'Aborted' | 'Hold') {
    setLoading(true)
    setError(null)
    try {
      let reason = '';
      if (['Rejected', 'Aborted', 'Hold'].includes(action)) {
        reason = window.prompt(`Alasan untuk status ${action}?`) || '';
        if (!reason.trim()) {
           throw new Error(`Alasan wajib diisi.`);
        }
      }

      if (action === 'Approved') {
        const res = await fetch(`/api/quests/${quest.id}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        })
        if (!res.ok) {
          const { error: msg } = await res.json()
          throw new Error(msg ?? 'Gagal approve quest')
        }
        
        // Fire confetti!
        try {
          const confetti = (await import('canvas-confetti')).default
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#C9A227', '#1B2E52', '#ffffff']
          })
        } catch(e) {}
      } else {
        const body: any = { status: action };
        if (action === 'Rejected') body.rejectionReason = reason;
        if (action === 'Hold') body.holdReason = reason;
        if (action === 'Aborted') body.abortReason = reason;

        const res = await fetch(`/api/quests/${quest.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        if (!res.ok) throw new Error('Gagal update status quest')
      }
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Add Comment ───────────────────────────────────────────────────────────
  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return
    setAddingComment(true)
    try {
      const res = await fetch(`/api/quests/${quest.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.trim() })
      })
      if (!res.ok) throw new Error('Gagal menambah komentar')

      setNewComment('')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError('Gagal mengirim update.')
    } finally {
      setAddingComment(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Document shell (Parchment Feel) ───────────────────────────── */}
      <div
        className="bg-[#FAFAF8] border shadow-sm relative overflow-hidden"
        style={{ borderColor: '#E8E5E0' }}
      >
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#1B2E5210] to-transparent pointer-events-none" />

        {/* ── Header band ─────────────────────────────────────────────── */}
        <div
          className="px-6 py-5 border-b flex items-start justify-between gap-4"
          style={{ background: '#1B2E52', borderColor: '#1B2E5200' }}
        >
          <div className="flex items-start gap-3 min-w-0">
            {/* Scroll icon instead of sword */}
            <svg
              width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="#C9A227" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              className="shrink-0 mt-0.5"
            >
              <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M2 15h10" />
              <path d="m9 18 3-3-3-3" />
            </svg>
            <h1
              className="text-lg font-bold leading-snug"
              style={{ color: '#F5F3EE', letterSpacing: '0.02em' }}
            >
              {quest.title}
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
            {quest.urgency && (
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 border" style={{ borderColor: '#C9A22750', color: '#C9A227' }}>
                {quest.urgency}
              </span>
            )}
            <div className="flex items-center gap-2">
              <Badge rank={quest.difficulty} size="lg" />
              <StatusPill status={quest.status} dot />
            </div>
          </div>
        </div>

        {/* ── Approval Pending Pressure Banner ─────────────────────────── */}
        {quest.status === 'Submitted' && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3 text-amber-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M5 22h14" />
                <path d="M5 2h14" />
                <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
              </svg>
              <span className="text-sm font-bold tracking-wide uppercase">Review Pending</span>
            </div>
            <span className="text-xs text-amber-600 font-medium">Menunggu Validasi Guild Master</span>
          </div>
        )}

        {/* ── Incomplete warning ───────────────────────────────────────── */}
        {isIncomplete && isGM && (
          <div
            className="px-6 py-3 flex items-center gap-3 border-b text-sm"
            style={{ background: '#FFFBEB', borderColor: '#F59E0B22', color: '#92400E' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
            <span>
              <strong>Detail quest belum lengkap.</strong> Quest ini berisiko terkena penalti −20 poin saat 00:00.&nbsp;
              <Link href={`/quests/${quest.id}/edit`} className="underline font-semibold">
                Lengkapi sekarang →
              </Link>
            </span>
          </div>
        )}

        {/* ── Quest info grid ──────────────────────────────────────────── */}
        <div className="px-6 py-5 space-y-2.5 border-b" style={{ borderColor: '#E8E5E0' }}>
          <InfoRow label="Quest Giver" value={
            <div className="flex items-center gap-2">
              <Avatar url={creator?.avatarUrl} name={creator?.nama || '?'} size="sm" />
              <span>{creator?.nama ?? '—'}</span>
            </div>
          } />
          <InfoRow label="Assigned" value={
            assignee ? (
              <div className="flex items-center gap-2">
                <Avatar url={assignee.avatarUrl} name={assignee.nama} size="sm" />
                <span>{assignee.nama}</span>
              </div>
            ) : (
              <em className="text-gray-400">Unassigned</em>
            )
          } />
          <InfoRow
            label="Deadline"
            value={
              quest.deadline ? (
                <span className="font-mono text-[13px]" style={{ color: new Date(quest.deadline) < new Date() && !['Approved', 'Completed', 'Cancelled', 'Aborted'].includes(quest.status) ? '#993C1D' : undefined }}>
                  {formatDeadline(quest.deadline)}
                </span>
              ) : (
                <em className="text-gray-400">Belum ditetapkan</em>
              )
            }
          />
        </div>

        {/* ── Objective (Narrative) ────────────────────────────────────── */}
        <div className="px-6 py-5 space-y-6">
          <SectionBlock label="Tactical Objective">
            {quest.description ? (
              <div className="p-4 bg-white border border-gray-200 rounded-sm shadow-sm relative">
                {/* Subtle quote mark decoration */}
                <span className="absolute top-2 left-2 text-4xl text-gray-200 font-serif leading-none select-none">&quot;</span>
                <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line relative z-10 pl-6 italic font-serif" style={{ color: '#2B3B4E' }}>
                  {quest.description}
                </p>
                {quest.brief_attachment_url && (
                  <div className="mt-4 pl-6 relative z-10">
                    <a 
                      href={quest.brief_attachment_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy bg-navy/5 px-3 py-2 border border-navy/10 hover:bg-navy/10 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                      Lihat Lampiran Referensi
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm italic text-gray-400">Deskripsi belum diisi.</p>
                {quest.brief_attachment_url && (
                  <div>
                    <a 
                      href={quest.brief_attachment_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy bg-navy/5 px-3 py-2 border border-navy/10 hover:bg-navy/10 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                      Lihat Lampiran Referensi
                    </a>
                  </div>
                )}
              </div>
            )}
          </SectionBlock>

          {/* ── Success Criteria (Checklist) ───────────────────────────── */}
          <SectionBlock label="Definition of Done">
            {criteria.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4">
                <ul className="space-y-3">
                  {criteria.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-charcoal group">
                      <div className="w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 mt-0.5 bg-gray-50 border-gray-300">
                        {/* Fake checkbox appearance */}
                      </div>
                      <span className="leading-snug">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm italic text-gray-400">Kriteria belum diisi.</p>
            )}
          </SectionBlock>

          {/* ── Reward ───────────────────────────────────────────────── */}
          <SectionBlock label="Reward">
            {quest.rewardPoints != null ? (
              <p className="text-2xl font-bold flex items-center gap-2" style={{ color: '#C9A227' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v2M12 16v2M9.5 9A2.5 2.5 0 0 1 12 7.5h.5a2 2 0 0 1 0 4H12a2 2 0 0 0 0 4h.5A2.5 2.5 0 0 0 14.5 14" />
                </svg>
                +{quest.rewardPoints}{' '}
                <span className="text-[10px] font-bold tracking-widest uppercase mt-1" style={{ color: '#1B2E5260' }}>
                  SGD Points
                </span>
              </p>
            ) : (
              <p className="text-sm italic text-gray-400">Reward belum ditetapkan.</p>
            )}
          </SectionBlock>

          {/* ── Operational Updates ────────────────────────────────────── */}
          <SectionBlock label="Operational Updates">
            <div className="space-y-4">
              {comments.length > 0 ? (
                <div className="space-y-3 border-l-2 pl-4" style={{ borderColor: '#E8E5E0' }}>
                  {comments.map((comment) => (
                    <div key={comment.id} className="text-sm relative">
                      <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-gray-300 border-2 border-white" />
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[11px] uppercase tracking-wider text-charcoal">{comment.users?.nama || 'System'}</span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(comment.created_at).toLocaleString('id-ID', { hour: '2-digit', minute:'2-digit', day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <div className="p-3 bg-white border border-gray-200 rounded-sm shadow-sm text-gray-700 whitespace-pre-wrap">
                        {comment.content}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-gray-400 border-l-2 pl-4" style={{ borderColor: '#E8E5E0' }}>Belum ada log operasional.</p>
              )}
              
              <form onSubmit={handleAddComment} className="flex gap-2 pt-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Laporkan progres operasional..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-navy font-mono"
                  disabled={addingComment}
                />
                <button
                  type="submit"
                  disabled={addingComment || !newComment.trim()}
                  className="px-4 py-2 bg-navy text-gold text-xs font-bold uppercase tracking-wider rounded-sm disabled:opacity-50 hover:opacity-90"
                >
                  Log
                </button>
              </form>
            </div>
          </SectionBlock>
        </div>

        {/* ── Action footer ─────────────────────────────────────────────── */}
        {(canSubmit || canSubmitWarn || canApprove || (!isGM && !quest.assignedTo && quest.status !== 'Draft') || (isGM && !['Approved', 'Completed', 'Cancelled', 'Aborted'].includes(quest.status))) && (
          <div
            className="px-6 py-4 border-t flex flex-wrap items-center gap-3"
            style={{ background: '#F9F8F6', borderColor: '#E8E5E0' }}
          >
            {/* Error */}
            {error && (
              <p className="w-full text-xs font-medium" style={{ color: '#993C1D' }}>
                ⚠ {error}
              </p>
            )}

            {/* Adventurer: submit */}
            {canSubmit && (
              <ActionButton variant="primary" loading={loading} onClick={handleSubmit}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Submit for Review
              </ActionButton>
            )}
            {canSubmitWarn && (
              <p className="text-xs flex items-center gap-1.5" style={{ color: '#993C1D' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Upload minimal 1 bukti pelaksanaan operasional.
              </p>
            )}

            {/* GM: approve / revise / tolak */}
            {canApprove && (
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <ActionButton variant="primary" loading={loading} onClick={() => handleGMAction('Approved')}>
                  ✓ Validasi & Approve
                </ActionButton>
                <ActionButton variant="ghost" loading={loading} onClick={() => handleGMAction('Rejected')}>
                  Tolak (Revise)
                </ActionButton>
              </div>
            )}
            
            {/* GM: Hold / Abort if active */}
            {isGM && ['Active', 'ActiveStar', 'Submitted'].includes(quest.status) && (
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto ml-auto">
                 <ActionButton variant="ghost" loading={loading} onClick={() => handleGMAction('Hold')}>
                  Hold
                </ActionButton>
                <ActionButton variant="danger" loading={loading} onClick={() => handleGMAction('Aborted')}>
                  Abort
                </ActionButton>
              </div>
            )}

            <div className="flex-1" />

            {/* GM: edit quest */}
            {isGM && !['Approved', 'Completed', 'Cancelled', 'Aborted'].includes(quest.status) && (
              <Link
                href={`/quests/${quest.id}/edit`}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-[0.12em] uppercase hover:opacity-80 transition-opacity"
                style={{ background: 'transparent', color: '#1B2E52', border: '1px solid #1B2E5230' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                Edit
              </Link>
            )}

            {/* Adventurer: Claim Unassigned Quest */}
            {!isGM && !quest.assignedTo && quest.status !== 'Draft' && (
              <ActionButton
                variant="primary"
                loading={loading}
                onClick={() => {
                  if (confirm(`Yakin ingin mengambil tanggung jawab operasional quest "${quest.title}"?`)) {
                    handleClaimQuest()
                  }
                }}
              >
                ✋ Claim
              </ActionButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
