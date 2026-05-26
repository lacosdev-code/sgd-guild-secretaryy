# SGD Guild Secretary — Product Requirements Document
**Version:** 1.0 MVP  
**Status:** Draft  
**Owner:** Guild Master Reza  
**Stack:** Next.js · TailwindCSS · Supabase · N8N · OpenRouter API · VPS (4GB) · Custom Domain

---

## 1. Ringkasan Produk

**SGD Guild Secretary** adalah sistem task management berbasis struktur guild RPG untuk tim operasional SGD Care. Aplikasi ini berfungsi sebagai *sekretaris digital* yang mencatat, mengawasi, dan memvalidasi seluruh quest operasional harian.

> Bukan game yang pura-pura jadi kerja — melainkan sistem kerja nyata yang dibuat lebih jelas, lebih hidup, dan lebih engaging.

### Tujuan Utama

| # | Tujuan |
|---|--------|
| 1 | Memperjelas delegasi tugas |
| 2 | Meningkatkan accountability direct report |
| 3 | Membangun budaya reporting dengan bukti |
| 4 | Mengurangi mental overload Guild Master |
| 5 | Menciptakan ritme kerja harian yang sehat dan terukur |

---

## 2. Pengguna & Peran

### Guild Master
- **Saat ini:** Reza
- Membuat dan mendefinisikan quest
- Assign PIC ke Adventurer
- Approve / Reject / Revise quest submission
- Terkena sistem penalti jika quest tidak terdefinisi dengan baik

### Adventurer
- **Saat ini:** Pris, Ervan, Siska, Santi, Christian, Bruno, Reza
- Menjalankan quest yang ditugaskan
- Upload bukti penyelesaian
- Submit quest untuk di-approve Guild Master
- Menerima SGD Points atas quest yang approved

---

## 3. Core Loop MVP

```
GM buat quest → GM assign PIC → Review 21:00 → Penalti 00:00 (jika belum lengkap)
                                                       ↓
Adventurer jalankan quest → Upload bukti → Submit → GM approve → Points diberikan
```

### Step 1 — Pembuatan Quest

**Field wajib saat pembuatan:**
- Judul Quest
- PIC (Assigned Adventurer)

**Field opsional (wajib lengkap sebelum 00:00):**
- Deskripsi
- Deadline
- Tingkat kesulitan (F–S Rank)
- Success parameter / kriteria selesai
- SGD Points reward

### Step 2 — Evening Review (21:00)

- Sistem otomatis scan quest yang masih belum lengkap field-nya
- Guild Master menerima **warning notification** via push/WhatsApp/N8N
- **Tidak ada pengurangan poin** pada jam ini
- Berfungsi murni sebagai *"Evening Review Reminder"*

### Step 3 — Midnight Penalty (00:00)

- Jika quest masih belum lengkap detail-nya saat pergantian hari
- Guild Master terkena **pengurangan SGD Points**
- Tujuan: melatih kejelasan delegasi, mengurangi *perintah abu-abu*

### Step 4 — Bonus GM (Quest lengkap sebelum 21:00)

- Guild Master mendapat **tambahan SGD Points**
- Muncul **praise notification** otomatis
- Berlaku untuk kelengkapan *detail quest*, bukan penyelesaian quest operasional

---

## 4. Fitur & Spesifikasi

### 4.1 Quest Sheet — Tampilan Adventurer

Saat list quest dibuka, tampil seperti to-do list biasa. Saat quest diklik, halaman berubah menjadi **Quest Sheet RPG**.

**Contoh Quest Sheet:**

```
┌─────────────────────────────────────────────────────┐
│  ⚔  Perbaikan AC ICU Bella                [B Rank]  │
├─────────────────────────────────────────────────────┤
│  Quest Giver        Guild Master Reza               │
│  Assigned           Christian                       │
│  Deadline           26 Mei 2026 — 17:00             │
├─────────────────────────────────────────────────────┤
│  OBJECTIVE                                          │
│  Koordinasi dengan Bokir untuk memastikan           │
│  airflow ICU stabil.                                │
├─────────────────────────────────────────────────────┤
│  SUCCESS CRITERIA                                   │
│  ✓ Airflow stabil                                   │
│  ✓ Nurse confirmation                               │
│  ✓ Upload foto                                      │
│  ✓ Tidak ada complaint 24 jam                       │
├─────────────────────────────────────────────────────┤
│  REWARD            +120 SGD Points                  │
└─────────────────────────────────────────────────────┘
```

