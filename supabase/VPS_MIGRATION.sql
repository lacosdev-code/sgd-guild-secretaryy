-- COMBINED MIGRATIONS FOR VPS

-- =========================================
-- FILE: all_migrations_combined.sql
-- =========================================

-- ============================================================
-- SGD Guild Secretary — Initial Database Schema
-- Migration: 001_init_schema.sql
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama         TEXT NOT NULL,
  role         TEXT NOT NULL CHECK (role IN ('guild_master', 'adventurer')),
  total_points INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.users IS 'Stores adventurer and guild master profiles, linked to Supabase Auth.';

-- ============================================================
-- TABLE: quests
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quests (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                TEXT NOT NULL,
  description          TEXT,
  assigned_to          UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_by           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  difficulty           TEXT CHECK (difficulty IN ('F', 'E', 'D', 'C', 'B', 'A', 'S')),
  deadline             TIMESTAMPTZ,
  success_parameter    TEXT,
  reward_points        INTEGER,
  status               TEXT NOT NULL DEFAULT 'Draft'
                         CHECK (status IN ('Draft', 'Active', 'Submitted', 'Approved', 'Revise', 'Failed')),
  detail_completed     BOOLEAN NOT NULL DEFAULT FALSE,
  detail_completed_at  TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.quests IS 'Main quest table. A quest is considered "detail_completed" when description, deadline, difficulty, success_parameter, and reward_points are all filled.';
COMMENT ON COLUMN public.quests.detail_completed IS 'True when all optional fields (description, deadline, difficulty, success_parameter, reward_points) are populated.';

-- ============================================================
-- TABLE: attachments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.attachments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id     UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  file_url     TEXT NOT NULL,
  file_type    TEXT,
  uploaded_by  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  uploaded_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.attachments IS 'Proof-of-completion files uploaded by adventurers. Required before quest can be submitted.';

-- ============================================================
-- TABLE: point_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.point_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  quest_id    UUID REFERENCES public.quests(id) ON DELETE SET NULL,
  delta       INTEGER NOT NULL,  -- positive = reward, negative = penalty
  reason      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.point_logs IS 'Audit log of all point changes. delta > 0 is a reward, delta < 0 is a penalty.';

-- ============================================================
-- FUNCTION: auto-update quests.updated_at on row change
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_quest_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quests_updated_at_trigger
  BEFORE UPDATE ON public.quests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_quest_updated_at();

-- ============================================================
-- FUNCTION: auto-update quests.detail_completed
-- Sets detail_completed = true when all required optional fields
-- (description, deadline, difficulty, success_parameter, reward_points)
-- are present on the quest row.
-- ============================================================
CREATE OR REPLACE FUNCTION public.check_quest_detail_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    NEW.description IS NOT NULL AND NEW.description <> '' AND
    NEW.deadline IS NOT NULL AND
    NEW.difficulty IS NOT NULL AND
    NEW.success_parameter IS NOT NULL AND NEW.success_parameter <> '' AND
    NEW.reward_points IS NOT NULL
  ) THEN
    IF NOT NEW.detail_completed THEN
      NEW.detail_completed = TRUE;
      NEW.detail_completed_at = NOW();
    END IF;
  ELSE
    NEW.detail_completed = FALSE;
    NEW.detail_completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quests_detail_completed_trigger
  BEFORE INSERT OR UPDATE ON public.quests
  FOR EACH ROW
  EXECUTE FUNCTION public.check_quest_detail_completed();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_logs ENABLE ROW LEVEL SECURITY;

-- users: anyone authenticated can read all profiles
CREATE POLICY "Authenticated users can view all users"
  ON public.users FOR SELECT
  TO authenticated
  USING (TRUE);

-- users: each user can update only their own row
CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- quests: all authenticated users can view all quests
CREATE POLICY "Authenticated users can view all quests"
  ON public.quests FOR SELECT
  TO authenticated
  USING (TRUE);

-- quests: only guild_master can create quests
CREATE POLICY "Guild masters can create quests"
  ON public.quests FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'guild_master'
    )
  );

-- quests: guild_master can update any quest; adventurer can update only their own assigned quest
CREATE POLICY "Guild masters can update any quest"
  ON public.quests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'guild_master'
    )
  );

