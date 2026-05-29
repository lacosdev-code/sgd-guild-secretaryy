const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://api.sgd-corp.com', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc3OTk5MjY0MCwiZXhwIjo0OTM1NjY2MjQwLCJyb2xlIjoiYW5vbiJ9.QY7BMyTYJ9ujbP61ZKE4HUTzYpeHsbSWc52m192vZQw');

async function test() {
  console.log("Starting login...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'reza@sgd-corp.com',
    password: 'wrongpassword'
  });
  console.log("Result:", { data, error });
}
test();
