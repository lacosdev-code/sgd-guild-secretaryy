'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function createUser(data: FormData) {
  const nama = data.get('nama') as string
  const email = data.get('email') as string
  const password = data.get('password') as string

  if (!nama || !email || !password) {
    return { success: false, error: 'Nama, Email, dan Password harus diisi' }
  }

  try {
    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return { success: false, error: 'Email sudah digunakan' }
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        nama,
        email,
        passwordHash,
        role: 'adventurer',
        totalPoints: 0,
      },
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Terjadi kesalahan sistem' }
  }
}
