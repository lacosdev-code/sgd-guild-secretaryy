const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://tbbrzfbxqzlqqgvukwvu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiYnJ6ZmJ4cXpscXFndnVrd3Z1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTc5MDE4NSwiZXhwIjoyMDk1MzY2MTg1fQ.FMKzEG1OYZx0BmEiI6tbqf3YEeXAf7zKKvlS1n448o4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.rpc('get_policies'); // won't work if not defined
}
check();
