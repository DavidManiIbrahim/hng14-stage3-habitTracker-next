// Test runner script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\HP\\Documents\\HNG14\\STAGE3TASK\\habit-Tracker-next';

try {
  console.log('Running vitest...');
  const output = execSync('npx vitest run', {
    cwd: projectDir,
    encoding: 'utf-8',
    timeout: 180000,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  console.log('Output:', output);
  fs.writeFileSync(path.join(projectDir, 'test-results.log'), output);
} catch (error) {
  console.log('STDOUT:', error.stdout);
  console.log('STDERR:', error.stderr);
  console.log('Exit code:', error.status);
  
  if (error.stdout) {
    fs.writeFileSync(path.join(projectDir, 'test-results.log'), error.stdout);
  }
}