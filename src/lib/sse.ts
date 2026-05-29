type SSEController = ReadableStreamDefaultController<Uint8Array>

const chatClients = new Set<SSEController>()
const notificationClients = new Map<string, Set<SSEController>>()

// --- Chat SSE ---
export function broadcastChatEvent(data: any) {
  const payload = `data: ${JSON.stringify(data)}\n\n`
  const encoder = new TextEncoder()
  chatClients.forEach((ctrl) => {
    try {
      ctrl.enqueue(encoder.encode(payload))
    } catch {
      chatClients.delete(ctrl)
    }
  })
}

export function addChatClient(ctrl: SSEController) {
  chatClients.add(ctrl)
}

export function removeChatClient(ctrl: SSEController) {
  chatClients.delete(ctrl)
}

// --- Notifications SSE ---
export function sendNotificationToUser(userId: string, data: any) {
  const userClients = notificationClients.get(userId)
  if (!userClients) return

  const payload = `data: ${JSON.stringify(data)}\n\n`
  const encoder = new TextEncoder()
  userClients.forEach((ctrl) => {
    try {
      ctrl.enqueue(encoder.encode(payload))
    } catch {
      userClients.delete(ctrl)
    }
  })
  
  if (userClients.size === 0) {
    notificationClients.delete(userId)
  }
}

export function addNotificationClient(userId: string, ctrl: SSEController) {
  if (!notificationClients.has(userId)) {
    notificationClients.set(userId, new Set())
  }
  notificationClients.get(userId)!.add(ctrl)
}

export function removeNotificationClient(userId: string, ctrl: SSEController) {
  const userClients = notificationClients.get(userId)
  if (userClients) {
    userClients.delete(ctrl)
    if (userClients.size === 0) {
      notificationClients.delete(userId)
    }
  }
}
