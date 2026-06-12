'use client'

import { useState } from 'react'
import { Database, Plus } from 'lucide-react'
import { VaultList } from '@/components/vault/VaultList'
import { UploadVaultDialog } from '@/components/vault/UploadVaultDialog'

export default function VaultPage() {
  const [showUpload, setShowUpload] = useState(false)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  const handleUploadSuccess = () => {
    setShowUpload(false)
    setReloadTrigger(prev => prev + 1)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Database className="text-gold w-8 h-8" />
            <h1 className="text-2xl font-bold text-navy dark:text-white tracking-tight">Vault</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm ml-11">
            Gudang data dan Knowledge Base guild.
          </p>
        </div>

        <button 
          onClick={() => setShowUpload(true)}
          className="px-4 py-2.5 bg-navy text-gold font-bold text-sm rounded-lg hover:bg-navy/90 transition-all shadow-sm flex items-center gap-2"
        >
          <Plus size={18} /> Upload Dokumen
        </button>
      </div>

      <VaultList reloadTrigger={reloadTrigger} />

      {showUpload && (
        <UploadVaultDialog 
          onClose={() => setShowUpload(false)} 
          onSuccess={handleUploadSuccess} 
        />
      )}
    </div>
  )
}
