import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { questUpdateSchema } from '@/lib/validators/schemas'

// GET /api/quests/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const quest = await prisma.quest.findUnique({
    where: { id: params.id },
    include: {
      assignee: { select: { id: true, nama: true, avatarUrl: true, role: true } },
      creator: { select: { id: true, nama: true } },
      comments: {
        include: { user: { select: { id: true, nama: true, avatarUrl: true } } },
        orderBy: { createdAt: 'asc' },
      },
      attachments: {
        include: { user: { select: { id: true, nama: true } } },
        orderBy: { uploadedAt: 'desc' },
      },
    },
  })

  if (!quest) return NextResponse.json({ error: 'Not Found' }, { status: 404 })

  return NextResponse.json(quest)
}

// PATCH /api/quests/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const parsed = questUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }
  const validBody = parsed.data

  const isGM = (session.user as { role?: string }).role === 'guild_master'

  const currentQuest = await prisma.quest.findUnique({ where: { id: params.id } })
  if (!currentQuest) return NextResponse.json({ error: 'Not Found' }, { status: 404 })

  if (!isGM && currentQuest.createdBy !== session.user.id && currentQuest.assignedTo !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updateData: any = {}
  if ('title' in validBody) updateData.title = validBody.title
  if ('description' in validBody) updateData.description = validBody.description
  if ('urgency' in validBody) updateData.urgency = validBody.urgency
  if ('deadline' in validBody) updateData.deadline = validBody.deadline ? new Date(validBody.deadline) : null
  if ('successParameter' in validBody) updateData.successParameter = validBody.successParameter
  if ('briefAttachmentUrl' in validBody) updateData.briefAttachmentUrl = validBody.briefAttachmentUrl
  if ('detailCompleted' in validBody) updateData.detailCompleted = validBody.detailCompleted
  if (validBody.detailCompleted === true) updateData.detailCompletedAt = new Date()
  if ('projectId' in validBody) updateData.projectId = validBody.projectId

  // GM only fields
  if (isGM) {
    if ('assignedTo' in validBody) updateData.assignedTo = validBody.assignedTo
    if ('difficulty' in validBody) updateData.difficulty = validBody.difficulty
    if ('rewardPoints' in validBody) updateData.rewardPoints = validBody.rewardPoints ? Number(validBody.rewardPoints) : null
    if ('status' in validBody) updateData.status = validBody.status
  }

  const quest = await prisma.quest.update({
    where: { id: params.id },
    data: updateData,
    include: {
      assignee: { select: { id: true, nama: true, avatarUrl: true } },
      creator: { select: { id: true, nama: true } },
    },
  })

  // --- Notification Triggers ---
  import('@/lib/notification').then(({ sendNotificationToUser }) => {
    // 1. Assigned to a new person
    if ('assignedTo' in validBody && validBody.assignedTo && validBody.assignedTo !== currentQuest.assignedTo) {
      prisma.notification.create({
        data: { userId: validBody.assignedTo, title: '⚔ Quest Baru', message: `Quest "${quest.title}" ditugaskan ke kamu.`, link: `/quests/${quest.id}` }
      }).then()
      
      sendNotificationToUser({
        userId: validBody.assignedTo,
        title: '⚔ Quest Baru Untukmu',
        body: `Kamu mendapat penugasan quest baru: "${quest.title}".`,
        emailType: 'Quest Assigned',
        questId: quest.id,
        url: `/quests/${quest.id}`,
      }).catch(console.error)
    }

    // 2. Status Changed
    if ('status' in validBody && validBody.status !== currentQuest.status) {
      if (validBody.status === 'Completed') {
        // Notify Creator/GM
        prisma.notification.create({
          data: { userId: quest.createdBy, title: 'Quest Selesai', message: `"${quest.title}" menunggu verifikasi.`, link: `/quests/${quest.id}` }
        }).then()

        sendNotificationToUser({
          userId: quest.createdBy,
          title: '🛡 Quest Selesai',
          body: `Quest "${quest.title}" telah diselesaikan oleh ${quest.assignee?.nama}. Silakan lakukan verifikasi.`,
          emailType: 'Quest Completed',
          questId: quest.id,
          url: `/quests/${quest.id}`,
        }).catch(console.error)
      } else if (validBody.status === 'Approved' || validBody.status === 'Rejected') {
        // Notify Assignee
        if (quest.assignedTo) {
          const title = validBody.status === 'Approved' ? '✅ Quest Terverifikasi' : '❌ Quest Ditolak'
          const msg = validBody.status === 'Approved' ? `Kerja bagus! "${quest.title}" diverifikasi.` : `Revisi dibutuhkan untuk "${quest.title}".`
          
          prisma.notification.create({
            data: { userId: quest.assignedTo, title, message: msg, link: `/quests/${quest.id}` }
          }).then()

          sendNotificationToUser({
            userId: quest.assignedTo,
            title: title,
            body: msg,
            emailType: `Quest ${validBody.status}`,
            questId: quest.id,
            url: `/quests/${quest.id}`,
          }).catch(console.error)
        }
      }
    }
  }).catch(console.error)

  return NextResponse.json(quest)
}

// DELETE /api/quests/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isGM = (session.user as { role?: string }).role === 'guild_master'

  const currentQuest = await prisma.quest.findUnique({ where: { id: params.id } })
  if (!currentQuest) return NextResponse.json({ error: 'Not Found' }, { status: 404 })

  // Only GM or creator of a Draft quest can delete
  if (!isGM) {
    if (currentQuest.createdBy !== session.user.id || currentQuest.status !== 'Draft') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  await prisma.quest.delete({ where: { id: params.id } })
  return new NextResponse(null, { status: 204 })
}
