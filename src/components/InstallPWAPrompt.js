'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePWA } from '@/hooks/usePWA';
import { XMarkIcon } from '@heroicons/react/24/outline';

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
        <div className={`$ {t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/80 dark:to-purple-900/80 shadow-2xl rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-indigo-200 dark:border-indigo-700 p-4 relative transition-all duration-300`}>
          <div className="flex items-start w-full">
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-800 mr-4">
              <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-indigo-900 dark:text-indigo-100 mb-1">Install Lingento App</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Add to your home screen for quick access and offline use.</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleInstallClick}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all"
                >
                  Install
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg font-medium shadow hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Close notification"
            >
              <XMarkIcon className="h-5 w-5 text-indigo-400 dark:text-indigo-200" />
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const handleInstallClick = async () => {
    try {
      const result = await installApp();
      if (result === true || result === 'accepted') {
        toast.success('App installed successfully!');
      } else {
        toast('Installation prompt was dismissed.', { icon: 'ℹ️' });
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