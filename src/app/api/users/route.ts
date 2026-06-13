import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/users
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isGM = (session.user as any)?.role === 'guild_master'

  const users = await prisma.user.findMany({
    select: {
      id: true,
      nama: true,
      // Only Guild Masters can see everyone's email
      email: isGM,
      role: true,
      totalPoints: true,
      avatarUrl: true,
      createdAt: true,
    },
    orderBy: { totalPoints: 'desc' },
  })

  return NextResponse.json(users)
}
