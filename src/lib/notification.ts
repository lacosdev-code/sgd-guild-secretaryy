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

    // Email sending disabled by user request
    emailStatus = 'Disabled'
    emailError = 'Email notification is disabled'

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
