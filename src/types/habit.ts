export type HabitPriority = 'low' | 'medium' | 'high';

export type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily';
  priority: HabitPriority;
  dueDate: string;
  createdAt: string;
  completions: string[];
};
