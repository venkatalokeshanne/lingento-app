'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePWA } from '@/hooks/usePWA';

export default function UpdateNotification() {
  const { isUpdateAvailable, updateApp } = usePWA();
  const [isClient, setIsClient] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [versionInfo, setVersionInfo] = useState(null);

  useEffect(() => {
    setIsClient(true);
    
    // Listen for service worker version messages
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_ACTIVATED') {
          console.log('📦 New version activated:', event.data);
          setVersionInfo({
            version: event.data.version,
            buildTime: event.data.buildTime,
            timestamp: new Date().toLocaleString()
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (isClient && isUpdateAvailable) {
      console.log('🔄 Update available, showing notification');
      
      // Show notification to user about update
      toast.custom(
        (t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 dark:ring-white ring-opacity-10`}>
            <div className="flex-1 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    🎉 New version available!
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    An updated version of Lingento is ready. Click to reload and get the latest features.
                    {versionInfo && (
                      <span className="block mt-1 text-xs font-mono text-blue-600 dark:text-blue-400">
                        📅 Built: {new Date(versionInfo.buildTime).toLocaleString()}
                      </span>
                    )}
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={async () => {
                        setIsUpdating(true);
                        try {
                          console.log('🔄 User clicked update now');
                          
                          // Show loading toast
                          toast.loading('Updating app...', { 
                            id: 'updating',
                            duration: 2000 
                          });
                          
                          updateApp();
                          toast.dismiss(t.id);
                        } catch (error) {
                          console.error('Update failed:', error);
                          toast.error('Update failed, please refresh manually');
                          setIsUpdating(false);
                        }
                      }}
                      disabled={isUpdating}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        '🚀 Update Now'
                      )}
                    </button>
                    <button
                      onClick={() => {
                        console.log('User dismissed update notification');
                        toast.dismiss(t.id);
                        
                        // Show reminder after 5 minutes
                        setTimeout(() => {
                          if (isUpdateAvailable) {
                            toast('Update still available! 🔄', { 
                              duration: 3000,
                              icon: '💡'
                            });
                          }
                        }, 5 * 60 * 1000);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      ⏰ Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),        { 
          duration: Infinity,
          id: 'update-notification',
          position: 'top-right'
        }
      );
    }
  }, [isClient, isUpdateAvailable, updateApp]);

  return null; // This component doesn't render anything visible
}
