'use client'

import { useState, useEffect } from 'react'
import { FileText, FileSpreadsheet, Image as ImageIcon, Video, Trash2, Download, Search } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { notify } from '@/lib/toast'

interface VaultItem {
  id: string
  title: string
  type: string
  summary: string | null
  fileUrl: string
  visibility: string
  createdAt: string
  uploadedById: string
  uploader: {
    id: string
    nama: string
    avatarUrl: string | null
  }
  arc: { id: string; name: string } | null
  project: { id: string; name: string } | null
}

const getFileIcon = (url: string) => {
  const ext = url.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return <ImageIcon className="text-blue-500" />
  if (['mp4', 'mov'].includes(ext || '')) return <Video className="text-purple-500" />
  if (['xls', 'xlsx'].includes(ext || '')) return <FileSpreadsheet className="text-green-500" />
  return <FileText className="text-gray-500" />
}

export function VaultList({ reloadTrigger }: { reloadTrigger: number }) {
  const [items, setItems] = useState<VaultItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { user, role } = useUser()

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true)
        const res = await fetch('/api/vault')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setItems(data)
      } catch (err) {

      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [reloadTrigger])

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus dokumen ini?')) return
    try {
      const res = await fetch(`/api/vault/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setItems(items.filter(item => item.id !== id))
    } catch {
      notify.warn('Gagal menghapus dokumen.')
    }
  }

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.type.toLowerCase().includes(search.toLowerCase()) ||
    (item.project?.name || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <span className="w-8 h-8 rounded-full border-2 border-navy border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-100 dark:border-white/5 flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari dokumen..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 dark:bg-black/20 text-gray-500 dark:text-gray-400 font-medium">
            <tr>
              <th className="px-6 py-4 rounded-tl-xl">Dokumen</th>
              <th className="px-6 py-4">Tipe</th>
              <th className="px-6 py-4 hidden md:table-cell">Kaitan</th>
              <th className="px-6 py-4 hidden sm:table-cell">Visibilitas</th>
              <th className="px-6 py-4 hidden lg:table-cell">Uploader</th>
              <th className="px-6 py-4 text-right rounded-tr-xl">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Tidak ada dokumen ditemukan.
                </td>
              </tr>
            ) : (
              filteredItems.map(item => {
                const canDelete = item.uploadedById === user?.id || role === 'guild_master'
                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getFileIcon(item.fileUrl)}</div>
                        <div>
                          <p className="font-bold text-navy dark:text-gray-200">{item.title}</p>
                          {item.summary && <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.summary}</p>}
                          <p className="text-[10px] text-gray-400 mt-1 lg:hidden">
                            {new Date(item.createdAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded text-xs font-medium">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-500 dark:text-gray-400">
                      {item.project ? (
                        <span className="text-xs">Proj: {item.project.name}</span>
                      ) : item.arc ? (
                        <span className="text-xs">Arc: {item.arc.name}</span>
                      ) : (
                        <span className="text-xs opacity-50">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${item.visibility === 'GM only' ? 'text-red-500' : 'text-green-500'}`}>
                        {item.visibility}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex flex-col">
                        <span className="text-gray-700 dark:text-gray-300">{item.uploader.nama}</span>
                        <span className="text-[10px] text-gray-400">{new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a 
                          href={item.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-navy dark:hover:text-gold hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
                          title="Unduh / Lihat"
                        >
                          <Download size={16} />
                        </a>
                        {canDelete && (
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