### 4.2 Status Quest

| Status | Arti |
|--------|------|
| `Draft` | Quest dibuat, detail belum lengkap |
| `Active` | Quest aktif, Adventurer sedang mengerjakan |
| `Submitted` | Adventurer sudah submit, menunggu approval |
| `Approved` | Quest selesai, poin diberikan |
| `Revise` | GM minta revisi / tambahan bukti |
| `Failed` | Gagal / melewati deadline tanpa completion |

### 4.3 Sistem Bukti Penyelesaian

Quest **tidak bisa disubmit** tanpa minimal 1 attachment.

**Format yang diterima:**
- Foto (JPG, PNG, HEIC)
- PDF (laporan, quotation, invoice)
- Screenshot (konfirmasi client, WhatsApp)
- Dokumen (Word, Excel)

### 4.4 Sistem Difficulty Rank

| Rank | Makna |
|------|-------|
| F | Task sederhana / rutin |
| E | Task basic operasional |
| D | Task operasional standar |
| C | Task skill-based |
| B | Task koordinasi penting |
| A | Task high responsibility |
| S | Strategic / critical / rare |

---

## 5. Dashboard

### Guild Master Dashboard
- Active quest list + status
- Overdue quest (merah / flagged)
- Quest dengan detail tidak lengkap
- Pending approval queue
- Poin harian GM

### Adventurer Dashboard
- Active quest yang di-assign
- Completed quest history
- Overdue quest
- Total SGD Points kumulatif

---

## 6. Sistem Points & Notifikasi

### Aturan Poin

| Event | Efek Poin |
|-------|-----------|
| Quest approved | Adventurer +Points (sesuai reward quest) |
| Quest detail lengkap sebelum 21:00 | GM +Bonus Points |
| Quest detail tidak lengkap saat 00:00 | GM −Penalty Points |
| Quest Failed / overdue | Adventurer tidak dapat poin |

### Notifikasi via N8N Automation

| Trigger | Target | Channel |
|---------|--------|---------|
| 21:00 — quest incomplete | Guild Master | Push / WA |
| 00:00 — penalti terjadi | Guild Master | Push / WA |
| Quest submitted | Guild Master | Push / WA |
| Quest approved | Adventurer | Push / WA |
| Quest revise/reject | Adventurer | Push / WA |
| Bonus points GM | Guild Master | In-app + Push |

---

## 7. Arsitektur Teknis

### Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js + TailwindCSS |
| Backend / Auth | Supabase (PostgreSQL + Auth + Storage) |
| Automation | N8N (self-hosted di VPS) |
| AI Assistant (opsional) | OpenRouter API (task summarization, suggestion) |
| Hosting | VPS 4GB (Coolify + Docker) + Custom Domain |
| File Storage | Supabase Storage |

### Struktur Database (Supabase)

**Tabel `users`**
```sql
id           uuid PRIMARY KEY
nama         text NOT NULL
role         text CHECK (role IN ('guild_master', 'adventurer'))
total_points integer DEFAULT 0
created_at   timestamp DEFAULT now()
```

**Tabel `quests`**
```sql
id                uuid PRIMARY KEY
title             text NOT NULL
description       text
assigned_to       uuid REFERENCES users(id)
created_by        uuid REFERENCES users(id)
difficulty        text CHECK (difficulty IN ('F','E','D','C','B','A','S'))
deadline          timestamp
success_parameter text
reward_points     integer
status            text DEFAULT 'Draft'
detail_completed  boolean DEFAULT false
detail_completed_at timestamp
created_at        timestamp DEFAULT now()
updated_at        timestamp DEFAULT now()
```

**Tabel `attachments`**
```sql
id         uuid PRIMARY KEY
quest_id   uuid REFERENCES quests(id)
file_url   text NOT NULL
file_type  text
uploaded_by uuid REFERENCES users(id)
uploaded_at timestamp DEFAULT now()
```

**Tabel `point_logs`**
```sql
id          uuid PRIMARY KEY
user_id     uuid REFERENCES users(id)
quest_id    uuid REFERENCES quests(id)
delta       integer NOT NULL  -- positif = reward, negatif = penalti
reason      text
created_at  timestamp DEFAULT now()
```

---

## 8. N8N Automation Flows

### Flow 1 — Evening Review (21:00 WIB)
```
Cron trigger 21:00 → Query Supabase (quest status=Active AND detail_completed=false)
→ Format notifikasi → Send WA / Push ke Guild Master
```

