# SGD Guild Secretary — Product Requirements Document (Final)
**Version:** 3.0 (Kombinasi v1 & Revisi Pak Reza)  
**Status:** Draft / Trial Season 1  
**Owner:** Guild Master Reza  
**Stack:** Next.js · TailwindCSS · PostgreSQL (Prisma/Supabase) · N8N · OpenRouter API · VPS (4GB) · Custom Domain

---

## 1. Ringkasan Produk

**SGD Guild Secretary** adalah sistem *task management* berbasis struktur guild RPG untuk tim operasional SGD Care. Aplikasi ini berfungsi sebagai *sekretaris digital* yang mencatat, mengawasi, dan memvalidasi seluruh quest operasional harian.

> *Bukan game yang pura-pura jadi kerja — melainkan sistem kerja nyata yang dibuat lebih jelas, lebih hidup, dan lebih engaging.*

### Tujuan Utama
1. **Memperjelas delegasi tugas** dengan memisahkan level strategis dan taktis.
2. **Meningkatkan accountability** melalui kebiasaan reporting dengan bukti nyata.
3. **Membangun *operational memory*** agar file/dokumen tidak hilang di grup WhatsApp.
4. **Mengurangi mental overload Guild Master** dengan pendelegasian terstruktur.
5. **Menciptakan ritme kerja terukur** dengan gamifikasi poin dan *Leaderboard*.

---

## 2. Struktur Hierarki Operasional

Sistem menggunakan hierarki 3 tingkat agar menjadi pusat komando dan memori organisasi.

**Arc → Project → Quest → Updates / Proof / Approval**

### 2.1. Arc (Strategic Storyline)
- Wadah kampanye strategis atau alur cerita besar perusahaan.
- **Contoh:** *RS Bella Support Arc*, *Internal System Building*.
- **Halaman Arc:** Menampilkan objektif strategis, *health* proyek di bawahnya, dan **Arc Vault**.

### 2.2. Project (Operational Battlefield)
- Wadah operasional di bawah sebuah Arc.
- **Contoh:** *AC Preventive Maintenance June*, *Follow-up Quotation Genset*.
- **Halaman Project:** Menampilkan klasifikasi proyek (Client/Internal), tanggal target, daftar Quest aktif, dan **Project Vault**.

### 2.3. Quest (Executable Command)
- Tugas nyata yang ditugaskan kepada anggota.
- Terhubung ke Project.
- Berisi instruksi, kriteria sukses (*definition of done*), deadline, dan *reward points*.

### 2.4. Vault (Command Archive)
- *Information dump area* pada halaman Arc dan Project.
- **Tujuan:** Menyimpan MoM, kontrak, SOW, foto, dan invoice secara terorganisir.
- **Metadata:** Title, Type, Uploaded By, Date, Summary, Attachment Link.

---

## 3. Pengguna & Peran (Role Permissions)

| Role | Ability / Hak Akses | Pemegang Saat Ini |
|------|---------------------|-------------------|
| **Guild Master (GM)** | Create, edit, approve, reject, abort, cancel, hold, resume, manual point adjust, add members. | Reza |
| **Guild Secretary** | Create draft, bantu lengkapi detail, edit administratif, add member. | Bruno |
| **Quest Giver** | Create quest, approve own quest, hold / cancel own quest. | - |
| **Adventurer** | View assigned quest, update progress, upload proof, submit quest. | Pris, Ervan, Siska, Santi, Christian |

---

## 4. Alur & Status Quest

### 4.1. Core Loop MVP
```
Buat Quest → Assigned → Review 21:00 → Midnight Penalty (jika instruksi tdk lengkap)
                               ↓
Adventurer Kerja → Update Log → Submit (via Proof) → Approve / Reject → Poin Cair
```

### 4.2. Status Operasional (Quest Status)
| Status | Penjelasan |
|--------|------------|
| `Draft` | Quest dibuat tapi belum live/ditugaskan. |
| `Active*` | Quest live & ditugaskan, tapi **instruksi/detail belum lengkap**. |
| `Active` | Quest berjalan normal, detail sudah lengkap. |
| `Hold` | Quest dijeda karena menunggu pihak lain (deadline/penalti stop). |
| `Submitted`| Adventurer sudah upload bukti, menunggu approval GM. |
| `Approved` | Quest diterima, reward poin diberikan. |
| `Rejected` | Bukti ditolak, quest kembali untuk direvisi (Wajib isi alasan penolakan). |
| `Completed`| State akhir yang diselesaikan otomatis pasca-approve. |
| `Cancelled`| Batal secara normal karena sudah tidak perlu. |
| `Aborted` | Batal paksa darurat karena risiko tinggi / arah salah (Hanya GM). |

### 4.3. Action Khusus
- **Hold:** GM wajib memasukkan alasan hold, pihak penahan (contoh: klien/vendor), dan waktu mulai. Saat di-*resume*, sistem akan meminta perpanjangan deadline.
- **Abort:** GM wajib mengetik "ABORT" untuk konfirmasi. Wajib isi kategori abort, alasan, dan perlakuan poin (contoh: kompensasi parsial).

### 4.4. Operational Update Log & Proof
- **Update Log:** Setiap update kerja mencatat Waktu, User, Teks, dan Lampiran.
- **Proof Requirement:** Quest tidak bisa di-submit tanpa lampiran (PDF/Foto/Screenshot).

---

## 5. Sistem Poin & Detail Completion Rules

