# N8N Workflows for SGD Guild Secretary

Folder ini berisi konfigurasi JSON yang bisa langsung di-import ke instalasi n8n self-hosted milikmu. Flow ini mengatur notifikasi, penalti, dan bonus sesuai rules di PRD.

## Persiapan Environment Variables di N8N
Sebelum melakukan import, pastikan environment variables berikut sudah di-set di server n8n kamu (biasanya di file `.env` docker-compose n8n):

```env
SUPABASE_URL=https://<id>.supabase.co
SUPABASE_SERVICE_KEY=eyJhbG... (gunakan Service Role Key, BUKAN Anon Key)
NOTIFICATION_WEBHOOK_URL=https://discord.com/api/webhooks/... (atau Telegram, dll)
```

## Cara Import Flow
1. Buka dashboard N8N.
2. Buat workflow baru (Add Workflow).
3. Pilih menu "Import from File" atau gunakan copy-paste (buka file JSON dengan text editor, lalu paste langsung ke area canvas N8N).
4. Pastikan untuk menekan **Save** dan set toggle ke **Active**.

## Daftar Flows

### 1. Evening Review (`evening-review.json`)
**Trigger**: Cron job (setiap hari jam 21:00 WIB).
**Fungsi**: Melakukan pengecekan `quests` yang masih Draft atau Active namun detailnya belum lengkap. Jika ada, mengirimkan ringkasan list quest tersebut ke webhook notifikasi.

### 2. Midnight Penalty (`midnight-penalty.json`)
**Trigger**: Cron job (setiap hari jam 00:00 WIB).
**Fungsi**: Memeriksa quest yang tidak lengkap saat lewat batas tengah malam. Untuk setiap quest, memberikan penalti -20 poin kepada Guild Master dengan memanggil RPC `increment_user_points`, mencatatnya ke `point_logs`, dan mengirimkan notifikasi.

### 3. Bonus GM (`bonus-gm.json`)
**Trigger**: Webhook (`POST /webhook/bonus-gm`).
**Fungsi**: Dipanggil dari Next.js app ketika sebuah quest di-update menjadi `detail_completed = true`. Flow ini mengecek jam. Jika sebelum 21:00 WIB, maka GM akan menerima +30 poin, di-insert ke `point_logs`, dan dikirimi praise notification.

*(Note: Untuk mengaktifkan flow ini, URL webhook yang digenerate oleh N8N perlu dimasukkan ke environment variable aplikasi Next.js milikmu: `N8N_WEBHOOK_BONUS_GM`)*

### 4. Quest Submission Alert (`quest-submission-alert.json`)
**Trigger**: Webhook (`POST /webhook/quest-submission`).
**Fungsi**: Dipanggil dari Next.js app ketika Adventurer submit quest. Mengirimkan notifikasi ke GM bahwa ada quest yang siap di-review.

*(Note: Masukkan URL webhook ini ke env `N8N_WEBHOOK_SUBMISSION` di aplikasi Next.js)*
