import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './_client'

/**
 * Server component — validates session server-side, then hands off to
 * the client component which renders the correct dashboard by role.
 */
export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <DashboardClient />
}
