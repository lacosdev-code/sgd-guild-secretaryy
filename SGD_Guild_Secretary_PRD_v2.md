# SGD Guild Secretary — Product Requirements Document v2.0
**Version:** 2.0 (Revision Recap)
**Status:** Draft / Trial Season 1
**Owner:** Guild Master Reza
**Stack:** Next.js · TailwindCSS · PostgreSQL (Prisma) · N8N · Custom Domain

---

## 1. Ringkasan Produk

**SGD Guild Secretary** adalah sistem *task management* dan *operational command center* berbasis struktur RPG untuk tim operasional SGD Care. Sistem ini berfungsi sebagai "sekretaris digital" yang mencatat, mengawasi, dan memvalidasi seluruh kegiatan operasional dari tingkat strategis hingga eksekusi harian.

### Tujuan Utama
1. **Memperjelas delegasi tugas** dengan struktur yang tidak membingungkan.
2. **Meningkatkan accountability** melalui bukti penyelesaian (attachment).
3. **Membangun budaya *reporting* yang rapi** dan *operational memory* yang kuat.
4. **Mengurangi mental overload Guild Master** dengan memisahkan level strategis (Arc) dan operasional eksekusi (Quest).
5. **Menciptakan ritme kerja yang terukur** dengan sistem gamifikasi poin dan *Leaderboard*.

---

## 2. Struktur Hierarki Operasional

Sistem menggunakan hierarki 3 tingkat agar tidak hanya menjadi daftar tugas (To-Do List), tetapi menjadi pusat komando dan memori organisasi.

### Arc → Project → Quest → Updates / Proof / Approval

#### 1. Arc (Strategic Storyline)
- Arc adalah wadah kampanye strategis atau alur cerita besar.
- **Contoh:** *RS Bella Support Arc*, *Finance Discipline Arc*, *Internal System Building*.
- **Halaman Arc:** Menampilkan objektif strategis, daftar Project yang berjalan di bawahnya, dan **Arc Vault** (tempat menyimpan dokumen strategis seperti SOW atau MoM).

#### 2. Project (Operational Battlefield)
- Project adalah wadah koordinasi operasional di bawah sebuah Arc.
- **Contoh:** *AC Preventive Maintenance June*, *Follow-up Quotation Genset*.
- **Halaman Project:** Menampilkan klasifikasi proyek, status/kesehatan proyek (Merah/Kuning/Hijau), target selesai, daftar Quest aktif, dan **Project Vault**.

#### 3. Quest (Executable Command)
- Quest adalah tugas nyata yang diberikan kepada satu orang (Adventurer).
- Quest harus terhubung ke sebuah Project (opsional ke Arc).
- Berisi instruksi taktis, *definition of done*, tenggat waktu, dan *reward points*.

#### 4. Vault (Command Archive)
- Vault adalah *Information Dump Area* untuk menyimpan dokumen terpusat agar tidak berserakan di WhatsApp.
- **Isi Vault:** Minutes of Meeting, Quotation, Kontrak, Foto Lapangan, Catatan Keputusan, dll.
- **Metadata:** Setiap file di Vault memiliki *Title*, *Type*, *Uploaded By*, *Date*, *Summary*, dan *Visibility*.

---

## 3. Pengguna & Peran (Role Permissions)

Sistem memberlakukan otorisasi sesuai tingkatan peran berikut:

| Role | Ability / Hak Akses |
|------|---------------------|
| **Guild Master (GM)** | Create, edit, approve, reject, abort, cancel, hold, resume, adjust points manual, manage members (add user). |
| **Guild Secretary** | Create draft, bantu lengkapi detail, edit field administratif, export report, add member (bantuan GM). |
| **Quest Giver** | Create quest, approve own quest, hold atau cancel own quest. |
| **Adventurer** | View assigned quest, update progress, upload proof, submit quest. |

*(Catatan: Bruno direkomendasikan bertindak sebagai Guild Secretary).*

---

## 4. Alur & Status Quest

### 4.1. Pemisahan Status Operasional vs Status Detail
Agar sistem bisa mengakomodir pendelegasian cepat, status Quest dibagi dua:

**1. Quest Status (Status Operasional):**
- `Active*` : Quest sudah didelegasikan/live, tapi instruksi/detail belum lengkap.
- `Active` : Quest sedang berjalan dan instruksi sudah lengkap.
- `Hold` : Quest dijeda sementara (alasan valid, deadline & penalti stop).
- `Submitted` : Adventurer telah selesai dan submit bukti, menunggu approval.
- `Approved` : Quest diterima, poin cair.
- `Rejected` : Quest ditolak (wajib menyertakan alasan penolakan), kembali untuk direvisi.
- `Completed` : (State akhir setelah approved).
- `Cancelled` : Dibatalkan karena alasan normal (sudah tidak perlu).
- `Aborted` : Diberhentikan paksa (darurat, arah salah, risiko tinggi). GM Only.

**2. Detail Status (Kelengkapan Instruksi):**
- `Complete`
- `Detail Kurang`
- `Critical Detail Missing`

### 4.2. Action Khusus: Hold & Abort

#### HOLD (Jeda Sementara)
- Quest masih valid tapi tertahan (menunggu vendor, klien, pembayaran, dll).
- **Efek:** Deadline berhenti sementara, penalti stop, poin tersimpan, Adventurer aman.
- **Syarat Hold:** Wajib isi Alasan Hold, Siapa yang menahan, dan Pihak Pemblokir (Client/Vendor/Finance/dll).
- **Resume:** Saat di-resume, GM memilih apakah memakai deadline lama, ditambah durasi hold, atau set deadline manual baru.

