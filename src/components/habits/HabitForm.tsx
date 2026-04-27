'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { validateHabitName } from '@/lib/validators';

interface HabitFormProps {
  onSubmit: (data: {
    name: string;
    description: string;
  }) => void;
  onCancel: () => void;
}

export default function HabitForm({ onSubmit, onCancel }: HabitFormProps) {
  const [habitName, setHabitName] = useState('');
  const [habitDescription, setHabitDescription] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const validation = validateHabitName(habitName);
    if (!validation.valid) {
      setFormError(validation.error || 'Invalid habit name');
      return;
    }

    onSubmit({
      name: validation.value,
      description: habitDescription,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onCancel}
      />
      <form 
        data-testid="habit-form"
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-300"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Habit</h3>
          <button 
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {formError && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
            {formError}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Habit Name
            </label>
            <input
              id="habit-name"
              type="text"
              data-testid="habit-name-input"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Drink Water"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="habit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="habit-description"
              data-testid="habit-description-input"
              value={habitDescription}
              onChange={(e) => setHabitDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white h-24 resize-none"
              placeholder="Why is this habit important?"
            />
          </div>

          <div>
            <label htmlFor="habit-frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frequency
            </label>
            <select
              id="habit-frequency"
              data-testid="habit-frequency-select"
              value="daily"
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400"
            >
              <option value="daily">Daily</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            data-testid="habit-save-button"
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform active:scale-[0.98]"
          >
            Save Habit
          </button>
        </div>
      </form>
    </div>
  );
}
