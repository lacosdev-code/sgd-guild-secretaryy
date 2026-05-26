'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Quest, DifficultyRank, User } from '@/types'

// ── Constants ─────────────────────────────────────────────────────────────────

const DIFFICULTY_OPTIONS: { value: DifficultyRank; label: string; desc: string }[] = [
  { value: 'F', label: 'F',  desc: 'Rutin' },
  { value: 'E', label: 'E',  desc: 'Basic Operasional' },
  { value: 'D', label: 'D',  desc: 'Operasional Standar' },
  { value: 'C', label: 'C',  desc: 'Skill-Based' },
  { value: 'B', label: 'B',  desc: 'Koordinasi Penting' },
  { value: 'A', label: 'A',  desc: 'High Responsibility' },
  { value: 'S', label: 'S',  desc: 'Strategic / Critical' },
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
  assigned_to: string
  description: string
  deadline: string        // ISO datetime-local string
  difficulty: DifficultyRank | ''
  success_parameter: string
  reward_points: string
}

function isDetailComplete(f: FormState): boolean {
  return (
    f.description.trim() !== '' &&
    f.deadline !== '' &&
    f.difficulty !== '' &&
    f.success_parameter.trim() !== '' &&
    f.reward_points !== '' && !isNaN(Number(f.reward_points))
  )
}

