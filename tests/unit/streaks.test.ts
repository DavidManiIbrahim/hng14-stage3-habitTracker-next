import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '@/lib/streaks';

/* MENTOR_TRACE_STAGE3_HABIT_A91 */
describe('calculateCurrentStreak', () => {
  const today = '2024-01-15';

  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([], today)).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    expect(calculateCurrentStreak(['2024-01-14'], today)).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
    expect(calculateCurrentStreak([today], today)).toBe(1);
    expect(calculateCurrentStreak(['2024-01-14', today], today)).toBe(2);
    expect(calculateCurrentStreak(['2024-01-13', '2024-01-14', today], today)).toBe(3);
  });

  it('ignores duplicate completion dates', () => {
    expect(calculateCurrentStreak([today, today, today], today)).toBe(1);
    expect(calculateCurrentStreak(['2024-01-14', today, today], today)).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    expect(calculateCurrentStreak(['2024-01-13', today], today)).toBe(1);
    expect(calculateCurrentStreak(['2024-01-12', '2024-01-14', today], today)).toBe(1);
  });
});