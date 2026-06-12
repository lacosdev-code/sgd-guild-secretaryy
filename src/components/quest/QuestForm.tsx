'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Paperclip, Loader2, X } from 'lucide-react'
import imageCompression from 'browser-image-compression'
import toast from 'react-hot-toast'
import type { Quest, DifficultyRank, QuestUrgency, User } from '@/types'

// ── Constants ─────────────────────────────────────────────────────────────────

const URGENCY_OPTIONS: { value: QuestUrgency; label: string; desc: string; color: string; border: string }[] = [
  { value: 'Routine', label: 'Routine', desc: 'Tugas operasional biasa', color: '#6B7280', border: '#D1D5DB' },
  { value: 'Priority', label: 'Priority', desc: 'Penting & mendesak', color: '#D97706', border: '#F59E0B' },
  { value: 'Strategic', label: 'Strategic', desc: 'Dampak jangka panjang', color: '#0F6E56', border: '#10B981' },
  { value: 'Emergency', label: 'Emergency', desc: 'Kritis / Fire Fighting', color: '#DC2626', border: '#EF4444' },
]

const DIFFICULTY_OPTIONS: { value: DifficultyRank; label: string; desc: string }[] = [
  { value: 'F', label: 'F',  desc: 'Routine' },
  { value: 'E', label: 'E',  desc: 'Operational' },
  { value: 'D', label: 'D',  desc: 'Standard' },
  { value: 'C', label: 'C',  desc: 'Skill-Based' },
  { value: 'B', label: 'B',  desc: 'Important' },
  { value: 'A', label: 'A',  desc: 'High Resp.' },
  { value: 'S', label: 'S',  desc: 'Critical' },
]

// PRD rank colors for the option chip
const RANK_STYLE: Record<DifficultyRank, { bg: string; color: string; border: string }> = {
  F: { bg: '#F0EFEE', color: '#6B7280', border: '#D1D5DB' },
  E: { bg: '#E9E8E6', color: '#4B5563', border: '#9CA3AF' },
  D: { bg: '#D6EDE7', color: '#0A5742', border: '#0F6E5660' },
  C: { bg: '#EBF4F1', color: '#0F6E56', border: '#0F6E5640' },
  B: { bg: '#CDD4E4', color: '#1B2E52', border: '#1B2E5260' },
  A: { bg: '#E8ECF3', color: '#1B2E52', border: '#1B2E5240' },
  S: { bg: '#FDF5DC', color: '#A07D10', border: '#C9A22760' },
}

// ── Field state ───────────────────────────────────────────────────────────────

interface FormState {
  title: string
  assignedTo: string
  projectId: string
  urgency: QuestUrgency
  description: string
  deadline: string        // ISO datetime-local string
  difficulty: DifficultyRank | ''
  success_parameter: string
  rewardPoints: string
  brief_attachment_url: string | null
}

function isDetailComplete(f: FormState): boolean {
  return (
    f.description.trim() !== '' &&
    f.deadline !== '' &&
    f.difficulty !== '' &&
    f.success_parameter.trim() !== '' &&
    f.rewardPoints !== '' && !isNaN(Number(f.rewardPoints))
  )
}

function calculateProgress(f: FormState): number {
  let score = 0
  // Weights: Deadline (30%), Success Criteria (40%), Objective (15%), Difficulty (5%), Reward (10%)
  if (f.deadline !== '') score += 30
  if (f.success_parameter.trim() !== '') score += 40
  if (f.description.trim() !== '') score += 15
  if (f.difficulty !== '') score += 5
  if (f.rewardPoints !== '' && !isNaN(Number(f.rewardPoints))) score += 10
  return score
}

// ── UI sub-components ─────────────────────────────────────────────────────────

function FieldLabel({
  htmlFor,
  children,
  required,
  hint,
}: {
  htmlFor: string
  children: React.ReactNode
  required?: boolean
  hint?: string
}) {
  return (
    <div className="mb-1.5 space-y-0.5">
      <label
        htmlFor={htmlFor}
        className="block text-[11px] font-bold tracking-[0.18em] uppercase"
        style={{ color: '#1B2E52' }}
      >
        {children}
        {required && (
          <span className="ml-1" style={{ color: '#993C1D' }}>
            *
          </span>
        )}
      </label>
      {hint && (
        <p className="text-[11px] text-gray-400">{hint}</p>
      )}
    </div>
  )
}

