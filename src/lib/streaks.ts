export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayDate = today || new Date().toISOString().split('T')[0];
  
  if (!completions || completions.length === 0) {
    return 0;
  }
  
  // Remove duplicates and sort ascending
  const uniqueCompletions = [...new Set(completions)].sort();
  
  // Check if today is completed
  if (!uniqueCompletions.includes(todayDate)) {
    return 0;
  }
  
  // Find the index of today
  const todayIndex = uniqueCompletions.indexOf(todayDate);
  
  // Count consecutive days from today going backwards
  // IMPORTANT: Each date must be exactly one day before the previous
  let streak = 0;
  let expectedDate = new Date(todayDate);
  
  for (let i = todayIndex; i >= 0; i--) {
    const completionDate = uniqueCompletions[i];
    const expectedDateStr = expectedDate.toISOString().split('T')[0];
    
    if (completionDate === expectedDateStr) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      // Gap found - streak is broken
      break;
    }
  }
  
  return streak;
}