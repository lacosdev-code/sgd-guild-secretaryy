import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
)

export async function POST(req: Request) {
  try {
    // Allow server-to-server calls via API secret key
    const authHeader = req.headers.get('authorization')
    const apiSecret = process.env.INTERNAL_API_SECRET

    let authorized = false
    if (apiSecret && authHeader === `Bearer ${apiSecret}`) {
      authorized = true
    } else {
      const session = await auth()
      if (session?.user?.id) authorized = true
    }

    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, title, message, url } = await req.json()

    if (!userId || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Fetch subscriptions via Prisma
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    })

    if (subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'No active subscriptions' })
    }

    const payload = JSON.stringify({
      title,
      body: message,
      url: url || '/dashboard',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
    })

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        )
      )
    )

    // Cleanup expired/revoked subscriptions
    const failedEndpoints: string[] = []
    results.forEach((result, idx) => {
      if (result.status === 'rejected') {
        const err = result.reason as any
        if (err.statusCode === 410 || err.statusCode === 404) {
          failedEndpoints.push(subscriptions[idx].endpoint)
        }
      }
    })

    if (failedEndpoints.length > 0) {
      await prisma.pushSubscription.deleteMany({
        where: { endpoint: { in: failedEndpoints } },
      })
    }

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    console.error('[API Error]', error) // log server-side
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
