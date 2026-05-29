const fs = require('fs');
const path = require('path');

const replacements = {
  'detail_completed': 'detailCompleted',
  'target_date': 'targetDate',
  'is_recurring': 'isRecurring',
  'cron_expression': 'cronExpression',
  'file_url': 'fileUrl',
  'file_type': 'fileType',
  'uploaded_by': 'uploadedBy'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [snake, camel] of Object.entries(replacements)) {
    if (content.includes(snake)) {
      content = content.replace(new RegExp(`\\b${snake}\\b`, 'g'), camel);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
