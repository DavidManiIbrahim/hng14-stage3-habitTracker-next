'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/shared/SplashScreen';
import { getSession } from '@/lib/auth';

const SPLASH_DURATION_MS = 1200;

export default function HomePage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Get session on client side only
      let session = null;
      try {
        session = getSession();
      } catch (e) {
        console.error('Error getting session:', e);
      }

      const destination = session ? '/dashboard' : '/login';
      router.push(destination);
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
