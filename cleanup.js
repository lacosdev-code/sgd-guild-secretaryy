const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next') walkDir(dirPath, callback);
    } else {
      if (f.endsWith('.ts') || f.endsWith('.tsx')) callback(dirPath);
    }
  });
}

let files = [];
walkDir('./src', (p) => files.push(p));

let replacedAny = 0;
let replacedConsole = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // Replace catch (err: any) -> catch (error: unknown) { const err = error as Error;
  content = content.replace(/catch\s*\(\s*([a-zA-Z0-9_]+)\s*:\s*any\s*\)\s*\{/g, 'catch (error: unknown) {\n    const $1 = error as Error;');
  
  // Replace (session.user as any).role -> (session.user as { role?: string }).role
  content = content.replace(/\(session\.user\s+as\s+any\)\.role/g, '(session.user as { role?: string }).role');
  content = content.replace(/\(session\?.user\s+as\s+any\)\?.role/g, '(session?.user as { role?: string })?.role');
  
  // Clean console.logs from components (but keep in API/lib where they might be useful server-side, unless specified)
  if (file.includes('/components/') || file.includes('/app/(main)/')) {
    content = content.replace(/^\s*console\.(log|warn|error)\(.*$/gm, '');
  }

  // Common any replacements
  content = content.replace(/data\.map\(\([a-zA-Z0-9_]+\s*:\s*any\)\s*=>/g, match => match.replace(': any', ': { id: string, [key: string]: any }'));
  content = content.replace(/filter\(\([a-zA-Z0-9_]+\s*:\s*any\)\s*=>/g, match => match.replace(': any', ': { id: string, [key: string]: any }'));
  content = content.replace(/find\(\([a-zA-Z0-9_]+\s*:\s*any\)\s*=>/g, match => match.replace(': any', ': { id: string, [key: string]: any }'));
  content = content.replace(/\(quest\s*as\s*any\)\.assignee/g, '(quest as { assignee?: { nama: string } }).assignee');
  content = content.replace(/\(q\s*as\s*any\)\.assignee/g, '(q as { assignee?: { nama: string } }).assignee');
  
  // Vault route any
  content = content.replace(/const where: any = \{\}/g, 'const where: Record<string, unknown> = {}');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    replacedAny++;
  }
});

console.log(`Modified ${replacedAny} files for 'any' types and consoles.`);
