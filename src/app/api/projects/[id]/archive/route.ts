import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ALLOWED_ROLES = ['guild_master', 'quest_giver', 'guild_secretary']

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user || !ALLOWED_ROLES.includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { archive } = await req.json() // archive: true | false
    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        isArchived: archive,
        archivedAt: archive ? new Date() : null,
      }
    })
    return NextResponse.json({ success: true, project })
  } catch (e: unknown) {
    const err = e as Error
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
