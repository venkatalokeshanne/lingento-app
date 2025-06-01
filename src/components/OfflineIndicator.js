'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(null); // Start with null to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set that we're on the client
    setIsClient(true);
    
    // Set initial online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online! 🌐', {
        duration: 3000,
        id: 'online-status'
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You are offline. Some features may be limited.', {
        duration: Infinity,
        id: 'offline-status'
      });
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't render anything until client-side hydration is complete
  if (!isClient || isOnline === null || isOnline) return null;

  return (
    <div className="offline-indicator">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
        <span>Offline</span>
      </div>
    </div>
  );
}
