import type { QuestStatus } from '@/types'

interface StatusConfig {
  bg: string
  text: string
  border: string
  dot: string
}

const STATUS_CONFIG: Record<QuestStatus, StatusConfig> = {
  Draft:     { bg: '#F3F2F0', text: '#6B7280', border: '#D1D5DB',   dot: '#9CA3AF' },
  Active:    { bg: '#EBF0F8', text: '#1B2E52', border: '#1B2E5230', dot: '#1B2E52' },
  Submitted: { bg: '#FDF5DC', text: '#92600A', border: '#C9A22740', dot: '#C9A227' },
  Approved:  { bg: '#EAF4F0', text: '#0A5742', border: '#0F6E5640', dot: '#0F6E56' },
  Revise:    { bg: '#FEF3E2', text: '#92400E', border: '#F59E0B40', dot: '#F59E0B' },
  Failed:    { bg: '#FDF2F0', text: '#993C1D', border: '#993C1D30', dot: '#993C1D' },
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
  const cfg = STATUS_CONFIG[status]
  const fs  = size === 'sm' ? '9px' : '10px'
  const px  = size === 'sm' ? '6px' : '8px'
  const py  = size === 'sm' ? '2px' : '3px'

  return (
    <span
      className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider border select-none"
      style={{
        background: cfg.bg,
        color: cfg.text,
        borderColor: cfg.border,
        fontSize: fs,
        paddingLeft: px,
        paddingRight: px,
        paddingTop: py,
        paddingBottom: py,
        letterSpacing: '0.12em',
      }}
    >
      {dot && (
        <span
          className="rounded-full shrink-0"
          style={{ width: 5, height: 5, background: cfg.dot }}
        />
      )}
      {STATUS_ID[status]}
    </span>
  )
}
