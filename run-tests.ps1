const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\HP\\Documents\\HNG14\\STAGE3TASK\\habit-Tracker-next';

console.log('Starting test run...');

const child = exec('npx vitest run', {
  cwd: projectDir,
  timeout: 120000
}, (error, stdout, stderr) => {
  const output = stdout + '\n' + stderr;
  console.log('Output:', output);
  fs.writeFileSync(path.join(projectDir, 'test-output.txt'), output);
  console.log('Results written to test-output.txt');
  process.exit(error ? 1 : 0);
});

child.stdout.on('data', (data) => console.log(data.toString()));
child.stderr.on('data', (data) => console.error(data.toString()));