import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hhgcffryalqfcgmbgmml.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoZ2NmZnJ5YWxxZmNnbWJnbW1sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTgwNzQ1NSwiZXhwIjoyMDk1MzgzNDU1fQ.UbSGX1370nmJioknFdvvETZ4BLnfAqHod4i3-r8rayo'
);

async function check() {
  const { data: tables, error: tableErr } = await supabase.from('users').select('count', { count: 'exact', head: true });
  console.log("Users table check:", tableErr ? "Error: " + tableErr.message : "Exists, rows: " + tables);

  const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
  console.log("Buckets:", bucketErr ? bucketErr : buckets.map(b => b.name));
}

check();
