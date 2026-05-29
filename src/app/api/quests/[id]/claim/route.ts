import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/quests/[id]/claim  (adventurer submit quest)
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const quest = await prisma.quest.findUnique({ where: { id: params.id } })
  if (!quest) return NextResponse.json({ error: 'Quest not found' }, { status: 404 })

  await prisma.quest.update({
    where: { id: params.id },
    data: { status: 'Submitted' },
  })

  // Notify GM(s)
  const gms = await prisma.user.findMany({ where: { role: 'guild_master' } })
  await prisma.notification.createMany({
    data: gms.map((gm) => ({
      userId: gm.id,
      title: '📋 Quest Perlu Review',
      message: `Quest "${quest.title}" sudah disubmit dan menunggu persetujuan.`,
      link: `/quests/${quest.id}`,
    })),
  })

  return NextResponse.json({ success: true })
}
