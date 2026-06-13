import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ALLOWED_ROLES = ['guild_master', 'quest_giver', 'guild_secretary']

async function getAuthorizedUser(email: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !ALLOWED_ROLES.includes(user.role)) return null
  return user
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await getAuthorizedUser(session.user.email)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await req.json()
    const { name, arcId, status } = body

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(arcId !== undefined && { arcId: arcId || null }),
        ...(status !== undefined && { status }),
      }
    })
    return NextResponse.json(project)
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await getAuthorizedUser(session.user.email)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    await prisma.project.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

