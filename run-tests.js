// Simple test runner that avoids interactive prompts
import { execSync } from 'child_process';
import { spawn } from 'child_process';

function runTests() {
  console.log('Running unit tests...');
  
  try {
    // Run vitest with non-interactive mode
    const result = spawn('npx', ['vitest', 'run', 'tests/unit/streaks.test.ts', '--reporter=basic'], {
      cwd: 'c:\\Users\\HP\\Documents\\HNG14\\STAGE3TASK\\habit-Tracker-next',
      stdio: 'pipe',
      shell: true
    });
    
    result.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    result.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    result.on('close', (code) => {
      console.log(`Process exited with code ${code}`);
      process.exit(code || 0);
    });
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

runTests();