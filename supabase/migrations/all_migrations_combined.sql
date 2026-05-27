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
-- Run this in Supabase SQL Editor to generate comprehensive dummy data
-- ============================================================

DO $$
DECLARE
  gm_id UUID; 
  
  adv1 UUID := gen_random_uuid();
  adv2 UUID := gen_random_uuid();
  adv3 UUID := gen_random_uuid();
  adv4 UUID := gen_random_uuid();
  adv5 UUID := gen_random_uuid();

  quest1 UUID := gen_random_uuid();
  quest2 UUID := gen_random_uuid();
  quest3 UUID := gen_random_uuid();
  quest4 UUID := gen_random_uuid();
  quest5 UUID := gen_random_uuid();
  quest6 UUID := gen_random_uuid();
BEGIN

  -- Cari ID Guild Master yang ada di database saat ini (akun Anda)
  SELECT id INTO gm_id FROM public.users WHERE role = 'guild_master' LIMIT 1;

  -- 1. Insert ke auth.users (Membuat 5 Adventurer Fiktif)
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES
  (adv1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'adventurer1@dummy.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  (adv2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'adventurer2@dummy.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  (adv3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'adventurer3@dummy.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  (adv4, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'adventurer4@dummy.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  (adv5, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'adventurer5@dummy.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
  ON CONFLICT DO NOTHING;

  -- 2. Insert ke public.users
  INSERT INTO public.users (id, nama, role, total_points, avatar_url)
  VALUES
  (adv1, 'Kirito', 'adventurer', 1250, 'https://ik.imagekit.io/Sgd/dummy/kirito.png'),
  (adv2, 'Asuna', 'adventurer', 3400, 'https://ik.imagekit.io/Sgd/dummy/asuna.png'),
  (adv3, 'Sung Jin-Woo', 'adventurer', 9999, 'https://ik.imagekit.io/Sgd/dummy/jinwoo.png'),
  (adv4, 'Arthur Leywin', 'adventurer', 5600, 'https://ik.imagekit.io/Sgd/dummy/arthur.png'),
  (adv5, 'Rudeus', 'adventurer', 800, 'https://ik.imagekit.io/Sgd/dummy/rudeus.png')
  ON CONFLICT DO NOTHING;

  -- 3. Insert Dummy Quests (Membuat Quest untuk Dashboard & Halaman Quest)
  IF gm_id IS NOT NULL THEN
    INSERT INTO public.quests (id, title, description, assigned_to, created_by, status, reward_points, deadline, created_at, difficulty)
    VALUES
    (quest1, 'Membasmi 10 Slime di Hutan Timur', 'Warga desa melapor banyak slime merusak kebun. Habisi mereka dan bawa buktinya.', adv1, gm_id, 'Approved', 250, now() + interval '2 days', now() - interval '2 days', 'E'),
    (quest2, 'Pengawalan Pedagang ke Ibukota', 'Jaga kereta barang dari serangan bandit.', adv2, gm_id, 'Active', 400, now() + interval '5 days', now() - interval '1 days', 'D'),
    (quest3, 'Menjelajah Dungeon Rank A', 'Temukan artifak langka di lantai 50.', adv3, gm_id, 'Approved', 5000, now() + interval '10 days', now() - interval '5 days', 'A'),
    (quest4, 'Mencari Herb Obat', 'Ramuan obat membutuhkan daun mint biru.', adv4, gm_id, 'Failed', 100, now() - interval '1 days', now() - interval '3 days', 'F'),
    (quest5, 'Membersihkan Selokan Guild', 'Pekerjaan kotor namun penting.', adv5, gm_id, 'Active', 50, now() + interval '1 days', now(), 'F'),
    (quest6, 'Memburu Naga Merah', 'Quest darurat! Seekor naga menyerang pedesaan!', NULL, gm_id, 'Draft', 9000, now() + interval '7 days', now(), 'S')
    ON CONFLICT DO NOTHING;

    -- 4. Insert Notifications untuk Anda (Guild Master) supaya ada notif masuk
    INSERT INTO public.notifications (user_id, title, message, is_read)
    VALUES
    (gm_id, 'Quest Selesai', 'Kirito telah menyelesaikan quest Membasmi Slime.', false),
    (gm_id, 'Submission Baru', 'Asuna mengirimkan laporan progress quest.', false),
    (gm_id, 'Peringatan Deadline', 'Quest Mencari Herb Obat telah melewati deadline.', true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- 5. Insert Point History logs (Untuk halaman Profile masing-masing user)
  INSERT INTO public.point_logs (user_id, delta, reason)
  VALUES
  (adv1, 250, 'Menyelesaikan Quest: Berburu Slime'),
  (adv1, 1000, 'Eksplorasi Dungeon Lantai 1'),
  (adv2, 400, 'Menyelesaikan Quest: Menjaga Gerbang Kota'),
  (adv2, 3000, 'Bonus Mingguan Guild Master'),
  (adv3, 5000, 'Mengalahkan Boss Dungeon Rank S'),
  (adv3, 4999, 'Penyelamatan Kota dari Serbuan Monster'),
  (adv4, 5000, 'Mengalahkan Naga Kuno'),
  (adv4, 600, 'Mengajarkan Sihir Dasar'),
  (adv5, 800, 'Membantu Penduduk Memanen Gandum')
  ON CONFLICT DO NOTHING;

END $$;


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
