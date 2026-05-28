const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'supabase', 'migrations');
const files = [
  '001_init_schema.sql',
  '002_rpc_and_storage.sql',
  '003_comments_notifications.sql',
  '004_add_avatar_and_bucket.sql',
  '005_seed_dummy_data.sql',
  '006_push_subscriptions.sql'
];

let combined = '';
for (const file of files) {
  combined += fs.readFileSync(path.join(dir, file), 'utf8') + '\n\n';
}

fs.writeFileSync(path.join(dir, 'all_migrations_combined.sql'), combined);
console.log('Combined migrations written to all_migrations_combined.sql');
