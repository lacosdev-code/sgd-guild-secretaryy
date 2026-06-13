import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteFile } from '@/lib/storage'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string, attachmentId: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const attachment = await prisma.attachment.findUnique({
      where: { id: params.attachmentId }
    })

    if (!attachment) {
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 })
    }

    // Must be Guild Master or the uploader
    const isGM = (session.user as { role?: string }).role === 'guild_master'
    if (attachment.uploadedBy !== session.user.id && !isGM) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete from storage
    // fileUrl is typically "http://localhost:3000/api/files/misc/123.png"
    // We need to extract "misc/123.png"
    let relativePath = attachment.fileUrl
    const fileApiPrefix = '/api/files/'
    const apiIndex = relativePath.indexOf(fileApiPrefix)
    if (apiIndex !== -1) {
      relativePath = relativePath.substring(apiIndex + fileApiPrefix.length)
      await deleteFile(relativePath)
    }

    // Delete from DB
    await prisma.attachment.delete({
      where: { id: attachment.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error: unknown) {
    const err = error as Error;
    // Sanitize error exposure
    console.error('Attachment delete error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
