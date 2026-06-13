import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { questSchema } from '@/lib/validators/schemas'

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
  
  const parsed = questSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }
  const validBody = parsed.data

  const isGM = (session.user as { role?: string }).role === 'guild_master'

  const quest = await prisma.quest.create({
    data: {
      title: validBody.title,
      description: validBody.description || null,
      assignedTo: isGM ? (validBody.assignedTo || null) : null,
      createdBy: session.user.id,
      urgency: validBody.urgency || 'Routine',
      difficulty: isGM ? (validBody.difficulty as any || null) : null,
      deadline: validBody.deadline ? new Date(validBody.deadline) : null,
      successParameter: validBody.successParameter || null,
      rewardPoints: isGM && validBody.rewardPoints ? Number(validBody.rewardPoints) : null,
      status: isGM ? (validBody.status as any || 'Draft') : 'Draft',
      briefAttachmentUrl: validBody.briefAttachmentUrl || null,
      detailCompleted: validBody.detailCompleted || false,
      projectId: validBody.projectId || null,
    },
    include: {
      assignee: { select: { id: true, nama: true } },
      creator: { select: { id: true, nama: true } },
    },
  })

  // Notify the assignee
  if (quest.assignedTo) {
    // 1. In-app notification
    await prisma.notification.create({
      data: {
        userId: quest.assignedTo,
        title: '⚔ Quest Baru Untukmu',
        message: `Kamu mendapat quest baru: "${quest.title}"`,
        link: `/quests/${quest.id}`,
      },
    })
    
    // 2. Email & Push notification
    import('@/lib/notification').then(({ sendNotificationToUser }) => {
      sendNotificationToUser({
        userId: quest.assignedTo as string,
        title: '⚔ Quest Baru Untukmu',
        body: `Kamu mendapat quest baru: "${quest.title}". Segera cek rinciannya dan kerjakan!`,
        emailType: 'Quest Assigned',
        questId: quest.id,
        url: `/quests/${quest.id}`,
      }).catch(console.error)
    })
  }

  return NextResponse.json(quest, { status: 201 })
}
