// Test runner that outputs to file
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\HP\\Documents\\HNG14\\STAGE3TASK\\habit-Tracker-next';
const outputFile = path.join(projectDir, 'test-results.log');

console.log('Running tests...');

// Use spawn to avoid hanging
const { spawn } = require('child_process');
const proc = spawn('npx', ['vitest', 'run', '--reporter=basic'], {
  cwd: projectDir,
  shell: true,
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';

proc.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  process.stdout.write(text);
});

proc.stderr.on('data', (data) => {
  const text = data.toString();
  output += text;
  process.stderr.write(text);
});

proc.on('close', (code) => {
  fs.writeFileSync(outputFile, output);
  console.log('\n--- Results saved to test-results.log ---');
  process.exit(code);
});

proc.on('error', (err) => {
  fs.writeFileSync(outputFile, 'Error: ' + err.message);
  process.exit(1);
});