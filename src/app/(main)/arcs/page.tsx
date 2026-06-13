import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

import Link from 'next/link'

import ArcForm from '@/components/arcs/ArcForm'
export default async function ArcsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const arcs = await prisma.arc.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { projects: true } } }
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-navy dark:text-white mb-6">Master Arcs (Kampanye)</h1>
      
      <ArcForm />

      <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
        {arcs.map((arc: any, index: number) => (
          <Link href={`/arcs/${arc.id}`} key={arc.id} className="block group">
            <div 
              className="bg-white dark:bg-[#1B2E52] p-5 rounded-2xl border border-gray-100 dark:border-[#2A3F6B] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#C9A227]/50 animate-slide-up-fade relative overflow-hidden"
              style={{ animationDelay: `${index * 80 + 100}ms` }}
            >
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C9A227]/5 to-transparent rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110" />
              
              <div className="flex justify-between items-start relative z-10">
                <h3 className="font-bold text-navy dark:text-white group-hover:text-[#C9A227] transition-colors">{arc.name}</h3>
                <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${arc.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-[#C9A227]/10 dark:text-[#C9A227]' : 'bg-gray-100 dark:bg-black/20 text-gray-500 dark:text-gray-400'}`}>
                  {arc.status}
                </span>
              </div>
              {arc.strategicObjective && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 relative z-10">{arc.strategicObjective}</p>}
              <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500 relative z-10 group-hover:text-[#C9A227]/70 transition-colors">
                <div className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
                  {arc._count.projects} Projects
                </div>
              </div>
            </div>
          </Link>
        ))}
        {arcs.length === 0 && <p className="text-sm text-gray-500 animate-slide-up-fade">Belum ada Arc yang dibuat.</p>}
      </div>
    </div>
  )
}
