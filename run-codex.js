const { spawnSync } = require('child_process');
const fs = require('fs');
const prompt = fs.readFileSync('codex-prompt.txt', 'utf8');
const result = spawnSync('codex', ['exec', '--full-auto', prompt], {
  stdio: 'inherit',
  shell: false,
  cwd: __dirname,
  windowsVerbatimArguments: false
});
process.exit(result.status || 0);
