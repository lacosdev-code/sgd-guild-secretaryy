import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { vaultItemSchema } from '@/lib/validators/schemas'
import fs from 'fs'
import path from 'path'
import { UPLOAD_DIR } from '@/lib/storage'

// GET /api/vault
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const arcId = searchParams.get('arcId')
  const projectId = searchParams.get('projectId')

  // Filter based on role
  const isGuildMaster = (session.user as any).role === 'guild_master'
  const where: any = {}

  if (!isGuildMaster) {
    where.visibility = { not: 'GM only' }
  }

  if (arcId) where.arcId = arcId
  if (projectId) where.projectId = projectId

  try {
    const items = await prisma.vaultItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        uploader: { select: { id: true, nama: true, avatarUrl: true } },
        arc: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
    })

    const itemsWithStatus = items.map(item => {
      let isMissing = false
      if (item.fileUrl && item.fileUrl.includes('/api/files/')) {
        const relativePath = item.fileUrl.split('/api/files/')[1]
        if (relativePath) {
          const fullPath = path.join(UPLOAD_DIR, relativePath)
          if (!fs.existsSync(fullPath)) {
            isMissing = true
          }
        }
      }
      return { ...item, isMissing }
    })

    return NextResponse.json(itemsWithStatus)
  } catch (error: any) {
    console.error('[API Error]', error) // log server-side
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST /api/vault
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    
    const parsed = vaultItemSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }
    const validData = parsed.data

    const newItem = await prisma.vaultItem.create({
      data: {
        title: validData.title,
        type: validData.type,
        summary: validData.summary || null,
        fileUrl: validData.fileUrl,
        visibility: validData.visibility || 'all',
        arcId: validData.arcId || null,
        projectId: validData.projectId || null,
        uploadedById: session.user.id,
      },
      include: {
        uploader: { select: { id: true, nama: true, avatarUrl: true } },
        arc: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch (error: any) {
    console.error('[API Error]', error) // log server-side
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
