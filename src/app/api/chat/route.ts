import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { broadcastChatEvent } from '@/lib/sse'

// GET /api/chat
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '50')

  const messages = await prisma.guildChat.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, nama: true, avatarUrl: true } },
    },
  })

  return NextResponse.json(messages.reverse())
}

// POST /api/chat
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { message } = await req.json()
  if (!message?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 })

  const chat = await prisma.guildChat.create({
    data: {
      userId: session.user.id,
      message: message.trim(),
    },
    include: {
      user: { select: { id: true, nama: true, avatarUrl: true } },
    },
  })

  // Broadcast to SSE clients
  broadcastChatEvent(chat)

  return NextResponse.json(chat, { status: 201 })
}

// DELETE /api/chat
export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  const chat = await prisma.guildChat.findUnique({ where: { id } })
  if (!chat) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Only the creator or a guild_master can delete
  if (chat.userId !== session.user.id && session.user.role !== 'guild_master') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.guildChat.delete({ where: { id } })

  // Broadcast deletion event
  broadcastChatEvent({ type: 'delete', id })

  return NextResponse.json({ success: true })
}
