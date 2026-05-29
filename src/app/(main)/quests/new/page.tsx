import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import QuestForm from '@/components/quest/QuestForm'

export default async function NewQuestPage() {
  const session = await auth()

  // Auth check
  if (!session?.user) redirect('/login')

  // Role check — GM only
  const role = (session.user as any).role
  if (role !== 'guild_master') {
    redirect('/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <QuestForm mode="create" currentUserId={session.user.id!} />
    </div>
  )
}