### 5.1. Evening Review & Midnight Penalty
- **Jam 21:00:** Jika detail quest (tujuan, deadline, poin) sudah dilengkapi GM sebelum jam ini, GM mendapat **Bonus Poin**. Jika ada quest berstatus `Active*` (belum lengkap), GM dapat warning.
- **Jam 00:00:** Jika ada quest `Active*` belum lengkap, GM terkena **Pengurangan Poin (Penalty)**.

### 5.2. Aturan Reward & Manual Point Correction
- Adventurer mendapat poin jika quest berstatus `Approved`.
- **Manual Point:** GM bisa mengedit poin anggota (contoh: kompensasi task offline, penalti perilaku, kompensasi quest abort). Fitur ini memiliki log alasan dan pencatat (*Adjusted by*).

### 5.3. Sistem Difficulty Rank
F (Rutin), E (Basic), D (Standar), C (Skill-based), B (Koordinasi penting), A (High responsibility), S (Strategic/Rare).

---

## 6. Dasbor & Leaderboard

### 6.1. Guild Master Dashboard
- Active Quest list, Overdue quest (merah), Quest `Active*`, Pending Approval Queue, Poin Harian GM.

### 6.2. Adventurer Dashboard (My Tasks View)
- My Quests Today, My Overdue Quests, My Quests This Week.
- Waiting Approval, Rejected Quests (Butuh revisi).
- Total Poin Kumulatif.

### 6.3. Leaderboards (Pengganti Menu Guild)
- Ranking Mingguan, Bulanan, Season, dan All-Time.
- Kategori khusus: *Top Quest Completers*, *Most Improved Member*.

---

## 7. Administrasi & Notifikasi

### 7.1. Add New Member
- Fitur di Dasbor untuk GM / Secretary mendaftarkan anggota baru.
- Field: Nama, Email, Role, Divisi, Level awal, Hak Create/Approve.

### 7.2. Trigger Notifikasi (In-App & Email)
- Fitur notifikasi *dual-channel* menggunakan Microsoft 365 / Email API (Resend/Mailgun).
- **Triggers:**
  - Quest ditugaskan (In-app + Email)
  - Deadline mendekat (In-app)
  - Quest overdue (In-app + Email)
  - Quest Submitted / Approved / Rejected (In-app + Email)
  - Warning Detail 21:00 & 00:00 (In-app + Email khusus GM)
  - Hold / Resume / Abort (In-app + Email)
- Terdapat **Email Log** di Dasbor Admin untuk melacak email gagal terkirim.

---

## 8. N8N Automation Flows & AI

### 8.1. N8N Automations
1. **Evening Review (21:00):** Cron job deteksi `Active*` → Notif ke GM.
2. **Midnight Penalty (00:00):** Cron job deteksi `Active*` → Tarik poin GM → Notif.
3. **Bonus GM:** Webhook saat quest dilengkapi < 21:00 → Tambah poin GM.

### 8.2. OpenRouter API (Opsional / Helper AI)
Dapat dipanggil (misal: Mistral-7b atau Claude-3) untuk:
- *Auto-suggest success criteria* saat pembuatan quest.
- *Task summarization* dari rentetan log operasional.

---

## 9. Arah Visual & Desain

- **Vibe:** Guild administration + tactical operation board. Premium fantasy minimalis.
- **Inspirasi:** Darkest Dungeon, military journal, RPG logbook.
- **Palet Warna:** Navy Deep Blue (`#1B2E52`), SGD Gold (`#C9A227`), Off-White (`#F5F3EE`), Teal Success (`#0F6E56`), Coral Red Danger (`#993C1D`).
- **Hindari:** Efek visual/neon berlebihan, UI anime/MMORPG terlalu mencolok.

---

## 10. Rekomendasi Peluncuran & KPI

### 10.1. Peluncuran: Guild Trial Season 1
- **DO NOT launch as a full company system immediately.**
- **Durasi Trial:** 2–4 minggu.
- **User:** Reza, Bruno, Siska, Ervan, Pris, Santi, Christian.
- **Fokus Tes:** Validasi status `Active*`, kelancaran *proof upload*, *Hold/Abort flow*, keadilan sistem penalti, dan resistensi Leaderboard.

### 10.2. KPI Keberhasilan
- Direct report membuka aplikasi ≥ 80% hari kerja.
- Laporan dengan bukti (attachment) mencapai > 70%.
- Task overdue berada di angka < 20%.
- Koordinasi via WhatsApp berkurang signifikan.
- Tingkat stres / mental load GM berkurang (self-reported).

---

## 11. Arsitektur Database (Gambaran Utama Update)

*Catatan: Sistem lama sudah ada (Users, Quests, Attachments, Point_logs). Di versi ini akan di-upgrade skemanya.*

- **Model Arc:** id, name, strategic_objective, status.
- **Model Project:** id, arc_id, name, target_date, status, health.
- **Model Quest:** *Dihubungkan ke Project*, penambahan field status (`Hold`, `Aborted`), kolom *DetailStatus* (`Complete`, `Kurang`), dan field alasan (`rejection_reason`, `hold_reason`, `abort_reason`).
- **Model VaultItem:** id, type, file_url, title, uploaded_by, terkait_ke (Arc/Project).
- **Model EmailLog:** id, recipient, type, status (Success/Failed).

---
*Dokumen ini adalah cetak biru untuk pengembangan lanjutan (V2) dari SGD Guild Secretary.*
