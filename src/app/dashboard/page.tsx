'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, clearSession } from '@/lib/auth';
import { getUserHabits, createHabit, updateHabit, deleteHabit, toggleHabitCompletion } from '@/lib/habits';
import { Habit, HabitPriority } from '@/types/habit';
import { HabitList } from '@/components/habits/HabitList';
import HabitForm from '@/components/habits/HabitForm';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { LogOut, LayoutDashboard, Plus } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = () => {
    const session = getSession();
    if (session) {
      const userHabits = getUserHabits(session.userId);
      setHabits(userHabits);
    }
  };

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  const handleCreateHabit = (data: {
    name: string;
    description: string;
    priority: HabitPriority;
    dueDate: string;
  }) => {
    const session = getSession();
    if (!session) return;

    createHabit({
      userId: session.userId,
      name: data.name,
      description: data.description,
      frequency: 'daily',
      priority: data.priority,
      dueDate: data.dueDate,
    });

    setShowForm(false);
    loadHabits();
  };

  const handleUpdateHabit = (updated: Habit) => {
    updateHabit(updated);
    loadHabits();
  };

  const handleToggleComplete = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = toggleHabitCompletion(habit, today);
    updateHabit(updated);
    loadHabits();
  };

  const handleDelete = (id: string) => {
    deleteHabit(id);
    loadHabits();
  };

  return (
    <ProtectedRoute>
      <div data-testid="dashboard-page" className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Habit Tracker</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                data-testid="auth-logout-button"
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Habits</h2>
            <button
              data-testid="create-habit-button"
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 shadow-sm"
            >
              <Plus size={18} />
              <span>Add Habit</span>
            </button>
          </div>

          {showForm && (
            <HabitForm 
              onSubmit={handleCreateHabit} 
              onCancel={() => setShowForm(false)} 
            />
          )}

          <HabitList
            habits={habits}
            onUpdate={handleUpdateHabit}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}