#### ABORT (Pemberhentian Paksa Darurat)
- Hanya GM yang bisa menekan tombol Abort (wajib konfirmasi ketik "ABORT").
- Digunakan saat quest berisiko tinggi, arahnya salah total, duplikasi, atau darurat.
- **Efek:** Quest langsung dihentikan. Semua perhitungan waktu dan poin stop. History tetap dicatat.
- **Syarat Abort:** Wajib isi Alasan, Kategori Abort (Misal: *Wrong Direction*), dan Perlakuan Poin (*Void/Manual Adjustment*). GM ditanya apakah ingin membuat quest pengganti.

### 4.3. Approval & Rejection Flow
- Penyelesaian Quest **tidak otomatis**.
- Adventurer submit hasil beserta *Proof* (Bukti).
- Approver akan mengecek. Jika **Reject**, sistem *wajib* meminta Alasan Penolakan (contoh: "Invoice kurang lengkap"), lalu quest kembali ke Adventurer untuk diperbaiki.

### 4.4. Operational Update Log
- Komentar standar diubah menjadi **Operational Update Log**.
- Setiap *update* di Quest akan mencatat: Waktu, Pelapor, Teks Update, dan Lampiran (Attachment). Ini membangun *history* operasional yang solid.

---

## 5. Aturan Poin & Detail Completion Rules (Evening Review)

Aplikasi memiliki fitur disiplin pendelegasian untuk para pembuat tugas (Quest Giver / GM):

### Evening Review (21:00) & Midnight Penalty (00:00)
- GM dapat memberikan tugas secara cepat (Status: `Active*`), namun detailnya harus dilengkapi.
- **Sebelum 21:00:** Jika detail dilengkapi, GM dapat **Bonus Poin**.
- **Jam 21:00:** Sistem memberi peringatan (*warning*) ke GM jika ada quest `Active*` yang detailnya masih bolong.
- **Jam 00:00:** Jika detail belum juga dilengkapi, GM akan terkena **Pengurangan Poin (Penalty)**. (Terkecuali quest dibuat sangat larut malam, penalti dihitung hari berikutnya).

### Manual Point Correction
GM memiliki fitur untuk menyesuaikan poin secara manual jika ada:
- Tugas offline yang baru diinput.
- Koreksi karena salah submit.
- Kompensasi dari quest yang di-*Abort*.
Setiap penyesuaian manual mencatat: Jumlah poin, Alasan, Siapa yang mengubah, dan Waktu kejadian.

---

## 6. Leaderboard & Tampilan Dasbor

### 6.1. Menu Navigation
Menu utama meliputi:
- **Dashboard**
- **Arcs**
- **Projects**
- **Leaderboards** (Menggantikan menu "Guild")
- **Tavern** (Opsional)
- **Quests**
- **Members**
- **Profile**

### 6.2. Leaderboards
Halaman Leaderboards akan menampilkan kompetisi dan kemajuan anggota Guild:
- Weekly / Monthly / Season / All-time ranking.
- Poin yang diperoleh, history penalti/bonus.
- *Top quest completers* & *Most improved member*.

### 6.3. Dasbor Personal (My Tasks / This Week)
Dasbor akan berfokus pada eksekusi keseharian tiap pengguna:
- *My Quests Today*
- *My Overdue Quests*
- *My Quests This Week*
- *Waiting Approval* (Tugas yang sudah disubmit)
- *Rejected* (Tugas yang butuh revisi)

---

## 7. Administrasi Anggota (Add New Member)

Aplikasi menyediakan fitur bagi GM / Guild Secretary untuk menambah anggota baru tanpa bantuan developer:
- Masuk ke menu **Members → Add New Member**.
- Mengisi Nama, Email, Role, Divisi, Level awal, Supervisor, dan Hak Akses (Create/Approve Quest).
- Sistem membuat profil dan mengaktifkan member (bisa diatur manual password atau via email invitasi nantinya).

---

## 8. Notifikasi & Email

Selain notifikasi *in-app*, aplikasi akan mengirimkan notifikasi via Email (menggunakan Microsoft 365 Exchange atau penyedia API seperti Resend/Mailgun).

**Trigger Notifikasi Wajib (MVP):**
1. Quest baru di-assign (In-app + Email)
2. Deadline mendekat (In-app)
3. Quest overdue (In-app + Email)
4. Quest di-submit, di-approve, atau di-reject (In-app + Email)
5. Peringatan detail incomplete 21:00 & 00:00 (In-app + GM Email)
6. Hold / Resume / Abort (In-app + Email)

Terdapat fitur **Email Log** bagi GM/Secretary untuk mengecek apakah notifikasi email sukses terkirim, error, atau pending.

---

## 9. Rekomendasi Peluncuran (Launch Plan)

**DO NOT launch as a full company system immediately.**

Sistem akan diluncurkan dalam format: **Guild Trial Season 1**
- **Durasi Trial:** 2–4 minggu.
- **Pengguna Pertama:** Reza (GM), Bruno (Secretary), Siska, Ervan, Pris, Santi.
- **Tujuan Trial:**
  - Menguji apakah pengguna memahami sistem Quest dan alur *Active**.
  - Merasakan apakah *Penalty* dan *Hold/Abort* sudah jelas dan adil.
  - Memastikan *flow* unggah bukti dan approval lancar.
  - Melihat dampak Leaderboard (memotivasi atau resistensi).

Setelah *Season 1* berakhir, sistem dan *rulebook* dapat direvisi kembali sebelum diluncurkan untuk keseluruhan perusahaan.

---
*Document Version: 2.0 (Updated as per Revision Recap)*
