const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../d:/project/portfolio-next/src');

function findScssFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findScssFiles(filePath, fileList);
    } else if (filePath.endsWith('.scss')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const scssFiles = findScssFiles('d:/project/portfolio-next/src');

const replacements = [
  // Background Cards (usually rgba(20,5,40,alpha))
  { search: /rgba\(\s*20\s*,\s*5\s*,\s*40\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--bg-card-rgb), $1)' },
  { search: /rgba\(\s*10\s*,\s*0\s*,\s*20\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--bg-dark-rgb), $1)' },
  { search: /rgba\(\s*45\s*,\s*15\s*,\s*80\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--bg-hover-rgb), $1)' },
  { search: /rgba\(\s*40\s*,\s*15\s*,\s*80\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--bg-card-rgb), $1)' },
  
  // Borders
  { search: /rgba\(\s*139\s*,\s*92\s*,\s*246\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--border-rgb), $1)' },
  { search: /rgba\(\s*180\s*,\s*110\s*,\s*255\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--border-bright-rgb), $1)' },
  
  // Custom Accents with opacity
  { search: /rgba\(\s*132\s*,\s*43\s*,\s*226\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--accent-glow-rgb), $1)' },
  { search: /rgba\(\s*229\s*,\s*229\s*,\s*229\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--text-muted-rgb), $1)' },
  { search: /rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--white-rgb), $1)' },
  { search: /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--shadow-rgb), $1)' },
  
  // Solid Hex Colors
  { search: /#ffffff/gi, replace: 'var(--text-primary)' },
  { search: /#fff(?![A-Fa-f0-9])/gi, replace: 'var(--text-primary)' },
  { search: /#e5e5e5/gi, replace: 'var(--text-primary)' },
  { search: /#a3a3a3/gi, replace: 'var(--text-secondary)' },
  { search: /#dad8d8/gi, replace: 'var(--text-secondary)' },
  
  // Accent Solids
  { search: /#842be2/gi, replace: 'var(--accent-primary)' },
  { search: /#b46eff/gi, replace: 'var(--accent-secondary)' },
  { search: /#dfb4ff/gi, replace: 'var(--accent-light)' },
  { search: /#e879f9/gi, replace: 'var(--accent-pink)' },
  { search: /#5c13aa/gi, replace: 'var(--accent-dark)' }
];

let changedCount = 0;

scssFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  replacements.forEach(rule => {
    content = content.replace(rule.search, rule.replace);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
    changedCount++;
  }
});

console.log(`\nFinished replacing colors. Modified ${changedCount} file(s).`);
