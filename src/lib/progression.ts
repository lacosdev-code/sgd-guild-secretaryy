// SGD Awakening & Progression Framework
// Formula: EXP_required(level) = ROUND(3 × level² + 0.01 × level³)
// Cumulative EXP to REACH level N = sum of EXP_required(1..N-1)

export type Rarity =
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Epic'
  | 'Legendary'
  | 'Mythic'
  | 'Ascendant'
  | 'Transcendent'

export type AwakeningName =
  | 'Obedience'
  | 'Responsibility'
  | 'Excellence'
  | 'Initiative'
  | 'Ownership'
  | 'Leadership'
  | 'Stewardship'

export const AWAKENING_NAMES: AwakeningName[] = [
  'Obedience',
  'Responsibility',
  'Excellence',
  'Initiative',
  'Ownership',
  'Leadership',
  'Stewardship',
]

export const WORK_SKILL_LEVELS = ['F', 'E', 'D', 'C', 'B', 'A', 'S'] as const
export type WorkSkillLevel = (typeof WORK_SKILL_LEVELS)[number]

export const DEFAULT_SKILLS = [
  'Problem Solving',
  'Komunikasi',
  'Manajemen Waktu',
  'Kualitas Kerja',
  'Berpikir Sistemik',
  'Inisiatif',
  'Adaptasi',
  'Kolaborasi',
]

/** EXP required to be AT a specific level (how much that level is "worth") */
export function expForLevel(level: number): number {
  return Math.round(3 * level * level + 0.01 * level * level * level)
}

/** Cumulative EXP needed to REACH `level` from level 1 */
export function cumulativeExpToReach(level: number): number {
  if (level <= 1) return 0
  let total = 0
  for (let l = 1; l < level; l++) {
    total += expForLevel(l)
  }
  return total
}

/** Given total accumulated points/EXP, calculate the current employee level (1-99) */
export function calcEmployeeLevel(totalPoints: number): number {
  let level = 1
  while (level < 99) {
    const neededToReachNext = cumulativeExpToReach(level + 1)
    if (totalPoints < neededToReachNext) break
    level++
  }
  return level
}

/** EXP progress within the current level */
export function calcExpProgress(totalPoints: number): {
  level: number
  currentExp: number
  expNeeded: number
  percent: number
} {
  const level = calcEmployeeLevel(totalPoints)
  const expAtCurrentLevel = cumulativeExpToReach(level)
  const expAtNextLevel = level >= 99 ? cumulativeExpToReach(99) + expForLevel(99) : cumulativeExpToReach(level + 1)
  const currentExp = totalPoints - expAtCurrentLevel
  const expNeeded = expAtNextLevel - expAtCurrentLevel
  const percent = level >= 99 ? 100 : Math.min(100, Math.floor((currentExp / expNeeded) * 100))
  return { level, currentExp, expNeeded, percent }
}

/** Rarity based on employee level range */
export function getRarity(level: number): Rarity {
  if (level >= 91) return 'Transcendent'
  if (level >= 81) return 'Ascendant'
  if (level >= 71) return 'Mythic'
  if (level >= 61) return 'Legendary'
  if (level >= 51) return 'Epic'
  if (level >= 41) return 'Rare'
  if (level >= 21) return 'Uncommon'
  return 'Common'
}

/** Rarity gradient colors for UI styling */
export const RARITY_STYLES: Record<Rarity, { gradient: string; text: string; border: string; glow: string }> = {
  Common:       { gradient: 'from-gray-400 to-gray-500',        text: 'text-gray-400',   border: 'border-gray-400',   glow: 'shadow-gray-400/30' },
  Uncommon:     { gradient: 'from-green-400 to-emerald-500',    text: 'text-green-400',  border: 'border-green-400',  glow: 'shadow-green-400/30' },
  Rare:         { gradient: 'from-blue-400 to-indigo-500',      text: 'text-blue-400',   border: 'border-blue-400',   glow: 'shadow-blue-400/30' },
  Epic:         { gradient: 'from-purple-400 to-violet-600',    text: 'text-purple-400', border: 'border-purple-400', glow: 'shadow-purple-400/30' },
  Legendary:    { gradient: 'from-yellow-400 to-orange-500',    text: 'text-yellow-400', border: 'border-yellow-400', glow: 'shadow-yellow-400/30' },
  Mythic:       { gradient: 'from-red-400 to-rose-600',         text: 'text-red-400',    border: 'border-red-400',    glow: 'shadow-red-400/30' },
  Ascendant:    { gradient: 'from-cyan-400 to-teal-500',        text: 'text-cyan-400',   border: 'border-cyan-400',   glow: 'shadow-cyan-400/30' },
  Transcendent: { gradient: 'from-gold to-amber-300',           text: 'text-amber-300',  border: 'border-amber-300',  glow: 'shadow-amber-300/50' },
}

/** Awakening Level name (1-7) */
export function getAwakeningName(level: number): AwakeningName {
  const idx = Math.max(0, Math.min(6, level - 1))
  return AWAKENING_NAMES[idx]
}

/** Work/Skill level label */
export function getLevelLabel(level: WorkSkillLevel): string {
  const labels: Record<WorkSkillLevel, string> = {
    F: 'Beginner',
    E: 'Novice',
    D: 'Apprentice',
    C: 'Journeyman',
    B: 'Expert',
    A: 'Master',
    S: 'Grandmaster',
  }
  return labels[level] || level
}
