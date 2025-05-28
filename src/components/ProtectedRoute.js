'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Protected route component
export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // If authentication state is no longer loading and there's no user, redirect to login
    if (!loading) {
      if (!currentUser) {
        router.push('/login');
      } else {
        setIsVerifying(false);
      }
    }
  }, [currentUser, loading, router]);

  // Show loading state while verifying authentication
  if (loading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400 mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Render children only when authenticated
  return <>{children}</>;
}
