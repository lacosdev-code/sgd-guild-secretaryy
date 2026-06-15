'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { notify } from '@/lib/toast'

export default function DeleteEntityButton({ entityType, id, redirectPath }: { entityType: 'projects' | 'arcs', id: string, redirectPath: string }) {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const name = entityType === 'arcs' ? 'Arc' : 'Project'

  const handleDelete = async () => {
    setShowConfirm(false)
    setLoading(true)
    try {
      const res = await fetch(`/api/${entityType}/${id}`, {
        method: 'DELETE'
      })
      
      if (!res.ok) throw new Error(await res.text())
      
      notify.success(`${name} berhasil dihapus.`)
      router.push(redirectPath)
      router.refresh()
    } catch (err: any) {
      notify.error('Gagal menghapus: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-colors border border-red-100 dark:border-red-900/50 disabled:opacity-50"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        Hapus {name}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1520]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1B2E52] max-w-sm w-full rounded-2xl shadow-2xl border border-gray-100 dark:border-[#2A3F6B] overflow-hidden scale-in-center">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 text-red-500 mx-auto flex items-center justify-center mb-5">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-2">Hapus {name} Permanen?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                Semua data yang terkait dengan <strong>{name}</strong> ini akan ikut terhapus secara permanen atau kehilangan relasinya. Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#0F1B2D] dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
