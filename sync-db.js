const { Client } = require('pg');

async function sync() {
  const source = new Client({ connectionString: 'postgresql://postgres:postgres@localhost:5433/guild_secretary' });
  const target = new Client({ connectionString: 'postgresql://sail:password@localhost:5432/laravel' });

  await source.connect();
  await target.connect();

  console.log('Connected to both databases.');

  // Disable FK checks on target
  await target.query('SET session_replication_role = replica;');

  const tables = [
    'users',
    'arcs',
    'projects',
    'vault_items',
    'quests',
    'attachments',
    'point_logs',
    'quest_comments',
    'notifications',
    'push_subscriptions',
    'email_logs',
    'user_skills'
  ];

  for (const table of tables) {
    console.log(`Syncing table: ${table}...`);
    
    // TRUNCATE target
    try {
      await target.query(`TRUNCATE TABLE "${table}" CASCADE;`);
    } catch (e) {
      console.log(`Warning: Failed to truncate ${table}:`, e.message);
    }

    // GET source data
    const res = await source.query(`SELECT * FROM "${table}";`);
    const rows = res.rows;
    if (rows.length === 0) {
      console.log(`  No data in ${table}.`);
      continue;
    }

    // Map column names
    const mappedRows = rows.map(row => {
      if (table === 'users') {
        // Map password_hash to password for Laravel
        if (row.password_hash !== undefined) {
          row.password = row.password_hash;
          delete row.password_hash;
        }
      }
      return row;
    });

    const columns = Object.keys(mappedRows[0]).map(c => `"${c}"`).join(', ');
    
    for (const row of mappedRows) {
      const values = Object.values(row);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      try {
        await target.query(`INSERT INTO "${table}" (${columns}) VALUES (${placeholders})`, values);
      } catch (e) {
        console.error(`  Error inserting into ${table}:`, e.message);
      }
    }
    console.log(`  Copied ${mappedRows.length} rows to ${table}.`);
  }

  // Enable FK checks
  await target.query('SET session_replication_role = DEFAULT;');

  await source.end();
  await target.end();
  console.log('Sync complete!');
}

sync().catch(console.error);