### Flow 2 — Midnight Penalty (00:00 WIB)
```
Cron trigger 00:00 → Query quest belum lengkap
→ Kurangi poin GM di tabel users + catat di point_logs
→ Update quest → Kirim notifikasi penalti ke GM
```

### Flow 3 — Bonus GM (Deteksi detail lengkap sebelum 21:00)
```
Webhook dari Supabase (event: detail_completed = true, waktu < 21:00)
→ Tambah bonus poin GM → Catat di point_logs → Kirim praise notification
```

### Flow 4 — Quest Submission Alert
```
Webhook Supabase (status → Submitted)
→ Notifikasi ke GM: "Quest X menunggu approval kamu"
```

---

## 9. OpenRouter API — Penggunaan Opsional

Digunakan untuk fitur AI-assist yang membantu tanpa menggantikan proses manual:

| Fitur | Prompt Contoh |
|-------|--------------|
| Auto-suggest success criteria | *"Bantu saya tulis success criteria untuk: {judul quest}"* |
| Ringkasan laporan harian | *"Rangkum status quest hari ini dalam 3 kalimat"* |
| Deteksi quest ambigu | *"Apakah deskripsi quest ini sudah cukup jelas?"* |

Model yang direkomendasikan via OpenRouter: `mistral-7b-instruct` (ringan + murah) atau `claude-3-haiku` untuk kualitas lebih tinggi.

---

## 10. Arah Visual & Desain

### Tone & Nuansa
- Guild administration + tactical operation board
- Expedition ledger — premium fantasy minimalis
- Terinspirasi: Darkest Dungeon, military journal, fantasy operation office

### Palet Warna (dari branding SGD Care)

| Peran | Warna | Hex |
|-------|-------|-----|
| Primary | Navy Deep Blue | `#1B2E52` |
| Accent | SGD Gold | `#C9A227` |
| Background | Off-White | `#F5F3EE` |
| Success | Teal | `#0F6E56` |
| Danger | Coral Red | `#993C1D` |
| Text | Charcoal | `#2C2C2A` |

### Hindari
- Cartoon / anime berlebihan
- MMORPG flashy UI (neon, particle effects)
- Gradasi berlebihan

---

## 11. KPI Keberhasilan MVP

MVP dianggap berhasil **bukan** berdasarkan jumlah fitur atau visual, melainkan:

| Indikator | Target |
|-----------|--------|
| Direct report buka app setiap hari | ≥ 80% hari kerja |
| Task lebih jelas (self-report) | Improvement dalam 2 minggu |
| Reporting dengan bukti meningkat | > 70% quest punya attachment |
| Quest terlupakan berkurang | < 20% quest overdue |
| WhatsApp coordination berkurang | Noticeable reduction |
| Mental load GM turun | Self-report dari Reza |

---

## 12. Scope MVP — In vs Out

### ✅ In Scope (MVP)
- Auth (Supabase Auth)
- Quest CRUD + status management
- Quest Sheet RPG tampilan
- File attachment untuk bukti
- Dashboard GM & Adventurer
- Sistem poin dasar
- N8N automation: reminder, penalti, bonus, notifikasi
- Mobile-responsive (Next.js PWA)

### ❌ Out of Scope (Post-MVP)
- Leaderboard publik
- Guild chat / messaging
- Sub-quest / quest chain
- Calendar view
- Integrasi kalender eksternal
- Mobile native app (React Native)
- Multi-guild / multi-organisasi

---

## 13. Timeline MVP (Estimasi)

| Fase | Minggu | Deliverable |
|------|--------|-------------|
| Setup & Auth | 1 | Supabase schema + Next.js auth |
| Quest CRUD | 2 | GM bisa buat & assign quest |
| Quest Sheet UI | 3 | Tampilan RPG, status flow |
| Attachment & Submit | 4 | Upload bukti, submit, approve |
| Points & Notif | 5 | N8N flows, poin GM & adventurer |
| Polish & Testing | 6 | Testing dengan tim SGD, bug fix |

---

*Dokumen ini adalah living document. Update seiring feedback dari tim SGD.*

**SGD Guild Secretary · MVP v1.0 · SGD Care Internal Tool**

---

## 14. Struktur Folder Repo

