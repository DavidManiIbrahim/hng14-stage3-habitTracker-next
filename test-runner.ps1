// Simple test runner
const { execSync } = require('child_process');

console.log('Starting tests...');

try {
  const result = execSync('npx vitest run', {
    cwd: 'c:\\Users\\HP\\Documents\\HNG14\\STAGE3TASK\\habit-Tracker-next',
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: 180000,
    shell: true
  });
  
  console.log('=== TEST OUTPUT ===');
  console.log(result);
  console.log('==================');
} catch (error) {
  console.log('=== TEST OUTPUT ===');
  console.log(error.stdout || error.message);
  console.log('==================');
  console.log('Exit code:', error.status);
}