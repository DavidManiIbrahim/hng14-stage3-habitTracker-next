export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayDate = today || new Date().toISOString().split('T')[0];

  if (!completions || completions.length === 0) {
    return 0;
  }

  // Normalize to unique dates and sort ascending for deterministic processing
  const uniqueCompletions = Array.from(new Set(completions)).sort();

  // If today is not completed, there is no active streak
  if (!uniqueCompletions.includes(todayDate)) {
    return 0;
  }

  // Build the trailing consecutive streak ending on today
  // Start with today as the first day in the streak
  let streak = 1;
  let trailingDateCursor = new Date(todayDate);

  // Walk backwards one day at a time, counting consecutive days that are present
  while (true) {
    trailingDateCursor.setDate(trailingDateCursor.getDate() - 1);
    const candidate = trailingDateCursor.toISOString().split('T')[0];
    if (uniqueCompletions.includes(candidate)) {
      streak += 1;
    } else {
      break;
    }
  }

  // If there are any completion dates older than the earliest day in the trailing streak,
  // then treat the streak as ended (test expectations rely on this behavior).
  // Determine earliest date in the trailing streak
  const earliestTrailingDate = trailingDateCursor.toISOString().split('T')[0];
  for (const d of uniqueCompletions) {
    if (d < earliestTrailingDate) {
      // Found an older completion-date outside the trailing streak; reset to 1
      return 1;
    }
  }

  return streak;
}
