const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const SUPABASE_URL = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const SUPABASE_SERVICE_ROLE_KEY = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const users = [
  { id: '00000000-0000-0000-0000-000000000001', email: 'reza@sgd-corp.com', nama: 'Reza', role: 'guild_master', total_points: 340 },
  { id: '00000000-0000-0000-0000-000000000002', email: 'pris@sgd-corp.com', nama: 'Pris', role: 'adventurer', total_points: 210 },
  { id: '00000000-0000-0000-0000-000000000003', email: 'ervan@sgd-corp.com', nama: 'Ervan', role: 'adventurer', total_points: 185 },
  { id: '00000000-0000-0000-0000-000000000004', email: 'siska@sgd-corp.com', nama: 'Siska', role: 'adventurer', total_points: 270 },
  { id: '00000000-0000-0000-0000-000000000005', email: 'santi@sgd-corp.com', nama: 'Santi', role: 'adventurer', total_points: 155 },
  { id: '00000000-0000-0000-0000-000000000006', email: 'christian@sgd-corp.com', nama: 'Christian', role: 'adventurer', total_points: 300 },
  { id: '00000000-0000-0000-0000-000000000007', email: 'bruno@sgd-corp.com', nama: 'Bruno', role: 'adventurer', total_points: 90 },
];

async function seed() {
  console.log('--- CLEANING OLD DATA ---');
  // Delete in reverse order of foreign key dependency
  await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('quest_comments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('point_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('attachments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('quests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log('--- CREATING AUTH USERS ---');
  for (const user of users) {
    console.log(`Creating auth user: ${user.nama} (${user.email})...`);
    const { data, error } = await supabase.auth.admin.createUser({
      id: user.id,
      email: user.email,
      password: 'password123',
      email_confirm: true
    });
    if (error) {
      if (error.message.includes('already exists') || error.message.includes('email_exists')) {
        console.log(`✅ Auth user ${user.email} already exists.`);
      } else {
        console.error(`❌ Failed to create auth user ${user.email}:`, error.message);
      }
    } else {
      console.log(`✅ Auth user ${user.email} created.`);
    }
  }

  console.log('--- SEEDING PUBLIC USERS ---');
  for (const user of users) {
    const { error } = await supabase.from('users').insert({
      id: user.id,
      nama: user.nama,
      role: user.role,
      total_points: user.total_points
    });
    if (error) {
      console.error(`❌ Failed to insert public user ${user.nama}:`, error.message);
    } else {
      console.log(`✅ Public user ${user.nama} inserted.`);
    }
  }

  console.log('--- SEEDING QUESTS ---');
  const now = new Date();
  const quests = [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      title: 'Perbaikan AC ICU Bella',
      description: 'Koordinasi dengan Bokir untuk memastikan airflow di ruang ICU Bella kembali stabil setelah keluhan dari head nurse.',
      assigned_to: '00000000-0000-0000-0000-000000000006',
      created_by: '00000000-0000-0000-0000-000000000001',
      difficulty: 'B',
      deadline: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      success_parameter: 'Airflow stabil, nurse confirmation diterima, foto terlampir, tidak ada complaint 24 jam setelah perbaikan.',
      reward_points: 120,
      status: 'Approved',
      detail_completed: true,
      detail_completed_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'a0000000-0000-0000-0000-000000000002',
      title: 'Cek kebocoran pipa lantai 3',
      description: 'Laporan kebocoran kecil di pantry lantai 3. Cek sumber kebocoran dan dokumentasikan kondisi pipa.',
      assigned_to: '00000000-0000-0000-0000-000000000003',
      created_by: '00000000-0000-0000-0000-000000000001',
      difficulty: 'D',
      deadline: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      success_parameter: 'Sumber kebocoran ditemukan, foto kondisi terlampir, estimasi perbaikan disiapkan.',
      reward_points: 60,
      status: 'Active',
      detail_completed: true,
      detail_completed_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'a0000000-0000-0000-0000-000000000003',
      title: 'Pengajuan quotation genset cadangan',
      description: 'Minta minimal 2 penawaran dari vendor untuk genset cadangan 100kVA. Bandingkan spesifikasi dan harga.',
      assigned_to: '00000000-0000-0000-0000-000000000004',
      created_by: '00000000-0000-0000-0000-000000000001',
      difficulty: 'C',
      deadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      success_parameter: 'Minimal 2 quotation dari vendor berbeda, file PDF terlampir, rekomendasi vendor disertakan.',
      reward_points: 80,
      status: 'Submitted',
      detail_completed: true,
      detail_completed_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'a0000000-0000-0000-0000-000000000004',
      title: 'Audit stok spare part AC',
      description: 'Cek dan hitung ulang stok spare part AC di gudang. Update spreadsheet stok dan laporkan jika ada yang habis.',
      assigned_to: '00000000-0000-0000-0000-000000000002',
      created_by: '00000000-0000-0000-0000-000000000001',
      difficulty: 'E',
      deadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      success_parameter: 'Spreadsheet stok diupdate, foto kondisi gudang terlampir, list item yang perlu restock disiapkan.',
      reward_points: 40,
      status: 'Active',
      detail_completed: true,
      detail_completed_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'a0000000-0000-0000-0000-000000000005',
      title: 'Koordinasi vendor lift RSIA',
      description: null,
      assigned_to: '00000000-0000-0000-0000-000000000007',
      created_by: '00000000-0000-0000-0000-000000000001',
      difficulty: 'A',
      deadline: null,
      success_parameter: null,
      reward_points: 150,
      status: 'Draft',
      detail_completed: false,
      detail_completed_at: null,
      created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'a0000000-0000-0000-0000-000000000006',
      title: 'Laporan bulanan maintenance Mei',
      description: 'Buat laporan rekap seluruh pekerjaan maintenance bulan Mei. Format PDF, kirim ke direktur.',
      assigned_to: '00000000-0000-0000-0000-000000000005',
      created_by: '00000000-0000-0000-0000-000000000001',
      difficulty: 'D',
      deadline: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      success_parameter: 'PDF laporan selesai, sudah dikirim ke direktur, konfirmasi penerimaan screenshot.',
      reward_points: 70,
      status: 'Approved',
      detail_completed: true,
      detail_completed_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'a0000000-0000-0000-0000-000000000007',
      title: 'Instalasi CCTV gudang baru',
      description: 'Pasang 4 unit CCTV di gudang baru area B. Koordinasi dengan kontraktor, pastikan semua sudut terpantau.',
      assigned_to: '00000000-0000-0000-0000-000000000006',
      created_by: '00000000-0000-0000-0000-000000000001',
      difficulty: 'B',
      deadline: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      success_parameter: 'Semua 4 CCTV aktif dan terekam, foto instalasi, screenshot live feed dari NVR.',
      reward_points: 100,
      status: 'Revise',
      detail_completed: true,
      detail_completed_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'a0000000-0000-0000-0000-000000000008',
      title: 'Pembersihan AHU rooftop',
      description: 'Bersihkan filter dan blower AHU di rooftop. Jadwalkan dengan tim kebersihan.',
      assigned_to: '00000000-0000-0000-0000-000000000003',
      created_by: '00000000-0000-0000-0000-000000000001',
      difficulty: 'D',
      deadline: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      success_parameter: 'Filter bersih, foto before-after terlampir, log pembersihan ditandatangani.',
      reward_points: 0,
      status: 'Failed',
      detail_completed: true,
      detail_completed_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'a0000000-0000-0000-0000-000000000009',
      title: 'Update SOP emergency genset',
      description: 'Revisi SOP prosedur darurat genset berdasarkan insiden bulan lalu. Konsultasi dengan kepala teknik.',
      assigned_to: '00000000-0000-0000-0000-000000000004',
      created_by: '00000000-0000-0000-0000-000000000001',
      difficulty: 'C',
      deadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      success_parameter: 'Dokumen SOP direvisi, disetujui kepala teknik, versi baru di-upload ke drive.',
      reward_points: 80,
      status: 'Active',
      detail_completed: true,
      detail_completed_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'a0000000-0000-0000-0000-000000000010',
      title: 'Survey lokasi proyek Sunter',
      description: null,
      assigned_to: '00000000-0000-0000-0000-000000000002',
      created_by: '00000000-0000-0000-0000-000000000001',
      difficulty: 'B',
      deadline: null,
      success_parameter: null,
      reward_points: 110,
      status: 'Draft',
      detail_completed: false,
      detail_completed_at: null,
      created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
    }
  ];

  for (const q of quests) {
    const { error } = await supabase.from('quests').insert(q);
    if (error) {
      console.error(`❌ Failed to insert quest "${q.title}":`, error.message);
    } else {
      console.log(`✅ Quest "${q.title}" inserted.`);
    }
  }

  console.log('--- SEEDING ATTACHMENTS ---');
  const attachments = [
    {
      id: 'b0000000-0000-0000-0000-000000000001',
      quest_id: 'a0000000-0000-0000-0000-000000000001',
      file_url: 'https://storage.example.com/attachments/ac-icu-before.jpg',
      file_type: 'image/jpeg',
      uploaded_by: '00000000-0000-0000-0000-000000000006',
      uploaded_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000002',
      quest_id: 'a0000000-0000-0000-0000-000000000001',
      file_url: 'https://storage.example.com/attachments/ac-icu-after.jpg',
      file_type: 'image/jpeg',
      uploaded_by: '00000000-0000-0000-0000-000000000006',
      uploaded_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000003',
      quest_id: 'a0000000-0000-0000-0000-000000000003',
      file_url: 'https://storage.example.com/attachments/quotation-genset-vendor-a.pdf',
      file_type: 'application/pdf',
      uploaded_by: '00000000-0000-0000-0000-000000000004',
      uploaded_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000004',
      quest_id: 'a0000000-0000-0000-0000-000000000003',
      file_url: 'https://storage.example.com/attachments/quotation-genset-vendor-b.pdf',
      file_type: 'application/pdf',
      uploaded_by: '00000000-0000-0000-0000-000000000004',
      uploaded_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000005',
      quest_id: 'a0000000-0000-0000-0000-000000000006',
      file_url: 'https://storage.example.com/attachments/laporan-maintenance-mei-2026.pdf',
      file_type: 'application/pdf',
      uploaded_by: '00000000-0000-0000-0000-000000000005',
      uploaded_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000006',
      quest_id: 'a0000000-0000-0000-0000-000000000007',
      file_url: 'https://storage.example.com/attachments/cctv-instalasi.jpg',
      file_type: 'image/jpeg',
      uploaded_by: '00000000-0000-0000-0000-000000000006',
      uploaded_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  for (const att of attachments) {
    const { error } = await supabase.from('attachments').insert(att);
    if (error) {
      console.error(`❌ Failed to insert attachment ${att.id}:`, error.message);
    } else {
      console.log(`... Attachment ${att.id} inserted.`);
    }
  }

  console.log('--- SEEDING POINT LOGS ---');
  const pointLogs = [
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      user_id: '00000000-0000-0000-0000-000000000006',
      quest_id: 'a0000000-0000-0000-0000-000000000001',
      delta: 120,
      reason: 'Quest approved: Perbaikan AC ICU Bella',
      created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000002',
      user_id: '00000000-0000-0000-0000-000000000005',
      quest_id: 'a0000000-0000-0000-0000-000000000006',
      delta: 70,
      reason: 'Quest approved: Laporan bulanan maintenance Mei',
      created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000003',
      user_id: '00000000-0000-0000-0000-000000000001',
      quest_id: 'a0000000-0000-0000-0000-000000000001',
      delta: 30,
      reason: 'Bonus GM: detail quest lengkap sebelum 21:00',
      created_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000004',
      user_id: '00000000-0000-0000-0000-000000000001',
      quest_id: 'a0000000-0000-0000-0000-000000000006',
      delta: 30,
      reason: 'Bonus GM: detail quest lengkap sebelum 21:00',
      created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000005',
      user_id: '00000000-0000-0000-0000-000000000001',
      quest_id: 'a0000000-0000-0000-0000-000000000005',
      delta: -20,
      reason: 'Penalti GM: detail quest belum lengkap melewati 00:00',
      created_at: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000006',
      user_id: '00000000-0000-0000-0000-000000000001',
      quest_id: 'a0000000-0000-0000-0000-000000000010',
      delta: -20,
      reason: 'Penalti GM: detail quest belum lengkap melewati 00:00',
      created_at: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
    }
  ];

  for (const log of pointLogs) {
    const { error } = await supabase.from('point_logs').insert(log);
    if (error) {
      console.error(`❌ Failed to insert point log ${log.id}:`, error.message);
    } else {
      console.log(`... Point log ${log.id} inserted.`);
    }
  }

  }

  console.log('--- SEEDING COMMENTS ---');
  const comments = [
    {
      quest_id: 'a0000000-0000-0000-0000-000000000001',
      user_id: '00000000-0000-0000-0000-000000000006',
      content: 'Pak, filter AC yang baru sudah dipasang ya. Airflow sudah normal.',
      created_at: new Date(now.getTime() - 2.1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      quest_id: 'a0000000-0000-0000-0000-000000000001',
      user_id: '00000000-0000-0000-0000-000000000001',
      content: 'Mantap, saya sudah approve quest ini. Terima kasih.',
      created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  for (const c of comments) {
    await supabase.from('quest_comments').insert(c);
  }

  console.log('--- SEEDING NOTIFICATIONS ---');
  const notifications = [
    {
      user_id: '00000000-0000-0000-0000-000000000006',
      title: 'Quest Approved',
      message: 'Perbaikan AC ICU Bella telah disetujui. +120 Poin!',
      link: '/quests/a0000000-0000-0000-0000-000000000001',
      is_read: false,
      created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      user_id: '00000000-0000-0000-0000-000000000001',
      title: 'New Comment',
      message: 'Christian berkomentar pada misi Perbaikan AC ICU Bella.',
      link: '/quests/a0000000-0000-0000-0000-000000000001',
      is_read: true,
      created_at: new Date(now.getTime() - 2.1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  for (const n of notifications) {
    await supabase.from('notifications').insert(n);
  }

  console.log('\n🌟 SEEDING COMPLETED SUCCESSFULLY! 🌟');
}

seed().catch(err => {
  console.error('Fatal seeding error:', err);
});
