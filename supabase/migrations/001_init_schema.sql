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
