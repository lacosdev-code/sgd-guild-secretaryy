'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'

export default function DeleteEntityButton({ entityType, id, redirectPath }: { entityType: 'projects' | 'arcs', id: string, redirectPath: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const isArc = entityType === 'arcs'
    const name = isArc ? 'Arc' : 'Project'
    
    if (!confirm(`Hapus ${name} ini secara permanen? Perhatian: Semua data yang terkait dengan ${name} ini akan ikut terhapus atau kehilangan relasinya.`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/${entityType}/${id}`, {
        method: 'DELETE'
      })
      
      if (!res.ok) throw new Error(await res.text())
      
      alert(`${name} berhasil dihapus.`)
      router.push(redirectPath)
      router.refresh()
    } catch (err: any) {
      alert('Gagal menghapus: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-colors border border-red-100 dark:border-red-900/50 disabled:opacity-50"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      Hapus {entityType === 'arcs' ? 'Arc' : 'Project'}
    </button>
  )
}
