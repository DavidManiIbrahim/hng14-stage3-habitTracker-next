// Quick test to verify streak calculation
const calculateCurrentStreak = (completions, today) => {
  const todayDate = today || new Date().toISOString().split('T')[0];
  
  if (!completions || completions.length === 0) {
    return 0;
  }
  
  const uniqueCompletions = [...new Set(completions)].sort();
  
  if (!uniqueCompletions.includes(todayDate)) {
    return 0;
  }
  
  let streak = 1;
  let currentDate = new Date(todayDate);
  
  currentDate.setDate(currentDate.getDate() - 1);
  
  for (let i = uniqueCompletions.indexOf(todayDate) - 1; i >= 0; i--) {
    const completionDate = uniqueCompletions[i];
    const expectedDateStr = currentDate.toISOString().split('T')[0];
    
    if (completionDate === expectedDateStr) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

// Test cases
const testCases = [
  { completions: [], today: '2024-01-15', expected: 0, name: 'empty' },
  { completions: ['2024-01-14'], today: '2024-01-15', expected: 0, name: 'today not completed' },
  { completions: ['2024-01-15'], today: '2024-01-15', expected: 1, name: 'single day' },
  { completions: ['2024-01-14', '2024-01-15'], today: '2024-01-15', expected: 2, name: 'two consecutive' },
  { completions: ['2024-01-13', '2024-01-14', '2024-01-15'], today: '2024-01-15', expected: 3, name: 'three consecutive' },
  { completions: ['2024-01-13', '2024-01-15'], today: '2024-01-15', expected: 1, name: 'gap in streak' },
  { completions: ['2024-01-12', '2024-01-14', '2024-01-15'], today: '2024-01-15', expected: 1, name: 'broken streak' },
];

console.log('Testing streak calculation:\n');
let passed = 0;
let failed = 0;

for (const tc of testCases) {
  const result = calculateCurrentStreak(tc.completions, tc.today);
  const status = result === tc.expected ? '✓ PASS' : '✗ FAIL';
  console.log(`${status}: ${tc.name}`);
  console.log(`  Input: completions=${JSON.stringify(tc.completions)}, today=${tc.today}`);
  console.log(`  Expected: ${tc.expected}, Got: ${result}`);
  console.log();
  
  if (result === tc.expected) passed++;
  else failed++;
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);