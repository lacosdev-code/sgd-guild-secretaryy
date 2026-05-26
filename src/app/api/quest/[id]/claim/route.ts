import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const questId = params.id

  // Verify authenticated user
  const userClient = createServerClient()
  const { data: { user } } = await userClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Init admin client
  const supabaseAdmin = createAdminClient()

  // Verify the quest is unassigned
  const { data: quest, error: questError } = await supabaseAdmin
    .from('quests')
    .select('assigned_to, status')
    .eq('id', questId)
    .single()

  if (questError || !quest) {
    return NextResponse.json({ error: 'Quest not found' }, { status: 404 })
  }

  if (quest.assigned_to) {
    return NextResponse.json({ error: 'Quest is already assigned' }, { status: 400 })
  }

  // Assign user to quest and set status to Active
  const { error: updateError } = await supabaseAdmin
    .from('quests')
    .update({ assigned_to: user.id, status: 'Active', updated_at: new Date().toISOString() })
    .eq('id', questId)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Create notification for GM
  const { data: gmUsers } = await supabaseAdmin.from('users').select('id').eq('role', 'guild_master')
  if (gmUsers && gmUsers.length > 0) {
    const { data: currentUser } = await supabaseAdmin.from('users').select('nama').eq('id', user.id).single()
    const userName = currentUser?.nama || 'Someone'

    const notifications = gmUsers.map((gm: any) => ({
      user_id: gm.id,
      title: 'Quest Claimed',
      message: `${userName} has claimed an open quest.`,
      link: `/quests/${questId}`
    }))
    await supabaseAdmin.from('notifications').insert(notifications)
  }

  return NextResponse.json({ success: true })
}
