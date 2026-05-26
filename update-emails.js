const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const SUPABASE_URL = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const SUPABASE_SERVICE_KEY = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const usersToUpdate = [
  { id: '00000000-0000-0000-0000-000000000001', email: 'reza@sgd-corp.com' },
  { id: '00000000-0000-0000-0000-000000000002', email: 'pris@sgd-corp.com' },
  { id: '00000000-0000-0000-0000-000000000003', email: 'ervan@sgd-corp.com' },
  { id: '00000000-0000-0000-0000-000000000004', email: 'siska@sgd-corp.com' },
  { id: '00000000-0000-0000-0000-000000000005', email: 'santi@sgd-corp.com' },
  { id: '00000000-0000-0000-0000-000000000006', email: 'christian@sgd-corp.com' },
  { id: '00000000-0000-0000-0000-000000000007', email: 'bruno@sgd-corp.com' }
];

async function updateEmails() {
  for (const user of usersToUpdate) {
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { email: user.email }
    );
    if (error) {
      console.error(`Failed to update ${user.id} to ${user.email}:`, error.message);
    } else {
      console.log(`Successfully updated ${user.id} to ${user.email}`);
    }
  }
}

updateEmails();
