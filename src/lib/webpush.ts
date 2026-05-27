import webpush from 'web-push'
import { createAdminClient } from '@/lib/supabase/admin'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
)

export async function sendPushNotification(userId: string, payload: { title: string, body: string, url?: string }) {
  const supabase = createAdminClient()

  // Get all subscriptions for this user
  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId)

  if (error || !subscriptions) {
    console.error('Failed to get push subscriptions', error)
    return
  }

  const pushPayload = JSON.stringify({
    title: payload.title,
    body: payload.body,
    data: { url: payload.url || '/' }
  })

  // Send to all endpoints
  const sendPromises = subscriptions.map(async (sub) => {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        },
        pushPayload
      )
    } catch (err: any) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        // Subscription has expired or is no longer valid, delete it
        await supabase.from('push_subscriptions').delete().eq('id', sub.id)
      } else {
        console.error('Error sending push notification:', err)
      }
    }
  })

  await Promise.all(sendPromises)
}
