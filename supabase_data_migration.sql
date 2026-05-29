--
-- PostgreSQL database dump
--

\restrict AVebaddAss7DUHP4O0oibzTEkgRZ8y5D6zpebADuU4fcK7iNtTnbn0qsNhWApKr

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.10 (Debian 17.10-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

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

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'siska@sgd-corp.com', '$2a$10$jKagpdg/Ftxt.4mlUxBJ3.UJ/1D19oG8/9XhTPecyRGBilf4oWzE.', '2026-05-26 12:18:41.702879+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-28 15:27:12.738083+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-26 12:18:41.699682+00', '2026-05-28 15:27:12.763301+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'reza@sgd-corp.com', '$2a$10$RfnPCgkIDJCUAmqt8Y8Neem/dyt0axzsr45WaTNsqqoo1fQOOfI7a', '2026-05-26 12:18:41.277719+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-28 18:04:14.325006+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-26 12:18:41.255751+00', '2026-05-29 00:39:57.921563+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000007', 'authenticated', 'authenticated', 'bruno@sgd-corp.com', '$2a$10$W96y3l4HjXnJe9RR0iBiOexYg2gF0vcT79dgeUan9eUtxu8ZY2pL.', '2026-05-26 12:18:42.050894+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-28 11:52:57.56871+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-26 12:18:42.048449+00', '2026-05-28 11:52:57.5729+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000006', 'authenticated', 'authenticated', 'christian@sgd-corp.com', '$2a$10$aOWXtKF/8uqK8BSbWhFCCeieAD/M85ZoYjbTE.8t5Gq.MbZnBHcxS', '2026-05-26 12:18:41.934811+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-26 12:18:41.931934+00', '2026-05-27 07:52:38.81781+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', 'santi@sgd-corp.com', '$2a$10$6fWtlVdWaSdFZv5oWG3czuY3xH2fLckTJZJvoPf.P0vhutMClwooG', '2026-05-26 12:18:41.818209+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-26 12:18:41.815593+00', '2026-05-27 07:52:38.933608+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'ervan@sgd-corp.com', '$2a$10$ajs7sSeKBDRqt5o9dSEht.M7IPrpyw9FK.ndcfDV5eoNo1DSmrBS2', '2026-05-26 12:18:41.584689+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-26 12:18:41.580792+00', '2026-05-27 07:52:39.187436+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'pris@sgd-corp.com', '$2a$10$BS8yMQuKilVGi3lTEUyD.u8XwwzurGPruIei9RExccfC5x4ko634u', '2026-05-26 12:18:41.460564+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-26 12:18:41.457212+00', '2026-05-27 07:52:39.299793+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '{"sub": "00000000-0000-0000-0000-000000000001", "email": "reza@sgd-corp.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-26 12:18:41.273216+00', '2026-05-26 12:18:41.273283+00', '2026-05-26 12:18:41.273283+00', 'bceb7258-3a81-415b-8541-a4eeb837dad3');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '{"sub": "00000000-0000-0000-0000-000000000002", "email": "pris@sgd-corp.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-26 12:18:41.458965+00', '2026-05-26 12:18:41.459018+00', '2026-05-26 12:18:41.459018+00', '963eb61a-0e7c-4164-b9f4-5e7066263c13');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '{"sub": "00000000-0000-0000-0000-000000000003", "email": "ervan@sgd-corp.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-26 12:18:41.582594+00', '2026-05-26 12:18:41.582644+00', '2026-05-26 12:18:41.582644+00', '5ce228f2-cce8-4dbf-a239-006e401ed428');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', '{"sub": "00000000-0000-0000-0000-000000000004", "email": "siska@sgd-corp.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-26 12:18:41.701355+00', '2026-05-26 12:18:41.701406+00', '2026-05-26 12:18:41.701406+00', 'eb4e168e-3a78-430a-a2c1-5ea1049f65a9');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', '{"sub": "00000000-0000-0000-0000-000000000005", "email": "santi@sgd-corp.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-26 12:18:41.816753+00', '2026-05-26 12:18:41.816812+00', '2026-05-26 12:18:41.816812+00', '2689c47b-d7ed-437a-91c2-1f3bd0950ddf');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006', '{"sub": "00000000-0000-0000-0000-000000000006", "email": "christian@sgd-corp.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-26 12:18:41.933199+00', '2026-05-26 12:18:41.933246+00', '2026-05-26 12:18:41.933246+00', '1b28573e-8fa5-459d-a6bf-959cd71d654c');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000007', '{"sub": "00000000-0000-0000-0000-000000000007", "email": "bruno@sgd-corp.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-26 12:18:42.049622+00', '2026-05-26 12:18:42.049669+00', '2026-05-26 12:18:42.049669+00', '1eb9bf6f-b9a5-46be-9c98-4e6c483cf9ea');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) VALUES ('c9a1ecdd-8bb0-497b-bf7f-bfaf44604d2a', '00000000-0000-0000-0000-000000000004', '2026-05-28 14:59:47.51562+00', '2026-05-28 14:59:47.51562+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36', '114.8.199.222', NULL, NULL, NULL, NULL, NULL);
INSERT INTO auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) VALUES ('ae292620-ade0-4404-9fe5-51bc2c8e3a0c', '00000000-0000-0000-0000-000000000004', '2026-05-28 14:59:56.040283+00', '2026-05-28 14:59:56.040283+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36', '114.8.199.222', NULL, NULL, NULL, NULL, NULL);
INSERT INTO auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) VALUES ('2bba516a-a207-489e-9597-2f20fedd61e1', '00000000-0000-0000-0000-000000000007', '2026-05-28 11:52:57.568821+00', '2026-05-28 11:52:57.568821+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '103.160.13.22', NULL, NULL, NULL, NULL, NULL);
INSERT INTO auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) VALUES ('018ed55b-c6f6-400e-98b6-a71e29b26514', '00000000-0000-0000-0000-000000000004', '2026-05-28 15:27:12.739334+00', '2026-05-28 15:27:12.739334+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15', '103.160.13.22', NULL, NULL, NULL, NULL, NULL);
INSERT INTO auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) VALUES ('20286e99-2662-4c6a-a682-4ad217e561ee', '00000000-0000-0000-0000-000000000001', '2026-05-28 17:55:28.492174+00', '2026-05-28 17:55:28.492174+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36', '43.133.131.91', NULL, NULL, NULL, NULL, NULL);
INSERT INTO auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) VALUES ('8126538c-9510-4ac7-bf2a-500527341e5d', '00000000-0000-0000-0000-000000000001', '2026-05-28 17:58:28.342653+00', '2026-05-28 17:58:28.342653+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36', '43.133.131.91', NULL, NULL, NULL, NULL, NULL);
INSERT INTO auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) VALUES ('b9b236f1-89d0-492a-8b0e-0e7f6d8c2d61', '00000000-0000-0000-0000-000000000001', '2026-05-28 18:00:00.807029+00', '2026-05-28 18:00:00.807029+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36', '43.133.131.91', NULL, NULL, NULL, NULL, NULL);
INSERT INTO auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) VALUES ('12bef058-08a1-448c-9d7e-930caa3a55f1', '00000000-0000-0000-0000-000000000001', '2026-05-28 18:04:14.325106+00', '2026-05-29 00:39:57.93335+00', NULL, 'aal1', NULL, '2026-05-29 00:39:57.933239', 'Next.js Middleware', '43.156.21.41', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) VALUES ('2bba516a-a207-489e-9597-2f20fedd61e1', '2026-05-28 11:52:57.573971+00', '2026-05-28 11:52:57.573971+00', 'password', '58324b47-34cc-4925-ad7e-c32baaf59bc1');
INSERT INTO auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) VALUES ('c9a1ecdd-8bb0-497b-bf7f-bfaf44604d2a', '2026-05-28 14:59:47.53755+00', '2026-05-28 14:59:47.53755+00', 'password', 'ace4b97f-5534-47f7-9b5f-902cdb1af8c3');
INSERT INTO auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) VALUES ('ae292620-ade0-4404-9fe5-51bc2c8e3a0c', '2026-05-28 14:59:56.042848+00', '2026-05-28 14:59:56.042848+00', 'password', '6141bd9f-6ed7-4c4a-96eb-28f869bd8988');
INSERT INTO auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) VALUES ('018ed55b-c6f6-400e-98b6-a71e29b26514', '2026-05-28 15:27:12.7747+00', '2026-05-28 15:27:12.7747+00', 'password', 'd879b957-2f64-4ec8-aafa-a5d509ad6a1c');
INSERT INTO auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) VALUES ('20286e99-2662-4c6a-a682-4ad217e561ee', '2026-05-28 17:55:28.553716+00', '2026-05-28 17:55:28.553716+00', 'password', '23ecdfac-2313-4675-8cbc-baaf39b228e0');
INSERT INTO auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) VALUES ('8126538c-9510-4ac7-bf2a-500527341e5d', '2026-05-28 17:58:28.352937+00', '2026-05-28 17:58:28.352937+00', 'password', 'eaeacf64-757f-486e-825f-6edab4e41e11');
INSERT INTO auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) VALUES ('b9b236f1-89d0-492a-8b0e-0e7f6d8c2d61', '2026-05-28 18:00:00.825622+00', '2026-05-28 18:00:00.825622+00', 'password', '2c8486c4-ff19-4d1b-8c03-3b29dd1db523');
INSERT INTO auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) VALUES ('12bef058-08a1-448c-9d7e-930caa3a55f1', '2026-05-28 18:04:14.333546+00', '2026-05-28 18:04:14.333546+00', 'password', '6b414da0-05f2-4157-899d-2db655947cf6');


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

INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 91, 'eymaymic3ziw', '00000000-0000-0000-0000-000000000004', false, '2026-05-28 14:59:47.530057+00', '2026-05-28 14:59:47.530057+00', NULL, 'c9a1ecdd-8bb0-497b-bf7f-bfaf44604d2a');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 92, 'l4as3272v3vu', '00000000-0000-0000-0000-000000000004', false, '2026-05-28 14:59:56.041429+00', '2026-05-28 14:59:56.041429+00', NULL, 'ae292620-ade0-4404-9fe5-51bc2c8e3a0c');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 95, '3tuug44os3i4', '00000000-0000-0000-0000-000000000004', false, '2026-05-28 15:27:12.750523+00', '2026-05-28 15:27:12.750523+00', NULL, '018ed55b-c6f6-400e-98b6-a71e29b26514');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 96, 'pktb2w57q5b5', '00000000-0000-0000-0000-000000000001', false, '2026-05-28 17:55:28.522537+00', '2026-05-28 17:55:28.522537+00', NULL, '20286e99-2662-4c6a-a682-4ad217e561ee');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 97, 'vhogtz5gezc6', '00000000-0000-0000-0000-000000000001', false, '2026-05-28 17:58:28.349481+00', '2026-05-28 17:58:28.349481+00', NULL, '8126538c-9510-4ac7-bf2a-500527341e5d');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 98, 'xol5zw5mgxax', '00000000-0000-0000-0000-000000000001', false, '2026-05-28 18:00:00.821971+00', '2026-05-28 18:00:00.821971+00', NULL, 'b9b236f1-89d0-492a-8b0e-0e7f6d8c2d61');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 99, 'brmw5mc2k2ty', '00000000-0000-0000-0000-000000000001', true, '2026-05-28 18:04:14.330297+00', '2026-05-29 00:39:57.890895+00', NULL, '12bef058-08a1-448c-9d7e-930caa3a55f1');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 100, 'jkcj7va5qdyp', '00000000-0000-0000-0000-000000000001', false, '2026-05-29 00:39:57.911074+00', '2026-05-29 00:39:57.911074+00', 'brmw5mc2k2ty', '12bef058-08a1-448c-9d7e-930caa3a55f1');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 79, 'vhqticaz57qu', '00000000-0000-0000-0000-000000000007', false, '2026-05-28 11:52:57.570962+00', '2026-05-28 11:52:57.570962+00', NULL, '2bba516a-a207-489e-9597-2f20fedd61e1');


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

