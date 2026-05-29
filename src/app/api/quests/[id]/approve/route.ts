import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/quests/[id]/approve
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const gmUser = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (gmUser?.role !== 'guild_master') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const quest = await prisma.quest.findUnique({ where: { id: params.id } })
  if (!quest) return NextResponse.json({ error: 'Quest not found' }, { status: 404 })

  // Update quest status
  await prisma.quest.update({
    where: { id: params.id },
    data: { status: 'Approved' },
  })

  // Award points if assignee and reward set
  if (quest.assignedTo && quest.rewardPoints && quest.rewardPoints > 0) {
    await prisma.user.update({
      where: { id: quest.assignedTo },
      data: { totalPoints: { increment: quest.rewardPoints } },
    })
    await prisma.pointLog.create({
      data: {
        userId: quest.assignedTo,
        questId: quest.id,
        delta: quest.rewardPoints,
        reason: `Quest Approved: ${quest.title}`,
      },
    })
    await prisma.notification.create({
      data: {
        userId: quest.assignedTo,
        title: '✅ Quest Disetujui!',
        message: `Quest "${quest.title}" disetujui. +${quest.rewardPoints} SGD Points!`,
        link: `/quests/${quest.id}`,
      },
    })
  }

  return NextResponse.json({ success: true })
}
