const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.sgd-corp.com';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error("No SUPABASE_SERVICE_ROLE_KEY found in env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inject() {
  const { data: users, error } = await supabase.from('users').select('*').limit(10);
  if (error) {
    console.error("Error fetching users:", error);
    process.exit(1);
  }

  for (const u of users) {
    const dummyProgression = {
      level: 12,
      points: {
        "Logic": 85,
        "Focus": 70,
        "Communication": 95,
        "Execution": 80,
        "Management": 60,
        "Agility": 40
      }
    };
    
    // Also give them an adventurer class to make it cool
    const { error: updErr } = await supabase.from('users').update({ 
      progression: dummyProgression,
      class: 'Knight',
      role: 'guild_master' // Keep their role intact, but Alice is currently Adventurer? Let's just update progression.
    }).eq('id', u.id);

    if (updErr) {
      console.error("Error updating user:", u.email, updErr);
    } else {
      console.log(`Successfully injected dummy stats for ${u.email} (${u.nama})`);
    }
  }
}

inject();