const inputClass =
  'w-full px-3 py-2.5 text-sm bg-white border focus:outline-none focus:ring-2 transition-all text-charcoal placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed'

const inputStyle = {
  borderColor: '#DDD9D3',
  '--tw-ring-color': '#C9A227',
} as React.CSSProperties

// ── Progress bar ──────────────────────────────────────────────────────────────

function QuestCompletionBar({ pct }: { pct: number }) {
  const color =
    pct === 100 ? '#0F6E56'
    : pct >= 60  ? '#C9A227'
    :              '#993C1D'

  return (
    <div
      className="border px-4 py-3 space-y-2"
      style={{ background: '#F9F8F6', borderColor: '#E8E5E0' }}
    >
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
        <span style={{ color: '#1B2E5280' }}>Kelengkapan Kualitas Delegasi</span>
        <span style={{ color }}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-none" style={{ background: '#E8E5E0' }}>
        <div
          className="h-1.5 transition-all duration-300"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      {pct === 100 ? (
        <p className="text-[11px]" style={{ color: '#0F6E56' }}>
          ✓ Kualitas instruksi sempurna. Quest akan diset ke status <strong>Active</strong>.
        </p>
      ) : (
        <p className="text-[11px] text-gray-400">
          Sistem menyarankan Anda untuk mencapai 100% agar delegasi lebih jelas. Quest dengan detail kurang akan berstatus <strong>Draft</strong>.
        </p>
      )}
    </div>
  )
}

// ── Difficulty selector ───────────────────────────────────────────────────────

function DifficultySelector({
  value,
  onChange,
}: {
  value: DifficultyRank | ''
  onChange: (v: DifficultyRank | '') => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {DIFFICULTY_OPTIONS.map((opt) => {
        const sel = value === opt.value
        const s   = RANK_STYLE[opt.value]
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(sel ? '' : opt.value)}
            className="flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold transition-all hover:opacity-80"
            style={
              sel
                ? { background: s.bg, color: s.color, borderColor: s.border, boxShadow: `0 0 0 2px ${s.border}` }
                : { background: 'white', color: '#6B7280', borderColor: '#DDD9D3' }
            }
            title={opt.desc}
          >
            <span
              className="w-5 h-5 flex items-center justify-center text-[11px] font-bold border"
              style={sel ? { background: s.color, color: 'white', borderColor: s.color } : { borderColor: '#DDD9D3' }}
            >
              {opt.value}
            </span>
            <span className="hidden sm:inline text-[11px]">{opt.desc}</span>
          </button>
        )
      })}
    </div>
  )
}

function UrgencySelector({
  value,
  onChange,
}: {
  value: QuestUrgency
  onChange: (v: QuestUrgency) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {URGENCY_OPTIONS.map((opt) => {
        const sel = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="flex flex-col items-start px-3 py-2 border transition-all hover:opacity-80 text-left"
            style={
              sel
                ? { background: `${opt.color}10`, borderColor: opt.color, boxShadow: `0 0 0 1px ${opt.color}` }
                : { background: 'white', borderColor: '#DDD9D3' }
            }
          >
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: sel ? opt.color : '#4B5563' }}>
              {opt.label}
            </span>
            <span className="text-[10px] text-gray-500 mt-0.5">{opt.desc}</span>
          </button>
        )
      })}
    </div>
  )
}

