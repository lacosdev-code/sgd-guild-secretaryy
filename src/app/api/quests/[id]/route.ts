import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

  const updateData: any = {}
  if ('title' in body) updateData.title = body.title
  if ('description' in body) updateData.description = body.description
  if ('assignedTo' in body) updateData.assignedTo = body.assignedTo
  if ('urgency' in body) updateData.urgency = body.urgency
  if ('difficulty' in body) updateData.difficulty = body.difficulty
  if ('deadline' in body) updateData.deadline = body.deadline ? new Date(body.deadline) : null
  if ('successParameter' in body) updateData.successParameter = body.successParameter
  if ('rewardPoints' in body) updateData.rewardPoints = body.rewardPoints ? parseInt(body.rewardPoints) : null
  if ('status' in body) updateData.status = body.status
  if ('briefAttachmentUrl' in body) updateData.briefAttachmentUrl = body.briefAttachmentUrl
  if ('detailCompleted' in body) updateData.detailCompleted = body.detailCompleted
  if (body.detailCompleted === true) updateData.detailCompletedAt = new Date()

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

  // Only GM can delete
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user?.role !== 'guild_master') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.quest.delete({ where: { id: params.id } })
  return new NextResponse(null, { status: 204 })
}
