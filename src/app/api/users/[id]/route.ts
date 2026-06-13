import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
      totalPoints: true,
      avatarUrl: true,
      createdAt: true,
    }
  })

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Map to snake_case for UI compatibility
  const mapped = {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    totalPoints: user.totalPoints,
    avatarUrl: user.avatarUrl,
    created_at: user.createdAt,
  }

  return NextResponse.json(mapped)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  // Only users can edit their own profile, or admins
  if (session.user.id !== params.id && (session.user as { role?: string }).role !== 'guild_master') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const updateData: any = {}

  if (body.avatarUrl) {
    updateData.avatarUrl = body.avatarUrl
  }
  
  if (body.password) {
    updateData.passwordHash = await bcrypt.hash(body.password, 10)
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data: updateData,
  })

  return NextResponse.json({ success: true, user })
}
