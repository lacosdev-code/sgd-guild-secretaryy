import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { file_url, file_type } = await req.json()
    if (!file_url) return NextResponse.json({ error: 'Missing file_url' }, { status: 400 })

    const questId = params.id
    
    const quest = await prisma.quest.findUnique({
      where: { id: questId },
      select: { assigneeId: true, status: true },
    })

    if (!quest) return NextResponse.json({ error: 'Quest not found' }, { status: 404 })

    // Check permission: must be assignee or guild_master
    if (quest.assigneeId !== session.user.id && session.user.role !== 'guild_master') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const attachment = await prisma.attachment.create({
      data: {
        questId,
        fileUrl: file_url,
        fileType: file_type || 'application/octet-stream',
        uploadedBy: session.user.id,
      },
    })

    return NextResponse.json(attachment, { status: 201 })
  } catch (err: any) {
    console.error('Attachment insert error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
