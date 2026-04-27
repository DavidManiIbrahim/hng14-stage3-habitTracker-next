import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/lib/habits';
import { Habit } from '@/types/habit';

describe('toggleHabitCompletion', () => {
  const createHabit = (completions: string[]): Habit => ({
    id: '1',
    userId: 'user-1',
    name: 'Test Habit',
    description: 'Test description',
    frequency: 'daily',
    createdAt: '2024-01-01T00:00:00.000Z',
    completions,
  });

  it('adds a completion date when the date is not present', () => {
    const habit = createHabit([]);
    const result = toggleHabitCompletion(habit, '2024-01-15');
    expect(result.completions).toContain('2024-01-15');
  });

  it('removes a completion date when the date already exists', () => {
    const habit = createHabit(['2024-01-15']);
    const result = toggleHabitCompletion(habit, '2024-01-15');
    expect(result.completions).not.toContain('2024-01-15');
  });

  it('does not mutate the original habit object', () => {
    const habit = createHabit([]);
    const originalCompletions = [...habit.completions];
    toggleHabitCompletion(habit, '2024-01-15');
    expect(habit.completions).toEqual(originalCompletions);
  });

  it('does not return duplicate completion dates', () => {
    const habit = createHabit(['2024-01-15']);
    const result = toggleHabitCompletion(habit, '2024-01-15');
    const duplicates = result.completions.filter((date, index) => 
      result.completions.indexOf(date) !== index
    );
    expect(duplicates).toHaveLength(0);
  });
});