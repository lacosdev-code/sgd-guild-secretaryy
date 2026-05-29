import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import DashboardClient from './_client'

/**
 * Server component — validates session server-side, then hands off to
 * the client component which renders the correct dashboard by role.
 */
export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return <DashboardClient />
}
