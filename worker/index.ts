/// <reference lib="webworker" />

const _self = self as unknown as ServiceWorkerGlobalScope;

_self.addEventListener("push", (event) => {
  if (event.data) {
    try {
      const data = event.data.json();

      const options: any = {
        body: data.body,
        icon: data.icon || "/icon.png",
        badge: data.badge || "/icon.png",
        data: data.url || "/dashboard",
        vibrate: [200, 100, 200],
        requireInteraction: false,
        silent: false,
        tag: "sgd-notification",
        renotify: true,
        actions: [
          {
            action: "open",
            title: "Buka →",
          },
          {
            action: "dismiss",
            title: "Tutup",
          },
        ],
      };

      event.waitUntil(
        _self.registration.showNotification(data.title || "⚔ SGD Guild", options)
      );
    } catch (e) {
      // Fallback for non-JSON payload
      const options: any = {
        body: event.data.text(),
        icon: "/icon.png",
        vibrate: [200, 100, 200],
      };
      event.waitUntil(
        _self.registration.showNotification("SGD Guild Center", options)
      );
    }
  }
});

_self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const urlToOpen = event.notification.data || "/dashboard";

  event.waitUntil(
    _self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if ("focus" in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      if (_self.clients.openWindow) {
        return _self.clients.openWindow(urlToOpen);
      }
    })
  );
});
