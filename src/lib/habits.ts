import { Habit } from '@/types/habit';
import { getItem, setItem } from './storage';
import { HABITS_KEY } from './constants';

export function getHabits(): Habit[] {
  return getItem<Habit[]>(HABITS_KEY) || [];
}

export function saveHabits(habits: Habit[]): void {
  setItem(HABITS_KEY, habits);
}

export function getUserHabits(userId: string): Habit[] {
  return getHabits().filter(h => h.userId === userId);
}

export function findHabitById(id: string): Habit | undefined {
  return getHabits().find(h => h.id === id);
}

export function createHabit(habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>): Habit {
  const habits = getHabits();
  const newHabit: Habit = {
    ...habitData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    completions: [],
  };
  
  saveHabits([...habits, newHabit]);
  return newHabit;
}

export function updateHabit(habit: Habit): void {
  const habits = getHabits();
  const index = habits.findIndex(h => h.id === habit.id);
  if (index !== -1) {
    habits[index] = habit;
    saveHabits(habits);
  }
}

export function deleteHabit(id: string): void {
  const habits = getHabits().filter(h => h.id !== id);
  saveHabits(habits);
}

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const isCompleted = habit.completions.includes(date);
  const updatedCompletions = isCompleted
    ? habit.completions.filter(c => c !== date)
    : [...habit.completions, date];
  
  // Rule: the returned habit must not contain duplicate dates
  const uniqueCompletions = [...new Set(updatedCompletions)];
  
  // Rule: the original input should not be mutated
  return {
    ...habit,
    completions: uniqueCompletions,
  };
}
