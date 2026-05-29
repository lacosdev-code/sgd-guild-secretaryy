import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { ensureUploadDir, getFileUrl } from '@/lib/storage'
import path from 'path'
import fs from 'fs'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const subDir = (formData.get('dir') as string) || 'misc'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File terlalu besar (maks 10MB)' }, { status: 413 })
    }

    const ext = path.extname(file.name).toLowerCase() || '.bin'
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}${ext}`
    const uploadDir = ensureUploadDir(subDir)
    const fullPath = path.join(uploadDir, fileName)

    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(fullPath, buffer)

    const relativePath = `${subDir}/${fileName}`
    const url = getFileUrl(relativePath)

    return NextResponse.json({ url, path: relativePath })
  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
