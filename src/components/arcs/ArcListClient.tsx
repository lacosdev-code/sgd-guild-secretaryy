'use client'

import { useState } from 'react'
import Link from 'next/link'
import ArcForm from './ArcForm'
import { useUser } from '@/hooks/useUser'

export default function ArcListClient({ arcs }: { arcs: any[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [showForm, setShowForm] = useState(false)
  const { role } = useUser()

  // RBAC: Only higher roles can create Arcs
  const canCreate = ['guild_master', 'quest_giver', 'guild_secretary'].includes(role || '')

  const filteredArcs = arcs.filter(arc => {
    if (search.trim()) {
      const s = search.toLowerCase()
      if (!arc.name.toLowerCase().includes(s) && !arc.strategicObjective?.toLowerCase().includes(s)) return false
    }
    if (filter === 'active' && arc.status !== 'Active') return false
    if (filter === 'completed' && arc.status !== 'Completed') return false
    return true
  })

  return (
    <div className="p-4 md:p-6 pb-24 max-w-4xl mx-auto space-y-6 animate-slide-up-fade">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Master Arcs (Kampanye)</h1>
          <p className="text-sm text-gray-500 mt-1">Garis besar strategis operasional</p>
        </div>
        {canCreate && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
              showForm 
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300' 
              : 'bg-navy text-white hover:bg-navy/90 hover:shadow-lg hover:shadow-navy/20 dark:bg-[#C9A227] dark:text-[#1B2E52]'
            }`}
          >
            {showForm ? 'Batal' : '+ Arc Baru'}
          </button>
        )}
      </div>

      {/* Expandable Form */}
      {canCreate && (
        <div className={`transition-all duration-500 overflow-hidden ${showForm ? 'max-h-[800px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
          <ArcForm />
        </div>
      )}

      {/* Interactive Toolbar: Search & Filters */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-focus-within:text-navy transition-colors">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama arc atau objektif strategis..." 
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#1B2E52] border border-gray-200 dark:border-[#2A3F6B] rounded-2xl focus:outline-none focus:ring-2 focus:ring-navy/20 dark:focus:ring-[#C9A227]/30 transition-all text-sm placeholder-gray-400"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
          <button
            onClick={() => setFilter('all')}
            className={`snap-center flex items-center gap-2 px-4 py-2 text-[11px] font-bold tracking-widest uppercase border rounded-full transition-all duration-300 whitespace-nowrap ${
              filter === 'all' 
              ? 'bg-navy border-navy text-white shadow-md dark:bg-white dark:border-white dark:text-navy' 
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:text-gray-400'
            }`}
          >
            Semua
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === 'all' ? 'bg-white/20 dark:bg-navy/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
              {arcs.length}
            </span>
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`snap-center flex items-center gap-2 px-4 py-2 text-[11px] font-bold tracking-widest uppercase border rounded-full transition-all duration-300 whitespace-nowrap ${
              filter === 'active' 
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' 
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:text-gray-400'
            }`}
          >
            Active
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === 'active' ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
              {arcs.filter(a => a.status === 'Active').length}
            </span>
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`snap-center flex items-center gap-2 px-4 py-2 text-[11px] font-bold tracking-widest uppercase border rounded-full transition-all duration-300 whitespace-nowrap ${
              filter === 'completed' 
              ? 'bg-indigo-500 border-indigo-500 text-white shadow-md' 
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:text-gray-400'
            }`}
          >
            Completed
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === 'completed' ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
              {arcs.filter(a => a.status === 'Completed').length}
            </span>
          </button>
        </div>
      </div>

      {/* Arcs Grid */}
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        {filteredArcs.map((arc: any, index: number) => (
          <Link href={`/arcs/${arc.id}`} key={arc.id} className="block group">
            <div 
              className="bg-white dark:bg-[#1B2E52] p-5 rounded-2xl border border-gray-100 dark:border-[#2A3F6B] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#C9A227]/50 animate-slide-up-fade relative overflow-hidden h-full flex flex-col"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C9A227]/5 to-transparent rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110" />
              
              <div className="flex justify-between items-start relative z-10 mb-2">
                <h3 className="font-bold text-navy dark:text-white group-hover:text-[#C9A227] transition-colors pr-2">{arc.name}</h3>
                <span className={`shrink-0 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${
                  arc.status === 'Active' 
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-[#C9A227]/10 dark:text-[#C9A227]' 
                    : 'bg-gray-100 dark:bg-black/20 text-gray-500 dark:text-gray-400'
                }`}>
                  {arc.status}
                </span>
              </div>
              
              {arc.strategicObjective && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4 line-clamp-3 relative z-10">{arc.strategicObjective}</p>
              )}
              
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-gray-400 dark:text-gray-500 relative z-10 group-hover:text-[#C9A227]/70 transition-colors">
                <div className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
                  {arc._count.projects} Projects
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center text-gray-400 group-hover:bg-[#C9A227] group-hover:text-navy transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {filteredArcs.length === 0 && (
          <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-400 mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Tidak ada arc yang ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  )
}
