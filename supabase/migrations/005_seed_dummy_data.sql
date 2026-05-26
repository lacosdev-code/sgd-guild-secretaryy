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
