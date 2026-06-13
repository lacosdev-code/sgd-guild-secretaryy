import { Resend } from 'resend'
import { prisma } from './prisma'
import { sendPushNotification } from './push'
import webpush from 'web-push'

const resend = new Resend(process.env.RESEND_API_KEY)

interface NotificationPayload {
  userId: string
  title: string
  body: string
  emailType: string
  questId?: string
  url?: string
}

export async function sendNotificationToUser(payload: NotificationPayload) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { pushSubscriptions: true }
    })

    if (!user || !user.email) {
      console.error('User or email not found for notification')
      return false
    }

    let emailError = ''
    let emailStatus = 'Success'

    // 1. Send Email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'SGD Guild Secretary <onboarding@resend.dev>', // Use custom domain if verified
          to: user.email,
          subject: payload.title,
          html: `
            <div style="font-family: sans-serif; padding: 20px; background: #F5F3EE;">
              <div style="background: white; padding: 20px; border-radius: 8px;">
                <h2 style="color: #1B2E52; margin-top: 0;">${payload.title}</h2>
                <p style="color: #4B5563;">${payload.body.replace(/\n/g, '<br/>')}</p>
                ${payload.url ? `<a href="https://secretary.sgd-corp.com${payload.url}" style="display: inline-block; background: #C9A227; color: #1B2E52; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px;">Lihat Detail</a>` : ''}
              </div>
            </div>
          `
        })
      } catch (err: any) {
        emailError = err.message
        emailStatus = 'Failed'
      }
    } else {
      emailStatus = 'Failed'
      emailError = 'RESEND_API_KEY missing'
    }

    // 2. Send Push Notifications
    if (user.pushSubscriptions && user.pushSubscriptions.length > 0) {
      for (const sub of user.pushSubscriptions) {
        const pushSub = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        } as webpush.PushSubscription

        await sendPushNotification(pushSub, {
          title: payload.title,
          body: payload.body,
          data: { url: payload.url }
        })
      }
    }

    // 3. Log to GM Logs (EmailLog)
    await prisma.emailLog.create({
      data: {
        emailType: payload.emailType,
        recipient: user.email,
        questId: payload.questId || null,
        status: emailStatus,
        errorMessage: emailError || null
      }
    })

    return true
  } catch (error) {
    console.error('Notification error:', error)
    return false
  }
}
