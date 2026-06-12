import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function createArc(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user?.id) return
  const name = formData.get('name') as string
  const strategicObjective = formData.get('strategicObjective') as string
  
  if (!name) return

  await prisma.arc.create({
    data: {
      name,
      strategicObjective,
      ownerId: session.user.id
    }
  })
  revalidatePath('/arcs')
}

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
      
      <form action={createArc} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-white/10 mb-8 max-w-2xl">
        <h2 className="font-semibold mb-4 text-navy dark:text-white">Buat Arc Baru</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Nama Arc</label>
            <input type="text" name="name" required className="w-full border rounded p-2 dark:bg-slate-900 dark:border-gray-700" placeholder="Contoh: RS Bella Support Arc" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Objektif Strategis (Opsional)</label>
            <input type="text" name="strategicObjective" className="w-full border rounded p-2 dark:bg-slate-900 dark:border-gray-700" placeholder="Target besar kampanye ini..." />
          </div>
          <button type="submit" className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 text-sm font-medium">
            + Tambah Arc
          </button>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
        {arcs.map(arc => (
          <div key={arc.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-white/10">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-navy dark:text-white">{arc.name}</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{arc.status}</span>
            </div>
            {arc.strategicObjective && <p className="text-sm text-gray-500 mt-2">{arc.strategicObjective}</p>}
            <div className="mt-4 text-xs font-medium text-gray-400">
              {arc._count.projects} Projects
            </div>
          </div>
        ))}
        {arcs.length === 0 && <p className="text-sm text-gray-500">Belum ada Arc yang dibuat.</p>}
      </div>
    </div>
  )
}
