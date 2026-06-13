'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Loader2, Save } from 'lucide-react'
import { notify } from '@/lib/toast'

interface EditArcModalProps {
  arc: { id: string; name: string; strategicObjective?: string | null; status: string }
  onClose: () => void
}

const STATUS_OPTIONS = ['Active', 'Completed', 'On Hold', 'Archived']

export default function EditArcModal({ arc, onClose }: EditArcModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(arc.name)
  const [strategicObjective, setStrategicObjective] = useState(arc.strategicObjective || '')
  const [status, setStatus] = useState(arc.status)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return notify.warn('Nama Arc tidak boleh kosong.')
    setLoading(true)

    try {
      const res = await fetch(`/api/arcs/${arc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), strategicObjective: strategicObjective.trim() || null, status })
      })
      if (!res.ok) throw new Error(await res.text())

      notify.success('Arc berhasil diperbarui!')
      router.refresh()
      onClose()
    } catch (err: any) {
      notify.error('Gagal memperbarui Arc: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#1B2E52] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#2A3F6B] w-full max-w-md p-6 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-navy dark:text-white flex items-center gap-2">
            <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-navy/10 dark:bg-white/10">✏️</span>
            Edit Arc
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-gray-500 dark:text-[#C9A227]/70">Nama Arc *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full bg-gray-50 dark:bg-[#0F1B2D] border border-gray-200 dark:border-[#2A3F6B] rounded-xl p-3 text-sm focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all dark:text-white"
              placeholder="Nama Arc..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-gray-500 dark:text-[#C9A227]/70">Objektif Strategis</label>
            <input
              type="text"
              value={strategicObjective}
              onChange={e => setStrategicObjective(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#0F1B2D] border border-gray-200 dark:border-[#2A3F6B] rounded-xl p-3 text-sm focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all dark:text-white"
              placeholder="Target besar kampanye ini..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-gray-500 dark:text-[#C9A227]/70">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#0F1B2D] border border-gray-200 dark:border-[#2A3F6B] rounded-xl p-3 text-sm focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all dark:text-white"
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-bold rounded-xl border border-gray-200 dark:border-[#2A3F6B] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-bold rounded-xl bg-navy dark:bg-[#C9A227] text-white dark:text-[#1B2E52] hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
