'use client'

import QuestSheet from '@/components/quest/QuestSheet'
import AttachmentUpload from '@/components/quest/AttachmentUpload'
import type { Quest, Attachment, User } from '@/types'
import type { UserRole } from '@/types'

interface ClientProps {
  quest: Quest
  assignee: User | null
  creator: User | null
  attachments: Attachment[]
  comments: any[]
  currentUserId: string
  currentUserRole: UserRole
}

/**
 * Client wrapper — renders QuestSheet (info + action buttons) followed by
 * AttachmentUpload (evidence files). Both are client components because
 * they use hooks and interact with Supabase.
 */
export default function QuestSheetClient({
  quest,
  assignee,
  creator,
  attachments,
  comments,
  currentUserId,
  currentUserRole,
}: ClientProps) {
  // Adventurer can upload when their quest is Active or needs Revision
  // Guild Master can also upload on behalf of the Adventurer
  const canUpload =
    (quest.assigned_to === currentUserId || currentUserRole === 'guild_master') &&
    (quest.status === 'Active' || quest.status === 'Revise')

  // GM can also view attachments
  const showAttachments =
    canUpload ||
    attachments.length > 0 ||
    currentUserRole === 'guild_master'

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* ── Quest document ───────────────────────────────────────────── */}
      <QuestSheet
        quest={quest}
        assignee={assignee}
        creator={creator}
        attachments={attachments}
        comments={comments}
        currentUserId={currentUserId}
        currentUserRole={currentUserRole}
      />

      {/* ── Attachment upload / viewer ───────────────────────────────── */}
      {showAttachments && (
        <AttachmentUpload
          questId={quest.id}
          currentUserId={currentUserId}
          canUpload={canUpload}
          attachments={attachments}
        />
      )}

      {/* ── Back nav ─────────────────────────────────────────────────── */}
      <div className="pb-6">
        <a
          href="/quests"
          className="text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5 hover:opacity-70 transition-opacity"
          style={{ color: '#1B2E5280' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Kembali ke Quest Log
        </a>
      </div>
    </div>
  )
}
