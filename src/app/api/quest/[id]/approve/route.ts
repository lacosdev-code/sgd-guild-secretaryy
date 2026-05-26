import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/quest/[id]/approve
 * Body: { action: 'Approved' | 'Revise' | 'Failed' }
 *
 * Only Guild Masters can call this endpoint.
 * On Approve: updates quest status + adds reward_points to adventurer
 *             + inserts into point_logs.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const questId = params.id

  // ── Auth — verify the caller is a GM ──────────────────────────────────────
  const supabase = createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', authUser.id)
    .single()

  if (!profile || profile.role !== 'guild_master') {
    return NextResponse.json({ error: 'Forbidden — GM only' }, { status: 403 })
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let action: string
  try {
    const body = await req.json()
    action = body.action
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!['Approved', 'Revise', 'Failed'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  // ── Fetch quest ───────────────────────────────────────────────────────────
  const admin = createAdminClient()
  const { data: quest, error: questError } = await admin
    .from('quests')
    .select('id, title, status, assigned_to, reward_points')
    .eq('id', questId)
    .single()

  if (questError || !quest) {
    return NextResponse.json({ error: 'Quest not found' }, { status: 404 })
  }

  if (quest.status !== 'Submitted') {
    return NextResponse.json(
      { error: `Quest is not in Submitted state (current: ${quest.status})` },
      { status: 409 }
    )
  }

  // ── Update quest status ───────────────────────────────────────────────────
  const { error: updateError } = await admin
    .from('quests')
    .update({ status: action, updated_at: new Date().toISOString() })
    .eq('id', questId)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // ── On Approve: award points + log ────────────────────────────────────────
  if (action === 'Approved' && quest.assigned_to && quest.reward_points) {
    // Increment total_points on the user row
    const { error: pointsError } = await admin.rpc('increment_user_points', {
      p_user_id: quest.assigned_to,
      p_delta:   quest.reward_points,
    })

    if (pointsError) {
      // Log but don't fail the request — status update already succeeded
      console.error('[approve] increment_user_points failed:', pointsError.message)
    }

    // Insert point_log entry
    await admin.from('point_logs').insert({
      user_id:  quest.assigned_to,
      quest_id: questId,
      delta:    quest.reward_points,
      reason:   `Quest approved: ${quest.title}`,
    })

    // Notify adventurer via N8N (fire-and-forget, non-blocking)
    const n8nApprove = process.env.N8N_WEBHOOK_APPROVAL
    if (n8nApprove) {
      fetch(n8nApprove, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questId,
          questTitle: quest.title,
          assignedTo: quest.assigned_to,
          points:     quest.reward_points,
          action:     'Approved',
        }),
      }).catch(() => {}) // intentionally swallow errors
    }
  }

  return NextResponse.json({ ok: true, action })
}
