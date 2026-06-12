'use client'

import { useState, useEffect, useRef } from 'react'
import { X, UploadCloud, Loader2 } from 'lucide-react'

interface UploadVaultDialogProps {
  onClose: () => void
  onSuccess: () => void
}

export function UploadVaultDialog({ onClose, onSuccess }: UploadVaultDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('SOW')
  const [summary, setSummary] = useState('')
  const [visibility, setVisibility] = useState('all')
  const [projectId, setProjectId] = useState('')
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchOptions() {
      try {
        const projectsRes = await fetch('/api/projects')
        
        // Projects
        if (projectsRes.ok) {
          const data = await projectsRes.json()
          setProjects(data)
        }
      } catch (err) {
        console.error('Failed to fetch options', err)
      }
    }
    fetchOptions()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title) return

    setLoading(true)
    setError(null)

    try {
      // 1. Upload File
      const formData = new FormData()
      formData.append('file', file)
      formData.append('dir', 'vault')

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error(await uploadRes.text())
      const uploadData = await uploadRes.json()
      
      // 2. Create VaultItem record
      const recordRes = await fetch('/api/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          type,
          summary,
          fileUrl: uploadData.url,
          visibility,
          arcId: null,
          projectId: projectId || null,
        })
      })

      if (!recordRes.ok) throw new Error(await recordRes.text())
      
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Gagal mengunggah dokumen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
          <h2 className="text-lg font-bold text-navy dark:text-gray-100">Upload Dokumen</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-red-500 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Pilih File *</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
            >
              <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-gold mb-3 transition-colors" />
              {file ? (
                <p className="text-sm font-bold text-navy dark:text-gray-200">{file.name}</p>
              ) : (
                <>
                  <p className="text-sm font-bold text-navy dark:text-gray-300">Klik untuk memilih file</p>
                  <p className="text-xs text-gray-400 mt-1">Maks. 10MB (PDF, DOC, XLS, IMG, MP4)</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={e => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.mp4"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Judul Dokumen *</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="Misal: SOW Project Alpha V2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Tipe Dokumen</label>
              <select 
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="SOW">SOW / Scope of Work</option>
                <option value="MOM">MOM / Minutes of Meeting</option>
                <option value="Proposal">Proposal</option>
                <option value="Quotation">Quotation</option>
                <option value="Invoice">Invoice</option>
                <option value="Other">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Visibilitas</label>
              <select 
                value={visibility}
                onChange={e => setVisibility(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="all">Semua Member</option>
                <option value="GM only">Hanya Guild Master</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Terkait Project (Opsional)</label>
            <select 
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              <option value="">-- Tidak Terkait Project --</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Ringkasan Pendek (Opsional)</label>
            <textarea 
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
              placeholder="Deskripsi singkat dokumen ini..."
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading || !file || !title}
              className="px-6 py-2 bg-navy text-gold font-bold text-sm rounded-lg hover:bg-navy/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-sm"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Mengunggah...' : 'Upload Dokumen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
