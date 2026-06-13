import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { fileUrl, fileType } = await req.json()
    if (!fileUrl) return NextResponse.json({ error: 'Missing fileUrl' }, { status: 400 })

    const questId = params.id
    
    const quest = await prisma.quest.findUnique({
      where: { id: questId },
      select: { assignedTo: true, status: true },
    })

    if (!quest) return NextResponse.json({ error: 'Quest not found' }, { status: 404 })

    // Check permission: must be assignee or guild_master
    if (quest.assignedTo !== session.user.id && (session.user as { role?: string }).role !== 'guild_master') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const attachment = await prisma.attachment.create({
      data: {
        questId,
        fileUrl: fileUrl,
        fileType: fileType || 'application/octet-stream',
        uploadedBy: session.user.id,
      },
    })

    return NextResponse.json(attachment, { status: 201 })
  } catch (e: unknown) {
    const error = e as Error;
    console.error('[API Error]', error) // log server-side
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
