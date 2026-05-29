import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import QuestSheetClient from './_client'

interface Props {
  params: { id: string }
}

export default async function QuestDetailPage({ params }: Props) {
  // ── Auth check ─────────────────────────────────────────────────────────────
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  // ── Fetch quest and related data ───────────────────────────────────────────
  const quest = await prisma.quest.findUnique({
    where: { id: params.id },
    include: {
      assignee: true,
      creator: true,
      attachments: {
        orderBy: { uploadedAt: 'asc' }
      },
      comments: {
        orderBy: { createdAt: 'asc' },
        include: {
          user: { select: { nama: true, role: true } }
        }
      }
    }
  })

  if (!quest) notFound()

  // ── Map Prisma to snake_case for the UI components ───────────────────────
  const mappedQuest = {
    id: quest.id,
    title: quest.title,
    description: quest.description,
    assignedTo: quest.assignedTo,
    createdBy: quest.createdBy,
    urgency: quest.urgency,
    difficulty: quest.difficulty,
    deadline: quest.deadline?.toISOString() || null,
    success_parameter: quest.successParameter,
    rewardPoints: quest.rewardPoints,
    status: quest.status,
    brief_attachment_url: quest.briefAttachmentUrl,
    detailCompleted: quest.detailCompleted,
    detail_completed_at: quest.detailCompletedAt?.toISOString() || null,
    created_at: quest.createdAt.toISOString(),
    updated_at: quest.updatedAt.toISOString(),
  }

  const mappedAssignee = quest.assignee ? {
    id: quest.assignee.id,
    nama: quest.assignee.nama,
    role: quest.assignee.role,
    totalPoints: quest.assignee.totalPoints,
    avatarUrl: quest.assignee.avatarUrl,
    created_at: quest.assignee.createdAt.toISOString(),
  } : null

  const mappedCreator = quest.creator ? {
    id: quest.creator.id,
    nama: quest.creator.nama,
    role: quest.creator.role,
    totalPoints: quest.creator.totalPoints,
    avatarUrl: quest.creator.avatarUrl,
    created_at: quest.creator.createdAt.toISOString(),
  } : null

  const mappedAttachments = quest.attachments.map(a => ({
    id: a.id,
    quest_id: a.questId,
    fileUrl: a.fileUrl,
    fileType: a.fileType,
    uploadedBy: a.uploadedBy,
    uploaded_at: a.uploadedAt.toISOString(),
  }))

  const mappedComments = quest.comments.map(c => ({
    id: c.id,
    quest_id: c.questId,
    user_id: c.userId,
    content: c.content,
    created_at: c.createdAt.toISOString(),
    users: c.user ? {
      nama: c.user.nama,
      role: c.user.role,
    } : null,
  }))

  return (
    <QuestSheetClient
      quest={mappedQuest as any}
      assignee={mappedAssignee as any}
      creator={mappedCreator as any}
      attachments={mappedAttachments as any}
      comments={mappedComments as any}
      currentUserId={session.user.id}
      currentUserRole={(session.user as any).role as any}
    />
  )
}
