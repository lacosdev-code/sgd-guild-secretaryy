'use client'

import { useState } from 'react'
import { WORK_SKILL_LEVELS, DEFAULT_SKILLS, getAwakeningName, getLevelLabel, type WorkSkillLevel } from '@/lib/progression'
import { notify } from '@/lib/toast'
import { Loader2, ChevronUp, ChevronDown, Save } from 'lucide-react'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

interface Skill {
  skillName: string
  skillLevel: string
}

interface ProgressionEditorProps {
  userId: string
  awakeningLevel: number
  workLevel: string
  skills: Skill[]
  onSaved?: () => void
}

export function ProgressionEditor({ userId, awakeningLevel, workLevel, skills, onSaved }: ProgressionEditorProps) {
  const [awakening, setAwakening] = useState(awakeningLevel)
  const [work, setWork] = useState(workLevel || 'F')
  const [skillMap, setSkillMap] = useState<Record<string, string>>(
    Object.fromEntries(skills.map(s => [s.skillName, s.skillLevel]))
  )
  const [saving, setSaving] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/users/${userId}/progression`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          awakeningLevel: awakening,
          workLevel: work,
          skills: DEFAULT_SKILLS.map(name => ({ skillName: name, skillLevel: skillMap[name] || 'F' })),
        })
      })
      if (!res.ok) throw new Error(await res.text())
      notify.success('Progression berhasil disimpan!')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000) // hide after 5 seconds
      onSaved?.()
    } catch (e: unknown) {
      const err = e as Error
      notify.warn('Gagal menyimpan: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, pointerEvents: 'none' }}>
          <Confetti width={width} height={height} numberOfPieces={300} recycle={false} gravity={0.15} colors={['#C9A227', '#1B2E52', '#ffffff', '#ffd700']} />
        </div>
      )}
      {/* Awakening Level */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Awakening Level (1–7)</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAwakening(Math.max(1, awakening - 1))}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ChevronDown size={16} className="text-gray-300" />
          </button>
          <div className="flex-1 text-center">
            <p className="text-3xl font-black text-white">Lv. {awakening}</p>
            <p className="text-xs text-gold font-bold mt-0.5">{getAwakeningName(awakening)}</p>
          </div>
          <button
            onClick={() => setAwakening(Math.min(7, awakening + 1))}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ChevronUp size={16} className="text-gray-300" />
          </button>
        </div>
        {/* Awakening progress bars */}
        <div className="flex gap-1 mt-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setAwakening(i + 1)}
              className={`flex-1 h-2 rounded-full transition-all duration-200 cursor-pointer ${i < awakening ? 'bg-gold' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </div>

      {/* Work Level */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Work Level</p>
        <div className="grid grid-cols-7 gap-1">
          {WORK_SKILL_LEVELS.map(lvl => (
            <button
              key={lvl}
              onClick={() => setWork(lvl)}
              className={`py-2 rounded-lg text-sm font-black transition-all duration-200 ${
                work === lvl
                  ? 'bg-gold text-navy shadow-lg shadow-gold/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">{getLevelLabel((work || 'F') as WorkSkillLevel)}</p>
      </div>

      {/* Skill Levels */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Skill Levels</p>
        <div className="space-y-2">
          {DEFAULT_SKILLS.map(skillName => (
            <div key={skillName} className="flex items-center gap-2">
              <span className="text-xs text-gray-300 w-36 shrink-0">{skillName}</span>
              <div className="flex gap-1 flex-1">
                {WORK_SKILL_LEVELS.map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setSkillMap(prev => ({ ...prev, [skillName]: lvl }))}
                    className={`flex-1 py-1 rounded text-[11px] font-black transition-all duration-150 ${
                      (skillMap[skillName] || 'F') === lvl
                        ? 'bg-gold text-navy'
                        : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 rounded-xl bg-gold text-navy font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-[0_0_15px_rgba(201,162,39,0.5)]"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {saving ? 'Menyimpan...' : 'Simpan Progression'}
      </button>
    </div>
  )
}
