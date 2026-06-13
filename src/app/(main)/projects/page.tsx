import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProjectListClient from '@/components/projects/ProjectListClient'

export default async function ProjectsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: { arc: true, _count: { select: { quests: true } } }
  })
  const arcs = await prisma.arc.findMany()

  return <ProjectListClient projects={projects} arcs={arcs} />
}
