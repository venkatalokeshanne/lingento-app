'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePWA } from '@/hooks/usePWA';

export default function UpdateNotification() {
  const { isUpdateAvailable, updateApp } = usePWA();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && isUpdateAvailable) {
      // Show notification to user about update
      toast.custom(
        (t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New version available!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Click to reload and use the latest version.
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => {
                        updateApp();
                        toast.dismiss(t.id);
                        // Reload the page after a short delay
                        setTimeout(() => {
                          window.location.reload();
                        }, 1000);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Update Now
                    </button>
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),        { 
          duration: Infinity,
          id: 'update-notification'
        }
      );
    }
  }, [isClient, isUpdateAvailable, updateApp]);

  return null; // This component doesn't render anything visible
}
