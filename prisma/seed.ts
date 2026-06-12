import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Seeding database...')

  // Password for all dummy users
  const passwordHash = await bcrypt.hash('sgd123', 12)
  
  // Create Guild Master (Reza)
  const gm = await prisma.user.upsert({
    where: { email: 'reza@sgd-corp.com' },
    update: { passwordHash }, // Reset password just in case
    create: {
      nama: 'Reza (Guild Master)',
      email: 'reza@sgd-corp.com',
      passwordHash: passwordHash,
      role: 'guild_master',
      totalPoints: 0,
    },
  })

  // Create Adventurer (Dummy for testing)
  const adventurer = await prisma.user.upsert({
    where: { email: 'adventurer@sgd-corp.com' },
    update: { passwordHash },
    create: {
      nama: 'Budi (Adventurer)',
      email: 'adventurer@sgd-corp.com',
      passwordHash: passwordHash,
      role: 'adventurer',
      totalPoints: 0,
    },
  })

  // Create Bruno
  const bruno = await prisma.user.upsert({
    where: { email: 'bruno@sgd-corp.com' },
    update: { passwordHash },
    create: {
      nama: 'Bruno',
      email: 'bruno@sgd-corp.com',
      passwordHash: passwordHash,
      role: 'adventurer',
      totalPoints: 0,
    },
  })

  // Create Siska
  const siska = await prisma.user.upsert({
    where: { email: 'siska@sgd-corp.com' },
    update: { passwordHash },
    create: {
      nama: 'Siska',
      email: 'siska@sgd-corp.com',
      passwordHash: passwordHash,
      role: 'quest_giver',
      totalPoints: 0,
    },
  })

  console.log(`✅ Guild Master created: ${gm.email}`)
  console.log(`✅ Adventurer created: ${adventurer.email}`)
  console.log(`✅ Adventurer created: ${bruno.email}`)
  console.log(`✅ Quest Giver created: ${siska.email}`)
  console.log('📝 Password untuk semua akun: sgd123')
  console.log('\n✅ Seeding selesai!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
