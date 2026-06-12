# Guild Secretary - Quest Management System

## 📖 Deskripsi
Sistem manajemen tugas (Quest) berbasis hierarki Arc → Project → Quest 
untuk organisasi/guild. Dilengkapi dengan fitur live chat (Tavern), 
vault dokumen, leaderboard, dan notifikasi.

## 🛠 Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** NextAuth.js
- **UI:** React + TailwindCSS
- **Real-time:** Server-Sent Events (SSE)
- **File Upload:** Local storage + ImageKit
- **PWA:** Next-PWA

## 📋 Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm atau yarn

## ⚙️ Installation

1. Clone repository:
   ```bash
   git clone [repo-url]
   cd guild-secretary
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Environment Variables:
   Buat file `.env` di root directory (bisa menyalin dari `.env.example` jika tersedia) dan isi variabel kunci berikut:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5433/guild_secretary?schema=public"
   NEXTAUTH_SECRET="random_super_secret_string"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Dan konfigurasi lainnya (misal: SMTP Email, VAPID Web Push, ImageKit)
   ```

4. Setup Database (Prisma):
   Generate Prisma Client dan sinkronisasi struktur ke database.
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. Seed Data Awal (Opsional):
   Tanamkan data dasar dan *dummy* awal (Role, Users, Arcs, Projects).
   ```bash
   npx prisma db seed
   # Jika butuh data dummy tambahan:
   npx tsx seed_arcs_projects.ts
   ```

6. Jalankan Server:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di peramban Anda.
