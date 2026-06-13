'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import EditArcModal from '@/components/common/EditArcModal'

interface ArcActionButtonsProps {
  arc: { id: string; name: string; strategicObjective?: string | null; status: string }
}

export default function ArcActionButtons({ arc }: ArcActionButtonsProps) {
  const [showEdit, setShowEdit] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowEdit(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg transition-colors border border-blue-100 dark:border-blue-900/50"
      >
        <Pencil size={14} />
        Edit Arc
      </button>

      {showEdit && (
        <EditArcModal arc={arc} onClose={() => setShowEdit(false)} />
      )}
    </>
  )
}
