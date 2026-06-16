import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DEFAULT_SKILLS, WORK_SKILL_LEVELS } from '@/lib/progression'

const GM_ROLES = ['guild_master', 'guild_secretary']

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        nama: true,
        role: true,
        division: true,
        totalPoints: true,
        avatarUrl: true,
        employeeLevel: true,
        awakeningLevel: true,
        workLevel: true,
        skills: {
          select: { skillName: true, skillLevel: true }
        }
      }
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Ensure all default skills exist in response even if not in DB yet
    const skillMap = Object.fromEntries(user.skills.map(s => [s.skillName, s.skillLevel]))
    const skills = DEFAULT_SKILLS.map(name => ({ skillName: name, skillLevel: skillMap[name] || 'F' }))

    return NextResponse.json({ ...user, skills })
  } catch (e: unknown) {
    const err = e as Error
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const requestor = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!requestor || !GM_ROLES.includes(requestor.role)) {
    return NextResponse.json({ error: 'Forbidden: GM only' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { awakeningLevel, workLevel, skills } = body

    // Validate awakeningLevel (1-7)
    if (awakeningLevel !== undefined && (awakeningLevel < 1 || awakeningLevel > 7)) {
      return NextResponse.json({ error: 'awakeningLevel must be between 1 and 7' }, { status: 400 })
    }
    // Validate workLevel (F-S)
    if (workLevel !== undefined && !WORK_SKILL_LEVELS.includes(workLevel)) {
      return NextResponse.json({ error: 'Invalid workLevel' }, { status: 400 })
    }

    // Update user progression fields
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(awakeningLevel !== undefined && { awakeningLevel }),
        ...(workLevel !== undefined && { workLevel }),
      }
    })

    // Upsert skills if provided
    if (skills && Array.isArray(skills)) {
      for (const skill of skills) {
        if (!skill.skillName || !WORK_SKILL_LEVELS.includes(skill.skillLevel)) continue
        await prisma.userSkill.upsert({
          where: { userId_skillName: { userId: params.id, skillName: skill.skillName } },
          create: { userId: params.id, skillName: skill.skillName, skillLevel: skill.skillLevel },
          update: { skillLevel: skill.skillLevel },
        })
      }
    }

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (e: unknown) {
    const err = e as Error
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
