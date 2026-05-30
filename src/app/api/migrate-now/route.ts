import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  // Security: require secret token to prevent unauthorized DB reset
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (!token || token !== (process.env.MIGRATE_SECRET || 'sgd-migrate-2026')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const users = [
  {
    "id": "00000000-0000-0000-0000-000000000002",
    "nama": "Pris",
    "role": "adventurer",
    "totalPoints": 210,
    "createdAt": "2026-05-26T12:18:42.133Z",
    "avatarUrl": null,
    "email": "pris@sgd-corp.com",
    "passwordHash": "$2a$10$BS8yMQuKilVGi3lTEUyD.u8XwwzurGPruIei9RExccfC5x4ko634u"
  },
  {
    "id": "00000000-0000-0000-0000-000000000003",
    "nama": "Ervan",
    "role": "adventurer",
    "totalPoints": 185,
    "createdAt": "2026-05-26T12:18:42.216Z",
    "avatarUrl": null,
    "email": "ervan@sgd-corp.com",
    "passwordHash": "$2a$10$ajs7sSeKBDRqt5o9dSEht.M7IPrpyw9FK.ndcfDV5eoNo1DSmrBS2"
  },
  {
    "id": "00000000-0000-0000-0000-000000000005",
    "nama": "Santi",
    "role": "adventurer",
    "totalPoints": 155,
    "createdAt": "2026-05-26T12:18:42.287Z",
    "avatarUrl": null,
    "email": "santi@sgd-corp.com",
    "passwordHash": "$2a$10$6fWtlVdWaSdFZv5oWG3czuY3xH2fLckTJZJvoPf.P0vhutMClwooG"
  },
  {
    "id": "00000000-0000-0000-0000-000000000006",
    "nama": "Christian",
    "role": "adventurer",
    "totalPoints": 300,
    "createdAt": "2026-05-26T12:18:42.318Z",
    "avatarUrl": null,
    "email": "christian@sgd-corp.com",
    "passwordHash": "$2a$10$aOWXtKF/8uqK8BSbWhFCCeieAD/M85ZoYjbTE.8t5Gq.MbZnBHcxS"
  },
  {
    "id": "00000000-0000-0000-0000-000000000007",
    "nama": "Bruno",
    "role": "adventurer",
    "totalPoints": 90,
    "createdAt": "2026-05-26T12:18:42.374Z",
    "avatarUrl": null,
    "email": "bruno@sgd-corp.com",
    "passwordHash": "$2a$10$W96y3l4HjXnJe9RR0iBiOexYg2gF0vcT79dgeUan9eUtxu8ZY2pL."
  },
  {
    "id": "00000000-0000-0000-0000-000000000001",
    "nama": "Reza",
    "role": "guild_master",
    "totalPoints": 340,
    "createdAt": "2026-05-26T12:18:42.086Z",
    "avatarUrl": "https://tbbrzfbxqzlqqgvukwvu.supabase.co/storage/v1/object/public/avatars/00000000-0000-0000-0000-000000000001/00000000-0000-0000-0000-000000000001-1779811975155.png",
    "email": "reza@sgd-corp.com",
    "passwordHash": "$2a$10$RfnPCgkIDJCUAmqt8Y8Neem/dyt0axzsr45WaTNsqqoo1fQOOfI7a"
  },
  {
    "id": "00000000-0000-0000-0000-000000000004",
    "nama": "Siska",
    "role": "adventurer",
    "totalPoints": 270,
    "createdAt": "2026-05-26T12:18:42.249Z",
    "avatarUrl": "https://tbbrzfbxqzlqqgvukwvu.supabase.co/storage/v1/object/public/avatars/00000000-0000-0000-0000-000000000004/00000000-0000-0000-0000-000000000004-1779873998167.jpg",
    "email": "siska@sgd-corp.com",
    "passwordHash": "$2a$10$jKagpdg/Ftxt.4mlUxBJ3.UJ/1D19oG8/9XhTPecyRGBilf4oWzE."
  }
];
    const quests = [
  {
    "id": "a0000000-0000-0000-0000-000000000001",
    "title": "Perbaikan AC ICU Bella",
    "description": "Koordinasi dengan Bokir untuk memastikan airflow di ruang ICU Bella kembali stabil setelah keluhan dari head nurse.",
    "assignedTo": "00000000-0000-0000-0000-000000000006",
    "createdBy": "00000000-0000-0000-0000-000000000001",
    "difficulty": "B",
    "deadline": "2026-05-24T12:18:42.275Z",
    "successParameter": "Airflow stabil, nurse confirmation diterima, foto terlampir, tidak ada complaint 24 jam setelah perbaikan.",
    "rewardPoints": 120,
    "status": "Approved",
    "detailCompleted": true,
    "detailCompletedAt": "2026-05-23T12:18:42.275Z",
    "createdAt": "2026-05-22T12:18:42.275Z",
    "updatedAt": "2026-05-26T12:18:42.423Z",
    "urgency": "Routine"
  },
  {
    "id": "a0000000-0000-0000-0000-000000000002",
    "title": "Cek kebocoran pipa lantai 3",
    "description": "Laporan kebocoran kecil di pantry lantai 3. Cek sumber kebocoran dan dokumentasikan kondisi pipa.",
    "assignedTo": "00000000-0000-0000-0000-000000000003",
    "createdBy": "00000000-0000-0000-0000-000000000001",
    "difficulty": "D",
    "deadline": "2026-05-27T12:18:42.275Z",
    "successParameter": "Sumber kebocoran ditemukan, foto kondisi terlampir, estimasi perbaikan disiapkan.",
    "rewardPoints": 60,
    "status": "Active",
    "detailCompleted": true,
    "detailCompletedAt": "2026-05-25T12:18:42.275Z",
    "createdAt": "2026-05-25T12:18:42.275Z",
    "updatedAt": "2026-05-26T12:18:42.467Z",
    "urgency": "Routine"
  },
  {
    "id": "a0000000-0000-0000-0000-000000000003",
    "title": "Pengajuan quotation genset cadangan",
    "description": "Minta minimal 2 penawaran dari vendor untuk genset cadangan 100kVA. Bandingkan spesifikasi dan harga.",
    "assignedTo": "00000000-0000-0000-0000-000000000004",
    "createdBy": "00000000-0000-0000-0000-000000000001",
    "difficulty": "C",
    "deadline": "2026-05-28T12:18:42.275Z",
    "successParameter": "Minimal 2 quotation dari vendor berbeda, file PDF terlampir, rekomendasi vendor disertakan.",
    "rewardPoints": 80,
    "status": "Submitted",
    "detailCompleted": true,
    "detailCompletedAt": "2026-05-24T12:18:42.275Z",
    "createdAt": "2026-05-23T12:18:42.275Z",
    "updatedAt": "2026-05-26T12:18:42.500Z",
    "urgency": "Routine"
  },
  {
    "id": "a0000000-0000-0000-0000-000000000004",
    "title": "Audit stok spare part AC",
    "description": "Cek dan hitung ulang stok spare part AC di gudang. Update spreadsheet stok dan laporkan jika ada yang habis.",
    "assignedTo": "00000000-0000-0000-0000-000000000002",
    "createdBy": "00000000-0000-0000-0000-000000000001",
    "difficulty": "E",
    "deadline": "2026-05-29T12:18:42.275Z",
    "successParameter": "Spreadsheet stok diupdate, foto kondisi gudang terlampir, list item yang perlu restock disiapkan.",
    "rewardPoints": 40,
    "status": "Active",
    "detailCompleted": true,
    "detailCompletedAt": "2026-05-25T12:18:42.275Z",
    "createdAt": "2026-05-24T12:18:42.275Z",
    "updatedAt": "2026-05-26T12:18:42.534Z",
    "urgency": "Routine"
  },
  {
    "id": "a0000000-0000-0000-0000-000000000006",
    "title": "Laporan bulanan maintenance Mei",
    "description": "Buat laporan rekap seluruh pekerjaan maintenance bulan Mei. Format PDF, kirim ke direktur.",
    "assignedTo": "00000000-0000-0000-0000-000000000005",
    "createdBy": "00000000-0000-0000-0000-000000000001",
    "difficulty": "D",
    "deadline": "2026-05-23T12:18:42.275Z",
    "successParameter": "PDF laporan selesai, sudah dikirim ke direktur, konfirmasi penerimaan screenshot.",
    "rewardPoints": 70,
    "status": "Approved",
    "detailCompleted": true,
    "detailCompletedAt": "2026-05-21T12:18:42.275Z",
    "createdAt": "2026-05-19T12:18:42.275Z",
    "updatedAt": "2026-05-26T12:18:42.652Z",
    "urgency": "Routine"
  },
  {
    "id": "a0000000-0000-0000-0000-000000000007",
    "title": "Instalasi CCTV gudang baru",
    "description": "Pasang 4 unit CCTV di gudang baru area B. Koordinasi dengan kontraktor, pastikan semua sudut terpantau.",
    "assignedTo": "00000000-0000-0000-0000-000000000006",
    "createdBy": "00000000-0000-0000-0000-000000000001",
    "difficulty": "B",
    "deadline": "2026-05-27T12:18:42.275Z",
    "successParameter": "Semua 4 CCTV aktif dan terekam, foto instalasi, screenshot live feed dari NVR.",
    "rewardPoints": 100,
    "status": "Revise",
    "detailCompleted": true,
    "detailCompletedAt": "2026-05-23T12:18:42.275Z",
    "createdAt": "2026-05-22T12:18:42.275Z",
    "updatedAt": "2026-05-26T12:18:42.683Z",
    "urgency": "Routine"
  },
  {
    "id": "a0000000-0000-0000-0000-000000000008",
    "title": "Pembersihan AHU rooftop",
    "description": "Bersihkan filter dan blower AHU di rooftop. Jadwalkan dengan tim kebersihan.",
    "assignedTo": "00000000-0000-0000-0000-000000000003",
    "createdBy": "00000000-0000-0000-0000-000000000001",
    "difficulty": "D",
    "deadline": "2026-05-24T12:18:42.275Z",
    "successParameter": "Filter bersih, foto before-after terlampir, log pembersihan ditandatangani.",
    "rewardPoints": 0,
    "status": "Failed",
    "detailCompleted": true,
    "detailCompletedAt": "2026-05-20T12:18:42.275Z",
    "createdAt": "2026-05-19T12:18:42.275Z",
    "updatedAt": "2026-05-26T12:18:42.720Z",
    "urgency": "Routine"
  },
  {
    "id": "a0000000-0000-0000-0000-000000000010",
    "title": "Survey lokasi proyek Sunter",
    "description": null,
    "assignedTo": "00000000-0000-0000-0000-000000000002",
    "createdBy": "00000000-0000-0000-0000-000000000001",
    "difficulty": "B",
    "deadline": null,
    "successParameter": null,
    "rewardPoints": 110,
    "status": "Draft",
    "detailCompleted": false,
    "detailCompletedAt": null,
    "createdAt": "2026-05-26T10:18:42.275Z",
    "updatedAt": "2026-05-26T12:18:42.902Z",
    "urgency": "Routine"
  },
  {
    "id": "c86ee129-aabf-497b-853f-5a0fc9087af8",
    "title": "Membersihkan Selokan Guild",
    "description": "Pekerjaan kotor namun penting.",
    "assignedTo": "00000000-0000-0000-0000-000000000005",
    "createdBy": "00000000-0000-0000-0000-000000000001",
    "difficulty": "E",
    "deadline": "2026-05-27T02:22:00.000Z",
    "successParameter": "Jalur air lancar",
    "rewardPoints": 50,
    "status": "Active",
    "detailCompleted": true,
    "detailCompletedAt": "2026-05-27T10:19:27.975Z",
    "createdAt": "2026-05-26T16:22:20.017Z",
    "updatedAt": "2026-05-27T10:19:27.975Z",
    "urgency": "Routine"
  },
  {
    "id": "65d95ead-700c-49db-94f8-ba6627584379",
    "title": "Mencari Herb Obat",
    "description": "Ramuan obat membutuhkan daun mint biru.",
    "assignedTo": null,
    "createdBy": "00000000-0000-0000-0000-000000000001",
    "difficulty": "F",
    "deadline": "2026-05-25T16:22:20.017Z",
    "successParameter": null,
    "rewardPoints": 100,
    "status": "Failed",
    "detailCompleted": false,
    "detailCompletedAt": null,
    "createdAt": "2026-05-23T16:22:20.017Z",
    "updatedAt": "2026-05-28T06:36:03.440Z",
    "urgency": "Routine"
  },
  {
    "id": "7171a8ed-7e36-49c3-9427-ec14734a6873",
    "title": "Membasmi 10 Slime di Hutan Timur",
    "description": "Warga desa melapor banyak slime merusak kebun. Habisi mereka dan bawa buktinya.",
    "assignedTo": null,
    "createdBy": "00000000-0000-0000-0000-000000000001",
    "difficulty": "E",
    "deadline": "2026-05-28T16:22:20.017Z",
    "successParameter": null,
    "rewardPoints": 250,
    "status": "Approved",
    "detailCompleted": false,
    "detailCompletedAt": null,
    "createdAt": "2026-05-24T16:22:20.017Z",
    "updatedAt": "2026-05-28T06:36:03.440Z",
    "urgency": "Routine"
  },
  {
    "id": "b3b414e8-1364-4f92-a498-abfcb0b9dc1a",
    "title": "Menjelajah Dungeon Rank A",
    "description": "Temukan artifak langka di lantai 50.",
    "assignedTo": null,
    "createdBy": "00000000-0000-0000-0000-000000000001",
    "difficulty": "A",
    "deadline": "2026-06-05T16:22:20.017Z",
    "successParameter": null,
    "rewardPoints": 5000,
    "status": "Approved",
    "detailCompleted": false,
    "detailCompletedAt": null,
    "createdAt": "2026-05-21T16:22:20.017Z",
    "updatedAt": "2026-05-28T06:36:03.440Z",
    "urgency": "Routine"
  },
  {
    "id": "d4f6fe74-eb9b-4793-b9d9-a06e70c11414",
    "title": "Pengawalan Pedagang ke Ibukota",
    "description": "Jaga kereta barang dari serangan bandit.",
    "assignedTo": null,
    "createdBy": "00000000-0000-0000-0000-000000000001",
    "difficulty": "D",
    "deadline": "2026-05-31T16:22:20.017Z",
    "successParameter": null,
    "rewardPoints": 400,
    "status": "Active",
    "detailCompleted": false,
    "detailCompletedAt": null,
    "createdAt": "2026-05-25T16:22:20.017Z",
    "updatedAt": "2026-05-28T06:36:03.440Z",
    "urgency": "Routine"
  },
  {
    "id": "777bbd39-383e-4b5e-bfaa-adbcc4fb1061",
    "title": "Memburu Naga Merah",
    "description": "Quest darurat! Seekor naga menyerang pedesaan!",
    "assignedTo": "00000000-0000-0000-0000-000000000007",
    "createdBy": "00000000-0000-0000-0000-000000000001",
    "difficulty": "S",
    "deadline": "2026-06-02T09:22:00.000Z",
    "successParameter": "Potong kepala naga",
    "rewardPoints": 9000,
    "status": "Active",
    "detailCompleted": true,
    "detailCompletedAt": "2026-05-28T10:11:57.130Z",
    "createdAt": "2026-05-26T16:22:20.017Z",
    "updatedAt": "2026-05-28T10:11:57.130Z",
    "urgency": "Routine"
  },
  {
    "id": "a0000000-0000-0000-0000-000000000005",
    "title": "Koordinasi vendor lift RSIA",
    "description": "Vendor lift hari ini datang. Agar ditemani dan diperjelas masalahnya dimana.",
    "assignedTo": "00000000-0000-0000-0000-000000000007",
    "createdBy": "00000000-0000-0000-0000-000000000001",
    "difficulty": "A",
    "deadline": "2026-05-29T10:13:00.000Z",
    "successParameter": "Principal menginformasikan parts apa yg perlu diganti.",
    "rewardPoints": 150,
    "status": "Active",
    "detailCompleted": true,
    "detailCompletedAt": "2026-05-28T10:13:48.779Z",
    "createdAt": "2026-05-26T06:18:42.275Z",
    "updatedAt": "2026-05-28T10:13:48.779Z",
    "urgency": "Routine"
  },
  {
    "id": "a0000000-0000-0000-0000-000000000009",
    "title": "Update SOP emergency genset",
    "description": "Revisi SOP prosedur darurat genset berdasarkan insiden bulan lalu. Konsultasi dengan kepala teknik.",
    "assignedTo": "00000000-0000-0000-0000-000000000004",
    "createdBy": "00000000-0000-0000-0000-000000000001",
    "difficulty": "C",
    "deadline": "2026-05-31T12:18:42.275Z",
    "successParameter": "Dokumen SOP direvisi, disetujui kepala teknik, versi baru di-upload ke drive.",
    "rewardPoints": 80,
    "status": "Revise",
    "detailCompleted": true,
    "detailCompletedAt": "2026-05-25T12:18:42.275Z",
    "createdAt": "2026-05-24T12:18:42.275Z",
    "updatedAt": "2026-05-28T15:02:03.556Z",
    "urgency": "Routine"
  }
];
    const attachments = [
  {
    "id": "b0000000-0000-0000-0000-000000000001",
    "questId": "a0000000-0000-0000-0000-000000000001",
    "fileUrl": "https://storage.example.com/attachments/ac-icu-before.jpg",
    "fileType": "image/jpeg",
    "uploadedBy": "00000000-0000-0000-0000-000000000006",
    "uploadedAt": "2026-05-24T12:18:42.275Z"
  },
  {
    "id": "b0000000-0000-0000-0000-000000000002",
    "questId": "a0000000-0000-0000-0000-000000000001",
    "fileUrl": "https://storage.example.com/attachments/ac-icu-after.jpg",
    "fileType": "image/jpeg",
    "uploadedBy": "00000000-0000-0000-0000-000000000006",
    "uploadedAt": "2026-05-24T12:18:42.275Z"
  },
  {
    "id": "b0000000-0000-0000-0000-000000000003",
    "questId": "a0000000-0000-0000-0000-000000000003",
    "fileUrl": "https://storage.example.com/attachments/quotation-genset-vendor-a.pdf",
    "fileType": "application/pdf",
    "uploadedBy": "00000000-0000-0000-0000-000000000004",
    "uploadedAt": "2026-05-25T12:18:42.275Z"
  },
  {
    "id": "b0000000-0000-0000-0000-000000000004",
    "questId": "a0000000-0000-0000-0000-000000000003",
    "fileUrl": "https://storage.example.com/attachments/quotation-genset-vendor-b.pdf",
    "fileType": "application/pdf",
    "uploadedBy": "00000000-0000-0000-0000-000000000004",
    "uploadedAt": "2026-05-25T12:18:42.275Z"
  },
  {
    "id": "b0000000-0000-0000-0000-000000000005",
    "questId": "a0000000-0000-0000-0000-000000000006",
    "fileUrl": "https://storage.example.com/attachments/laporan-maintenance-mei-2026.pdf",
    "fileType": "application/pdf",
    "uploadedBy": "00000000-0000-0000-0000-000000000005",
    "uploadedAt": "2026-05-22T12:18:42.275Z"
  },
  {
    "id": "b0000000-0000-0000-0000-000000000006",
    "questId": "a0000000-0000-0000-0000-000000000007",
    "fileUrl": "https://storage.example.com/attachments/cctv-instalasi.jpg",
    "fileType": "image/jpeg",
    "uploadedBy": "00000000-0000-0000-0000-000000000006",
    "uploadedAt": "2026-05-25T12:18:42.275Z"
  },
  {
    "id": "39739b73-c9c8-4028-a8a9-a0fbf25abee0",
    "questId": "a0000000-0000-0000-0000-000000000009",
    "fileUrl": "https://tbbrzfbxqzlqqgvukwvu.supabase.co/storage/v1/object/public/attachments/a0000000-0000-0000-0000-000000000009/1779857116072_umi0vkyk8i.png",
    "fileType": "image/png",
    "uploadedBy": "00000000-0000-0000-0000-000000000004",
    "uploadedAt": "2026-05-27T04:45:17.171Z"
  },
  {
    "id": "3213c263-58cf-47fa-a6ca-51912fd32377",
    "questId": "a0000000-0000-0000-0000-000000000009",
    "fileUrl": "https://tbbrzfbxqzlqqgvukwvu.supabase.co/storage/v1/object/public/attachments/a0000000-0000-0000-0000-000000000009/1779857117107_1phjtb833pd.jpg",
    "fileType": "image/jpeg",
    "uploadedBy": "00000000-0000-0000-0000-000000000004",
    "uploadedAt": "2026-05-27T04:45:17.773Z"
  }
];
    const guildChats = [
  {
    "id": "2d6a95b4-334f-487a-abc9-2e89f3608627",
    "userId": "00000000-0000-0000-0000-000000000001",
    "message": "halo",
    "createdAt": "2026-05-28T11:39:02.869Z"
  },
  {
    "id": "a0e2f6a1-b10e-4f49-b0c9-4451eae9a78e",
    "userId": "00000000-0000-0000-0000-000000000004",
    "message": "okej tugas aman",
    "createdAt": "2026-05-28T11:40:00.770Z"
  },
  {
    "id": "9287d9b2-b20c-487a-b2a7-731c35030814",
    "userId": "00000000-0000-0000-0000-000000000004",
    "message": "tugas baru?",
    "createdAt": "2026-05-28T11:52:02.862Z"
  },
  {
    "id": "3e0926d3-2144-432a-bdba-7730c810bce5",
    "userId": "00000000-0000-0000-0000-000000000007",
    "message": "tugas bella ac update",
    "createdAt": "2026-05-28T11:53:42.215Z"
  },
  {
    "id": "2cd8c011-f60a-4c97-b88f-25340b3bb47f",
    "userId": "00000000-0000-0000-0000-000000000001",
    "message": "baik",
    "createdAt": "2026-05-28T11:58:12.634Z"
  },
  {
    "id": "61495d52-f17f-4e13-b40e-abc19faa6a9a",
    "userId": "00000000-0000-0000-0000-000000000004",
    "message": "baik",
    "createdAt": "2026-05-28T11:58:27.679Z"
  },
  {
    "id": "23a92f5c-3c27-43e0-b9a9-2304e7d49988",
    "userId": "00000000-0000-0000-0000-000000000001",
    "message": "tolong perbaiki catatan",
    "createdAt": "2026-05-28T12:05:42.724Z"
  },
  {
    "id": "7843942f-fa8c-4b74-9d6d-24da873aec71",
    "userId": "00000000-0000-0000-0000-000000000007",
    "message": "baik",
    "createdAt": "2026-05-28T12:05:58.533Z"
  },
  {
    "id": "abf17181-4083-4513-b4c3-67f8f47c444d",
    "userId": "00000000-0000-0000-0000-000000000001",
    "message": "halo pagi",
    "createdAt": "2026-05-28T12:06:51.419Z"
  },
  {
    "id": "55de8ef3-0968-4fd6-ab58-6084d943e09f",
    "userId": "00000000-0000-0000-0000-000000000004",
    "message": "pagi",
    "createdAt": "2026-05-28T12:06:57.254Z"
  },
  {
    "id": "dc6e30b5-3d0e-4e2c-b801-8e1e9c83f1e1",
    "userId": "00000000-0000-0000-0000-000000000007",
    "message": "pagi",
    "createdAt": "2026-05-28T12:07:01.494Z"
  },
  {
    "id": "874fac76-0472-4a44-87bd-8c8ac251962f",
    "userId": "00000000-0000-0000-0000-000000000001",
    "message": "ada tuags bru",
    "createdAt": "2026-05-28T12:07:09.730Z"
  },
  {
    "id": "7af81e7b-1cc1-4a29-9a4b-052b6ae13024",
    "userId": "00000000-0000-0000-0000-000000000004",
    "message": "ok",
    "createdAt": "2026-05-28T12:07:14.133Z"
  },
  {
    "id": "0f6ce977-0073-4870-af3e-74d7a5103b2d",
    "userId": "00000000-0000-0000-0000-000000000007",
    "message": "ok",
    "createdAt": "2026-05-28T12:07:17.503Z"
  },
  {
    "id": "1c1c6312-0763-44d7-aee9-5da076112187",
    "userId": "00000000-0000-0000-0000-000000000004",
    "message": "malam tim",
    "createdAt": "2026-05-28T14:54:52.323Z"
  }
];
    const notifications = [
  {
    "id": "94c1278b-3d11-4719-ba4e-9945ff1ebebd",
    "userId": "00000000-0000-0000-0000-000000000001",
    "title": "Peringatan Deadline",
    "message": "Quest Mencari Herb Obat telah melewati deadline.",
    "link": null,
    "isRead": true,
    "createdAt": "2026-05-26T16:22:20.017Z"
  },
  {
    "id": "87dffee7-f6e7-4016-98b6-b067b9b0b8b5",
    "userId": "00000000-0000-0000-0000-000000000001",
    "title": "Quest Selesai",
    "message": "Kirito telah menyelesaikan quest Membasmi Slime.",
    "link": null,
    "isRead": true,
    "createdAt": "2026-05-26T16:22:20.017Z"
  },
  {
    "id": "e2cb8c55-112e-4018-be73-578c81afc2ad",
    "userId": "00000000-0000-0000-0000-000000000001",
    "title": "Submission Baru",
    "message": "Asuna mengirimkan laporan progress quest.",
    "link": null,
    "isRead": true,
    "createdAt": "2026-05-26T16:22:20.017Z"
  }
];
    const pointLogs = [
  {
    "id": "c0000000-0000-0000-0000-000000000001",
    "userId": "00000000-0000-0000-0000-000000000006",
    "questId": "a0000000-0000-0000-0000-000000000001",
    "delta": 120,
    "reason": "Quest approved: Perbaikan AC ICU Bella",
    "createdAt": "2026-05-24T12:18:42.275Z"
  },
  {
    "id": "c0000000-0000-0000-0000-000000000002",
    "userId": "00000000-0000-0000-0000-000000000005",
    "questId": "a0000000-0000-0000-0000-000000000006",
    "delta": 70,
    "reason": "Quest approved: Laporan bulanan maintenance Mei",
    "createdAt": "2026-05-23T12:18:42.275Z"
  },
  {
    "id": "c0000000-0000-0000-0000-000000000003",
    "userId": "00000000-0000-0000-0000-000000000001",
    "questId": "a0000000-0000-0000-0000-000000000001",
    "delta": 30,
    "reason": "Bonus GM: detail quest lengkap sebelum 21:00",
    "createdAt": "2026-05-22T12:18:42.275Z"
  },
  {
    "id": "c0000000-0000-0000-0000-000000000004",
    "userId": "00000000-0000-0000-0000-000000000001",
    "questId": "a0000000-0000-0000-0000-000000000006",
    "delta": 30,
    "reason": "Bonus GM: detail quest lengkap sebelum 21:00",
    "createdAt": "2026-05-19T12:18:42.275Z"
  },
  {
    "id": "c0000000-0000-0000-0000-000000000005",
    "userId": "00000000-0000-0000-0000-000000000001",
    "questId": "a0000000-0000-0000-0000-000000000005",
    "delta": -20,
    "reason": "Penalti GM: detail quest belum lengkap melewati 00:00",
    "createdAt": "2026-05-26T07:18:42.275Z"
  },
  {
    "id": "c0000000-0000-0000-0000-000000000006",
    "userId": "00000000-0000-0000-0000-000000000001",
    "questId": "a0000000-0000-0000-0000-000000000010",
    "delta": -20,
    "reason": "Penalti GM: detail quest belum lengkap melewati 00:00",
    "createdAt": "2026-05-26T11:18:42.275Z"
  }
];

    await prisma.pointLog.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.guildChat.deleteMany({});
    await prisma.attachment.deleteMany({});
    await prisma.quest.deleteMany({});
    await prisma.user.deleteMany({});

    if (users.length) await prisma.user.createMany({ data: users as any });
    if (quests.length) await prisma.quest.createMany({ data: quests as any });
    if (attachments.length) await prisma.attachment.createMany({ data: attachments as any });
    if (guildChats.length) await prisma.guildChat.createMany({ data: guildChats as any });
    if (notifications.length) await prisma.notification.createMany({ data: notifications as any });
    if (pointLogs.length) await prisma.pointLog.createMany({ data: pointLogs as any });

    return NextResponse.json({ success: true, message: 'Migration via Prisma createMany executed successfully!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
  }
}
