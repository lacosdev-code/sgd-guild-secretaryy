--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.10 (Debian 17.10-1.pgdg13+1)


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--






--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users DISABLE TRIGGER ALL;

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'siska@sgd-corp.com', '$2a$10$jKagpdg/Ftxt.4mlUxBJ3.UJ/1D19oG8/9XhTPecyRGBilf4oWzE.', '2026-05-26 12:18:41.702879+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-28 15:27:12.738083+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-26 12:18:41.699682+00', '2026-05-28 15:27:12.763301+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'reza@sgd-corp.com', '$2a$10$RfnPCgkIDJCUAmqt8Y8Neem/dyt0axzsr45WaTNsqqoo1fQOOfI7a', '2026-05-26 12:18:41.277719+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-28 18:04:14.325006+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-26 12:18:41.255751+00', '2026-05-29 00:39:57.921563+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000007', 'authenticated', 'authenticated', 'bruno@sgd-corp.com', '$2a$10$W96y3l4HjXnJe9RR0iBiOexYg2gF0vcT79dgeUan9eUtxu8ZY2pL.', '2026-05-26 12:18:42.050894+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-28 11:52:57.56871+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-26 12:18:42.048449+00', '2026-05-28 11:52:57.5729+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000006', 'authenticated', 'authenticated', 'christian@sgd-corp.com', '$2a$10$aOWXtKF/8uqK8BSbWhFCCeieAD/M85ZoYjbTE.8t5Gq.MbZnBHcxS', '2026-05-26 12:18:41.934811+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-26 12:18:41.931934+00', '2026-05-27 07:52:38.81781+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', 'santi@sgd-corp.com', '$2a$10$6fWtlVdWaSdFZv5oWG3czuY3xH2fLckTJZJvoPf.P0vhutMClwooG', '2026-05-26 12:18:41.818209+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-26 12:18:41.815593+00', '2026-05-27 07:52:38.933608+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'ervan@sgd-corp.com', '$2a$10$ajs7sSeKBDRqt5o9dSEht.M7IPrpyw9FK.ndcfDV5eoNo1DSmrBS2', '2026-05-26 12:18:41.584689+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-26 12:18:41.580792+00', '2026-05-27 07:52:39.187436+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'pris@sgd-corp.com', '$2a$10$BS8yMQuKilVGi3lTEUyD.u8XwwzurGPruIei9RExccfC5x4ko634u', '2026-05-26 12:18:41.460564+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-26 12:18:41.457212+00', '2026-05-27 07:52:39.299793+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


ALTER TABLE auth.users ENABLE TRIGGER ALL;

--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities DISABLE TRIGGER ALL;

INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '{"sub": "00000000-0000-0000-0000-000000000001", "email": "reza@sgd-corp.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-26 12:18:41.273216+00', '2026-05-26 12:18:41.273283+00', '2026-05-26 12:18:41.273283+00', 'bceb7258-3a81-415b-8541-a4eeb837dad3');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '{"sub": "00000000-0000-0000-0000-000000000002", "email": "pris@sgd-corp.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-26 12:18:41.458965+00', '2026-05-26 12:18:41.459018+00', '2026-05-26 12:18:41.459018+00', '963eb61a-0e7c-4164-b9f4-5e7066263c13');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '{"sub": "00000000-0000-0000-0000-000000000003", "email": "ervan@sgd-corp.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-26 12:18:41.582594+00', '2026-05-26 12:18:41.582644+00', '2026-05-26 12:18:41.582644+00', '5ce228f2-cce8-4dbf-a239-006e401ed428');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', '{"sub": "00000000-0000-0000-0000-000000000004", "email": "siska@sgd-corp.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-26 12:18:41.701355+00', '2026-05-26 12:18:41.701406+00', '2026-05-26 12:18:41.701406+00', 'eb4e168e-3a78-430a-a2c1-5ea1049f65a9');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', '{"sub": "00000000-0000-0000-0000-000000000005", "email": "santi@sgd-corp.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-26 12:18:41.816753+00', '2026-05-26 12:18:41.816812+00', '2026-05-26 12:18:41.816812+00', '2689c47b-d7ed-437a-91c2-1f3bd0950ddf');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006', '{"sub": "00000000-0000-0000-0000-000000000006", "email": "christian@sgd-corp.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-26 12:18:41.933199+00', '2026-05-26 12:18:41.933246+00', '2026-05-26 12:18:41.933246+00', '1b28573e-8fa5-459d-a6bf-959cd71d654c');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000007', '{"sub": "00000000-0000-0000-0000-000000000007", "email": "bruno@sgd-corp.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-26 12:18:42.049622+00', '2026-05-26 12:18:42.049669+00', '2026-05-26 12:18:42.049669+00', '1eb9bf6f-b9a5-46be-9c98-4e6c483cf9ea');


ALTER TABLE auth.identities ENABLE TRIGGER ALL;

--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--





--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.users DISABLE TRIGGER ALL;

INSERT INTO public.users (id, nama, role, total_points, created_at, avatar_url) VALUES ('00000000-0000-0000-0000-000000000002', 'Pris', 'adventurer', 210, '2026-05-26 12:18:42.133931+00', NULL);
INSERT INTO public.users (id, nama, role, total_points, created_at, avatar_url) VALUES ('00000000-0000-0000-0000-000000000003', 'Ervan', 'adventurer', 185, '2026-05-26 12:18:42.216467+00', NULL);
INSERT INTO public.users (id, nama, role, total_points, created_at, avatar_url) VALUES ('00000000-0000-0000-0000-000000000005', 'Santi', 'adventurer', 155, '2026-05-26 12:18:42.287375+00', NULL);
INSERT INTO public.users (id, nama, role, total_points, created_at, avatar_url) VALUES ('00000000-0000-0000-0000-000000000006', 'Christian', 'adventurer', 300, '2026-05-26 12:18:42.318098+00', NULL);
INSERT INTO public.users (id, nama, role, total_points, created_at, avatar_url) VALUES ('00000000-0000-0000-0000-000000000007', 'Bruno', 'adventurer', 90, '2026-05-26 12:18:42.374789+00', NULL);
INSERT INTO public.users (id, nama, role, total_points, created_at, avatar_url) VALUES ('00000000-0000-0000-0000-000000000001', 'Reza', 'guild_master', 340, '2026-05-26 12:18:42.086722+00', 'https://tbbrzfbxqzlqqgvukwvu.supabase.co/storage/v1/object/public/avatars/00000000-0000-0000-0000-000000000001/00000000-0000-0000-0000-000000000001-1779811975155.png');
INSERT INTO public.users (id, nama, role, total_points, created_at, avatar_url) VALUES ('00000000-0000-0000-0000-000000000004', 'Siska', 'adventurer', 270, '2026-05-26 12:18:42.249947+00', 'https://tbbrzfbxqzlqqgvukwvu.supabase.co/storage/v1/object/public/avatars/00000000-0000-0000-0000-000000000004/00000000-0000-0000-0000-000000000004-1779873998167.jpg');


ALTER TABLE public.users ENABLE TRIGGER ALL;

--
-- Data for Name: quests; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.quests DISABLE TRIGGER ALL;

INSERT INTO public.quests (id, title, description, assigned_to, created_by, difficulty, deadline, success_parameter, reward_points, status, detail_completed, detail_completed_at, created_at, updated_at, urgency) VALUES ('a0000000-0000-0000-0000-000000000001', 'Perbaikan AC ICU Bella', 'Koordinasi dengan Bokir untuk memastikan airflow di ruang ICU Bella kembali stabil setelah keluhan dari head nurse.', '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'B', '2026-05-24 12:18:42.275+00', 'Airflow stabil, nurse confirmation diterima, foto terlampir, tidak ada complaint 24 jam setelah perbaikan.', 120, 'Approved', true, '2026-05-23 12:18:42.275+00', '2026-05-22 12:18:42.275+00', '2026-05-26 12:18:42.423899+00', 'Routine');
INSERT INTO public.quests (id, title, description, assigned_to, created_by, difficulty, deadline, success_parameter, reward_points, status, detail_completed, detail_completed_at, created_at, updated_at, urgency) VALUES ('a0000000-0000-0000-0000-000000000002', 'Cek kebocoran pipa lantai 3', 'Laporan kebocoran kecil di pantry lantai 3. Cek sumber kebocoran dan dokumentasikan kondisi pipa.', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'D', '2026-05-27 12:18:42.275+00', 'Sumber kebocoran ditemukan, foto kondisi terlampir, estimasi perbaikan disiapkan.', 60, 'Active', true, '2026-05-25 12:18:42.275+00', '2026-05-25 12:18:42.275+00', '2026-05-26 12:18:42.467696+00', 'Routine');
INSERT INTO public.quests (id, title, description, assigned_to, created_by, difficulty, deadline, success_parameter, reward_points, status, detail_completed, detail_completed_at, created_at, updated_at, urgency) VALUES ('a0000000-0000-0000-0000-000000000003', 'Pengajuan quotation genset cadangan', 'Minta minimal 2 penawaran dari vendor untuk genset cadangan 100kVA. Bandingkan spesifikasi dan harga.', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'C', '2026-05-28 12:18:42.275+00', 'Minimal 2 quotation dari vendor berbeda, file PDF terlampir, rekomendasi vendor disertakan.', 80, 'Submitted', true, '2026-05-24 12:18:42.275+00', '2026-05-23 12:18:42.275+00', '2026-05-26 12:18:42.500162+00', 'Routine');
INSERT INTO public.quests (id, title, description, assigned_to, created_by, difficulty, deadline, success_parameter, reward_points, status, detail_completed, detail_completed_at, created_at, updated_at, urgency) VALUES ('a0000000-0000-0000-0000-000000000004', 'Audit stok spare part AC', 'Cek dan hitung ulang stok spare part AC di gudang. Update spreadsheet stok dan laporkan jika ada yang habis.', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'E', '2026-05-29 12:18:42.275+00', 'Spreadsheet stok diupdate, foto kondisi gudang terlampir, list item yang perlu restock disiapkan.', 40, 'Active', true, '2026-05-25 12:18:42.275+00', '2026-05-24 12:18:42.275+00', '2026-05-26 12:18:42.534817+00', 'Routine');
INSERT INTO public.quests (id, title, description, assigned_to, created_by, difficulty, deadline, success_parameter, reward_points, status, detail_completed, detail_completed_at, created_at, updated_at, urgency) VALUES ('a0000000-0000-0000-0000-000000000006', 'Laporan bulanan maintenance Mei', 'Buat laporan rekap seluruh pekerjaan maintenance bulan Mei. Format PDF, kirim ke direktur.', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'D', '2026-05-23 12:18:42.275+00', 'PDF laporan selesai, sudah dikirim ke direktur, konfirmasi penerimaan screenshot.', 70, 'Approved', true, '2026-05-21 12:18:42.275+00', '2026-05-19 12:18:42.275+00', '2026-05-26 12:18:42.652441+00', 'Routine');
INSERT INTO public.quests (id, title, description, assigned_to, created_by, difficulty, deadline, success_parameter, reward_points, status, detail_completed, detail_completed_at, created_at, updated_at, urgency) VALUES ('a0000000-0000-0000-0000-000000000007', 'Instalasi CCTV gudang baru', 'Pasang 4 unit CCTV di gudang baru area B. Koordinasi dengan kontraktor, pastikan semua sudut terpantau.', '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'B', '2026-05-27 12:18:42.275+00', 'Semua 4 CCTV aktif dan terekam, foto instalasi, screenshot live feed dari NVR.', 100, 'Revise', true, '2026-05-23 12:18:42.275+00', '2026-05-22 12:18:42.275+00', '2026-05-26 12:18:42.683914+00', 'Routine');
INSERT INTO public.quests (id, title, description, assigned_to, created_by, difficulty, deadline, success_parameter, reward_points, status, detail_completed, detail_completed_at, created_at, updated_at, urgency) VALUES ('a0000000-0000-0000-0000-000000000008', 'Pembersihan AHU rooftop', 'Bersihkan filter dan blower AHU di rooftop. Jadwalkan dengan tim kebersihan.', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'D', '2026-05-24 12:18:42.275+00', 'Filter bersih, foto before-after terlampir, log pembersihan ditandatangani.', 0, 'Failed', true, '2026-05-20 12:18:42.275+00', '2026-05-19 12:18:42.275+00', '2026-05-26 12:18:42.720268+00', 'Routine');
INSERT INTO public.quests (id, title, description, assigned_to, created_by, difficulty, deadline, success_parameter, reward_points, status, detail_completed, detail_completed_at, created_at, updated_at, urgency) VALUES ('a0000000-0000-0000-0000-000000000010', 'Survey lokasi proyek Sunter', NULL, '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'B', NULL, NULL, 110, 'Draft', false, NULL, '2026-05-26 10:18:42.275+00', '2026-05-26 12:18:42.902929+00', 'Routine');
INSERT INTO public.quests (id, title, description, assigned_to, created_by, difficulty, deadline, success_parameter, reward_points, status, detail_completed, detail_completed_at, created_at, updated_at, urgency) VALUES ('c86ee129-aabf-497b-853f-5a0fc9087af8', 'Membersihkan Selokan Guild', 'Pekerjaan kotor namun penting.', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'E', '2026-05-27 02:22:00+00', 'Jalur air lancar', 50, 'Active', true, '2026-05-27 10:19:27.975452+00', '2026-05-26 16:22:20.017155+00', '2026-05-27 10:19:27.975452+00', 'Routine');
INSERT INTO public.quests (id, title, description, assigned_to, created_by, difficulty, deadline, success_parameter, reward_points, status, detail_completed, detail_completed_at, created_at, updated_at, urgency) VALUES ('65d95ead-700c-49db-94f8-ba6627584379', 'Mencari Herb Obat', 'Ramuan obat membutuhkan daun mint biru.', NULL, '00000000-0000-0000-0000-000000000001', 'F', '2026-05-25 16:22:20.017155+00', NULL, 100, 'Failed', false, NULL, '2026-05-23 16:22:20.017155+00', '2026-05-28 06:36:03.44077+00', 'Routine');
INSERT INTO public.quests (id, title, description, assigned_to, created_by, difficulty, deadline, success_parameter, reward_points, status, detail_completed, detail_completed_at, created_at, updated_at, urgency) VALUES ('7171a8ed-7e36-49c3-9427-ec14734a6873', 'Membasmi 10 Slime di Hutan Timur', 'Warga desa melapor banyak slime merusak kebun. Habisi mereka dan bawa buktinya.', NULL, '00000000-0000-0000-0000-000000000001', 'E', '2026-05-28 16:22:20.017155+00', NULL, 250, 'Approved', false, NULL, '2026-05-24 16:22:20.017155+00', '2026-05-28 06:36:03.44077+00', 'Routine');
INSERT INTO public.quests (id, title, description, assigned_to, created_by, difficulty, deadline, success_parameter, reward_points, status, detail_completed, detail_completed_at, created_at, updated_at, urgency) VALUES ('b3b414e8-1364-4f92-a498-abfcb0b9dc1a', 'Menjelajah Dungeon Rank A', 'Temukan artifak langka di lantai 50.', NULL, '00000000-0000-0000-0000-000000000001', 'A', '2026-06-05 16:22:20.017155+00', NULL, 5000, 'Approved', false, NULL, '2026-05-21 16:22:20.017155+00', '2026-05-28 06:36:03.44077+00', 'Routine');
INSERT INTO public.quests (id, title, description, assigned_to, created_by, difficulty, deadline, success_parameter, reward_points, status, detail_completed, detail_completed_at, created_at, updated_at, urgency) VALUES ('d4f6fe74-eb9b-4793-b9d9-a06e70c11414', 'Pengawalan Pedagang ke Ibukota', 'Jaga kereta barang dari serangan bandit.', NULL, '00000000-0000-0000-0000-000000000001', 'D', '2026-05-31 16:22:20.017155+00', NULL, 400, 'Active', false, NULL, '2026-05-25 16:22:20.017155+00', '2026-05-28 06:36:03.44077+00', 'Routine');
INSERT INTO public.quests (id, title, description, assigned_to, created_by, difficulty, deadline, success_parameter, reward_points, status, detail_completed, detail_completed_at, created_at, updated_at, urgency) VALUES ('777bbd39-383e-4b5e-bfaa-adbcc4fb1061', 'Memburu Naga Merah', 'Quest darurat! Seekor naga menyerang pedesaan!', '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'S', '2026-06-02 09:22:00+00', 'Potong kepala naga', 9000, 'Active', true, '2026-05-28 10:11:57.130832+00', '2026-05-26 16:22:20.017155+00', '2026-05-28 10:11:57.130832+00', 'Routine');
INSERT INTO public.quests (id, title, description, assigned_to, created_by, difficulty, deadline, success_parameter, reward_points, status, detail_completed, detail_completed_at, created_at, updated_at, urgency) VALUES ('a0000000-0000-0000-0000-000000000005', 'Koordinasi vendor lift RSIA', 'Vendor lift hari ini datang. Agar ditemani dan diperjelas masalahnya dimana.', '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'A', '2026-05-29 10:13:00+00', 'Principal menginformasikan parts apa yg perlu diganti.', 150, 'Active', true, '2026-05-28 10:13:48.779034+00', '2026-05-26 06:18:42.275+00', '2026-05-28 10:13:48.779034+00', 'Routine');
INSERT INTO public.quests (id, title, description, assigned_to, created_by, difficulty, deadline, success_parameter, reward_points, status, detail_completed, detail_completed_at, created_at, updated_at, urgency) VALUES ('a0000000-0000-0000-0000-000000000009', 'Update SOP emergency genset', 'Revisi SOP prosedur darurat genset berdasarkan insiden bulan lalu. Konsultasi dengan kepala teknik.', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'C', '2026-05-31 12:18:42.275+00', 'Dokumen SOP direvisi, disetujui kepala teknik, versi baru di-upload ke drive.', 80, 'Revise', true, '2026-05-25 12:18:42.275+00', '2026-05-24 12:18:42.275+00', '2026-05-28 15:02:03.556638+00', 'Routine');


ALTER TABLE public.quests ENABLE TRIGGER ALL;

--
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.attachments DISABLE TRIGGER ALL;

INSERT INTO public.attachments (id, quest_id, file_url, file_type, uploaded_by, uploaded_at) VALUES ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'https://storage.example.com/attachments/ac-icu-before.jpg', 'image/jpeg', '00000000-0000-0000-0000-000000000006', '2026-05-24 12:18:42.275+00');
INSERT INTO public.attachments (id, quest_id, file_url, file_type, uploaded_by, uploaded_at) VALUES ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'https://storage.example.com/attachments/ac-icu-after.jpg', 'image/jpeg', '00000000-0000-0000-0000-000000000006', '2026-05-24 12:18:42.275+00');
INSERT INTO public.attachments (id, quest_id, file_url, file_type, uploaded_by, uploaded_at) VALUES ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'https://storage.example.com/attachments/quotation-genset-vendor-a.pdf', 'application/pdf', '00000000-0000-0000-0000-000000000004', '2026-05-25 12:18:42.275+00');
INSERT INTO public.attachments (id, quest_id, file_url, file_type, uploaded_by, uploaded_at) VALUES ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003', 'https://storage.example.com/attachments/quotation-genset-vendor-b.pdf', 'application/pdf', '00000000-0000-0000-0000-000000000004', '2026-05-25 12:18:42.275+00');
INSERT INTO public.attachments (id, quest_id, file_url, file_type, uploaded_by, uploaded_at) VALUES ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006', 'https://storage.example.com/attachments/laporan-maintenance-mei-2026.pdf', 'application/pdf', '00000000-0000-0000-0000-000000000005', '2026-05-22 12:18:42.275+00');
INSERT INTO public.attachments (id, quest_id, file_url, file_type, uploaded_by, uploaded_at) VALUES ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000007', 'https://storage.example.com/attachments/cctv-instalasi.jpg', 'image/jpeg', '00000000-0000-0000-0000-000000000006', '2026-05-25 12:18:42.275+00');
INSERT INTO public.attachments (id, quest_id, file_url, file_type, uploaded_by, uploaded_at) VALUES ('39739b73-c9c8-4028-a8a9-a0fbf25abee0', 'a0000000-0000-0000-0000-000000000009', 'https://tbbrzfbxqzlqqgvukwvu.supabase.co/storage/v1/object/public/attachments/a0000000-0000-0000-0000-000000000009/1779857116072_umi0vkyk8i.png', 'image/png', '00000000-0000-0000-0000-000000000004', '2026-05-27 04:45:17.171273+00');
INSERT INTO public.attachments (id, quest_id, file_url, file_type, uploaded_by, uploaded_at) VALUES ('3213c263-58cf-47fa-a6ca-51912fd32377', 'a0000000-0000-0000-0000-000000000009', 'https://tbbrzfbxqzlqqgvukwvu.supabase.co/storage/v1/object/public/attachments/a0000000-0000-0000-0000-000000000009/1779857117107_1phjtb833pd.jpg', 'image/jpeg', '00000000-0000-0000-0000-000000000004', '2026-05-27 04:45:17.773986+00');


ALTER TABLE public.attachments ENABLE TRIGGER ALL;

--
-- Data for Name: guild_chat; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.guild_chat DISABLE TRIGGER ALL;

INSERT INTO public.guild_chat (id, user_id, message, created_at) VALUES ('2d6a95b4-334f-487a-abc9-2e89f3608627', '00000000-0000-0000-0000-000000000001', 'halo', '2026-05-28 11:39:02.869415+00');
INSERT INTO public.guild_chat (id, user_id, message, created_at) VALUES ('a0e2f6a1-b10e-4f49-b0c9-4451eae9a78e', '00000000-0000-0000-0000-000000000004', 'okej tugas aman', '2026-05-28 11:40:00.770059+00');
INSERT INTO public.guild_chat (id, user_id, message, created_at) VALUES ('9287d9b2-b20c-487a-b2a7-731c35030814', '00000000-0000-0000-0000-000000000004', 'tugas baru?', '2026-05-28 11:52:02.862774+00');
INSERT INTO public.guild_chat (id, user_id, message, created_at) VALUES ('3e0926d3-2144-432a-bdba-7730c810bce5', '00000000-0000-0000-0000-000000000007', 'tugas bella ac update', '2026-05-28 11:53:42.215913+00');
INSERT INTO public.guild_chat (id, user_id, message, created_at) VALUES ('2cd8c011-f60a-4c97-b88f-25340b3bb47f', '00000000-0000-0000-0000-000000000001', 'baik', '2026-05-28 11:58:12.634698+00');
INSERT INTO public.guild_chat (id, user_id, message, created_at) VALUES ('61495d52-f17f-4e13-b40e-abc19faa6a9a', '00000000-0000-0000-0000-000000000004', 'baik', '2026-05-28 11:58:27.67928+00');
INSERT INTO public.guild_chat (id, user_id, message, created_at) VALUES ('23a92f5c-3c27-43e0-b9a9-2304e7d49988', '00000000-0000-0000-0000-000000000001', 'tolong perbaiki catatan', '2026-05-28 12:05:42.724113+00');
INSERT INTO public.guild_chat (id, user_id, message, created_at) VALUES ('7843942f-fa8c-4b74-9d6d-24da873aec71', '00000000-0000-0000-0000-000000000007', 'baik', '2026-05-28 12:05:58.533112+00');
INSERT INTO public.guild_chat (id, user_id, message, created_at) VALUES ('abf17181-4083-4513-b4c3-67f8f47c444d', '00000000-0000-0000-0000-000000000001', 'halo pagi', '2026-05-28 12:06:51.419089+00');
INSERT INTO public.guild_chat (id, user_id, message, created_at) VALUES ('55de8ef3-0968-4fd6-ab58-6084d943e09f', '00000000-0000-0000-0000-000000000004', 'pagi', '2026-05-28 12:06:57.254909+00');
INSERT INTO public.guild_chat (id, user_id, message, created_at) VALUES ('dc6e30b5-3d0e-4e2c-b801-8e1e9c83f1e1', '00000000-0000-0000-0000-000000000007', 'pagi', '2026-05-28 12:07:01.494201+00');
INSERT INTO public.guild_chat (id, user_id, message, created_at) VALUES ('874fac76-0472-4a44-87bd-8c8ac251962f', '00000000-0000-0000-0000-000000000001', 'ada tuags bru', '2026-05-28 12:07:09.730152+00');
INSERT INTO public.guild_chat (id, user_id, message, created_at) VALUES ('7af81e7b-1cc1-4a29-9a4b-052b6ae13024', '00000000-0000-0000-0000-000000000004', 'ok', '2026-05-28 12:07:14.133783+00');
INSERT INTO public.guild_chat (id, user_id, message, created_at) VALUES ('0f6ce977-0073-4870-af3e-74d7a5103b2d', '00000000-0000-0000-0000-000000000007', 'ok', '2026-05-28 12:07:17.503936+00');
INSERT INTO public.guild_chat (id, user_id, message, created_at) VALUES ('1c1c6312-0763-44d7-aee9-5da076112187', '00000000-0000-0000-0000-000000000004', 'malam tim', '2026-05-28 14:54:52.323215+00');


ALTER TABLE public.guild_chat ENABLE TRIGGER ALL;

--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.notifications DISABLE TRIGGER ALL;

INSERT INTO public.notifications (id, user_id, title, message, link, is_read, created_at) VALUES ('94c1278b-3d11-4719-ba4e-9945ff1ebebd', '00000000-0000-0000-0000-000000000001', 'Peringatan Deadline', 'Quest Mencari Herb Obat telah melewati deadline.', NULL, true, '2026-05-26 16:22:20.017155+00');
INSERT INTO public.notifications (id, user_id, title, message, link, is_read, created_at) VALUES ('87dffee7-f6e7-4016-98b6-b067b9b0b8b5', '00000000-0000-0000-0000-000000000001', 'Quest Selesai', 'Kirito telah menyelesaikan quest Membasmi Slime.', NULL, true, '2026-05-26 16:22:20.017155+00');
INSERT INTO public.notifications (id, user_id, title, message, link, is_read, created_at) VALUES ('e2cb8c55-112e-4018-be73-578c81afc2ad', '00000000-0000-0000-0000-000000000001', 'Submission Baru', 'Asuna mengirimkan laporan progress quest.', NULL, true, '2026-05-26 16:22:20.017155+00');


ALTER TABLE public.notifications ENABLE TRIGGER ALL;

--
-- Data for Name: point_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.point_logs DISABLE TRIGGER ALL;

INSERT INTO public.point_logs (id, user_id, quest_id, delta, reason, created_at) VALUES ('c0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 120, 'Quest approved: Perbaikan AC ICU Bella', '2026-05-24 12:18:42.275+00');
INSERT INTO public.point_logs (id, user_id, quest_id, delta, reason, created_at) VALUES ('c0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006', 70, 'Quest approved: Laporan bulanan maintenance Mei', '2026-05-23 12:18:42.275+00');
INSERT INTO public.point_logs (id, user_id, quest_id, delta, reason, created_at) VALUES ('c0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 30, 'Bonus GM: detail quest lengkap sebelum 21:00', '2026-05-22 12:18:42.275+00');
INSERT INTO public.point_logs (id, user_id, quest_id, delta, reason, created_at) VALUES ('c0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 30, 'Bonus GM: detail quest lengkap sebelum 21:00', '2026-05-19 12:18:42.275+00');
INSERT INTO public.point_logs (id, user_id, quest_id, delta, reason, created_at) VALUES ('c0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', -20, 'Penalti GM: detail quest belum lengkap melewati 00:00', '2026-05-26 07:18:42.275+00');
INSERT INTO public.point_logs (id, user_id, quest_id, delta, reason, created_at) VALUES ('c0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000010', -20, 'Penalti GM: detail quest belum lengkap melewati 00:00', '2026-05-26 11:18:42.275+00');


ALTER TABLE public.point_logs ENABLE TRIGGER ALL;

--
-- Data for Name: quest_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.quest_comments DISABLE TRIGGER ALL;



ALTER TABLE public.quest_comments ENABLE TRIGGER ALL;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--



--
-- PostgreSQL database dump complete
--


