import webpush from 'web-push'
import { prisma } from '@/lib/prisma'

let isVapidInitialized = false

export async function sendPushNotification(userId: string, payload: { title: string, body: string, url?: string }) {
  if (!isVapidInitialized) {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    const privateKey = process.env.VAPID_PRIVATE_KEY
    if (publicKey && privateKey) {
      webpush.setVapidDetails(
        process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
        publicKey,
        privateKey
      )
      isVapidInitialized = true
    } else {
      console.warn('VAPID keys not set. Push notifications will not be sent.')
      return
    }
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  })

  if (!subscriptions.length) return

  const pushPayload = JSON.stringify({
    title: payload.title,
    body: payload.body,
    data: { url: payload.url || '/' }
  })

  const sendPromises = subscriptions.map(async (sub) => {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        pushPayload
      )
    } catch (error: unknown) {
    const err = error as Error;
      if ((err as any).statusCode === 410 || (err as any).statusCode === 404) {
        await prisma.pushSubscription.delete({ where: { id: sub.id } })
      } else {
        console.error('Error sending push notification:', err)
      }
    }
  })

  await Promise.all(sendPromises)
}