CREATE POLICY "Adventurers can update their assigned quest status"
  ON public.quests FOR UPDATE
  TO authenticated
  USING (assigned_to = auth.uid());

-- attachments: all authenticated users can view attachments
CREATE POLICY "Authenticated users can view all attachments"
  ON public.attachments FOR SELECT
  TO authenticated
  USING (TRUE);

-- attachments: adventurers can upload to their assigned quest only
CREATE POLICY "Adventurers can upload attachments to their quests"
  ON public.attachments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quests
      WHERE id = quest_id AND assigned_to = auth.uid()
    )
  );

-- point_logs: authenticated users can view their own logs; GM can view all
CREATE POLICY "Users can view their own point logs"
  ON public.point_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Guild masters can view all point logs"
  ON public.point_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'guild_master'
    )
  );

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS quests_assigned_to_idx ON public.quests (assigned_to);
CREATE INDEX IF NOT EXISTS quests_created_by_idx ON public.quests (created_by);
CREATE INDEX IF NOT EXISTS quests_status_idx ON public.quests (status);
CREATE INDEX IF NOT EXISTS quests_detail_completed_idx ON public.quests (detail_completed);
CREATE INDEX IF NOT EXISTS attachments_quest_id_idx ON public.attachments (quest_id);
CREATE INDEX IF NOT EXISTS point_logs_user_id_idx ON public.point_logs (user_id);
CREATE INDEX IF NOT EXISTS point_logs_quest_id_idx ON public.point_logs (quest_id);


-- ============================================================
-- SGD Guild Secretary — Migration 002
-- Adds:
--   1. increment_user_points() RPC — called by API route (service role)
--   2. Storage policy guidance for "attachments" bucket
-- ============================================================

-- ── RPC: increment_user_points ─────────────────────────────────────────────
-- Called server-side (service role) when a quest is approved.
-- Uses SECURITY DEFINER so it bypasses RLS when invoked by admin client.
CREATE OR REPLACE FUNCTION public.increment_user_points(
  p_user_id UUID,
  p_delta   INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET total_points = total_points + p_delta
  WHERE id = p_user_id;
END;
$$;

-- Revoke public execute, only service_role can call it
REVOKE ALL ON FUNCTION public.increment_user_points(UUID, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_user_points(UUID, INTEGER) TO service_role;

-- ── NOTE: Supabase Storage Bucket Setup ───────────────────────────────────
-- Run these in the Supabase Dashboard → Storage → Policies, OR
-- use the Supabase CLI / Dashboard to create the bucket manually.
--
-- 1. Create a bucket named "attachments" (public: true)
-- 2. Add these Storage policies:
--
--    Policy: "Authenticated users can upload to their quest folder"
--    ON storage.objects FOR INSERT TO authenticated
--    WITH CHECK (bucket_id = 'attachments' AND auth.role() = 'authenticated')
--
--    Policy: "Public read access to attachments"
--    ON storage.objects FOR SELECT TO public
--    USING (bucket_id = 'attachments')


-- ============================================================
-- Migration: 003_comments_notifications.sql
-- ============================================================

-- ============================================================
-- TABLE: quest_comments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quest_comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id    UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.quest_comments IS 'Stores discussion threads for each quest.';

-- ============================================================
-- TABLE: notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  link        TEXT,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.notifications IS 'In-app notifications for users.';

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.quest_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- quest_comments: authenticated users can read all comments
CREATE POLICY "Authenticated users can view all quest comments"
  ON public.quest_comments FOR SELECT
  TO authenticated
  USING (TRUE);

-- quest_comments: authenticated users can insert their own comments
CREATE POLICY "Users can insert their own quest comments"
  ON public.quest_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- notifications: users can only view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- notifications: users can update (mark as read) their own notifications
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- notifications: authenticated users (especially GM) can insert notifications (e.g. via triggers or APIs)
CREATE POLICY "Authenticated users can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS quest_comments_quest_id_idx ON public.quest_comments (quest_id);
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON public.notifications (is_read);


-- Add avatar_url column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Insert the 'avatars' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- RLS Policies for avatars bucket
-- NOTE: Run these in Supabase Dashboard → Storage → Policies
-- if the migration runner does not have access to storage schema.
-- ============================================================

-- 1. Anyone can read avatars (public bucket)
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

-- 2. Authenticated users can upload their own avatar
--    Uses (storage.foldername(name))[1] to check folder = user UUID
CREATE POLICY "Users can upload their own avatar."
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 3. Users can update their own avatar
CREATE POLICY "Users can update their own avatar."
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 4. Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar."
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );


-- ============================================================
-- 005_seed_dummy_data.sql
-- (Anime characters removed as requested)
-- ============================================================


-- ============================================================
-- Migration: 006_push_subscriptions.sql
-- ============================================================

-- TABLE: push_subscriptions
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  endpoint        TEXT NOT NULL UNIQUE,
  p256dh          TEXT NOT NULL,
  auth            TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.push_subscriptions IS 'Stores Web Push API subscriptions for users.';

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert their own push subscriptions"
  ON public.push_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own subscriptions
CREATE POLICY "Users can view their own push subscriptions"
  ON public.push_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own subscriptions
CREATE POLICY "Users can delete their own push subscriptions"
  ON public.push_subscriptions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- INDEXES
CREATE INDEX IF NOT EXISTS push_subscriptions_user_id_idx ON public.push_subscriptions (user_id);


-- ============================================================
-- SGD Guild Secretary
-- Migration: 006_add_attachments_bucket.sql
-- ============================================================

-- Insert the 'attachments' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('attachments', 'attachments', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for attachments bucket
-- 1. Anyone can read attachments (public bucket)
CREATE POLICY "Public read access to attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'attachments');

-- 2. Authenticated users can upload attachments
CREATE POLICY "Authenticated users can upload attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'attachments'
    AND auth.role() = 'authenticated'
  );

-- 3. Users can update their own attachments
CREATE POLICY "Users can update their own attachments"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'attachments'
    AND auth.uid() = owner
  );

