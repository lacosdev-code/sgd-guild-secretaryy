import type { QuestStatus } from '@/types'

const STATUS_CLASSES: Record<QuestStatus, string> = {
  Draft:     'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/60 dark:text-gray-400 dark:border-gray-700',
  Active:    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  Submitted: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  Approved:  'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  Revise:    'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
  Failed:    'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
}

const DOT_CLASSES: Record<QuestStatus, string> = {
  Draft:     'bg-gray-400 dark:bg-gray-500',
  Active:    'bg-blue-500 dark:bg-blue-400',
  Submitted: 'bg-amber-500 dark:bg-amber-400',
  Approved:  'bg-emerald-500 dark:bg-emerald-400',
  Revise:    'bg-orange-500 dark:bg-orange-400',
  Failed:    'bg-red-500 dark:bg-red-400',
}

const STATUS_ID: Record<QuestStatus, string> = {
  Draft:     'Draft',
  Active:    'Aktif',
  Submitted: 'Submitted',
  Approved:  'Approved',
  Revise:    'Revisi',
  Failed:    'Gagal',
}

interface StatusPillProps {
  status: QuestStatus
  /** Show leading colored dot */
  dot?: boolean
  size?: 'sm' | 'md'
}

export default function StatusPill({ status, dot = true, size = 'md' }: StatusPillProps) {
  const classes = STATUS_CLASSES[status] || STATUS_CLASSES.Draft
  const dotClass = DOT_CLASSES[status] || DOT_CLASSES.Draft

  const sizeClasses = size === 'sm' 
    ? 'text-[9px] px-2 py-0.5' 
    : 'text-[10px] px-2.5 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-widest border rounded-full select-none transition-colors ${classes} ${sizeClasses}`}
    >
      {dot && (
        <span
          className={`shrink-0 rounded-full w-1.5 h-1.5 ${dotClass}`}
        />
      )}
      {STATUS_ID[status]}
    </span>
  )
}
