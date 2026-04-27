'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { 
  Pencil, 
  Trash2, 
  Flame, 
  CheckCircle2, 
  Circle,
  Save,
  X
} from 'lucide-react';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';

interface HabitCardProps {
  habit: Habit;
  onUpdate: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (habit: Habit) => void;
}

export function HabitCard({ habit, onUpdate, onDelete, onToggleComplete }: HabitCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const [editDescription, setEditDescription] = useState(habit.description);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);

  const handleSave = () => {
    onUpdate({
      ...habit,
      name: editName,
      description: editDescription,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div 
        data-testid={`habit-card-${slug}`}
        className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <div className="space-y-3">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            placeholder="Habit name"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            placeholder="Description"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <button
              onClick={handleSave}
              className="p-2 text-blue-600 hover:text-blue-700"
            >
              <Save size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      data-testid={`habit-card-${slug}`}
      className={`group bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border transition-all duration-300 hover:shadow-md ${
        isCompletedToday 
          ? 'border-green-100 dark:border-green-900/30' 
          : 'border-gray-100 dark:border-gray-800'
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggleComplete(habit)}
          className={`flex-shrink-0 transition-all duration-300 transform hover:scale-110 active:scale-95 ${
            isCompletedToday 
              ? 'text-green-500 dark:text-green-400' 
              : 'text-gray-300 dark:text-gray-600 hover:text-blue-400'
          }`}
        >
          {isCompletedToday ? (
            <CheckCircle2 size={32} className="fill-green-50" />
          ) : (
            <Circle size={32} />
          )}
        </button>

        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold truncate text-lg transition-colors ${
              isCompletedToday ? 'text-gray-500 line-through decoration-2' : 'text-gray-900 dark:text-white'
            }`}>
              {habit.name}
            </h3>
            <span 
              data-testid={`habit-streak-${slug}`}
              className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-lg text-xs font-bold"
            >
              <Flame size={14} className="fill-orange-500" />
              {streak} streak
            </span>
          </div>
          {habit.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
              {habit.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            data-testid={`habit-edit-${slug}`}
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
          >
            <Pencil size={18} />
          </button>
          
          {deleteConfirm ? (
            <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
              <button
                data-testid="confirm-delete-button"
                onClick={() => onDelete(habit.id)}
                className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <button
              data-testid={`habit-delete-${slug}`}
              onClick={() => setDeleteConfirm(true)}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
