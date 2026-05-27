/**
 * Browser Notification API helper
 * Muncul di pojok layar seperti WhatsApp Web
 * Bekerja selama browser masih terbuka (meskipun tab tidak aktif)
 */

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  if (!('Notification' in window)) return false

  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false

  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function getNotificationPermission(): NotificationPermission | null {
  if (typeof window === 'undefined') return null
  if (!('Notification' in window)) return null
  return Notification.permission
}

export function showBrowserNotification(
  title: string,
  options?: {
    body?: string
    icon?: string
    link?: string
  }
) {
  if (typeof window === 'undefined') return
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  const notif = new Notification(title, {
    body: options?.body ?? '',
    icon: options?.icon ?? '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'sgd-guild', // Prevent duplicate stacking
  })

  // Click notification → buka halaman yang relevan
  notif.onclick = () => {
    window.focus()
    if (options?.link) {
      window.location.href = options.link
    }
    notif.close()
  }

  // Auto-close setelah 6 detik
  setTimeout(() => notif.close(), 6000)
}
