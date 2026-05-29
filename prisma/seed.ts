import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Seeding database...')

  // Create Guild Master account
  const gmPassword = await bcrypt.hash('Admin@SGD2024!', 12)
  
  const gm = await prisma.user.upsert({
    where: { email: 'admin@sgd-corp.com' },
    update: {},
    create: {
      nama: 'Guild Master',
      email: 'admin@sgd-corp.com',
      passwordHash: gmPassword,
      role: 'guild_master',
      totalPoints: 0,
    },
  })

  console.log(`✅ Guild Master created: ${gm.email}`)
  console.log('📝 Password default: Admin@SGD2024!')
  console.log('⚠️  Segera ganti password setelah login pertama!')
  console.log('\n✅ Seeding selesai!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
