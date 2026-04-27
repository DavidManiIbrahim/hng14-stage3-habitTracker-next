export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayDate = today || new Date().toISOString().split('T')[0];
  
  if (!completions || completions.length === 0) {
    return 0;
  }
  
  // Remove duplicates
  const uniqueCompletions = [...new Set(completions)];
  
  // Sort by date
  const sorted = [...uniqueCompletions].sort();
  
  // Check if today is completed
  if (!sorted.includes(todayDate)) {
    return 0;
  }
  
  // Count consecutive days backwards from today
  let streak = 0;
  let currentDate = new Date(todayDate);
  
  for (let i = sorted.length - 1; i >= 0; i--) {
    const completionDate = new Date(sorted[i]);
    const expectedDate = new Date(currentDate);
    
    // Reset time to compare dates only
    expectedDate.setHours(0, 0, 0, 0);
    completionDate.setHours(0, 0, 0, 0);
    
    if (completionDate.getTime() === expectedDate.getTime()) {
      streak++;
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (completionDate.getTime() < expectedDate.getTime()) {
      // Gap found, streak is broken
      break;
    }
  }
  
  return streak;
}