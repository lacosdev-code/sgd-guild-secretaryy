import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteFile } from '@/lib/storage'

// DELETE /api/vault/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }

  try {
    const item = await prisma.vaultItem.findUnique({ where: { id } })
    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Only the uploader or a guild_master can delete
    const isGuildMaster = (session.user as any).role === 'guild_master'
    if (item.uploadedById !== session.user.id && !isGuildMaster) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.vaultItem.delete({ where: { id } })

    // Sync physical file deletion
    if (item.fileUrl && item.fileUrl.includes('/api/files/')) {
      const relativePath = item.fileUrl.split('/api/files/')[1]
      if (relativePath) {
        await deleteFile(relativePath)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[API Error]', error) // log server-side
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
