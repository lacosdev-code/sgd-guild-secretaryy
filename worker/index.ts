/// <reference lib="webworker" />

// To avoid TypeScript errors
declare let self: ServiceWorkerGlobalScope;

self.addEventListener("push", (event) => {
  if (event.data) {
    try {
      const data = event.data.json();

      const options: NotificationOptions = {
        body: data.body,
        icon: data.icon || "/icon.png",
        badge: data.badge || "/icon.png",
        data: data.url || "/",
        vibrate: [100, 50, 100],
        requireInteraction: true,
      };

      event.waitUntil(
        self.registration.showNotification(data.title || "SGD Notification", options)
      );
    } catch (e) {
      // Fallback for non-JSON payload
      const options: NotificationOptions = {
        body: event.data.text(),
        icon: "/icon.png",
        vibrate: [100, 50, 100],
      };
      event.waitUntil(
        self.registration.showNotification("SGD Guild Center", options)
      );
    }
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
