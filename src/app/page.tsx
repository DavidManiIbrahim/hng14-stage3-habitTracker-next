'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/shared/SplashScreen';
import { getSession } from '@/lib/auth';

const SPLASH_DURATION_MS = 1200;

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const session = getSession();
      router.replace(session ? '/dashboard' : '/login');
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  return <SplashScreen />;
}
