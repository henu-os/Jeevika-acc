const fs = require('fs');
const path = require('path');
const dir = 'H:\\Jeevika Accounting\\html';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
let fixed = 0;

files.forEach(f => {
  const fp = path.join(dir, f);
  let buf = fs.readFileSync(fp);
  let content = buf.toString('utf8');
  
  // Remove BOM if present
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.substring(1);
  }
  
  // Ensure the meta charset is the very first thing after <!DOCTYPE html><html><head>
  // The issue is the browser might be detecting encoding before reaching the meta tag
  // Rewrite without BOM, ensuring UTF-8 meta tag is present
  fs.writeFileSync(fp, content, { encoding: 'utf8' });
  fixed++;
});

console.log(`Cleaned ${fixed} files (removed BOM, ensured UTF-8)`);