INSERT INTO auth.schema_migrations (version) VALUES ('20171026211738');
INSERT INTO auth.schema_migrations (version) VALUES ('20171026211808');
INSERT INTO auth.schema_migrations (version) VALUES ('20171026211834');
INSERT INTO auth.schema_migrations (version) VALUES ('20180103212743');
INSERT INTO auth.schema_migrations (version) VALUES ('20180108183307');
INSERT INTO auth.schema_migrations (version) VALUES ('20180119214651');
INSERT INTO auth.schema_migrations (version) VALUES ('20180125194653');
INSERT INTO auth.schema_migrations (version) VALUES ('00');
INSERT INTO auth.schema_migrations (version) VALUES ('20210710035447');
INSERT INTO auth.schema_migrations (version) VALUES ('20210722035447');
INSERT INTO auth.schema_migrations (version) VALUES ('20210730183235');
INSERT INTO auth.schema_migrations (version) VALUES ('20210909172000');
INSERT INTO auth.schema_migrations (version) VALUES ('20210927181326');
INSERT INTO auth.schema_migrations (version) VALUES ('20211122151130');
INSERT INTO auth.schema_migrations (version) VALUES ('20211124214934');
INSERT INTO auth.schema_migrations (version) VALUES ('20211202183645');
INSERT INTO auth.schema_migrations (version) VALUES ('20220114185221');
INSERT INTO auth.schema_migrations (version) VALUES ('20220114185340');
INSERT INTO auth.schema_migrations (version) VALUES ('20220224000811');
INSERT INTO auth.schema_migrations (version) VALUES ('20220323170000');
INSERT INTO auth.schema_migrations (version) VALUES ('20220429102000');
INSERT INTO auth.schema_migrations (version) VALUES ('20220531120530');
INSERT INTO auth.schema_migrations (version) VALUES ('20220614074223');
INSERT INTO auth.schema_migrations (version) VALUES ('20220811173540');
INSERT INTO auth.schema_migrations (version) VALUES ('20221003041349');
INSERT INTO auth.schema_migrations (version) VALUES ('20221003041400');
INSERT INTO auth.schema_migrations (version) VALUES ('20221011041400');
INSERT INTO auth.schema_migrations (version) VALUES ('20221020193600');
INSERT INTO auth.schema_migrations (version) VALUES ('20221021073300');
INSERT INTO auth.schema_migrations (version) VALUES ('20221021082433');
INSERT INTO auth.schema_migrations (version) VALUES ('20221027105023');
INSERT INTO auth.schema_migrations (version) VALUES ('20221114143122');
INSERT INTO auth.schema_migrations (version) VALUES ('20221114143410');
INSERT INTO auth.schema_migrations (version) VALUES ('20221125140132');
INSERT INTO auth.schema_migrations (version) VALUES ('20221208132122');
INSERT INTO auth.schema_migrations (version) VALUES ('20221215195500');
INSERT INTO auth.schema_migrations (version) VALUES ('20221215195800');
INSERT INTO auth.schema_migrations (version) VALUES ('20221215195900');
INSERT INTO auth.schema_migrations (version) VALUES ('20230116124310');
INSERT INTO auth.schema_migrations (version) VALUES ('20230116124412');
INSERT INTO auth.schema_migrations (version) VALUES ('20230131181311');
INSERT INTO auth.schema_migrations (version) VALUES ('20230322519590');
INSERT INTO auth.schema_migrations (version) VALUES ('20230402418590');
INSERT INTO auth.schema_migrations (version) VALUES ('20230411005111');
INSERT INTO auth.schema_migrations (version) VALUES ('20230508135423');
INSERT INTO auth.schema_migrations (version) VALUES ('20230523124323');
INSERT INTO auth.schema_migrations (version) VALUES ('20230818113222');
INSERT INTO auth.schema_migrations (version) VALUES ('20230914180801');
INSERT INTO auth.schema_migrations (version) VALUES ('20231027141322');
INSERT INTO auth.schema_migrations (version) VALUES ('20231114161723');
INSERT INTO auth.schema_migrations (version) VALUES ('20231117164230');
INSERT INTO auth.schema_migrations (version) VALUES ('20240115144230');
INSERT INTO auth.schema_migrations (version) VALUES ('20240214120130');
INSERT INTO auth.schema_migrations (version) VALUES ('20240306115329');
INSERT INTO auth.schema_migrations (version) VALUES ('20240314092811');
INSERT INTO auth.schema_migrations (version) VALUES ('20240427152123');
INSERT INTO auth.schema_migrations (version) VALUES ('20240612123726');
INSERT INTO auth.schema_migrations (version) VALUES ('20240729123726');
INSERT INTO auth.schema_migrations (version) VALUES ('20240802193726');
INSERT INTO auth.schema_migrations (version) VALUES ('20240806073726');
INSERT INTO auth.schema_migrations (version) VALUES ('20241009103726');
INSERT INTO auth.schema_migrations (version) VALUES ('20250717082212');
INSERT INTO auth.schema_migrations (version) VALUES ('20250731150234');
INSERT INTO auth.schema_migrations (version) VALUES ('20250804100000');
INSERT INTO auth.schema_migrations (version) VALUES ('20250901200500');
INSERT INTO auth.schema_migrations (version) VALUES ('20250903112500');
INSERT INTO auth.schema_migrations (version) VALUES ('20250904133000');
INSERT INTO auth.schema_migrations (version) VALUES ('20250925093508');
INSERT INTO auth.schema_migrations (version) VALUES ('20251007112900');
INSERT INTO auth.schema_migrations (version) VALUES ('20251104100000');
INSERT INTO auth.schema_migrations (version) VALUES ('20251111201300');
INSERT INTO auth.schema_migrations (version) VALUES ('20251201000000');
INSERT INTO auth.schema_migrations (version) VALUES ('20260115000000');
INSERT INTO auth.schema_migrations (version) VALUES ('20260121000000');
INSERT INTO auth.schema_migrations (version) VALUES ('20260219120000');
INSERT INTO auth.schema_migrations (version) VALUES ('20260302000000');


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

