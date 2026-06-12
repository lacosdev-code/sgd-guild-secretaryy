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
    const rawSubDir = (formData.get('dir') as string) || 'misc'
    // Sanitize subDir to prevent path traversal
    const subDir = path.basename(rawSubDir)

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File terlalu besar (maks 10MB)' }, { status: 413 })
    }

    const ext = path.extname(file.name).toLowerCase()
    const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.mp4']
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: 'Tipe file tidak diizinkan.' }, { status: 415 })
    }

    // Sanitize filename
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}_${safeFileName}`
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
