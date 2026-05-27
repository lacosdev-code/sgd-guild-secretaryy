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