INSERT INTO public.users (id, nama, role, total_points, created_at, avatar_url) VALUES ('00000000-0000-0000-0000-000000000002', 'Pris', 'adventurer', 210, '2026-05-26 12:18:42.133931+00', NULL);
INSERT INTO public.users (id, nama, role, total_points, created_at, avatar_url) VALUES ('00000000-0000-0000-0000-000000000003', 'Ervan', 'adventurer', 185, '2026-05-26 12:18:42.216467+00', NULL);
INSERT INTO public.users (id, nama, role, total_points, created_at, avatar_url) VALUES ('00000000-0000-0000-0000-000000000005', 'Santi', 'adventurer', 155, '2026-05-26 12:18:42.287375+00', NULL);
INSERT INTO public.users (id, nama, role, total_points, created_at, avatar_url) VALUES ('00000000-0000-0000-0000-000000000006', 'Christian', 'adventurer', 300, '2026-05-26 12:18:42.318098+00', NULL);
INSERT INTO public.users (id, nama, role, total_points, created_at, avatar_url) VALUES ('00000000-0000-0000-0000-000000000007', 'Bruno', 'adventurer', 90, '2026-05-26 12:18:42.374789+00', NULL);
INSERT INTO public.users (id, nama, role, total_points, created_at, avatar_url) VALUES ('00000000-0000-0000-0000-000000000001', 'Reza', 'guild_master', 340, '2026-05-26 12:18:42.086722+00', 'https://tbbrzfbxqzlqqgvukwvu.supabase.co/storage/v1/object/public/avatars/00000000-0000-0000-0000-000000000001/00000000-0000-0000-0000-000000000001-1779811975155.png');
INSERT INTO public.users (id, nama, role, total_points, created_at, avatar_url) VALUES ('00000000-0000-0000-0000-000000000004', 'Siska', 'adventurer', 270, '2026-05-26 12:18:42.249947+00', 'https://tbbrzfbxqzlqqgvukwvu.supabase.co/storage/v1/object/public/avatars/00000000-0000-0000-0000-000000000004/00000000-0000-0000-0000-000000000004-1779873998167.jpg');


