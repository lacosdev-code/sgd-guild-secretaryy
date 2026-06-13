import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

import Link from 'next/link'

import ProjectForm from '@/components/projects/ProjectForm'
export default async function ProjectsPage({ searchParams }: { searchParams: { filter?: string } }) {
  const filter = searchParams.filter
  const session = await auth()
  if (!session) redirect('/login')

  const whereCondition = filter === 'orphan' ? { arcId: null } : {}

  const projects = await prisma.project.findMany({
    where: whereCondition,
    orderBy: { createdAt: 'desc' },
    include: { arc: true, _count: { select: { quests: true } } }
  })
  const arcs = await prisma.arc.findMany()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-navy dark:text-white mb-6">Projects (Proyek Operasional)</h1>
      
      <ProjectForm arcs={arcs} />

      <div className="flex gap-2 mb-6">
        <Link href="/projects" className={`px-4 py-2 rounded-lg text-sm font-medium ${!filter ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'}`}>
          Semua Project
        </Link>
        <Link href="/projects?filter=orphan" className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'orphan' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'}`}>
          Proyek Tanpa Arc (Orphan)
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
        {projects.map((proj: any, index: number) => (
          <Link 
            href={`/projects/${proj.id}`} 
            key={proj.id} 
            className="block group animate-in slide-in-from-bottom-2 fade-in duration-500 fill-mode-both"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-white/10 transition-all hover:border-navy dark:hover:border-slate-500 hover:shadow-md h-full">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-navy dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{proj.name}</h3>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{proj.health}</span>
              </div>
              {proj.arc && <p className="text-xs text-indigo-500 font-bold mt-1 tracking-wider uppercase">ARC: {proj.arc.name}</p>}
              <div className="mt-4 text-xs font-medium text-gray-400">
                {proj._count.quests} Quests
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && <p className="text-sm text-gray-500">Belum ada Project yang dibuat.</p>}
      </div>
    </div>
  )
}
