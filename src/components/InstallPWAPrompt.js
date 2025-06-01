'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePWA } from '@/hooks/usePWA';

export default function InstallPWAPrompt() {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    // Only show install prompt if app is installable and not already installed
    if (isClient && isInstallable && !isInstalled) {
      // Show install prompt after a delay
      const timer = setTimeout(() => {
        showInstallToast();
      }, 5000); // Show after 5 seconds      return () => clearTimeout(timer);
    }
  }, [isClient, isInstallable, isInstalled]);const showInstallToast = () => {
    if (!isInstallable) return;

    toast.custom(
      (t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Install Lingento App
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Add to your home screen for quick access and offline use.
                </p>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={handleInstallClick}
                    className="bg-indigo-600 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Install
                  </button>
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="bg-white inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      { duration: 8000 }
    );
  };

  const handleInstallClick = async () => {
    try {
      const result = await installApp();
      if (result === 'accepted') {
        toast.success('App installed successfully!');
      }
    } catch (error) {
      console.error('Installation failed:', error);
      toast.error('Installation failed. Please try again.');
    }
    toast.dismiss();
  };

  // This component doesn't render visible UI, it only manages the install prompt
  return null;
}