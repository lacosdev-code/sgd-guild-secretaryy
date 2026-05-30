const fs = require('fs');
const sql = fs.readFileSync('coolify_migration.sql', 'utf8');

const routeContent = `import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const rawSql = \`${sql.replace(/`/g, '\\`')}\`;
    const statements = rawSql.split(';').filter(s => s.trim().length > 0);
    
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
console.log('API route updated!');
