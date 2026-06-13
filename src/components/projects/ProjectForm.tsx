'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { notify } from '@/lib/toast'

export default function ProjectForm({ arcs, onCreated }: { arcs: any[], onCreated?: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const arcId = formData.get('arcId') as string

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, arcId: arcId || null })
      })

      if (!res.ok) throw new Error(await res.text())
      
      notify.success('Project berhasil dibuat')
      e.currentTarget.reset()
      router.refresh()
      if (onCreated) onCreated()
    } catch (error: unknown) {
    const err = error as Error;
      notify.error('Gagal membuat Project: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-white/10 mb-8 max-w-2xl">
      <h2 className="font-semibold mb-4 text-navy dark:text-white">Buat Project Baru</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Pilih Arc (Opsional)</label>
          <select name="arcId" className="w-full border rounded p-2 dark:bg-slate-900 dark:border-gray-700">
            <option value="">-- Tanpa Arc --</option>
            {arcs.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Nama Project</label>
          <input type="text" name="name" required className="w-full border rounded p-2 dark:bg-slate-900 dark:border-gray-700" placeholder="Contoh: AC Preventive Maintenance" />
        </div>
        <button type="submit" disabled={loading} className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 disabled:opacity-50 text-sm font-medium flex items-center gap-2">
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : '+ Tambah Project'}
          {loading && 'Menyimpan...'}
        </button>
      </div>
    </form>
  )
}
