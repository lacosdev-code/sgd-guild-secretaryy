const fs = require('fs');

const sql = fs.readFileSync('migration_auth_public.sql', 'utf8');

const authUsersRegex = /INSERT INTO auth\.users \([^)]+\) VALUES \('[^']+', '([^']+)', '[^']+', '[^']+', '([^']+)', '([^']+)'/g;
let authUsers = {};
let match;
while ((match = authUsersRegex.exec(sql)) !== null) {
  authUsers[match[1]] = { email: match[2], password_hash: match[3] };
}

const lines = sql.split('\n');
let outLines = [];

for (let line of lines) {
  if (line.startsWith('INSERT INTO public.users')) {
    // INSERT INTO public.users (id, nama, role, total_points, created_at, avatar_url) VALUES ('...', '...', '...', ..., ...);
    const regex = /INSERT INTO public\.users \(([^)]+)\) VALUES \((.+)\);/;
    const m = line.match(regex);
    if (m) {
      let cols = m[1].split(',').map(s => s.trim());
      let valsStr = m[2];
      
      // We need to parse vals string. This is a bit tricky with commas inside strings, but for this data it might be simple enough:
      let vals = valsStr.split(/, /); 
      // The id is the first value, usually like '00000000...'
      let idStr = vals[0].replace(/'/g, '');
      
      let email = authUsers[idStr] ? authUsers[idStr].email : 'unknown@sgd-corp.com';
      let pass = authUsers[idStr] ? authUsers[idStr].password_hash : '';
      
      cols.push('email');
      cols.push('password_hash');
      
      vals.push(`'${email}'`);
      vals.push(`'${pass}'`);
      
      outLines.push(`INSERT INTO public.users (${cols.join(', ')}) VALUES (${vals.join(', ')});`);
    } else {
      outLines.push(line);
    }
  } 
  else if (line.startsWith('ALTER TABLE auth.')) { continue; }
  else if (line.startsWith('INSERT INTO auth.')) { continue; }
  else if (line.includes('Schema: auth')) { continue; }
  else {
    outLines.push(line);
  }
}

fs.writeFileSync('coolify_migration.sql', outLines.join('\n'));
console.log('coolify_migration.sql created!');
