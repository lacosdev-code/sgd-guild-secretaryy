-- ============================================================
-- SGD Guild Secretary — Supabase Seed File
-- Jalankan di: Supabase Dashboard → SQL Editor
-- CATATAN: File ini menggunakan hardcoded UUID yang berbeda dari
--          auth.users yang sebenarnya. Gunakan 005_seed_dummy_data.sql
--          untuk data dummy yang lebih lengkap.
-- ============================================================

-- Bersihkan data lama (cascade untuk hapus foreign key dependencies)
TRUNCATE TABLE
  public.point_logs,
  public.quest_comments,
  public.notifications,
  public.attachments,
  public.quests,
  public.users
CASCADE;

-- ============================================================
-- SEED: AUTH USERS (wajib ada sebelum insert ke public.users)
-- Hardcoded UUID agar relasi bisa dipakai langsung
-- ============================================================
INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'reza@sgd-corp.com', crypt('admin123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'pris@sgd-corp.com', crypt('admin123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'ervan@sgd-corp.com', crypt('admin123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'siska@sgd-corp.com', crypt('admin123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'santi@sgd-corp.com', crypt('admin123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'christian@sgd-corp.com', crypt('admin123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'bruno@sgd-corp.com', crypt('admin123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED: PUBLIC USERS
-- UUID di-hardcode agar relasi di bawah bisa pakai langsung
-- ============================================================

INSERT INTO public.users (id, nama, role, total_points) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Reza',      'guild_master', 340),
  ('00000000-0000-0000-0000-000000000002', 'Pris',      'adventurer',   210),
  ('00000000-0000-0000-0000-000000000003', 'Ervan',     'adventurer',   185),
  ('00000000-0000-0000-0000-000000000004', 'Siska',     'adventurer',   270),
  ('00000000-0000-0000-0000-000000000005', 'Santi',     'adventurer',   155),
  ('00000000-0000-0000-0000-000000000006', 'Christian', 'adventurer',   300),
  ('00000000-0000-0000-0000-000000000007', 'Bruno',     'adventurer',    90)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED: QUESTS (10 quest, lintas status)
-- ============================================================

INSERT INTO public.quests (
  id, title, description, assigned_to, created_by,
  difficulty, deadline, success_parameter, reward_points,
  status, detail_completed, detail_completed_at, created_at
) VALUES

-- Q1: Approved — Christian, B Rank
(
  'a0000000-0000-0000-0000-000000000001',
  'Perbaikan AC ICU Bella',
  'Koordinasi dengan Bokir untuk memastikan airflow di ruang ICU Bella kembali stabil setelah keluhan dari head nurse.',
  '00000000-0000-0000-0000-000000000006',
  '00000000-0000-0000-0000-000000000001',
  'B',
  now() - interval '2 days',
  'Airflow stabil, nurse confirmation diterima, foto terlampir, tidak ada complaint 24 jam setelah perbaikan.',
  120, 'Approved', true, now() - interval '3 days', now() - interval '4 days'
),

-- Q2: Active — Ervan, D Rank
(
  'a0000000-0000-0000-0000-000000000002',
  'Cek kebocoran pipa lantai 3',
  'Laporan kebocoran kecil di pantry lantai 3. Cek sumber kebocoran dan dokumentasikan kondisi pipa.',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'D',
  now() + interval '1 day',
  'Sumber kebocoran ditemukan, foto kondisi terlampir, estimasi perbaikan disiapkan.',
  60, 'Active', true, now() - interval '1 day', now() - interval '1 day'
),

-- Q3: Submitted — Siska, C Rank
(
  'a0000000-0000-0000-0000-000000000003',
  'Pengajuan quotation genset cadangan',
  'Minta minimal 2 penawaran dari vendor untuk genset cadangan 100kVA. Bandingkan spesifikasi dan harga.',
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  'C',
  now() + interval '2 days',
  'Minimal 2 quotation dari vendor berbeda, file PDF terlampir, rekomendasi vendor disertakan.',
  80, 'Submitted', true, now() - interval '2 days', now() - interval '3 days'
),

-- Q4: Active — Pris, E Rank
(
  'a0000000-0000-0000-0000-000000000004',
  'Audit stok spare part AC',
  'Cek dan hitung ulang stok spare part AC di gudang. Update spreadsheet stok dan laporkan jika ada yang habis.',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'E',
  now() + interval '3 days',
  'Spreadsheet stok diupdate, foto kondisi gudang terlampir, list item yang perlu restock disiapkan.',
  40, 'Active', true, now() - interval '1 day', now() - interval '2 days'
),

-- Q5: Draft — Bruno, A Rank (detail belum lengkap)
(
  'a0000000-0000-0000-0000-000000000005',
  'Koordinasi vendor lift RSIA',
  NULL,
  '00000000-0000-0000-0000-000000000007',
  '00000000-0000-0000-0000-000000000001',
  'A',
  NULL,
  NULL,
  150, 'Draft', false, NULL, now() - interval '6 hours'
),

-- Q6: Approved — Santi, D Rank
(
  'a0000000-0000-0000-0000-000000000006',
  'Laporan bulanan maintenance Mei',
  'Buat laporan rekap seluruh pekerjaan maintenance bulan Mei. Format PDF, kirim ke direktur.',
  '00000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000001',
  'D',
  now() - interval '3 days',
  'PDF laporan selesai, sudah dikirim ke direktur, konfirmasi penerimaan screenshot.',
  70, 'Approved', true, now() - interval '5 days', now() - interval '7 days'
),

-- Q7: Revise — Christian, B Rank
(
  'a0000000-0000-0000-0000-000000000007',
  'Instalasi CCTV gudang baru',
  'Pasang 4 unit CCTV di gudang baru area B. Koordinasi dengan kontraktor, pastikan semua sudut terpantau.',
  '00000000-0000-0000-0000-000000000006',
  '00000000-0000-0000-0000-000000000001',
  'B',
  now() + interval '1 day',
  'Semua 4 CCTV aktif dan terekam, foto instalasi, screenshot live feed dari NVR.',
  100, 'Revise', true, now() - interval '3 days', now() - interval '4 days'
),

-- Q8: Failed — Ervan, D Rank
(
  'a0000000-0000-0000-0000-000000000008',
  'Pembersihan AHU rooftop',
  'Bersihkan filter dan blower AHU di rooftop. Jadwalkan dengan tim kebersihan.',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'D',
  now() - interval '2 days',
  'Filter bersih, foto before-after terlampir, log pembersihan ditandatangani.',
  0, 'Failed', true, now() - interval '6 days', now() - interval '7 days'
),

-- Q9: Active — Siska, C Rank
(
  'a0000000-0000-0000-0000-000000000009',
  'Update SOP emergency genset',
  'Revisi SOP prosedur darurat genset berdasarkan insiden bulan lalu. Konsultasi dengan kepala teknik.',
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  'C',
  now() + interval '5 days',
  'Dokumen SOP direvisi, disetujui kepala teknik, versi baru di-upload ke drive.',
  80, 'Active', true, now() - interval '1 day', now() - interval '2 days'
),

-- Q10: Draft — Pris, B Rank (detail belum lengkap)
(
  'a0000000-0000-0000-0000-000000000010',
  'Survey lokasi proyek Sunter',
  NULL,
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'B',
  NULL,
  NULL,
  110, 'Draft', false, NULL, now() - interval '2 hours'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED: ATTACHMENTS
-- ============================================================

INSERT INTO public.attachments (id, quest_id, file_url, file_type, uploaded_by, uploaded_at) VALUES

-- Q1: Perbaikan AC ICU — 2 attachments
(
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'https://storage.example.com/attachments/ac-icu-before.jpg',
  'image/jpeg',
  '00000000-0000-0000-0000-000000000006',
  now() - interval '2 days'
),
(
  'b0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'https://storage.example.com/attachments/ac-icu-after.jpg',
  'image/jpeg',
  '00000000-0000-0000-0000-000000000006',
  now() - interval '2 days'
),

-- Q3: Quotation genset — PDF
(
  'b0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000003',
  'https://storage.example.com/attachments/quotation-genset-vendor-a.pdf',
  'application/pdf',
  '00000000-0000-0000-0000-000000000004',
  now() - interval '1 day'
),
(
  'b0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000003',
  'https://storage.example.com/attachments/quotation-genset-vendor-b.pdf',
  'application/pdf',
  '00000000-0000-0000-0000-000000000004',
  now() - interval '1 day'
),

-- Q6: Laporan bulanan — PDF
(
  'b0000000-0000-0000-0000-000000000005',
  'a0000000-0000-0000-0000-000000000006',
  'https://storage.example.com/attachments/laporan-maintenance-mei-2026.pdf',
  'application/pdf',
  '00000000-0000-0000-0000-000000000005',
  now() - interval '4 days'
),

-- Q7: CCTV (Revise) — 1 attachment
(
  'b0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000007',
  'https://storage.example.com/attachments/cctv-instalasi.jpg',
  'image/jpeg',
  '00000000-0000-0000-0000-000000000006',
  now() - interval '1 day'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED: POINT LOGS
-- ============================================================

INSERT INTO public.point_logs (id, user_id, quest_id, delta, reason, created_at) VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000001',
  120,
  'Quest approved: Perbaikan AC ICU Bella',
  now() - interval '2 days'
),
(
  'c0000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000005',
  'a0000000-0000-0000-0000-000000000006',
  70,
  'Quest approved: Laporan bulanan maintenance Mei',
  now() - interval '3 days'
),
(
  'c0000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  30,
  'Bonus GM: detail quest lengkap sebelum 21:00',
  now() - interval '4 days'
),
(
  'c0000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000006',
  30,
  'Bonus GM: detail quest lengkap sebelum 21:00',
  now() - interval '7 days'
),
(
  'c0000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000005',
  -20,
  'Penalti GM: detail quest belum lengkap melewati 00:00',
  now() - interval '5 hours'
),
(
  'c0000000-0000-0000-0000-000000000006',
  '00000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000010',
  -20,
  'Penalti GM: detail quest belum lengkap melewati 00:00',
  now() - interval '1 hour'
)
ON CONFLICT (id) DO NOTHING;
