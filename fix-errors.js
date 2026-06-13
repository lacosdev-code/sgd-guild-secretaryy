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

walkDir('./src', (file) => {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // Replace `const error = error as Error;` with `const errObj = error as Error;` and replace usages.
  // Actually, easier is to change `catch (error: unknown)` to `catch (e: unknown)` and `const error = e as Error;`
  content = content.replace(/catch\s*\(\s*error\s*:\s*unknown\s*\)\s*\{\s*const\s+error\s*=\s*error\s*as\s*Error;/g, 'catch (e: unknown) {\n    const error = e as Error;');

  // Also fix lib/auth.ts TS2322: Type 'unknown' is not assignable to type 'string | undefined'.
  // It was `(session.user as { role?: string }).role` -> wait, token.role is `string | undefined`.
  content = content.replace(/;\(session\?.user\s+as\s+\{\s*role\?:\s*string\s*\}\)\?.role\s*=\s*token\.role/g, ';(session.user as { role?: string }).role = token.role as string | undefined');
  content = content.replace(/\(session\.user\s+as\s+\{\s*role\?:\s*string\s*\}\)\.role\s*=\s*token\.role/g, '(session.user as { role?: string }).role = token.role as string | undefined');

  // Also fix lib/webpush.ts TS2339: Property 'statusCode' does not exist on type 'Error'.
  // I will just cast error to any there or create a custom interface, since it's WebPushError.
  content = content.replace(/err\.statusCode/g, '(err as any).statusCode');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});

