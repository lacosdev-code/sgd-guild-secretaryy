import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPushNotification } from '@/lib/webpush'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { questId, title, assignedTo, type } = body

    if (!title) {
      return NextResponse.json({ error: 'Missing notification details' }, { status: 400 })
    }

    const supabase = createAdminClient()

    let userIdsToNotify: string[] = []

    if (type === 'new_quest') {
      if (assignedTo) {
        // Notify the specific user it's assigned to
        userIdsToNotify.push(assignedTo)
      } else {
        // Notify all adventurers if it's unassigned
        const { data: users } = await supabase.from('users').select('id').eq('role', 'adventurer')
        if (users) {
          userIdsToNotify = users.map(u => u.id)
        }
      }
    }

    // Send push notifications to all determined users
    const pushPromises = userIdsToNotify.map(userId => 
      sendPushNotification(userId, {
        title: assignedTo ? 'Tugas Baru Untukmu ⚔️' : 'Quest Baru Tersedia 🛡️',
        body: title,
        url: questId ? `/quests/${questId}` : '/dashboard'
      })
    )

    await Promise.all(pushPromises)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Push notify error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
