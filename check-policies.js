const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tbbrzfbxqzlqqgvukwvu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiYnJ6ZmJ4cXpscXFndnVrd3Z1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc5MDE4NSwiZXhwIjoyMDk1MzY2MTg1fQ.FMKzEG1OYZx0BmEiI6tbqf3YEeXAf7zKKvlS1n448o4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.rpc('get_policies', { table_name: 'users' });
  // If rpc doesn't exist, let's query pg_policies using sql via rest if possible? 
  // No, we can't run raw SQL easily via supabase-js without a custom RPC or using the Postgres connection string.
}
check();