```
sgd-guild-secretary/
├── .env.local                    # Supabase URL, anon key, OpenRouter key
├── .env.example
├── next.config.js
├── tailwind.config.js
├── package.json
│
├── public/
│   └── icons/                   # PWA icons, rank badges (F–S)
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Redirect ke /login atau /dashboard
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx         # GM atau Adventurer dashboard (role-aware)
│   │   │   └── layout.tsx
│   │   ├── quests/
│   │   │   ├── page.tsx         # List semua quest
│   │   │   ├── new/
│   │   │   │   └── page.tsx     # Form buat quest baru
│   │   │   └── [id]/
│   │   │       ├── page.tsx     # Quest Sheet RPG detail
│   │   │       └── edit/
│   │   │           └── page.tsx # Edit quest (GM only)
│   │   └── profile/
│   │       └── page.tsx         # Poin history, profil adventurer
│   │
│   ├── components/
│   │   ├── ui/                  # Komponen generik (Button, Badge, Modal)
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── StatusPill.tsx
│   │   ├── quest/
│   │   │   ├── QuestCard.tsx    # Preview card di list
│   │   │   ├── QuestSheet.tsx   # Tampilan RPG lengkap
│   │   │   ├── QuestForm.tsx    # Form buat/edit quest
│   │   │   └── AttachmentUpload.tsx
│   │   ├── dashboard/
│   │   │   ├── GMDashboard.tsx
│   │   │   └── AdventurerDashboard.tsx
│   │   └── layout/
│   │       ├── Navbar.tsx
│   │       └── Sidebar.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts        # Supabase browser client
│   │   │   ├── server.ts        # Supabase server client (SSR)
│   │   │   └── types.ts         # Generated types dari Supabase
│   │   ├── openrouter.ts        # OpenRouter API helper
│   │   └── utils.ts             # Helper: format tanggal, rank color, dsb
│   │
│   ├── hooks/
│   │   ├── useUser.ts           # Auth + role check
│   │   ├── useQuests.ts         # Fetch & mutate quests
│   │   └── usePoints.ts         # Fetch point logs
│   │
│   └── types/
│       └── index.ts             # TypeScript types: Quest, User, Attachment, PointLog
│
├── supabase/
│   ├── migrations/
│   │   └── 001_init_schema.sql  # Schema awal semua tabel
│   └── seed/
│       ├── seed.sql             # Data dummy lengkap (users, quests, attachments, point_logs)
│       └── README.md            # Cara menjalankan seed
│
└── n8n/
    ├── flows/
    │   ├── evening-review.json       # Flow N8N: reminder 21:00
    │   ├── midnight-penalty.json     # Flow N8N: penalti 00:00
    │   ├── bonus-gm.json             # Flow N8N: bonus GM detail lengkap
    │   └── quest-submission-alert.json
    └── README.md                     # Cara import flow ke N8N
```

---

## 15. Data Dummy — Referensi

> File lengkap ada di `supabase/seed/seed.sql`

### Users (7 Adventurer + 1 GM)

| id (singkat) | nama | role | total_points |
|---|---|---|---|
| `u-001` | Reza | guild_master | 340 |
| `u-002` | Pris | adventurer | 210 |
| `u-003` | Ervan | adventurer | 185 |
| `u-004` | Siska | adventurer | 270 |
| `u-005` | Santi | adventurer | 155 |
| `u-006` | Christian | adventurer | 300 |
| `u-007` | Bruno | adventurer | 90 |

### Quests (10 quest lintas status)

| # | Judul | Assigned | Rank | Status | Poin |
|---|-------|----------|------|--------|------|
| 1 | Perbaikan AC ICU Bella | Christian | B | Approved | 120 |
| 2 | Cek kebocoran pipa lantai 3 | Ervan | D | Active | 60 |
| 3 | Pengajuan quotation genset | Siska | C | Submitted | 80 |
| 4 | Audit stok spare part AC | Pris | E | Active | 40 |
| 5 | Koordinasi vendor lift RSIA | Bruno | A | Draft | 150 |
| 6 | Laporan bulanan maintenance | Santi | D | Approved | 70 |
| 7 | Instalasi CCTV gudang baru | Christian | B | Revise | 100 |
| 8 | Pembersihan AHU rooftop | Ervan | D | Failed | 0 |
| 9 | Update SOP emergency genset | Siska | C | Active | 80 |
| 10 | Survey lokasi proyek Sunter | Pris | B | Draft | 110 |

### Point Logs (12 entri)

Mencakup skenario: reward approve, penalti GM tengah malam, bonus GM detail lengkap sebelum 21:00.

