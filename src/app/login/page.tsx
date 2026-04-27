import LoginForm from '@/components/auth/LoginForm';
import { LayoutDashboard } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072&auto=format&fit=crop")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80 z-0" />

      <div className="w-full max-w-md relative z-10 px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-4 shadow-xl shadow-blue-500/20">
            <LayoutDashboard size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Habit Tracker</h1>
          <p className="text-gray-300 mt-2 font-medium">Transform your life, one habit at a time.</p>
        </div>
        
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          <LoginForm />
        </div>
        
        <p className="text-center mt-8 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Habit Tracker. All rights reserved.
        </p>
      </div>
    </div>
  );
}