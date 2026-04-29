'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check session immediately on mount
    const session = getSession();
    if (!session) {
      router.push('/login');
      setIsLoading(false);
    } else {
      setIsAuthorized(true);
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    // Show nothing while checking auth
    return null;
  }

  if (!isAuthorized) {
    // Show nothing while redirecting
    return null;
  }

  return <>{children}</>;
}
