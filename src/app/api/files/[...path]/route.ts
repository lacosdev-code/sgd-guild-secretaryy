import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { UPLOAD_DIR } from '@/lib/storage'
import { auth } from '@/lib/auth'
import mime from 'mime-types'

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 })
  const filePath = path.join(UPLOAD_DIR, ...params.path)

  // Security: prevent directory traversal
  const safeUploadDir = UPLOAD_DIR.endsWith(path.sep) ? UPLOAD_DIR : UPLOAD_DIR + path.sep
  if (!filePath.startsWith(safeUploadDir)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const fileBuffer = fs.readFileSync(filePath)
  const mimeType = mime.lookup(filePath) || 'application/octet-stream'

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
