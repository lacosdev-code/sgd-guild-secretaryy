import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const pointLogs = await prisma.pointLog.findMany({
    where: { userId: params.id },
    orderBy: { createdAt: 'desc' },
  })

  // Map to snake_case for UI compatibility
  const mapped = pointLogs.map(log => ({
    id: log.id,
    user_id: log.userId,
    quest_id: log.questId,
    delta: log.delta,
    reason: log.reason,
    created_at: log.createdAt.toISOString(),
  }))

  return NextResponse.json(mapped)
}
