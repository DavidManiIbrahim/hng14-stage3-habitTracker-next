import { LayoutDashboard } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div 
      data-testid="splash-screen"
      className="min-h-screen flex flex-col items-center justify-center bg-gray-950"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 animate-pulse" />
        <div className="relative bg-blue-600 text-white p-6 rounded-3xl shadow-2xl animate-bounce">
          <LayoutDashboard size={48} />
        </div>
      </div>
      <div className="mt-8 text-center animate-fade-in">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Habit Tracker</h1>
        <div className="mt-2 flex items-center justify-center gap-1">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping" />
          <p className="text-gray-400 text-sm font-medium">Loading your journey...</p>
        </div>
      </div>
    </div>
  );
}