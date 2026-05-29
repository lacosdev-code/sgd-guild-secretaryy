import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const NEW_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const NEW_SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OLD_SUPABASE_URL = 'https://tbbrzfbxqzlqqgvukwvu.supabase.co';

if (!NEW_SUPABASE_URL || !NEW_SUPABASE_SERVICE_KEY) {
  console.error("Missing env vars in .env.local");
  process.exit(1);
}

const supabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_KEY);

async function run() {
  const sql = fs.readFileSync('supabase_data_migration.sql', 'utf8');
  // Match INSERT INTO storage.objects ... VALUES ('id', 'bucket', 'name', ...)
  // The structure is: INSERT INTO storage.objects (id, bucket_id, name, ...) VALUES ('id', 'bucket', 'name', ...
  const regex = /INSERT INTO storage\.objects \([^)]+\) VALUES \('[^']+', '([^']+)', '([^']+)'/g;
  
  let match;
  let count = 0;
  while ((match = regex.exec(sql)) !== null) {
    const bucket = match[1];
    const path = match[2];
    console.log(`Found file: [${bucket}] ${path}`);
    
    // Download from old
    const publicUrl = `${OLD_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
    try {
      const res = await fetch(publicUrl);
      if (!res.ok) {
        console.error(`Failed to download ${publicUrl}: ${res.statusText}`);
        continue;
      }
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Upload to new
      const { data, error } = await supabase.storage.from(bucket).upload(path, buffer, {
        upsert: true,
        contentType: res.headers.get('content-type') || 'application/octet-stream'
      });
      
      if (error) {
        console.error(`Error uploading ${path} to ${bucket}:`, error.message);
      } else {
        console.log(`Successfully migrated ${path} to ${bucket}!`);
        count++;
      }
    } catch (e) {
      console.error(`Error processing ${path}:`, e.message);
    }
  }
  console.log(`Migrated ${count} storage files.`);
}

run();
