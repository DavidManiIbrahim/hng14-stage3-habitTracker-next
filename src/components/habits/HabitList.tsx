'use client';

import { Habit } from '@/types/habit';
import { HabitCard } from './HabitCard';
import { Plus } from 'lucide-react';

interface HabitListProps {
  habits: Habit[];
  onUpdate: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (habit: Habit) => void;
}

export function HabitList({ habits, onUpdate, onDelete, onToggleComplete }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div data-testid="empty-state" className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-inner border border-gray-100 dark:border-gray-800">
        <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus size={32} className="text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">No habits yet.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start by creating your first daily habit!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {habits.map((habit) => (
        <div key={habit.id} className="w-full">
          <HabitCard
            habit={habit}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
          />
        </div>
      ))}
    </div>
  );
}
