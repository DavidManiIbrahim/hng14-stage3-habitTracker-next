'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/shared/SplashScreen';
import { getSession } from '@/lib/auth';

const SPLASH_DURATION_MS = 1200;

export default function HomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const timer = setTimeout(() => {
      // Get session on client side only
      let session = null;
      try {
        session = getSession();
      } catch (e) {
        console.error('Error getting session:', e);
      }

      const destination = session ? '/dashboard' : '/login';
      
      // Use window.location for more reliable redirect
      if (typeof window !== 'undefined') {
        window.location.href = destination;
      }
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [ready]);

  return <SplashScreen />;
}