-- 4. Users can delete their own attachments
CREATE POLICY "Users can delete their own attachments"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'attachments'
    AND auth.uid() = owner
  );


-- =========================================
-- FILE: 007_guild_chat.sql
-- =========================================

-- ============================================================
-- Migration: 007_guild_chat.sql
-- ============================================================

-- ============================================================
-- TABLE: guild_chat
-- ============================================================
CREATE TABLE IF NOT EXISTS public.guild_chat (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.guild_chat IS 'Stores global chat messages for the Tavern.';

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.guild_chat ENABLE ROW LEVEL SECURITY;

-- guild_chat: authenticated users can read all messages
CREATE POLICY "Authenticated users can view all tavern messages"
  ON public.guild_chat FOR SELECT
  TO authenticated
  USING (TRUE);

-- guild_chat: authenticated users can insert their own messages
CREATE POLICY "Users can insert their own tavern messages"
  ON public.guild_chat FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS guild_chat_created_at_idx ON public.guild_chat (created_at DESC);


-- =========================================
-- FILE: 20260528_add_urgency.sql
-- =========================================

-- Add urgency column to quests table
ALTER TABLE public.quests
ADD COLUMN urgency TEXT DEFAULT 'Routine';

-- Optional: If you want to restrict it to specific values
-- ALTER TABLE public.quests
-- ADD CONSTRAINT quests_urgency_check CHECK (urgency IN ('Routine', 'Priority', 'Emergency', 'Strategic'));


-- =========================================
-- FILE: 20260528_allow_gm_upload.sql
-- =========================================

-- Allow Guild Masters to upload attachments on behalf of adventurers
CREATE POLICY "Guild masters can upload attachments"
  ON public.attachments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'guild_master'
    )
  );



-- Allow users to delete their own messages
CREATE POLICY "Users can delete their own messages"
  ON public.guild_chat FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow guild masters to delete any message
CREATE POLICY "Guild masters can delete any message"
  ON public.guild_chat FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'guild_master'
    )
  );

-- ============================================================
-- Migration: 009_quest_brief_attachment.sql
-- ============================================================
ALTER TABLE public.quests
ADD COLUMN IF NOT EXISTS brief_attachment_url TEXT;
