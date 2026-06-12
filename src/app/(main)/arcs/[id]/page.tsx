import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ArcDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) redirect('/login')

  const arc = await prisma.arc.findUnique({
    where: { id: params.id },
    include: {
      projects: {
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { quests: true } }
        }
      }
    }
  })

  if (!arc) {
    return <div className="p-6">Arc tidak ditemukan.</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/arcs" className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Kembali ke Master Arcs</Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy dark:text-white">{arc.name}</h1>
            {arc.strategicObjective && (
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">{arc.strategicObjective}</p>
            )}
          </div>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold text-sm uppercase tracking-wider">{arc.status}</span>
        </div>
      </div>

      {/* Projects List */}
      <div>
        <h2 className="text-xl font-bold text-navy dark:text-white mb-4">Projects dalam Arc ini</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {arc.projects.map(proj => (
            <Link href={`/projects/${proj.id}`} key={proj.id} className="block group">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-white/10 transition-all hover:border-navy dark:hover:border-slate-500 hover:shadow-md h-full">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-navy dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{proj.name}</h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{proj.health}</span>
                </div>
                <div className="mt-4 text-xs font-medium text-gray-400">
                  {proj._count.quests} Quests
                </div>
              </div>
            </Link>
          ))}
          {arc.projects.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
              <p className="text-gray-500 dark:text-gray-400">Belum ada Project yang tergabung dalam Arc ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
