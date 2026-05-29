import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import QuestForm from '@/components/quest/QuestForm'

interface Props {
  params: { id: string }
}

export default async function EditQuestPage({ params }: Props) {
  const session = await auth()

  // Auth check
  if (!session?.user) redirect('/login')

  // Role check — GM only
  const role = (session.user as any).role
  if (role !== 'guild_master') {
    redirect('/dashboard')
  }

  // Fetch the quest to edit
  const quest = await prisma.quest.findUnique({
    where: { id: params.id },
  })

  if (!quest) notFound()

  // Map to snake_case for the form component compatibility
  const mappedQuest = {
    id: quest.id,
    title: quest.title,
    description: quest.description,
    status: quest.status,
    difficulty: quest.difficulty,
    urgency: quest.urgency,
    assigned_to: quest.assignedTo,
    created_by: quest.createdBy,
    created_at: quest.createdAt.toISOString(),
    deadline: quest.deadline?.toISOString() || null,
    success_parameter: quest.successParameter,
    reward_points: quest.rewardPoints,
    brief_attachment_url: quest.briefAttachmentUrl,
    detail_completed: quest.detailCompleted,
  }

  // Prevent editing quests that are already Approved or Failed
  if (quest.status === 'Approved' || quest.status === 'Failed') {
    redirect(`/quests/${quest.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <QuestForm
        mode="edit"
        existingQuest={mappedQuest as any}
        currentUserId={session.user.id!}
      />
    </div>
  )
}
