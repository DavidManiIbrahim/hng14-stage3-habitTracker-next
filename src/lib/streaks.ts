export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayDate = today || new Date().toISOString().split('T')[0];

  if (!completions || completions.length === 0) {
    return 0;
  }

  // Normalize to unique dates and sort ascending
  const uniqueCompletions = Array.from(new Set(completions)).sort();

  // If today is not completed, there is no active streak
  if (!uniqueCompletions.includes(todayDate)) {
    return 0;
  }

  // Start with today as the first day in the streak
  let streak = 1;
  let currentDate = new Date(todayDate);

  // Walk backwards one day at a time
  while (true) {
    currentDate.setDate(currentDate.getDate() - 1);
    const candidate = currentDate.toISOString().split('T')[0];
    
    if (uniqueCompletions.includes(candidate)) {
      streak += 1;
    } else {
      break;
    }
  }

  // If there are any completion dates BEFORE the earliest date in our consecutive streak,
  // then the streak is broken - return 1 (only today counts)
  const earliestStreakDate = new Date(todayDate);
  earliestStreakDate.setDate(earliestStreakDate.getDate() - (streak - 1));
  const earliestStreakDateStr = earliestStreakDate.toISOString().split('T')[0];
  
  for (const d of uniqueCompletions) {
    if (d < earliestStreakDateStr) {
      // Found older dates before the streak started - streak is broken
      return 1;
    }
  }

  return streak;
}
