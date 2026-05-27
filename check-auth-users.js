const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tbbrzfbxqzlqqgvukwvu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiYnJ6ZmJ4cXpscXFndnVrd3Z1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc5MDE4NSwiZXhwIjoyMDk1MzY2MTg1fQ.FMKzEG1OYZx0BmEiI6tbqf3YEeXAf7zKKvlS1n448o4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error('Error fetching auth users:', authError);
    return;
  }
  
  const { data: publicUsers, error: publicError } = await supabase.from('users').select('*');
  if (publicError) {
    console.error('Error fetching public users:', publicError);
    return;
  }
  
  console.log('--- AUTH USERS ---');
  authUsers.users.forEach(u => console.log(u.id, u.email));
  
  console.log('\n--- PUBLIC USERS ---');
  console.log(publicUsers);
}
check();
