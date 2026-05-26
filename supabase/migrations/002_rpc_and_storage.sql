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
