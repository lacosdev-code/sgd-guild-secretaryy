'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Attachment } from '@/types'

// ── Constants ─────────────────────────────────────────────────────────────────

const ACCEPTED_MIME: Record<string, string> = {
  'image/jpeg':       'JPG',
  'image/png':        'PNG',
  'image/heic':       'HEIC',
  'image/heif':       'HEIF',
  'application/pdf':  'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':       'XLSX',
  'application/msword': 'DOC',
  'application/vnd.ms-excel': 'XLS',
}
const ACCEPTED_ACCEPT = Object.keys(ACCEPTED_MIME).join(',')
const MAX_SIZE_MB = 10
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

// ── Helpers ───────────────────────────────────────────────────────────────────

function isImage(mimeType: string) {
  return mimeType.startsWith('image/')
}

function fileIcon(mimeType: string) {
  if (mimeType === 'application/pdf') return '📄'
  if (mimeType.includes('word')) return '📝'
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊'
  return '📁'
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// ── Upload queue item ─────────────────────────────────────────────────────────

interface UploadItem {
  id:       string
  file:     File
  preview:  string | null   // object URL for images
  progress: number          // 0-100
  error:    string | null
  done:     boolean
}

// ── Attachment thumbnail ──────────────────────────────────────────────────────

function AttachmentThumb({ attachment }: { attachment: Attachment }) {
  const isImg  = attachment.file_type?.startsWith('image/') ?? false
  const name   = attachment.file_url.split('/').pop() ?? 'file'
  const ext    = ACCEPTED_MIME[attachment.file_type ?? ''] ?? attachment.file_type?.split('/').pop()?.toUpperCase() ?? '?'

  return (
    <a
      href={attachment.file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 px-3 py-2.5 border hover:bg-gray-50 transition-colors group"
      style={{ borderColor: '#E8E5E0' }}
    >
      {isImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={attachment.file_url}
          alt={name}
          className="w-10 h-10 object-cover border shrink-0"
          style={{ borderColor: '#E8E5E0' }}
        />
      ) : (
        <div
          className="w-10 h-10 flex items-center justify-center text-xl shrink-0 border"
          style={{ background: '#F5F3EE', borderColor: '#E8E5E0' }}
        >
          {fileIcon(attachment.file_type ?? '')}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-charcoal truncate group-hover:underline">
          {name}
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">{ext}</p>
      </div>

      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 shrink-0">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </a>
  )
}

// ── Upload queue item UI ──────────────────────────────────────────────────────

function UploadRow({ item }: { item: UploadItem }) {
  const isImg = isImage(item.file.type)

  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2.5 border"
      style={{ borderColor: item.error ? '#993C1D44' : '#E8E5E0', background: item.error ? '#FDF2F0' : 'white' }}
    >
      {isImg && item.preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.preview} alt="" className="w-10 h-10 object-cover border shrink-0"
          style={{ borderColor: '#E8E5E0' }} />
      ) : (
        <div className="w-10 h-10 flex items-center justify-center text-xl border shrink-0"
          style={{ background: '#F5F3EE', borderColor: '#E8E5E0' }}>
          {fileIcon(item.file.type)}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-charcoal truncate">{item.file.name}</p>
        {item.error ? (
          <p className="text-[10px] mt-0.5" style={{ color: '#993C1D' }}>{item.error}</p>
        ) : item.done ? (
          <p className="text-[10px] mt-0.5" style={{ color: '#0F6E56' }}>✓ Upload selesai</p>
        ) : (
          <div className="mt-1.5 h-1 bg-gray-200 w-full">
            <div
              className="h-1 transition-all duration-300"
              style={{ width: `${item.progress}%`, background: '#1B2E52' }}
            />
          </div>
        )}
      </div>

      <span className="text-[10px] text-gray-400 shrink-0">
        {formatBytes(item.file.size)}
      </span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface AttachmentUploadProps {
  questId:     string
  currentUserId: string
  canUpload:   boolean   // true if user is assignee AND status is Active or Revise
  attachments: Attachment[]
}

export default function AttachmentUpload({
  questId,
  currentUserId,
  canUpload,
  attachments,
}: AttachmentUploadProps) {
  const router       = useRouter()
  const supabase     = createClient()
  const inputRef     = useRef<HTMLInputElement>(null)
  const [queue, setQueue]     = useState<UploadItem[]>([])
  const [dragging, setDragging] = useState(false)

  function updateItem(id: string, patch: Partial<UploadItem>) {
    setQueue((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }

  async function uploadFile(file: File) {
    // Validate type
    if (!ACCEPTED_MIME[file.type]) {
      return { error: `Format tidak didukung (${file.type || 'unknown'})` }
    }
    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      return { error: `Ukuran file melebihi batas ${MAX_SIZE_MB}MB` }
    }

    const ext      = file.name.split('.').pop()
    const safeName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const path     = `${questId}/${safeName}`

    const { error: storageError } = await supabase.storage
      .from('attachments')
      .upload(path, file, { contentType: file.type, upsert: false })

    if (storageError) return { error: storageError.message }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('attachments')
      .getPublicUrl(path)

    // Insert into attachments table
    const { error: dbError } = await supabase.from('attachments').insert({
      quest_id:    questId,
      file_url:    publicUrl,
      file_type:   file.type,
      uploaded_by: currentUserId,
    })

    if (dbError) return { error: dbError.message }

    return { url: publicUrl }
  }

  async function processFiles(files: FileList | File[]) {
    const fileArray = Array.from(files)
    if (fileArray.length === 0) return

    // Build queue entries
    const newItems: UploadItem[] = fileArray.map((file) => ({
      id:       `${Date.now()}-${Math.random()}`,
      file,
      preview:  isImage(file.type) ? URL.createObjectURL(file) : null,
      progress: 0,
      error:    null,
      done:     false,
    }))

    setQueue((prev) => [...prev, ...newItems])

    // Upload sequentially to avoid overwhelming storage
    for (const item of newItems) {
      updateItem(item.id, { progress: 20 })
      const result = await uploadFile(item.file)
      updateItem(item.id, {
        progress: result.error ? 0 : 100,
        error:    result.error ?? null,
        done:     !result.error,
      })
      // Clean up object URL
      if (item.preview && !result.error) {
        URL.revokeObjectURL(item.preview)
      }
    }

    // Refresh server data to show new attachments
    const hasSuccess = newItems.some((i) => {
      const q = queue.find((x) => x.id === i.id) ?? i
      return q.done
    })
    if (hasSuccess || newItems.some((i) => !i.error)) {
      router.refresh()
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) processFiles(e.target.files)
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files)
  }

  return (
    <div className="bg-white border" style={{ borderColor: '#DDD9D3' }}>

      {/* ── Section header ───────────────────────────────────────────────── */}
      <div
        className="px-5 py-3 border-b flex items-center justify-between"
        style={{ background: '#F9F8F6', borderColor: '#E8E5E0' }}
      >
        <span
          className="text-[10px] font-bold tracking-[0.2em] uppercase"
          style={{ color: '#1B2E5280' }}
        >
          Bukti Penyelesaian ({attachments.length})
        </span>
        {canUpload && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 border transition-all hover:opacity-80"
            style={{ background: '#1B2E52', color: '#C9A227', borderColor: 'transparent' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Upload File
          </button>
        )}
      </div>

      {/* ── Existing attachments ─────────────────────────────────────────── */}
      {attachments.length > 0 && (
        <div className="divide-y" style={{ borderColor: '#E8E5E0' }}>
          {attachments.map((a) => (
            <AttachmentThumb key={a.id} attachment={a} />
          ))}
        </div>
      )}

      {/* ── Upload area ──────────────────────────────────────────────────── */}
      {canUpload && (
        <>
          {/* Hidden file input */}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_ACCEPT}
            multiple
            className="hidden"
            onChange={handleFileInput}
          />

          {/* Drag-and-drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="mx-5 my-4 border-2 border-dashed px-6 py-6 text-center cursor-pointer transition-all"
            style={{
              borderColor: dragging ? '#1B2E52' : '#DDD9D3',
              background:  dragging ? '#1B2E5208' : 'transparent',
            }}
          >
            <svg
              width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              className="mx-auto mb-2" style={{ color: '#1B2E5250' }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-xs font-medium" style={{ color: '#1B2E5280' }}>
              Klik atau seret file ke sini
            </p>
            <p className="text-[10px] mt-1 text-gray-400">
              JPG · PNG · HEIC · PDF · DOCX · XLSX · Maks. {MAX_SIZE_MB}MB per file
            </p>
          </div>

          {/* Upload queue */}
          {queue.length > 0 && (
            <div className="mx-5 mb-4 space-y-1 border-t pt-3" style={{ borderColor: '#E8E5E0' }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: '#1B2E5260' }}>
                Antrian Upload
              </p>
              {queue.map((item) => (
                <UploadRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Empty state ──────────────────────────────────────────────────── */}
      {attachments.length === 0 && !canUpload && (
        <div className="px-5 py-8 text-center">
          <p className="text-xs italic text-gray-400">Belum ada file yang diupload.</p>
        </div>
      )}
    </div>
  )
}
