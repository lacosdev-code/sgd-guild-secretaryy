-- 1. Hapus semua policy lama via DROP secara manual untuk memastikan bersih
DROP POLICY IF EXISTS "Authenticated users can upload to attachments" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to attachments" ON storage.objects;
DROP POLICY IF EXISTS "Izinkan Upload ke Attachments" ON storage.objects;
DROP POLICY IF EXISTS "Semua Boleh Lihat Attachments" ON storage.objects;
DROP POLICY IF EXISTS "upload_attachments" ON storage.objects;
DROP POLICY IF EXISTS "select_attachments" ON storage.objects;

-- 2. Buat SATU policy super ampuh (Public) untuk INSERT
CREATE POLICY "Super Upload Attachments"
ON storage.objects FOR INSERT TO public
WITH CHECK ( bucket_id = 'attachments' );

-- 3. Buat SATU policy super ampuh untuk SELECT
CREATE POLICY "Super Select Attachments"
ON storage.objects FOR SELECT TO public
USING ( bucket_id = 'attachments' );
