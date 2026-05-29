import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/quests/[id]/comments
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const comments = await prisma.questComment.findMany({
    where: { questId: params.id },
    include: { user: { select: { id: true, nama: true, avatarUrl: true } } },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(comments)
}

// POST /api/quests/[id]/comments
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Content required' }, { status: 400 })

  const comment = await prisma.questComment.create({
    data: {
      questId: params.id,
      userId: session.user.id,
      content: content.trim(),
    },
    include: { user: { select: { id: true, nama: true, avatarUrl: true } } },
  })

  return NextResponse.json(comment, { status: 201 })
}
