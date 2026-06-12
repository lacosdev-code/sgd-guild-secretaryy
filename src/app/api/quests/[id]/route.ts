import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { questUpdateSchema } from '@/lib/validators/schemas'

// GET /api/quests/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const quest = await prisma.quest.findUnique({
    where: { id: params.id },
    include: {
      assignee: { select: { id: true, nama: true, avatarUrl: true, role: true } },
      creator: { select: { id: true, nama: true } },
      comments: {
        include: { user: { select: { id: true, nama: true, avatarUrl: true } } },
        orderBy: { createdAt: 'asc' },
      },
      attachments: {
        include: { user: { select: { id: true, nama: true } } },
        orderBy: { uploadedAt: 'desc' },
      },
    },
  })

  if (!quest) return NextResponse.json({ error: 'Not Found' }, { status: 404 })

  return NextResponse.json(quest)
}

// PATCH /api/quests/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const parsed = questUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }
  const validBody = parsed.data

  const isGM = (session.user as any).role === 'guild_master'

  const currentQuest = await prisma.quest.findUnique({ where: { id: params.id } })
  if (!currentQuest) return NextResponse.json({ error: 'Not Found' }, { status: 404 })

  if (!isGM && currentQuest.createdBy !== session.user.id && currentQuest.assignedTo !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updateData: any = {}
  if ('title' in validBody) updateData.title = validBody.title
  if ('description' in validBody) updateData.description = validBody.description
  if ('urgency' in validBody) updateData.urgency = validBody.urgency
  if ('deadline' in validBody) updateData.deadline = validBody.deadline ? new Date(validBody.deadline) : null
  if ('successParameter' in validBody) updateData.successParameter = validBody.successParameter
  if ('briefAttachmentUrl' in validBody) updateData.briefAttachmentUrl = validBody.briefAttachmentUrl
  if ('detailCompleted' in validBody) updateData.detailCompleted = validBody.detailCompleted
  if (validBody.detailCompleted === true) updateData.detailCompletedAt = new Date()
  if ('projectId' in validBody) updateData.projectId = validBody.projectId

  // GM only fields
  if (isGM) {
    if ('assignedTo' in validBody) updateData.assignedTo = validBody.assignedTo
    if ('difficulty' in validBody) updateData.difficulty = validBody.difficulty
    if ('rewardPoints' in validBody) updateData.rewardPoints = validBody.rewardPoints ? Number(validBody.rewardPoints) : null
    if ('status' in validBody) updateData.status = validBody.status
  }

  const quest = await prisma.quest.update({
    where: { id: params.id },
    data: updateData,
    include: {
      assignee: { select: { id: true, nama: true, avatarUrl: true } },
      creator: { select: { id: true, nama: true } },
    },
  })

  return NextResponse.json(quest)
}

// DELETE /api/quests/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isGM = (session.user as any).role === 'guild_master'

  const currentQuest = await prisma.quest.findUnique({ where: { id: params.id } })
  if (!currentQuest) return NextResponse.json({ error: 'Not Found' }, { status: 404 })

  // Only GM or creator of a Draft quest can delete
  if (!isGM) {
    if (currentQuest.createdBy !== session.user.id || currentQuest.status !== 'Draft') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  await prisma.quest.delete({ where: { id: params.id } })
  return new NextResponse(null, { status: 204 })
}
