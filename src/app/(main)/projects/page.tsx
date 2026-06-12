import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

async function createProject(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user?.id) return
  const name = formData.get('name') as string
  const arcId = formData.get('arcId') as string
  
  if (!name) return

  await prisma.project.create({
    data: {
      name,
      arcId: arcId || null,
      ownerId: session.user.id
    }
  })
  revalidatePath('/projects')
}

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
      
      <form action={createProject} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-white/10 mb-8 max-w-2xl">
        <h2 className="font-semibold mb-4 text-navy dark:text-white">Buat Project Baru</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Pilih Arc (Opsional)</label>
            <select name="arcId" className="w-full border rounded p-2 dark:bg-slate-900 dark:border-gray-700">
              <option value="">-- Tanpa Arc --</option>
              {arcs.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Nama Project</label>
            <input type="text" name="name" required className="w-full border rounded p-2 dark:bg-slate-900 dark:border-gray-700" placeholder="Contoh: AC Preventive Maintenance" />
          </div>
          <button type="submit" className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 text-sm font-medium">
            + Tambah Project
          </button>
        </div>
      </form>

      <div className="flex gap-2 mb-6">
        <Link href="/projects" className={`px-4 py-2 rounded-lg text-sm font-medium ${!filter ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'}`}>
          Semua Project
        </Link>
        <Link href="/projects?filter=orphan" className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'orphan' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'}`}>
          Proyek Tanpa Arc (Orphan)
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
        {projects.map(proj => (
          <Link href={`/projects/${proj.id}`} key={proj.id} className="block group">
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
