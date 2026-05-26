import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import QuestSheetClient from './_client'

interface Props {
  params: { id: string }
}

export default async function QuestDetailPage({ params }: Props) {
  const supabase = createClient()

  // ── Auth check ─────────────────────────────────────────────────────────────
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  // ── Fetch quest ────────────────────────────────────────────────────────────
  const { data: quest, error: questError } = await supabase
    .from('quests')
    .select('*')
    .eq('id', params.id)
    .single()

  if (questError || !quest) notFound()

  // ── Fetch related data in parallel ────────────────────────────────────────
  const [
    { data: assignee },
    { data: creator },
    { data: attachments },
    { data: comments },
    { data: currentUser },
  ] = await Promise.all([
    quest.assigned_to
      ? supabase.from('users').select('*').eq('id', quest.assigned_to).single()
      : Promise.resolve({ data: null }),
    supabase.from('users').select('*').eq('id', quest.created_by).single(),
    supabase.from('attachments').select('*').eq('quest_id', quest.id).order('uploaded_at'),
    supabase.from('quest_comments').select('*, users(nama, role)').eq('quest_id', quest.id).order('created_at', { ascending: true }),
    supabase.from('users').select('*').eq('id', authUser.id).single(),
  ])

  if (!currentUser) redirect('/login')

  return (
    <QuestSheetClient
      quest={quest}
      assignee={assignee}
      creator={creator}
      attachments={attachments ?? []}
      comments={comments ?? []}
      currentUserId={authUser.id}
      currentUserRole={currentUser.role}
    />
  )
}
