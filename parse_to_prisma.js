const fs = require('fs');

const sql = fs.readFileSync('coolify_migration.sql', 'utf8');
const lines = sql.split('\n');

function parseInsert(line) {
  const regex = /INSERT INTO public\.([a-z_]+) \(([^)]+)\) VALUES \((.+)\);/;
  const match = line.match(regex);
  if (!match) return null;

  const table = match[1];
  const cols = match[2].split(',').map(s => s.trim());
  const valsStr = match[3];
  
  // parse values considering commas inside quotes
  const vals = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < valsStr.length; i++) {
    const c = valsStr[i];
    if (c === "'") inQuotes = !inQuotes;
    if (c === ',' && !inQuotes) {
      vals.push(current.trim());
      current = '';
    } else {
      current += c;
    }
  }
  vals.push(current.trim());

  let obj = {};
  for (let i = 0; i < cols.length; i++) {
    let v = vals[i];
    if (v === 'NULL') {
      obj[cols[i]] = null;
    } else if (v.startsWith("'") && v.endsWith("'")) {
      obj[cols[i]] = v.substring(1, v.length - 1);
    } else if (v === 'true' || v === 'false') {
      obj[cols[i]] = v === 'true';
    } else {
      obj[cols[i]] = Number(v);
    }
  }
  return { table, obj };
}

let db = {
  users: [],
  quests: [],
  attachments: [],
  guild_chat: [],
  notifications: [],
  point_logs: []
};

for (const line of lines) {
  if (line.startsWith('INSERT INTO public.')) {
    const res = parseInsert(line);
    if (res && db[res.table]) {
      db[res.table].push(res.obj);
    }
  }
}

// Convert column names from snake_case to camelCase
function toCamel(str) {
  return str.replace(/_([a-z])/g, function(g) { return g[1].toUpperCase(); });
}

function processTable(rows) {
  return rows.map(r => {
    let o = {};
    for (let k in r) {
      if (k === 'password_hash') {
        o['passwordHash'] = r[k];
      } else {
        o[toCamel(k)] = r[k];
      }
    }
    return o;
  });
}

const users = processTable(db.users);
const quests = processTable(db.quests).map(q => {
  // Fix dates
  if (q.deadline) q.deadline = new Date(q.deadline).toISOString();
  if (q.createdAt) q.createdAt = new Date(q.createdAt).toISOString();
  if (q.updatedAt) q.updatedAt = new Date(q.updatedAt).toISOString();
  if (q.detailCompletedAt) q.detailCompletedAt = new Date(q.detailCompletedAt).toISOString();
  return q;
});
const attachments = processTable(db.attachments).map(a => {
  if (a.uploadedAt) a.uploadedAt = new Date(a.uploadedAt).toISOString();
  return a;
});
const guildChats = processTable(db.guild_chat).map(c => {
  if (c.createdAt) c.createdAt = new Date(c.createdAt).toISOString();
  return c;
});
const notifications = processTable(db.notifications).map(n => {
  if (n.createdAt) n.createdAt = new Date(n.createdAt).toISOString();
  return n;
});
const pointLogs = processTable(db.point_logs).map(p => {
  if (p.createdAt) p.createdAt = new Date(p.createdAt).toISOString();
  return p;
});

const routeContent = `import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const users = ${JSON.stringify(users, null, 2)};
    const quests = ${JSON.stringify(quests, null, 2)};
    const attachments = ${JSON.stringify(attachments, null, 2)};
    const guildChats = ${JSON.stringify(guildChats, null, 2)};
    const notifications = ${JSON.stringify(notifications, null, 2)};
    const pointLogs = ${JSON.stringify(pointLogs, null, 2)};

    // Delete existing to prevent duplicate IDs
    await prisma.pointLog.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.guildChat.deleteMany({});
    await prisma.attachment.deleteMany({});
    await prisma.quest.deleteMany({});
    await prisma.user.deleteMany({});

    if (users.length) await prisma.user.createMany({ data: users });
    if (quests.length) await prisma.quest.createMany({ data: quests });
    if (attachments.length) await prisma.attachment.createMany({ data: attachments });
    if (guildChats.length) await prisma.guildChat.createMany({ data: guildChats });
    if (notifications.length) await prisma.notification.createMany({ data: notifications });
    if (pointLogs.length) await prisma.pointLog.createMany({ data: pointLogs });

    return NextResponse.json({ success: true, message: 'Migration via Prisma createMany executed successfully!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
  }
}
`;

fs.writeFileSync('src/app/api/migrate-now/route.ts', routeContent);
console.log('API route updated with Prisma createMany!');
