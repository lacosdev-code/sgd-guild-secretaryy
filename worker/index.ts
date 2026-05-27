/// <reference lib="webworker" />
export default null;
declare let self: ServiceWorkerGlobalScope

// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// self.__WB_DISABLE_DEV_LOGS = true

// Listen to push events
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'Notification'
  const options = {
    body: data.body || 'You have a new message.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: data.data || {},
    vibrate: [200, 100, 200]
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Listen to notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  const url = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If the app is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus()
        }
      }
      // If app is not open, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(url)
      }
    })
  )
})
