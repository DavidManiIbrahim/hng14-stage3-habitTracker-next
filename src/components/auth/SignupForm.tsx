'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { findUserByEmail, createUser, setSession } from '@/lib/auth';
import { Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      setError('User already exists');
      return;
    }

    const user = createUser(email, password);
    setSession({ userId: user.id, email: user.email });
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
          <div className="w-1 h-4 bg-red-600 rounded-full" />
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
            data-testid="auth-signup-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all outline-none"
            placeholder="name@example.com"
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
            data-testid="auth-signup-password"
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
        data-testid="auth-signup-submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
      >
        <UserPlus size={20} />
        Create Account
      </button>

      {/* <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or join with</span>
        </div>
      </div> */}

      <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1">
          Log in <ArrowRight size={14} />
        </Link>
      </p>
    </form>
  );
}