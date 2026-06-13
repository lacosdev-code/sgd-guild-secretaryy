type RateLimitState = { count: number; resetAt: number }

const uploadLimits = new Map<string, RateLimitState>()
const chatLimits = new Map<string, RateLimitState>()

// Memory Monitor & Cleanup
setInterval(() => {
  const now = Date.now()
  
  // Cleanup uploadLimits
  uploadLimits.forEach((state, key) => {
    if (now > state.resetAt) {
      uploadLimits.delete(key)
    }
  })
  
  // Cleanup chatLimits
  chatLimits.forEach((state, key) => {
    if (now > state.resetAt) {
      chatLimits.delete(key)
    }
  })

  // Size Warnings
  if (uploadLimits.size > 1000) {
    console.warn(`[RateLimit Warning] uploadLimits size is ${uploadLimits.size}. Consider migrating to Redis if user base > 100.`)
  }
  if (chatLimits.size > 1000) {
    console.warn(`[RateLimit Warning] chatLimits size is ${chatLimits.size}. Consider migrating to Redis if user base > 100.`)
  }
}, 60 * 1000) // run cleanup every 1 minute

export function checkUploadLimit(userId: string): boolean {
  const now = Date.now()
  const state = uploadLimits.get(userId)

  // 1 hour in ms
  const WINDOW_MS = 60 * 60 * 1000
  const MAX_UPLOADS = 10

  if (!state || now > state.resetAt) {
    uploadLimits.set(userId, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (state.count >= MAX_UPLOADS) {
    return false
  }

  state.count++
  return true
}

export function checkChatLimit(userId: string): boolean {
  const now = Date.now()
  const state = chatLimits.get(userId)

  // 1 minute in ms
  const WINDOW_MS = 60 * 1000
  const MAX_MESSAGES = 15

  if (!state || now > state.resetAt) {
    chatLimits.set(userId, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (state.count >= MAX_MESSAGES) {
    return false
  }

  state.count++
  return true
}
