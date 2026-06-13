import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ArcListClient from '@/components/arcs/ArcListClient'

export default async function ArcsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const arcs = await prisma.arc.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { projects: true } } }
  })

  return <ArcListClient arcs={arcs} />
}
