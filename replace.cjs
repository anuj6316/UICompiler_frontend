const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/rounded-2xl/g, 'rounded-none');
  content = content.replace(/rounded-xl/g, 'rounded-none');
  content = content.replace(/rounded-lg/g, 'rounded-none');
  content = content.replace(/rounded-md/g, 'rounded-none');
  content = content.replace(/rounded-full/g, 'rounded-none');
  
  // Restore rounded-full for the spinner and notification dot
  content = content.replace(/rounded-none animate-spin/g, 'rounded-full animate-spin');
  content = content.replace(/w-2 h-2 bg-rose-500 rounded-none/g, 'w-2 h-2 bg-rose-500 rounded-full');

  fs.writeFileSync(filePath, content);
});

console.log('Done');
