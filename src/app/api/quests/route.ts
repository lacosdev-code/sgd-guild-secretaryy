import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/quests
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const assignedTo = searchParams.get('assignedTo')
  const status = searchParams.get('status')
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

  const quests = await prisma.quest.findMany({
    where: {
      ...(assignedTo ? { assignedTo } : {}),
      ...(status ? { status: status as any } : {}),
    },
    include: {
      assignee: { select: { id: true, nama: true, avatarUrl: true } },
      creator: { select: { id: true, nama: true } },
    },
    orderBy: { createdAt: 'desc' },
    ...(limit ? { take: limit } : {}),
  })

  return NextResponse.json(quests)
}

// POST /api/quests
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const isGM = (session.user as any).role === 'guild_master'

  const quest = await prisma.quest.create({
    data: {
      title: body.title,
      description: body.description || null,
      assignedTo: isGM ? (body.assignedTo || null) : null,
      createdBy: session.user.id,
      urgency: body.urgency || 'Routine',
      difficulty: isGM ? (body.difficulty || null) : null,
      deadline: body.deadline ? new Date(body.deadline) : null,
      successParameter: body.successParameter || null,
      rewardPoints: isGM && body.rewardPoints ? parseInt(body.rewardPoints) : null,
      status: isGM ? (body.status || 'Draft') : 'Draft',
      briefAttachmentUrl: body.briefAttachmentUrl || null,
      detailCompleted: body.detailCompleted || false,
    },
    include: {
      assignee: { select: { id: true, nama: true } },
      creator: { select: { id: true, nama: true } },
    },
  })

  // Notify the assignee
  if (quest.assignedTo) {
    await prisma.notification.create({
      data: {
        userId: quest.assignedTo,
        title: '⚔ Quest Baru Untukmu',
        message: `Kamu mendapat quest baru: "${quest.title}"`,
        link: `/quests/${quest.id}`,
      },
    })
  }

  return NextResponse.json(quest, { status: 201 })
}