function PICSelector(props: { value: string; onChange: (v: string) => void; adventurers: User[] }) {
  const { value, onChange, adventurers } = props;
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 text-sm bg-[#FAFAF8] border focus:outline-none transition-colors appearance-none cursor-pointer"
        style={{ borderColor: '#DDD9D3', color: value ? '#2B3B4E' : '#9CA3AF' }}
        required
      >
        <option value="" disabled>--- Pilih PIC ---</option>
        {adventurers.map((u) => (
          <option key={u.id} value={u.id}>
            {u.nama} {u.role === 'guild_master' ? '(GM)' : ''}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3" style={{ color: '#1B2E5250' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>
    </div>
  )
}

function ProjectSelector(props: { value: string; onChange: (v: string) => void; projects: any[] }) {
  const { value, onChange, projects } = props;
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 text-sm bg-white border focus:outline-none transition-colors appearance-none cursor-pointer"
        style={{ borderColor: '#DDD9D3', color: value ? '#2B3B4E' : '#9CA3AF' }}
      >
        <option value="">--- Tanpa Project (Opsional) ---</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3" style={{ color: '#1B2E5250' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>
    </div>
  )
}

// ── Main form component ───────────────────────────────────────────────────────

interface QuestFormProps {
  /** Pre-fill with existing data when editing */
  existingQuest?: Quest | null
  /** Current user ID (will be set as createdBy on insert) */
  currentUserId: string
  mode: 'create' | 'edit'
}

export default function QuestForm({
  existingQuest,
  mode,
}: QuestFormProps) {
  const router   = useRouter()

  const [adventurers, setAdventurers] = useState<User[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingBrief, setUploadingBrief] = useState(false)

  // Section expand state (Progressive Reveal)
  const [expandedSection, setExpandedSection] = useState<1 | 2 | 3>(1)

  const [form, setForm] = useState<FormState>({
    title:             existingQuest?.title ?? '',
    assignedTo:       existingQuest?.assignedTo ?? '',
    projectId:        existingQuest?.project_id ?? '',
    urgency:           existingQuest?.urgency ?? 'Routine',
    description:       existingQuest?.description ?? '',
    deadline:          existingQuest?.deadline
                         ? new Date(existingQuest.deadline).toISOString().slice(0, 16)
                         : '',
    difficulty:        existingQuest?.difficulty ?? '',
    success_parameter: existingQuest?.success_parameter ?? '',
    rewardPoints:     existingQuest?.rewardPoints != null
                         ? String(existingQuest.rewardPoints)
                         : '',
    brief_attachment_url: existingQuest?.brief_attachment_url ?? null,
  })

  // Fetch all adventurers and projects
  useEffect(() => {
    ;(async () => {
      try {
        const [resUsers, resProj] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/projects')
        ])
        if (resUsers.ok) setAdventurers(await resUsers.json())
        if (resProj.ok) setProjects(await resProj.json())
      } catch (err) {
        console.error('Failed to fetch data:', err)
      }
    })()
  }, [])

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const pctComplete    = calculateProgress(form)
  const allComplete    = isDetailComplete(form)

  // Determine status to save
  function computeStatus() {
    if (mode === 'edit' && existingQuest) {
      const editableStatuses = ['Draft', 'Active']
      if (!editableStatuses.includes(existingQuest.status)) {
        return existingQuest.status // Don't change status for Submitted/Approved/etc.
      }
    }
    return allComplete ? 'Active' : 'Draft'
  }

  const handleBriefUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10MB')
      return
    }

    setUploadingBrief(true)
    try {
      let finalFile = file
      const isImage = file.type.startsWith('image/')
      
      if (isImage) {
        try {
          const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1280, useWebWorker: false }
          const compressedBlob = await imageCompression(file, options)
          finalFile = new File([compressedBlob], file.name, { type: file.type })
        } catch (err) {
          console.error('Compression failed:', err)
        }
      }

      const formData = new FormData()
      formData.append('file', finalFile)
      formData.append('dir', 'briefs')

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error(await res.text())
      
      const data = await res.json()
      setForm(p => ({ ...p, brief_attachment_url: data.url }))
    } catch (err: any) {
      alert('Gagal mengupload lampiran: ' + err.message)
    } finally {
      setUploadingBrief(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim())      return setError('Judul quest wajib diisi.')
    if (!form.assignedTo)       return setError('PIC (assigned adventurer) wajib dipilih.')

    setSaving(true)
    setError(null)

    const payload = {
      title:             form.title.trim(),
      assignedTo:       form.assignedTo,
      urgency:           form.urgency,
      description:       form.description.trim() || null,
      deadline:          form.deadline ? new Date(form.deadline).toISOString() : null,
      difficulty:        form.difficulty || null,
      success_parameter: form.success_parameter.trim() || null,
      rewardPoints:     form.rewardPoints !== '' ? Number(form.rewardPoints) : null,
      brief_attachment_url: form.brief_attachment_url,
      projectId:         form.projectId || null,
      status:            computeStatus(),
      updated_at:        new Date().toISOString(),
    }

    try {
      let questId: string

      if (mode === 'create') {
        const res = await fetch('/api/quests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        questId = data.id

        // Trigger PWA Push Notification
        fetch('/api/push/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'new_quest',
            questId: questId,
            title: payload.title,
            assignedTo: payload.assignedTo
          })
        }).catch(console.error)

      } else {
        // Edit mode
        const res = await fetch(`/api/quests/${existingQuest!.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error(await res.text())
        questId = existingQuest!.id
      }

      toast.success(mode === 'create' ? 'Quest berhasil ditambahkan!' : 'Quest berhasil diperbarui!')
      router.push(`/quests/${questId}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan quest.')
    } finally {
      setSaving(false)
    }
  }

  const handleNext = (section: 1|2) => {
    setExpandedSection((section + 1) as 1|2|3)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl mx-auto space-y-0">

      {/* ── Document header ─────────────────────────────────────────────── */}
      <div
        className="px-6 py-5 flex items-start justify-between relative overflow-hidden shadow-sm"
        style={{ background: 'linear-gradient(135deg, #1B2E52 0%, #101c33 100%)' }}
      >
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M14.5 4L20 9.5"/></svg>
        </div>
        <div className="relative z-10">
          <h1 className="text-lg font-black tracking-widest uppercase flex items-center gap-2" style={{ color: '#C9A227' }}>
            <span className="opacity-80">⚔</span> {mode === 'create' ? 'Quest Baru' : 'Edit Quest'}
          </h1>
          <p className="text-xs mt-1 tracking-wider opacity-80" style={{ color: '#E8E5E0' }}>
            {mode === 'create'
              ? 'Mulai delegasi dengan jelas'
              : `Sedang menyunting: ${existingQuest?.title}`}
          </p>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          {mode === 'edit' && existingQuest && (
            <span
              className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-sm"
              style={{
                background: '#FFFFFF20',
                color: '#FFFFFF',
                backdropFilter: 'blur(4px)',
                border: '1px solid #FFFFFF30',
              }}
            >
              {existingQuest.status}
            </span>
          )}
          <button
            type="button"
            onClick={() => router.back()}
            className="text-[#FFFFFF80] hover:text-white transition-colors p-1"
            title="Tutup"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Error Banner ────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-white border-l border-r px-6 py-4" style={{ borderColor: '#DDD9D3' }}>
          <div
            className="px-4 py-3 border text-sm flex items-start gap-2"
            style={{ background: '#FDF2F0', borderColor: '#993C1D22', color: '#993C1D' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* ── Tahap 1: Inti Operasional ────────────────────────────────────── */}
      <div className="bg-white border px-6 py-5" style={{ borderColor: '#DDD9D3', borderBottomColor: expandedSection === 1 ? 'transparent' : '#DDD9D3' }}>
        <button 
          type="button" 
          onClick={() => setExpandedSection(1)}
          className="w-full flex items-center justify-between focus:outline-none"
        >
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: expandedSection === 1 ? '#1B2E52' : '#1B2E5250' }}>
            Tahap 1: Inti Operasional (Wajib)
          </p>
          <span style={{ color: '#1B2E5250' }}>{expandedSection === 1 ? '▼' : '▶'}</span>
        </button>
        
        {expandedSection === 1 && (
          <div className="mt-5 space-y-5 animate-in slide-in-from-top-2 duration-200">
            {/* Title */}
            <div>
              <FieldLabel htmlFor="quest-title" required>Judul Quest</FieldLabel>
              <input
                id="quest-title"
                type="text"
                value={form.title}
                onChange={set('title')}
                className={inputClass}
                style={inputStyle}
                placeholder="cth: Perbaikan AC ICU Bella"
                maxLength={200}
                required
              />
            </div>

            {/* Assigned to */}
            <div>
              <FieldLabel htmlFor="quest-assigned" required>PIC (Assigned Adventurer)</FieldLabel>
              <PICSelector
                value={form.assignedTo}
                onChange={(val) => setForm(p => ({ ...p, assignedTo: val }))}
                adventurers={adventurers}
              />
            </div>

            {/* Project */}
            <div>
              <FieldLabel htmlFor="quest-project">Project (Opsional)</FieldLabel>
              <ProjectSelector
                value={form.projectId}
                onChange={(val) => setForm(p => ({ ...p, projectId: val }))}
                projects={projects}
              />
            </div>

            {/* Urgency */}
            <div>
              <FieldLabel htmlFor="quest-urgency" required>Tingkat Urgensi</FieldLabel>
              <UrgencySelector
                value={form.urgency}
                onChange={(v) => setForm((p) => ({ ...p, urgency: v }))}
              />
            </div>

            {/* Difficulty / Mission Rank */}
            <div>
              <FieldLabel htmlFor="quest-difficulty" hint="Pembobotan tingkat kesulitan / komitmen.">
                Mission Rank (Difficulty)
              </FieldLabel>
              <DifficultySelector
                value={form.difficulty}
                onChange={(v) => setForm((p) => ({ ...p, difficulty: v }))}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleNext(1)}
                className="px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all bg-navy text-gold hover:opacity-80"
              >
                Lanjut ke Tahap 2 →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Tahap 2: Arahan Naratif ──────────────────────────────────────── */}
      <div className="bg-white border border-t-0 px-6 py-5" style={{ borderColor: '#DDD9D3', borderBottomColor: expandedSection === 2 ? 'transparent' : '#DDD9D3' }}>
        <button 
          type="button" 
          onClick={() => setExpandedSection(2)}
          className="w-full flex items-center justify-between focus:outline-none"
        >
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: expandedSection === 2 ? '#1B2E52' : '#1B2E5250' }}>
            Tahap 2: Arahan Strategis (Wajib sebelum 00:00)
          </p>
          <span style={{ color: '#1B2E5250' }}>{expandedSection === 2 ? '▼' : '▶'}</span>
        </button>
        
        {expandedSection === 2 && (
          <div className="mt-5 space-y-6 animate-in slide-in-from-top-2 duration-200">
            {/* Description */}
            <div>
              <FieldLabel htmlFor="quest-desc" hint="Gunakan tone naratif (cerita). Apa hasil akhir yang diinginkan perusahaan?">
                Objective (Tujuan Besar)
              </FieldLabel>
              <textarea
                id="quest-desc"
                value={form.description}
                onChange={set('description')}
                rows={3}
                className={`${inputClass} resize-y italic`}
                style={inputStyle}
                placeholder="cth: Pastikan tersedia pembanding vendor untuk pengambilan keputusan genset cadangan agar operasional RS tidak terancam mati lampu."
              />
            </div>

            {/* Deadline */}
            <div>
              <FieldLabel htmlFor="quest-deadline" hint="Kapan batas akhir misi ini?">Deadline</FieldLabel>
              <input
                id="quest-deadline"
                type="datetime-local"
                value={form.deadline}
                onChange={set('deadline')}
                className={inputClass}
                style={inputStyle}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            {/* Attachment */}
            <div>
              <FieldLabel htmlFor="quest-attachment" hint="Dokumen referensi (PDF, Gambar, dll) maksimal 10MB.">
                Lampiran Referensi (Opsional)
              </FieldLabel>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleBriefUpload}
                  disabled={uploadingBrief}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingBrief}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 text-charcoal text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {uploadingBrief ? <Loader2 size={14} className="animate-spin" /> : <Paperclip size={14} />}
                  {uploadingBrief ? 'Mengupload...' : 'Pilih File'}
                </button>
                {form.brief_attachment_url && (
                  <div className="flex items-center gap-2 text-xs text-navy px-3 py-1.5 bg-navy/5 rounded border border-navy/10">
                    <span className="truncate max-w-[200px] font-medium">{form.brief_attachment_url.split('/').pop()}</span>
                    <button type="button" onClick={() => setForm(p => ({ ...p, brief_attachment_url: null }))} className="text-red-500 hover:text-red-700 bg-white rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleNext(2)}
                className="px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all bg-navy text-gold hover:opacity-80"
              >
                Lanjut ke Tahap 3 →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Tahap 3: Resolusi & Kriteria ─────────────────────────────────── */}
      <div className="bg-white border border-t-0 px-6 py-5" style={{ borderColor: '#DDD9D3' }}>
        <button 
          type="button" 
          onClick={() => setExpandedSection(3)}
          className="w-full flex items-center justify-between focus:outline-none"
        >
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: expandedSection === 3 ? '#1B2E52' : '#1B2E5250' }}>
            Tahap 3: Kriteria Selesai & Reward
          </p>
          <span style={{ color: '#1B2E5250' }}>{expandedSection === 3 ? '▼' : '▶'}</span>
        </button>

        {expandedSection === 3 && (
          <div className="mt-5 space-y-6 animate-in slide-in-from-top-2 duration-200">
            {/* Success parameter */}
            <div>
              <FieldLabel
                htmlFor="quest-success"
                hint="Ubah instruksi ambigu menjadi checklist spesifik. 1 baris = 1 syarat."
              >
                Success Criteria (Definition of Done)
              </FieldLabel>
              <textarea
                id="quest-success"
                value={form.success_parameter}
                onChange={set('success_parameter')}
                rows={4}
                className={`${inputClass} resize-y font-mono text-xs`}
                style={inputStyle}
                placeholder={`Minimal 2 quotation (penawaran harga)
Vendor berbeda
PDF terlampir di sistem
Rekomendasi vendor ditulis di kolom diskusi`}
              />
              <div className="mt-2 p-3 bg-gray-50 border border-gray-200 text-xs text-gray-600 rounded-sm">
                <p className="font-bold mb-1 text-gray-700">Contoh kriteria yang baik vs buruk:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-red-600">❌ &quot;Kerjaan selesai&quot;</div>
                  <div className="text-emerald-600">✅ &quot;Foto terlampir di sistem&quot;</div>
                  <div className="text-red-600">❌ &quot;Hubungi vendor&quot;</div>
                  <div className="text-emerald-600">✅ &quot;Client approval diterima &amp; ditulis&quot;</div>
                </div>
              </div>
            </div>

            {/* Reward points */}
            <div>
              <FieldLabel htmlFor="quest-reward">SGD Points Reward</FieldLabel>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold select-none"
                  style={{ color: '#C9A227' }}
                >
                  +
                </span>
                <input
                  id="quest-reward"
                  type="number"
                  value={form.rewardPoints}
                  onChange={set('rewardPoints')}
                  className={`${inputClass} pl-7`}
                  style={inputStyle}
                  placeholder="cth: 80"
                  min={0}
                  max={9999}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold select-none"
                  style={{ color: '#1B2E5250' }}
                >
                  SGD Points
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Progress bar ────────────────────────────────────────────────── */}
      <QuestCompletionBar pct={pctComplete} />

      {/* ── Action footer ────────────────────────────────────────────────── */}
      <div
        className="border border-t-0 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ background: '#F9F8F6', borderColor: '#DDD9D3' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xs font-bold tracking-widest uppercase px-4 py-2.5 border transition-all hover:bg-white w-full sm:w-auto text-center"
          style={{ borderColor: '#1B2E5230', color: '#1B2E5280' }}
        >
          Batal
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Save as Draft shortcut — only on create */}
          {mode === 'create' && !allComplete && (
            <span className="text-[11px] text-gray-400 text-center sm:text-right">
              Akan disimpan sebagai <strong className="text-gray-600">Draft</strong>
              <br/><span className="text-[9px]">karena kelengkapan {pctComplete}%</span>
            </span>
          )}
          {mode === 'create' && allComplete && (
            <span className="text-[11px] text-center sm:text-right" style={{ color: '#0F6E56' }}>
              Akan disimpan sebagai <strong>Active</strong>
            </span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-2.5 text-xs font-bold tracking-widest uppercase transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
            style={{ background: '#1B2E52', color: '#C9A227' }}
          >
            {saving ? (
              <>
                <span
                  className="inline-block w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: '#C9A227', borderTopColor: 'transparent' }}
                />
                Menyimpan…
              </>
            ) : (
              mode === 'create' ? 'Simpan Quest' : 'Perbarui Quest'
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
