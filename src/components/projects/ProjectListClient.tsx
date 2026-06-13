'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProjectForm from './ProjectForm'
import { useUser } from '@/hooks/useUser'

export default function ProjectListClient({ projects, arcs }: { projects: any[], arcs: any[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'orphan'>('all')
  const [showForm, setShowForm] = useState(false)
  const { role } = useUser()

  const canCreate = ['guild_master', 'quest_giver', 'guild_secretary'].includes(role || '')

  // Filtering logic
  const filteredProjects = projects.filter(proj => {
    // 1. Text Search
    if (search.trim()) {
      const s = search.toLowerCase()
      if (!proj.name.toLowerCase().includes(s)) return false
    }
    // 2. Tab Filter
    if (filter === 'orphan') {
      if (proj.arcId !== null) return false
    }
    return true
  })

  return (
    <div className="p-4 md:p-6 pb-24 max-w-4xl mx-auto space-y-6 animate-slide-up-fade">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Projects Master</h1>
          <p className="text-sm text-gray-500 mt-1">Pusat komando operasional proyek</p>
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
            {showForm ? 'Batal' : '+ Project Baru'}
          </button>
        )}
      </div>

      {/* Expandable Form */}
      {canCreate && (
        <div className={`transition-all duration-500 overflow-hidden ${showForm ? 'max-h-[800px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
          <ProjectForm arcs={arcs} onCreated={() => setShowForm(false)} />
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
            placeholder="Cari nama proyek..." 
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
              {projects.length}
            </span>
          </button>
          <button
            onClick={() => setFilter('orphan')}
            className={`snap-center flex items-center gap-2 px-4 py-2 text-[11px] font-bold tracking-widest uppercase border rounded-full transition-all duration-300 whitespace-nowrap ${
              filter === 'orphan' 
              ? 'bg-amber-500 border-amber-500 text-white shadow-md dark:bg-amber-500 dark:border-amber-500' 
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:text-gray-400'
            }`}
          >
            Tanpa Arc
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === 'orphan' ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
              {projects.filter(p => p.arcId === null).length}
            </span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        {filteredProjects.map((proj: any, index: number) => (
          <Link 
            href={`/projects/${proj.id}`} 
            key={proj.id} 
            className="block group animate-in slide-in-from-bottom-2 fade-in duration-500 fill-mode-both"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-white/10 transition-all duration-300 group-hover:border-navy/30 dark:group-hover:border-slate-500 group-hover:shadow-xl group-hover:-translate-y-1 h-full relative overflow-hidden">
              {/* Decorative top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-navy to-[#C9A227] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-base text-navy dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#C9A227] transition-colors line-clamp-2 pr-2">
                  {proj.name}
                </h3>
                {proj.status === 'Active' ? (
                   <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full ring-1 ring-green-600/20">Active</span>
                ) : (
                   <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300 px-2.5 py-1 rounded-full">{proj.status}</span>
                )}
              </div>
              
              {proj.arc ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 mb-4">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <span className="text-[10px] font-bold tracking-wider uppercase truncate max-w-[200px]">{proj.arc.name}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 mb-4">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  <span className="text-[10px] font-bold tracking-wider uppercase">Orphan Project</span>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span className="text-xs font-medium">{proj._count.quests} Quests Terhubung</span>
                </div>
                
                <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center text-gray-400 group-hover:bg-navy group-hover:text-white dark:group-hover:bg-[#C9A227] dark:group-hover:text-navy transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-400 mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Tidak ada project yang ditemukan.</p>
            <button onClick={() => {setSearch(''); setFilter('all');}} className="mt-2 text-xs text-navy dark:text-[#C9A227] font-bold hover:underline">Reset Filter</button>
          </div>
        )}
      </div>
    </div>
  )
}
