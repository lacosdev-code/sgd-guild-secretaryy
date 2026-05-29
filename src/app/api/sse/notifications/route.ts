import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { addNotificationClient, removeNotificationClient } from '@/lib/sse'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  let controllerRef: ReadableStreamDefaultController<Uint8Array> | null = null

  const stream = new ReadableStream({
    start(controller) {
      controllerRef = controller
      addNotificationClient(userId, controller)

      // Send initial connection success message
      const encoder = new TextEncoder()
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`))

      // Keep connection alive with heartbeat
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'))
        } catch {
          clearInterval(interval)
        }
      }, 30000)

      req.signal.addEventListener('abort', () => {
        clearInterval(interval)
        removeNotificationClient(userId, controller)
      })
    },
    cancel() {
      if (controllerRef) {
        removeNotificationClient(userId, controllerRef)
      }
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  })
}
