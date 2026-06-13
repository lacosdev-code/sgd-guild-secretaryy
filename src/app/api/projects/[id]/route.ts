import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (!['guild_master', 'quest_giver', 'guild_secretary'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    // Prisma will cascade delete if relations are set up, but let's check quests.
    // If there are quests connected, we might want to unlink them or delete them.
    // Let's just unlink quests and delete the project. Or delete the project and it cascades if set in schema.
    // Let's see the schema first. Wait, if I just delete the project:
    await prisma.project.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