function countFilledOptional(f: FormState): number {
  let n = 0
  if (f.description.trim() !== '') n++
  if (f.deadline !== '') n++
  if (f.difficulty !== '') n++
  if (f.success_parameter.trim() !== '') n++
  if (f.reward_points !== '' && !isNaN(Number(f.reward_points))) n++
  return n
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

function QuestCompletionBar({ filled, total }: { filled: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((filled / total) * 100)
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
        <span style={{ color: '#1B2E5280' }}>Kelengkapan Detail Quest</span>
        <span style={{ color }}>
          {filled}/{total} field terisi
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
          ✓ Semua detail lengkap — quest akan otomatis diset ke status <strong>Active</strong>.
        </p>
      ) : (
        <p className="text-[11px] text-gray-400">
          Isi semua field untuk mengaktifkan quest. Quest tersimpan sebagai <strong>Draft</strong> jika masih ada field kosong.
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

// ── Main form component ───────────────────────────────────────────────────────

interface QuestFormProps {
  /** Pre-fill with existing data when editing */
  existingQuest?: Quest | null
  /** Current user ID (will be set as created_by on insert) */
  currentUserId: string
  mode: 'create' | 'edit'
}

export default function QuestForm({
  existingQuest,
  currentUserId,
  mode,
}: QuestFormProps) {
  const router   = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [adventurers, setAdventurers] = useState<User[]>([])
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState<string | null>(null)

  const [form, setForm] = useState<FormState>({
    title:             existingQuest?.title ?? '',
    assigned_to:       existingQuest?.assigned_to ?? '',
    description:       existingQuest?.description ?? '',
    deadline:          existingQuest?.deadline
                         ? new Date(existingQuest.deadline).toISOString().slice(0, 16)
                         : '',
    difficulty:        existingQuest?.difficulty ?? '',
    success_parameter: existingQuest?.success_parameter ?? '',
    reward_points:     existingQuest?.reward_points != null
                         ? String(existingQuest.reward_points)
                         : '',
  })

  // Fetch all adventurers (and GM — some may be assigned to themselves)
  useEffect(() => {
    ;(async () => {
      const { data } = await supabase
        .from('users')
        .select('id, nama, role')
        .order('nama')
      setAdventurers((data ?? []) as User[])
    })()
  }, [supabase])

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const filledOptional = useMemo(() => countFilledOptional(form), [form])
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim())      return setError('Judul quest wajib diisi.')
    if (!form.assigned_to)       return setError('PIC (assigned adventurer) wajib dipilih.')

    setSaving(true)
    setError(null)

    const payload = {
      title:             form.title.trim(),
      assigned_to:       form.assigned_to,
      description:       form.description.trim() || null,
      deadline:          form.deadline ? new Date(form.deadline).toISOString() : null,
      difficulty:        form.difficulty || null,
      success_parameter: form.success_parameter.trim() || null,
      reward_points:     form.reward_points !== '' ? Number(form.reward_points) : null,
      status:            computeStatus(),
      updated_at:        new Date().toISOString(),
    }

    try {
      let questId: string

      if (mode === 'create') {
        const { data, error: e } = await supabase
          .from('quests')
          .insert({ ...payload, created_by: currentUserId })
          .select('id')
          .single()
        if (e) throw e
        questId = data.id
      } else {
        const { error: e } = await supabase
          .from('quests')
          .update(payload)
          .eq('id', existingQuest!.id)
        if (e) throw e
        questId = existingQuest!.id
      }

      router.push(`/quests/${questId}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan quest.')
    } finally {
      setSaving(false)
    }
  }

  const isRequired = (f: keyof FormState) =>
    ['title', 'assigned_to'].includes(f)

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl mx-auto space-y-0">

      {/* ── Document header ─────────────────────────────────────────────── */}
      <div
        className="px-6 py-5 border flex items-center justify-between"
        style={{ background: '#1B2E52', borderColor: '#1B2E52' }}
      >
        <div>
          <h1 className="text-base font-bold tracking-widest uppercase" style={{ color: '#C9A227' }}>
            {mode === 'create' ? '⚔ Quest Baru' : '⚔ Edit Quest'}
          </h1>
          <p className="text-[11px] mt-0.5 tracking-wider" style={{ color: '#FFFFFF80' }}>
            {mode === 'create'
              ? 'Buat quest baru untuk tim guild'
              : `Mengedit: ${existingQuest?.title}`}
          </p>
        </div>
        {mode === 'edit' && existingQuest && (
          <span
            className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 border"
            style={{
              background: '#FFFFFF10',
              color: '#FFFFFF80',
              borderColor: '#FFFFFF20',
            }}
          >
            {existingQuest.status}
          </span>
        )}
      </div>

      {/* ── Fields ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-t-0 px-6 py-6 space-y-6" style={{ borderColor: '#DDD9D3' }}>

        {/* Error banner */}
        {error && (
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
        )}

        {/* REQUIRED FIELDS */}
        <div
          className="pb-5 border-b space-y-5"
          style={{ borderColor: '#E8E5E0' }}
        >
          <p
            className="text-[10px] font-bold tracking-[0.2em] uppercase -mb-2"
            style={{ color: '#1B2E5250' }}
          >
            Field Wajib
          </p>

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
            <FieldLabel htmlFor="quest-assigned" required>
              PIC (Assigned Adventurer)
            </FieldLabel>
            <select
              id="quest-assigned"
              value={form.assigned_to}
              onChange={set('assigned_to')}
              className={inputClass}
              style={inputStyle}
              required
            >
              <option value="">— Pilih adventurer —</option>
              {adventurers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nama}
                  {u.role === 'guild_master' ? ' (Guild Master)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* OPTIONAL FIELDS */}
        <div className="space-y-6">
          <p
            className="text-[10px] font-bold tracking-[0.2em] uppercase -mb-3"
            style={{ color: '#1B2E5250' }}
          >
            Detail Quest (Wajib Lengkap Sebelum 00:00)
          </p>

          {/* Description */}
          <div>
            <FieldLabel htmlFor="quest-desc">Deskripsi / Objective</FieldLabel>
            <textarea
              id="quest-desc"
              value={form.description}
              onChange={set('description')}
              rows={4}
              className={`${inputClass} resize-y`}
              style={inputStyle}
              placeholder="Jelaskan tujuan quest ini secara spesifik. Siapa yang dihubungi, lokasi, konteks masalah, dll."
            />
          </div>

          {/* Deadline */}
          <div>
            <FieldLabel htmlFor="quest-deadline">Deadline</FieldLabel>
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

          {/* Difficulty */}
          <div>
            <FieldLabel htmlFor="quest-difficulty">
              Difficulty Rank
            </FieldLabel>
            <DifficultySelector
              value={form.difficulty}
              onChange={(v) => setForm((p) => ({ ...p, difficulty: v }))}
            />
          </div>

          {/* Success parameter */}
          <div>
            <FieldLabel
              htmlFor="quest-success"
              hint="Pisahkan per baris. Setiap baris akan dijadikan item checklist di Quest Sheet."
            >
              Success Criteria
            </FieldLabel>
            <textarea
              id="quest-success"
              value={form.success_parameter}
              onChange={set('success_parameter')}
              rows={5}
              className={`${inputClass} resize-y font-mono text-xs`}
              style={inputStyle}
              placeholder={`Airflow AC stabil
Konfirmasi dari perawat
Foto AC dan panel terlampir
Tidak ada complaint dalam 24 jam`}
            />
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
                value={form.reward_points}
                onChange={set('reward_points')}
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
      </div>

      {/* ── Progress bar ────────────────────────────────────────────────── */}
      <QuestCompletionBar filled={filledOptional} total={5} />

      {/* ── Action footer ────────────────────────────────────────────────── */}
      <div
        className="border border-t-0 px-6 py-4 flex items-center justify-between gap-4"
        style={{ background: '#F9F8F6', borderColor: '#DDD9D3' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xs font-bold tracking-widest uppercase px-4 py-2.5 border transition-all hover:bg-white"
          style={{ borderColor: '#1B2E5230', color: '#1B2E5280' }}
        >
          Batal
        </button>

        <div className="flex items-center gap-3">
          {/* Save as Draft shortcut — only on create */}
          {mode === 'create' && !allComplete && (
            <span className="text-[11px] text-gray-400">
              Akan disimpan sebagai <strong>Draft</strong>
            </span>
          )}
          {mode === 'create' && allComplete && (
            <span className="text-[11px]" style={{ color: '#0F6E56' }}>
              Akan disimpan sebagai <strong>Active</strong>
            </span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold tracking-widest uppercase transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
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