--
-- Data for Name: quests; Type: TABLE DATA; Schema: public; Owner: postgres
--

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


--
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.attachments (id, quest_id, file_url, file_type, uploaded_by, uploaded_at) VALUES ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'https://storage.example.com/attachments/ac-icu-before.jpg', 'image/jpeg', '00000000-0000-0000-0000-000000000006', '2026-05-24 12:18:42.275+00');
INSERT INTO public.attachments (id, quest_id, file_url, file_type, uploaded_by, uploaded_at) VALUES ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'https://storage.example.com/attachments/ac-icu-after.jpg', 'image/jpeg', '00000000-0000-0000-0000-000000000006', '2026-05-24 12:18:42.275+00');
INSERT INTO public.attachments (id, quest_id, file_url, file_type, uploaded_by, uploaded_at) VALUES ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'https://storage.example.com/attachments/quotation-genset-vendor-a.pdf', 'application/pdf', '00000000-0000-0000-0000-000000000004', '2026-05-25 12:18:42.275+00');
INSERT INTO public.attachments (id, quest_id, file_url, file_type, uploaded_by, uploaded_at) VALUES ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003', 'https://storage.example.com/attachments/quotation-genset-vendor-b.pdf', 'application/pdf', '00000000-0000-0000-0000-000000000004', '2026-05-25 12:18:42.275+00');
INSERT INTO public.attachments (id, quest_id, file_url, file_type, uploaded_by, uploaded_at) VALUES ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006', 'https://storage.example.com/attachments/laporan-maintenance-mei-2026.pdf', 'application/pdf', '00000000-0000-0000-0000-000000000005', '2026-05-22 12:18:42.275+00');
INSERT INTO public.attachments (id, quest_id, file_url, file_type, uploaded_by, uploaded_at) VALUES ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000007', 'https://storage.example.com/attachments/cctv-instalasi.jpg', 'image/jpeg', '00000000-0000-0000-0000-000000000006', '2026-05-25 12:18:42.275+00');
INSERT INTO public.attachments (id, quest_id, file_url, file_type, uploaded_by, uploaded_at) VALUES ('39739b73-c9c8-4028-a8a9-a0fbf25abee0', 'a0000000-0000-0000-0000-000000000009', 'https://tbbrzfbxqzlqqgvukwvu.supabase.co/storage/v1/object/public/attachments/a0000000-0000-0000-0000-000000000009/1779857116072_umi0vkyk8i.png', 'image/png', '00000000-0000-0000-0000-000000000004', '2026-05-27 04:45:17.171273+00');
INSERT INTO public.attachments (id, quest_id, file_url, file_type, uploaded_by, uploaded_at) VALUES ('3213c263-58cf-47fa-a6ca-51912fd32377', 'a0000000-0000-0000-0000-000000000009', 'https://tbbrzfbxqzlqqgvukwvu.supabase.co/storage/v1/object/public/attachments/a0000000-0000-0000-0000-000000000009/1779857117107_1phjtb833pd.jpg', 'image/jpeg', '00000000-0000-0000-0000-000000000004', '2026-05-27 04:45:17.773986+00');


--
-- Data for Name: guild_chat; Type: TABLE DATA; Schema: public; Owner: postgres
--

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


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.notifications (id, user_id, title, message, link, is_read, created_at) VALUES ('94c1278b-3d11-4719-ba4e-9945ff1ebebd', '00000000-0000-0000-0000-000000000001', 'Peringatan Deadline', 'Quest Mencari Herb Obat telah melewati deadline.', NULL, true, '2026-05-26 16:22:20.017155+00');
INSERT INTO public.notifications (id, user_id, title, message, link, is_read, created_at) VALUES ('87dffee7-f6e7-4016-98b6-b067b9b0b8b5', '00000000-0000-0000-0000-000000000001', 'Quest Selesai', 'Kirito telah menyelesaikan quest Membasmi Slime.', NULL, true, '2026-05-26 16:22:20.017155+00');
INSERT INTO public.notifications (id, user_id, title, message, link, is_read, created_at) VALUES ('e2cb8c55-112e-4018-be73-578c81afc2ad', '00000000-0000-0000-0000-000000000001', 'Submission Baru', 'Asuna mengirimkan laporan progress quest.', NULL, true, '2026-05-26 16:22:20.017155+00');


