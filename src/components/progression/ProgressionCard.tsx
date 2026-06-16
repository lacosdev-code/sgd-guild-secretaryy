'use client'

import { calcExpProgress, getRarity, RARITY_STYLES, getAwakeningName, getLevelLabel, type WorkSkillLevel } from '@/lib/progression'

interface ProgressionCardProps {
  totalPoints: number
  employeeLevel: number
  awakeningLevel: number
  workLevel: string
  nama: string
  compact?: boolean
}

export function ProgressionCard({
  totalPoints,
  employeeLevel,
  awakeningLevel,
  workLevel,
  nama,
  compact = false,
}: ProgressionCardProps) {
  const { level, currentExp, expNeeded, percent } = calcExpProgress(totalPoints)
  const rarity = getRarity(level)
  const style = RARITY_STYLES[rarity]
  const awakeningName = getAwakeningName(awakeningLevel)
  const workLabel = getLevelLabel((workLevel || 'F') as WorkSkillLevel)

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border ${style.border} ${style.glow} shadow-xl bg-gradient-to-br from-[#0F1B2D] to-[#1B2E52] transition-all duration-300`}
      style={{ boxShadow: `0 0 32px -8px var(--tw-shadow-color)` }}
    >
      {/* Rarity glow overlay */}
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${style.gradient} pointer-events-none`} />

      {/* Header */}
      <div className="relative px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-0.5">Employee</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black ${style.text}`}>Lv.{level}</span>
            <span className={`text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${style.border} ${style.text} bg-white/5`}>
              {rarity}
            </span>
          </div>
          <p className="text-sm text-gray-300 font-semibold mt-0.5">{nama}</p>
        </div>

        {/* Circular progress ring */}
        <div className="relative w-16 h-16">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" stroke="#ffffff10" strokeWidth="6" fill="none" />
            <circle
              cx="32" cy="32" r="28"
              stroke="url(#rarityGrad)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - percent / 100)}`}
              className="transition-all duration-700"
            />
            <defs>
              <linearGradient id="rarityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={style.text} stopColor="currentColor" />
                <stop offset="100%" className={style.text} stopColor="currentColor" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-black ${style.text}`}>{percent}%</span>
          </div>
        </div>
      </div>

      {/* EXP Bar */}
      <div className="relative px-5 pb-3">
        <div className="flex justify-between text-[10px] text-gray-400 font-mono mb-1">
          <span>EXP {currentExp.toLocaleString()}</span>
          <span>{expNeeded.toLocaleString()} needed</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${style.gradient} transition-all duration-700`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-500 mt-1 text-right font-mono">
          Total: {totalPoints.toLocaleString()} XP
        </p>
      </div>

      {/* Stats row */}
      {!compact && (
        <div className="relative grid grid-cols-2 gap-2 px-5 pb-5">
          {/* Awakening Level */}
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-1">Awakening Lv.{awakeningLevel}</p>
            <p className="text-sm font-black text-white">{awakeningName}</p>
            <div className="flex gap-0.5 mt-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full transition-all duration-300 ${i < awakeningLevel ? `bg-gradient-to-r ${style.gradient}` : 'bg-white/10'}`}
                />
              ))}
            </div>
          </div>

          {/* Work Level */}
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-1">Work Level</p>
            <p className={`text-2xl font-black ${style.text}`}>{workLevel || 'F'}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{workLabel}</p>
          </div>
        </div>
      )}
    </div>
  )
}
