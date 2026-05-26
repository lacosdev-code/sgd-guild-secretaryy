const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Bypass self-signed cert

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

async function setupUsers() {
  const usersToCreate = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'reza@sgd-corp.com',
      password: 'password123',
      name: 'Reza'
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'pris@sgd-corp.com',
      password: 'password123',
      name: 'Pris'
    }
  ];

  for (const user of usersToCreate) {
    console.log(`\nMembuat user ${user.name} (${user.email})...`);
    const { data, error } = await supabase.auth.admin.createUser({
      id: user.id,
      email: user.email,
      password: user.password,
      email_confirm: true
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`✅ User ${user.email} sudah ada di database.`);
      } else {
        console.error(`❌ Gagal membuat ${user.email}:`, error.message);
      }
    } else {
      console.log(`✅ Berhasil membuat ${user.email} dengan ID ${data.user.id}`);
    }
  }
}

setupUsers().then(() => console.log('\nSelesai!'));
