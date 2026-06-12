import { prisma } from './src/lib/prisma'

async function main() {
  console.log('🌱 Seeding Dummy Arcs and Projects...')

  // Find the Guild Master user (or first user)
  const owner = await prisma.user.findFirst({
    where: { role: 'guild_master' }
  })
  
  if (!owner) {
    console.error('❌ Guild Master not found! Run base seed first.')
    return
  }

  // Create Arcs
  const arc1 = await prisma.arc.create({
    data: {
      name: 'RS Bella Support Arc',
      strategicObjective: 'Fokus pada maintenance operasional fasilitas RS Bella.',
      ownerId: owner.id
    }
  })

  const arc2 = await prisma.arc.create({
    data: {
      name: 'Internal System Building',
      strategicObjective: 'Pembenahan sistem internal SGD dan evaluasi staf.',
      ownerId: owner.id
    }
  })
  console.log('✅ Arcs created!')

  // Create Projects
  const proj1 = await prisma.project.create({
    data: {
      name: 'AC Preventive Maintenance June',
      arcId: arc1.id,
      ownerId: owner.id,
      health: 'Green',
      scopeSummary: 'Maintenance AC lantai 1 hingga 5.'
    }
  })

  const proj2 = await prisma.project.create({
    data: {
      name: 'RSIA Lift Vendor Coordination',
      arcId: arc1.id,
      ownerId: owner.id,
      health: 'Yellow',
      scopeSummary: 'Follow up kerusakan mesin lift.'
    }
  })

  const proj3 = await prisma.project.create({
    data: {
      name: 'SGD Care Kelapa Gading Expansion',
      arcId: arc2.id,
      ownerId: owner.id,
      health: 'Green',
      scopeSummary: 'Persiapan pembukaan cabang Kelapa Gading.'
    }
  })
  console.log('✅ Projects created!')

  // Fetch all existing quests
  const quests = await prisma.quest.findMany()

  // Assign them randomly to projects
  const projects = [proj1.id, proj2.id, proj3.id]
  let pIdx = 0

  for (const quest of quests) {
    await prisma.quest.update({
      where: { id: quest.id },
      data: { projectId: projects[pIdx] }
    })
    pIdx = (pIdx + 1) % projects.length
  }
  
  console.log('✅ Dummy Quests linked to Projects!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
