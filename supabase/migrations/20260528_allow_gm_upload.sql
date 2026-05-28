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
