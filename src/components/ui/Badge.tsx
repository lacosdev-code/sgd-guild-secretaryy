import type { DifficultyRank } from '@/types'

// PRD rank color spec:
// F/E → gray   |  D/C → teal #0F6E56  |  B/A → navy #1B2E52  |  S → gold #C9A227

interface BadgeConfig {
  bg: string
  text: string
  border: string
  label: string
}

const RANK_CONFIG: Record<DifficultyRank, BadgeConfig> = {
  F: { bg: '#F0EFEE', text: '#6B7280', border: '#D1D5DB', label: 'F' },
  E: { bg: '#E9E8E6', text: '#4B5563', border: '#9CA3AF', label: 'E' },
  D: { bg: '#EBF4F1', text: '#0F6E56', border: '#0F6E5640', label: 'D' },
  C: { bg: '#D6EDE7', text: '#0A5742', border: '#0F6E5660', label: 'C' },
  B: { bg: '#E8ECF3', text: '#1B2E52', border: '#1B2E5240', label: 'B' },
  A: { bg: '#CDD4E4', text: '#1B2E52', border: '#1B2E5260', label: 'A' },
  S: { bg: '#FDF5DC', text: '#A07D10', border: '#C9A22760', label: 'S' },
}

interface BadgeProps {
  rank: DifficultyRank | null
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Show full rank label beside letter */
  showLabel?: boolean
}

const RANK_LABEL: Record<DifficultyRank, string> = {
  F: 'F — Rutin',
  E: 'E — Basic',
  D: 'D — Standar',
  C: 'C — Skill',
  B: 'B — Koordinasi',
  A: 'A — High Responsibility',
  S: 'S — Strategic',
}

export default function Badge({ rank, size = 'md', showLabel = false }: BadgeProps) {
  if (!rank) {
    return (
      <span
        className="inline-flex items-center justify-center font-bold border text-center select-none"
        style={{
          background: '#F0EFEE',
          color: '#9CA3AF',
          borderColor: '#E5E2DC',
          fontSize: size === 'sm' ? 10 : size === 'lg' ? 14 : 12,
          width: size === 'sm' ? 22 : size === 'lg' ? 36 : 28,
          height: size === 'sm' ? 22 : size === 'lg' ? 36 : 28,
        }}
        title="Rank belum ditetapkan"
      >
        ?
      </span>
    )
  }

  const cfg = RANK_CONFIG[rank]
  const dim = size === 'sm' ? 22 : size === 'lg' ? 36 : 28
  const fs  = size === 'sm' ? 10  : size === 'lg' ? 14  : 12

  return (
    <span className="inline-flex items-center gap-1.5 select-none">
      <span
        className="inline-flex items-center justify-center font-bold border shrink-0"
        style={{
          background: cfg.bg,
          color: cfg.text,
          borderColor: cfg.border,
          fontSize: fs,
          width: dim,
          height: dim,
          letterSpacing: '0.05em',
        }}
        title={RANK_LABEL[rank]}
      >
        {cfg.label}
      </span>
      {showLabel && (
        <span className="text-xs font-medium" style={{ color: cfg.text }}>
          {RANK_LABEL[rank]}
        </span>
      )}
    </span>
  )
}
