'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function createUser(data: FormData) {
  const nama = data.get('nama') as string
  const email = data.get('email') as string
  const password = data.get('password') as string
  
  if (!nama || !email || !password) {
    return { success: false, error: 'Nama, Email, dan Password harus diisi' }
  }

  const supabaseAdmin = createAdminClient()

  try {
    // 1. Buat user di auth.users Supabase (Sistem Login)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        nama: nama,
        role: 'adventurer'
      }
    })

    if (authError) {
      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      return { success: false, error: 'Gagal membuat akun Auth' }
    }

    // 2. Insert ke public.users
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        nama: nama,
        role: 'adventurer',
        total_points: 0
      })

    if (dbError) {
      // Rollback auth user if DB insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return { success: false, error: dbError.message }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Terjadi kesalahan sistem' }
  }
}
