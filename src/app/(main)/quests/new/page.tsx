import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import QuestForm from '@/components/quest/QuestForm'

export default async function NewQuestPage() {
  const supabase = createClient()

  // Auth check
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  // Role check — GM only
  const { data: profile } = await supabase
    .from('users')
    .select('id, role')
    .eq('id', authUser.id)
    .single()

  if (!profile || profile.role !== 'guild_master') {
    redirect('/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <QuestForm mode="create" currentUserId={authUser.id} />
    </div>
  )
}
