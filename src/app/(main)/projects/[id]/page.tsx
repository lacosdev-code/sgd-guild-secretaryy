import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getStatusColor, getRankColor, formatDeadline } from '@/lib/utils'

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) redirect('/login')

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      arc: true,
      quests: {
        orderBy: { createdAt: 'desc' },
        include: {
          assignee: {
            select: { nama: true }
          }
        }
      }
    }
  })

  if (!project) {
    return <div className="p-6">Project tidak ditemukan.</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/projects" className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Kembali ke Master Projects</Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy dark:text-white">{project.name}</h1>
            {project.arc && (
              <p className="text-indigo-600 dark:text-indigo-400 mt-2 font-bold tracking-wider uppercase flex items-center gap-2">
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 px-2 py-1 rounded">ARC</span>
                <Link href={`/arcs/${project.arc.id}`} className="hover:underline">{project.arc.name}</Link>
              </p>
            )}
          </div>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-sm uppercase tracking-wider">{project.health}</span>
        </div>
      </div>

      {/* Quests List */}
      <div>
        <h2 className="text-xl font-bold text-navy dark:text-white mb-4">Quests dalam Project ini</h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
          {project.quests.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">Belum ada Quest yang ditugaskan untuk Project ini.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {project.quests.map(quest => (
                <Link
                  key={quest.id}
                  href={`/quests/${quest.id}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 w-full">
                    {/* Rank Badge */}
                    <span className={`shrink-0 inline-flex w-8 h-8 rounded-full items-center justify-center text-xs font-bold ${getRankColor(quest.difficulty as any)}`}>
                      {quest.difficulty}
                    </span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {quest.urgency && quest.urgency !== 'Routine' && (
                          <span className={`text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded-sm ${
                            quest.urgency === 'Emergency' ? 'bg-red-100 text-red-700' : 
                            quest.urgency === 'Priority' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {quest.urgency}
                          </span>
                        )}
                        <p className="text-sm font-semibold text-charcoal dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {quest.title}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span>{quest.assignee?.nama ?? 'Unassigned'}</span>
                        {quest.deadline && (
                          <>
                            <span>&bull;</span>
                            <span>{formatDeadline(quest.deadline)}</span>
                          </>
                        )}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(quest.status as any)}`}>
                        {quest.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
