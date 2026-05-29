const fs = require('fs');
const sql = fs.readFileSync('coolify_migration.sql', 'utf8');

const routeContent = `import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const sql = \`${sql.replace(/`/g, '\\`')}\`;
    
    // Prisma $executeRawUnsafe runs raw SQL
    await prisma.$executeRawUnsafe(sql);
    
    return NextResponse.json({ success: true, message: 'Migration executed successfully!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
`;

fs.mkdirSync('src/app/api/migrate-now', { recursive: true });
fs.writeFileSync('src/app/api/migrate-now/route.ts', routeContent);
console.log('API route created!');
