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
