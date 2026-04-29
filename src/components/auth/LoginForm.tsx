'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { findUserByEmail, setSession } from '@/lib/auth';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      setError('Invalid email or password');
      return;
    }

    setSession({ userId: user.id, email: user.email });
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2 animate-shake">
          {error}
        </div>
      )}
      
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Mail size={18} />
          </div>
          <input
            id="email"
            type="email"
            data-testid="auth-login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all outline-none"
            placeholder="name@gmail.com"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Lock size={18} />
          </div>
          <input
            id="password"
            type="password"
            data-testid="auth-login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all outline-none"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        data-testid="auth-login-submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
      >
        <LogIn size={20} />
        Log In
      </button>

      

      <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1">
          Sign up <ArrowRight size={14} />
        </Link>
      </p>
    </form>
  );
}