import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import QuestForm from '@/components/quest/QuestForm'

interface Props {
  params: { id: string }
}

export default async function EditQuestPage({ params }: Props) {
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

  // Fetch the quest to edit
  const { data: quest, error } = await supabase
    .from('quests')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !quest) notFound()

  // Prevent editing quests that are already Approved or Failed
  if (quest.status === 'Approved' || quest.status === 'Failed') {
    redirect(`/quests/${quest.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <QuestForm
        mode="edit"
        existingQuest={quest}
        currentUserId={authUser.id}
      />
    </div>
  )
}
