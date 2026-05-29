import path from 'path'
import fs from 'fs'

// Upload directory — in Docker: mount volume to UPLOAD_DIR
export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads')

// Ensure upload directory exists
export function ensureUploadDir(subDir?: string) {
  const dir = subDir ? path.join(UPLOAD_DIR, subDir) : UPLOAD_DIR
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return dir
}

// Get public URL for a stored file
export function getFileUrl(filePath: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  // filePath is relative to UPLOAD_DIR, e.g. "tavern/abc.jpg"
  return `${baseUrl}/api/files/${filePath}`
}

// Delete a file
export async function deleteFile(relativePath: string) {
  const fullPath = path.join(UPLOAD_DIR, relativePath)
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
    }
  } catch (e) {
    console.error('Failed to delete file:', e)
  }
}
