const fs = require('fs');
const sql = fs.readFileSync('coolify_migration.sql', 'utf8');

// Filter out comments and empty lines
const lines = sql.split('\n');
let validLines = [];
for (let line of lines) {
  let trimmed = line.trim();
  if (trimmed.startsWith('--') || trimmed === '') continue;
  validLines.push(trimmed);
}

const cleanedSql = validLines.join('\n');
const statements = cleanedSql.split(';').map(s => s.trim()).filter(s => s.length > 0);

const routeContent = `import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const statements = ${JSON.stringify(statements)};
    
    for (const statement of statements) {
      await prisma.$executeRawUnsafe(statement);
    }
    
    return NextResponse.json({ success: true, message: 'Migration executed successfully! ' + statements.length + ' statements ran.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
`;

fs.writeFileSync('src/app/api/migrate-now/route.ts', routeContent);
console.log('API route updated with JSON array!');
