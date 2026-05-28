import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
)

export async function POST(req: Request) {
  try {
    // Basic auth check for backend service or super admin
    const authHeader = req.headers.get('authorization')
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // Allow if they have the Service Role Key (e.g. from Supabase Webhook or n8n)
    let isServerToServer = false
    if (authHeader && serviceRoleKey && authHeader === `Bearer ${serviceRoleKey}`) {
      isServerToServer = true
    }

    const supabase = createClient()
    
    if (!isServerToServer) {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const { userId, title, message, url } = await req.json()

    if (!userId || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Fetch subscriptions for this user
    // We use service role to bypass RLS if called via server-to-server
    const adminSupabase = isServerToServer ? createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    ) : supabase;

    const { data: subscriptions, error } = await adminSupabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      throw error
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'User has no active subscriptions' })
    }

    const payload = JSON.stringify({
      title,
      body: message,
      url: url || '/dashboard',
      icon: '/icon.png',
      badge: '/icon.png'
    })

    const results = await Promise.allSettled(
      subscriptions.map(sub => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        }
        return webpush.sendNotification(pushSubscription, payload)
      })
    )

    // Optional: cleanup failed subscriptions (e.g., if user revoked permission)
    const failedEndpoints: string[] = []
    results.forEach((result, idx) => {
      if (result.status === 'rejected') {
        const err = result.reason
        if (err.statusCode === 410 || err.statusCode === 404) {
          failedEndpoints.push(subscriptions[idx].endpoint)
        }
      }
    })

    if (failedEndpoints.length > 0) {
      await adminSupabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', failedEndpoints)
    }

    return NextResponse.json({ success: true, results })
  } catch (err: any) {
    console.error('Send push error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
