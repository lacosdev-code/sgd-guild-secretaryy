import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPushNotification } from '@/lib/webpush'

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, reward_points } = await req.json()

    if (!title) {
      return NextResponse.json({ error: 'Missing title' }, { status: 400 })
    }

    // Admin client to fetch all subscriptions
    const adminSupabase = createAdminClient()
    
    // Get unique user IDs who have subscriptions
    const { data: subscriptions } = await adminSupabase
      .from('push_subscriptions')
      .select('user_id')
    
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'No subscriptions found' })
    }
    
    // Get unique user IDs
    const userIds = Array.from(new Set(subscriptions.map(s => s.user_id)))

    // Broadcast to all
    const promises = userIds.map(uid => 
      sendPushNotification(uid, {
        title: '🌟 New Quest Available!',
        body: `Quest "${title}" has been posted. Reward: ${reward_points || 0} pts.`,
        url: '/'
      })
    )

    await Promise.all(promises)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Notify new quest error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
