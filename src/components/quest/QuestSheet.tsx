'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import StatusPill from '@/components/ui/StatusPill'
import { formatDeadline } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
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
      <div className="flex-1 border-t" style={{ borderColor: '#1B2E5218' }} />
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
    <div className="space-y-2">
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
      className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-[0.12em] uppercase transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
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
  const supabase              = createClient()
  const criteria              = parseSuccessCriteria(quest.success_parameter)

  const isGM          = currentUserRole === 'guild_master'
  const isAssignee    = quest.assigned_to === currentUserId
  const canSubmit     = isAssignee && quest.status === 'Active' && attachments.length > 0
  const canSubmitWarn = isAssignee && quest.status === 'Active' && attachments.length === 0
  const canApprove    = isGM && quest.status === 'Submitted'
  const isIncomplete  = !quest.detail_completed && quest.status !== 'Approved' && quest.status !== 'Failed'

  // ── Submit: update status + notify GM via N8N ──────────────────────────
  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      const { error: e } = await supabase
        .from('quests')
        .update({ status: 'Submitted', updated_at: new Date().toISOString() })
        .eq('id', quest.id)
      if (e) throw e

      // Fire-and-forget N8N webhook
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_SUBMISSION
      if (webhookUrl) {
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questId:   quest.id,
            questTitle: quest.title,
            assignedTo: quest.assigned_to,
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
      const res = await fetch(`/api/quest/${quest.id}/claim`, { method: 'POST' })
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
  async function handleGMAction(action: 'Approved' | 'Revise' | 'Failed') {
    setLoading(true)
    setError(null)
    try {
      if (action === 'Approved') {
        // Use API route — needs service role to award points
        const res = await fetch(`/api/quest/${quest.id}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        })
        if (!res.ok) {
          const { error: msg } = await res.json()
          throw new Error(msg ?? 'Gagal approve quest')
        }
      } else {
        // Revise / Failed — simple status update via client
        const { error: e } = await supabase
          .from('quests')
          .update({ status: action, updated_at: new Date().toISOString() })
          .eq('id', quest.id)
        if (e) throw e
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
      const { error: err } = await supabase.from('quest_comments').insert({
        quest_id: quest.id,
        user_id: currentUserId,
        content: newComment.trim()
      })
      if (err) throw err

      // Optional: notify assigned/gm using same API or webhook
      
      setNewComment('')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError('Gagal mengirim komentar.')
    } finally {
      setAddingComment(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Document shell ────────────────────────────────────────────── */}
      <div
        className="bg-white border"
        style={{ borderColor: '#DDD9D3' }}
      >
        {/* ── Header band ─────────────────────────────────────────────── */}
        <div
          className="px-6 py-5 border-b flex items-start justify-between gap-4"
          style={{ background: '#1B2E52', borderColor: '#1B2E5200' }}
        >
          <div className="flex items-start gap-3 min-w-0">
            {/* Sword icon */}
            <svg
              width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="#C9A227" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              className="shrink-0 mt-0.5"
            >
              <path d="m14.5 17.5 3 3a2.12 2.12 0 0 0 3-3l-9-9" />
              <path d="m3 3 4 4" /><path d="m14.5 6.5-1 1" />
              <path d="m6.5 14.5 1-1" /><path d="M2 20l7-7" />
              <path d="m3 12 9-9 6 6-9 9" />
            </svg>
            <h1
              className="text-lg font-bold leading-snug"
              style={{ color: '#F5F3EE', letterSpacing: '0.02em' }}
            >
              {quest.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge rank={quest.difficulty} size="lg" />
            <StatusPill status={quest.status} dot />
          </div>
        </div>

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
          <InfoRow label="Quest Giver" value={creator?.nama ?? '—'} />
          <InfoRow label="Assigned"    value={assignee?.nama ?? <em className="text-gray-400">Unassigned</em>} />
          <InfoRow
            label="Deadline"
            value={
              quest.deadline ? (
                <span style={{ color: new Date(quest.deadline) < new Date() && quest.status !== 'Approved' ? '#993C1D' : undefined }}>
                  {formatDeadline(quest.deadline)}
                </span>
              ) : (
                <em className="text-gray-400">Belum ditetapkan</em>
              )
            }
          />
        </div>

        {/* ── Objective ────────────────────────────────────────────────── */}
        <div className="px-6 py-5 space-y-4">
          <SectionBlock label="Objective">
            {quest.description ? (
              <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line">
                {quest.description}
              </p>
            ) : (
              <p className="text-sm italic text-gray-400">Deskripsi belum diisi.</p>
            )}
          </SectionBlock>

          {/* ── Success Criteria ─────────────────────────────────────── */}
          <SectionBlock label="Success Criteria">
            {criteria.length > 0 ? (
              <ul className="space-y-2">
                {criteria.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-charcoal">
                    <span
                      className="w-4 h-4 border flex items-center justify-center shrink-0 mt-0.5"
                      style={{ borderColor: '#1B2E5240' }}
                    >
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0F6E56"
                        strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm italic text-gray-400">Kriteria belum diisi.</p>
            )}
          </SectionBlock>

          {/* ── Reward ───────────────────────────────────────────────── */}
          <SectionBlock label="Reward">
            {quest.reward_points != null ? (
              <p className="text-2xl font-bold" style={{ color: '#C9A227' }}>
                +{quest.reward_points}{' '}
                <span className="text-base font-semibold" style={{ color: '#1B2E5260' }}>
                  SGD Points
                </span>
              </p>
            ) : (
              <p className="text-sm italic text-gray-400">Reward belum ditetapkan.</p>
            )}
          </SectionBlock>

          {/* Attachments section is now rendered separately via AttachmentUpload component in _client.tsx */}
          
          {/* ── Comments ───────────────────────────────────────────────── */}
          <SectionBlock label="Diskusi">
            <div className="space-y-4">
              {comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-charcoal">{comment.users?.nama || 'User'}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(comment.created_at).toLocaleString('id-ID', { hour: '2-digit', minute:'2-digit', day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-gray-400">Belum ada diskusi.</p>
              )}
              
              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tambahkan komentar..."
                  className="flex-1 px-3 py-2 text-sm border rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-navy"
                  disabled={addingComment}
                />
                <button
                  type="submit"
                  disabled={addingComment || !newComment.trim()}
                  className="px-4 py-2 bg-navy text-gold text-xs font-bold uppercase rounded disabled:opacity-50"
                >
                  Kirim
                </button>
              </form>
            </div>
          </SectionBlock>
        </div>

        {/* ── Action footer ─────────────────────────────────────────────── */}
        {(canSubmit || canSubmitWarn || canApprove || (!isGM && !quest.assigned_to && quest.status !== 'Draft') || (isGM && quest.status !== 'Approved' && quest.status !== 'Failed')) && (
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
                ⚔ Submit Quest
              </ActionButton>
            )}
            {canSubmitWarn && (
              <p className="text-xs flex items-center gap-1.5" style={{ color: '#993C1D' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Upload minimal 1 bukti sebelum bisa submit.
              </p>
            )}

            {/* GM: approve / revise / tolak */}
            {canApprove && (
              <>
                <ActionButton variant="primary" loading={loading} onClick={() => handleGMAction('Approved')}>
                  ✓ Approve
                </ActionButton>
                <ActionButton variant="ghost" loading={loading} onClick={() => handleGMAction('Revise')}>
                  Minta Revisi
                </ActionButton>
                <ActionButton variant="danger" loading={loading} onClick={() => handleGMAction('Failed')}>
                  Tolak Quest
                </ActionButton>
              </>
            )}

            {/* GM: edit incomplete / active quest */}
            {isGM && (quest.status === 'Draft' || quest.status === 'Active') && (
              <Link
                href={`/quests/${quest.id}/edit`}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-[0.12em] uppercase hover:opacity-80 transition-opacity"
                style={{ background: 'transparent', color: '#1B2E52', border: '1px solid #1B2E5230' }}
              >
                Edit Quest
              </Link>
            )}

            {/* Adventurer: Claim Unassigned Quest */}
            {!isGM && !quest.assigned_to && quest.status !== 'Draft' && (
              <ActionButton variant="primary" loading={loading} onClick={handleClaimQuest}>
                ✋ Claim Quest
              </ActionButton>
            )}
          </div>
        )}
      </div>

      {/* ── Back link ──────────────────────────────────────────────────── */}
      <div className="mt-5">
        <Link
          href="/quests"
          className="text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5 hover:opacity-70 transition-opacity"
          style={{ color: '#1B2E5280' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Kembali ke Quest List
        </Link>
      </div>
    </div>
  )
}
