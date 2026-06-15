'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { notify } from '@/lib/toast'

export default function ArcForm({ onCreated }: { onCreated?: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const name = formData.get('name') as string
    const strategicObjective = formData.get('strategicObjective') as string

    try {
      const res = await fetch('/api/arcs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, strategicObjective })
      })

      if (!res.ok) throw new Error(await res.text())
      
      notify.success('Arc berhasil dibuat')
      form.reset()
      router.refresh()
      if (onCreated) onCreated()
    } catch (error: unknown) {
    const err = error as Error;
      notify.error('Gagal membuat Arc: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1B2E52] p-6 rounded-2xl border border-gray-100 dark:border-[#2A3F6B] shadow-sm mb-8 max-w-2xl animate-slide-up-fade">
      <h2 className="font-bold text-lg tracking-wide mb-5 text-navy dark:text-white">Buat Arc Baru</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-gray-500 dark:text-[#C9A227]/70">Nama Arc</label>
          <input type="text" name="name" required className="w-full bg-gray-50 dark:bg-[#0F1B2D] border border-gray-200 dark:border-[#2A3F6B] rounded-xl p-3 text-sm focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all dark:text-white" placeholder="Contoh: RS Bella Support Arc" />
        </div>
        <div>
          <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-gray-500 dark:text-[#C9A227]/70">Objektif Strategis (Opsional)</label>
          <input type="text" name="strategicObjective" className="w-full bg-gray-50 dark:bg-[#0F1B2D] border border-gray-200 dark:border-[#2A3F6B] rounded-xl p-3 text-sm focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all dark:text-white" placeholder="Target besar kampanye ini..." />
        </div>
        <button type="submit" disabled={loading} className="bg-navy dark:bg-[#C9A227] text-white dark:text-[#1B2E52] px-6 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 text-sm font-bold tracking-wide transition-opacity mt-2 flex items-center gap-2">
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          )}
          {loading ? 'Menyimpan...' : 'Tambah Arc'}
        </button>
      </div>
    </form>
  )
}