--
-- Data for Name: point_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.point_logs (id, user_id, quest_id, delta, reason, created_at) VALUES ('c0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 120, 'Quest approved: Perbaikan AC ICU Bella', '2026-05-24 12:18:42.275+00');
INSERT INTO public.point_logs (id, user_id, quest_id, delta, reason, created_at) VALUES ('c0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006', 70, 'Quest approved: Laporan bulanan maintenance Mei', '2026-05-23 12:18:42.275+00');
INSERT INTO public.point_logs (id, user_id, quest_id, delta, reason, created_at) VALUES ('c0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 30, 'Bonus GM: detail quest lengkap sebelum 21:00', '2026-05-22 12:18:42.275+00');
INSERT INTO public.point_logs (id, user_id, quest_id, delta, reason, created_at) VALUES ('c0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 30, 'Bonus GM: detail quest lengkap sebelum 21:00', '2026-05-19 12:18:42.275+00');
INSERT INTO public.point_logs (id, user_id, quest_id, delta, reason, created_at) VALUES ('c0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', -20, 'Penalti GM: detail quest belum lengkap melewati 00:00', '2026-05-26 07:18:42.275+00');
INSERT INTO public.point_logs (id, user_id, quest_id, delta, reason, created_at) VALUES ('c0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000010', -20, 'Penalti GM: detail quest belum lengkap melewati 00:00', '2026-05-26 11:18:42.275+00');


--
-- Data for Name: quest_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) VALUES ('attachments', 'attachments', NULL, '2026-05-26 12:18:57.786416+00', '2026-05-26 12:18:57.786416+00', true, false, 10485760, '{image/jpeg,image/png,application/pdf}', NULL, 'STANDARD');
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) VALUES ('avatars', 'avatars', NULL, '2026-05-26 16:12:18.937224+00', '2026-05-26 16:12:18.937224+00', true, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (0, 'create-migrations-table', 'e18db593bcde2aca2a408c4d1100f6abba2195df', '2026-05-26 10:11:38.917051');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (1, 'initialmigration', '6ab16121fbaa08bbd11b712d05f358f9b555d777', '2026-05-26 10:11:38.951038');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (2, 'storage-schema', 'f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd', '2026-05-26 10:11:38.954782');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (3, 'pathtoken-column', '2cb1b0004b817b29d5b0a971af16bafeede4b70d', '2026-05-26 10:11:38.979584');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (4, 'add-migrations-rls', '427c5b63fe1c5937495d9c635c263ee7a5905058', '2026-05-26 10:11:38.992043');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (5, 'add-size-functions', '79e081a1455b63666c1294a440f8ad4b1e6a7f84', '2026-05-26 10:11:38.994574');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (6, 'change-column-name-in-get-size', 'ded78e2f1b5d7e616117897e6443a925965b30d2', '2026-05-26 10:11:38.997898');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (7, 'add-rls-to-buckets', 'e7e7f86adbc51049f341dfe8d30256c1abca17aa', '2026-05-26 10:11:39.001282');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (8, 'add-public-to-buckets', 'fd670db39ed65f9d08b01db09d6202503ca2bab3', '2026-05-26 10:11:39.003955');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (9, 'fix-search-function', 'af597a1b590c70519b464a4ab3be54490712796b', '2026-05-26 10:11:39.006938');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (10, 'search-files-search-function', 'b595f05e92f7e91211af1bbfe9c6a13bb3391e16', '2026-05-26 10:11:39.010647');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (11, 'add-trigger-to-auto-update-updated_at-column', '7425bdb14366d1739fa8a18c83100636d74dcaa2', '2026-05-26 10:11:39.014567');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (12, 'add-automatic-avif-detection-flag', '8e92e1266eb29518b6a4c5313ab8f29dd0d08df9', '2026-05-26 10:11:39.01795');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (13, 'add-bucket-custom-limits', 'cce962054138135cd9a8c4bcd531598684b25e7d', '2026-05-26 10:11:39.021821');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (14, 'use-bytes-for-max-size', '941c41b346f9802b411f06f30e972ad4744dad27', '2026-05-26 10:11:39.024892');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (15, 'add-can-insert-object-function', '934146bc38ead475f4ef4b555c524ee5d66799e5', '2026-05-26 10:11:39.048384');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (16, 'add-version', '76debf38d3fd07dcfc747ca49096457d95b1221b', '2026-05-26 10:11:39.051553');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (17, 'drop-owner-foreign-key', 'f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101', '2026-05-26 10:11:39.054361');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (18, 'add_owner_id_column_deprecate_owner', 'e7a511b379110b08e2f214be852c35414749fe66', '2026-05-26 10:11:39.05725');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (19, 'alter-default-value-objects-id', '02e5e22a78626187e00d173dc45f58fa66a4f043', '2026-05-26 10:11:39.062535');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (20, 'list-objects-with-delimiter', 'cd694ae708e51ba82bf012bba00caf4f3b6393b7', '2026-05-26 10:11:39.065694');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (21, 's3-multipart-uploads', '8c804d4a566c40cd1e4cc5b3725a664a9303657f', '2026-05-26 10:11:39.07246');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (22, 's3-multipart-uploads-big-ints', '9737dc258d2397953c9953d9b86920b8be0cdb73', '2026-05-26 10:11:39.086724');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (23, 'optimize-search-function', '9d7e604cddc4b56a5422dc68c9313f4a1b6f132c', '2026-05-26 10:11:39.095935');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (24, 'operation-function', '8312e37c2bf9e76bbe841aa5fda889206d2bf8aa', '2026-05-26 10:11:39.098888');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (25, 'custom-metadata', 'd974c6057c3db1c1f847afa0e291e6165693b990', '2026-05-26 10:11:39.101972');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (26, 'objects-prefixes', '215cabcb7f78121892a5a2037a09fedf9a1ae322', '2026-05-26 10:11:39.10585');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (27, 'search-v2', '859ba38092ac96eb3964d83bf53ccc0b141663a6', '2026-05-26 10:11:39.108669');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (28, 'object-bucket-name-sorting', 'c73a2b5b5d4041e39705814fd3a1b95502d38ce4', '2026-05-26 10:11:39.112959');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (29, 'create-prefixes', 'ad2c1207f76703d11a9f9007f821620017a66c21', '2026-05-26 10:11:39.115432');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (30, 'update-object-levels', '2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6', '2026-05-26 10:11:39.117744');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (31, 'objects-level-index', 'b40367c14c3440ec75f19bbce2d71e914ddd3da0', '2026-05-26 10:11:39.120883');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (32, 'backward-compatible-index-on-objects', 'e0c37182b0f7aee3efd823298fb3c76f1042c0f7', '2026-05-26 10:11:39.123428');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (33, 'backward-compatible-index-on-prefixes', 'b480e99ed951e0900f033ec4eb34b5bdcb4e3d49', '2026-05-26 10:11:39.125981');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (34, 'optimize-search-function-v1', 'ca80a3dc7bfef894df17108785ce29a7fc8ee456', '2026-05-26 10:11:39.129776');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (35, 'add-insert-trigger-prefixes', '458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc', '2026-05-26 10:11:39.133268');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (36, 'optimise-existing-functions', '6ae5fca6af5c55abe95369cd4f93985d1814ca8f', '2026-05-26 10:11:39.138091');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (37, 'add-bucket-name-length-trigger', '3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1', '2026-05-26 10:11:39.141236');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (38, 'iceberg-catalog-flag-on-buckets', '02716b81ceec9705aed84aa1501657095b32e5c5', '2026-05-26 10:11:39.147087');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (39, 'add-search-v2-sort-support', '6706c5f2928846abee18461279799ad12b279b78', '2026-05-26 10:11:39.157395');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (40, 'fix-prefix-race-conditions-optimized', '7ad69982ae2d372b21f48fc4829ae9752c518f6b', '2026-05-26 10:11:39.160363');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (41, 'add-object-level-update-trigger', '07fcf1a22165849b7a029deed059ffcde08d1ae0', '2026-05-26 10:11:39.165155');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (42, 'rollback-prefix-triggers', '771479077764adc09e2ea2043eb627503c034cd4', '2026-05-26 10:11:39.167692');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (43, 'fix-object-level', '84b35d6caca9d937478ad8a797491f38b8c2979f', '2026-05-26 10:11:39.170182');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (44, 'vector-bucket-type', '99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3', '2026-05-26 10:11:39.172719');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (45, 'vector-buckets', '049e27196d77a7cb76497a85afae669d8b230953', '2026-05-26 10:11:39.181605');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (46, 'buckets-objects-grants', 'fedeb96d60fefd8e02ab3ded9fbde05632f84aed', '2026-05-26 10:11:39.196006');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (47, 'iceberg-table-metadata', '649df56855c24d8b36dd4cc1aeb8251aa9ad42c2', '2026-05-26 10:11:39.199292');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (48, 'iceberg-catalog-ids', 'e0e8b460c609b9999ccd0df9ad14294613eed939', '2026-05-26 10:11:39.202188');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (49, 'buckets-objects-grants-postgres', '072b1195d0d5a2f888af6b2302a1938dd94b8b3d', '2026-05-26 10:11:39.218183');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (50, 'search-v2-optimised', '6323ac4f850aa14e7387eb32102869578b5bd478', '2026-05-26 10:11:39.225012');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (51, 'index-backward-compatible-search', '2ee395d433f76e38bcd3856debaf6e0e5b674011', '2026-05-26 10:11:39.423888');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (52, 'drop-not-used-indexes-and-functions', '5cc44c8696749ac11dd0dc37f2a3802075f3a171', '2026-05-26 10:11:39.427565');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (53, 'drop-index-lower-name', 'd0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854', '2026-05-26 10:11:39.437604');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (54, 'drop-index-object-level', '6289e048b1472da17c31a7eba1ded625a6457e67', '2026-05-26 10:11:39.439615');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (55, 'prevent-direct-deletes', '262a4798d5e0f2e7c8970232e03ce8be695d5819', '2026-05-26 10:11:39.440695');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (56, 'fix-optimized-search-function', 'b823ed1e418101032fa01374edc9a436e54e3ed4', '2026-05-26 10:11:39.446204');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (57, 's3-multipart-uploads-metadata', 'f127886e00d1b374fadbc7c6b31e09336aad5287', '2026-05-26 10:11:39.453293');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (58, 'operation-ergonomics', '00ca5d483b3fe0d522133d9002ccc5df98365120', '2026-05-26 10:11:39.45714');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (59, 'drop-unused-functions', '38456f13e39691c2bbb4b5151d0d1cdbabd4a8c4', '2026-05-26 10:11:39.465007');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (60, 'optimize-existing-functions-again', 'db35e1c91a9201e59f4fef8d972c2f277d68b157', '2026-05-26 10:11:39.471217');


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) VALUES ('86b9e711-be99-4ab9-9778-d880e5bcf343', 'avatars', '00000000-0000-0000-0000-000000000001/00000000-0000-0000-0000-000000000001-1779811975155.png', '00000000-0000-0000-0000-000000000001', '2026-05-26 16:12:56.173572+00', '2026-05-26 16:12:56.173572+00', '2026-05-26 16:12:56.173572+00', '{"eTag": "\"636eb94d533fc3a6339db59c442a3f70\"", "size": 112525, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-26T16:12:57.000Z", "contentLength": 112525, "httpStatusCode": 200}', '90e3a04e-10d9-4882-b311-e1bad477af54', '00000000-0000-0000-0000-000000000001', '{}');
INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) VALUES ('9799c2af-75dc-4a6e-bc35-50a53f2a52ef', 'attachments', 'a0000000-0000-0000-0000-000000000009/1779857116072_umi0vkyk8i.png', '00000000-0000-0000-0000-000000000004', '2026-05-27 04:45:16.97636+00', '2026-05-27 04:45:16.97636+00', '2026-05-27 04:45:16.97636+00', '{"eTag": "\"636eb94d533fc3a6339db59c442a3f70\"", "size": 112525, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-27T04:45:17.000Z", "contentLength": 112525, "httpStatusCode": 200}', 'b8b336a1-419c-47ad-86ff-b50c305639ea', '00000000-0000-0000-0000-000000000004', '{}');
INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) VALUES ('7703a2a1-4409-44c3-9d66-c109713550ee', 'attachments', 'a0000000-0000-0000-0000-000000000009/1779857117107_1phjtb833pd.jpg', '00000000-0000-0000-0000-000000000004', '2026-05-27 04:45:17.71326+00', '2026-05-27 04:45:17.71326+00', '2026-05-27 04:45:17.71326+00', '{"eTag": "\"ae3558016f0ebac6751dce0f91ea3f1b\"", "size": 397270, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-27T04:45:18.000Z", "contentLength": 397270, "httpStatusCode": 200}', '8da2fc23-645f-4811-9d56-296d6beb02d7', '00000000-0000-0000-0000-000000000004', '{}');
INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) VALUES ('e2289a0e-1ffd-480a-82fb-de25fc4283a6', 'avatars', '00000000-0000-0000-0000-000000000004/00000000-0000-0000-0000-000000000004-1779873991801.png', '00000000-0000-0000-0000-000000000004', '2026-05-27 09:26:32.449613+00', '2026-05-27 09:26:32.449613+00', '2026-05-27 09:26:32.449613+00', '{"eTag": "\"636eb94d533fc3a6339db59c442a3f70\"", "size": 112525, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-27T09:26:33.000Z", "contentLength": 112525, "httpStatusCode": 200}', '9796cc64-bb08-41c1-8adc-a64329975694', '00000000-0000-0000-0000-000000000004', '{}');
INSERT INTO storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) VALUES ('5f2c3b06-ddf1-4d63-91c3-fcfc72b0b1ab', 'avatars', '00000000-0000-0000-0000-000000000004/00000000-0000-0000-0000-000000000004-1779873998167.jpg', '00000000-0000-0000-0000-000000000004', '2026-05-27 09:26:38.735544+00', '2026-05-27 09:26:38.735544+00', '2026-05-27 09:26:38.735544+00', '{"eTag": "\"ae3558016f0ebac6751dce0f91ea3f1b\"", "size": 397270, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-27T09:26:39.000Z", "contentLength": 397270, "httpStatusCode": 200}', '4d7bf663-2e40-49e2-92ee-cbbdab96c319', '00000000-0000-0000-0000-000000000004', '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 100, true);


--
-- PostgreSQL database dump complete
--

\unrestrict AVebaddAss7DUHP4O0oibzTEkgRZ8y5D6zpebADuU4fcK7iNtTnbn0qsNhWApKr

