import { AlertTriangle } from 'lucide-react'

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = "Ya, Hapus",
  cancelText = "Batal",
  onConfirm,
  onCancel,
  variant = 'danger'
}: {
  isOpen: boolean
  title: string
  description: string | React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'primary'
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1520]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1B2E52] max-w-sm w-full rounded-2xl shadow-2xl border border-gray-100 dark:border-[#2A3F6B] overflow-hidden scale-in-center">
        <div className="p-6 text-center">
          <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-5 ${
            variant === 'danger' 
              ? 'bg-red-100 dark:bg-red-500/10 text-red-500' 
              : 'bg-navy/10 dark:bg-navy/30 text-navy dark:text-gold'
          }`}>
            <AlertTriangle size={28} />
          </div>
          <h3 className="text-xl font-bold text-navy dark:text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            {description}
          </p>
          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#0F1B2D] dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                onCancel()
                onConfirm()
              }}
              className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white transition-colors shadow-lg ${
                variant === 'danger'
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                  : 'bg-navy hover:bg-navy/90 shadow-navy/20 dark:text-gold'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
