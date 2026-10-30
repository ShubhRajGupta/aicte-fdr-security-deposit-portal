const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\Shubh108\\.gemini\\antigravity-ide\\scratch\\gsd-repo';
const cwd = process.cwd();

console.log('Setting up Antigravity Agent framework from:', src);

const itemsToCopy = ['.agent', '.agents', '.gemini', '.gsd', 'docs', 'adapters', 'PROJECT_RULES.md', 'GSD-STYLE.md', 'model_capabilities.yaml', 'VERSION'];

for (const item of itemsToCopy) {
  const srcPath = path.join(src, item);
  const destPath = path.join(cwd, item);
  if (fs.existsSync(srcPath)) {
    console.log(`Copying ${item}...`);
    fs.cpSync(srcPath, destPath, { recursive: true, force: true });
  }
}

console.log('Agent setup successfully completed.');
