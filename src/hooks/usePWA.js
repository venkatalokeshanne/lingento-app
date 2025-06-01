'use client';

import { useEffect, useState } from 'react';

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set that we're on the client to prevent hydration issues
    setIsClient(true);
    
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (typeof window === 'undefined') return false;
      
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isWebkit = window.navigator.standalone === true;
      const isInstalled = isStandalone || isWebkit;
      setIsInstalled(isInstalled);
      return isInstalled;
    };// Register service worker and handle updates
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Next.js PWA creates the service worker automatically
          // We just need to get the existing registration
          const registration = await navigator.serviceWorker.getRegistration();
          
          if (registration) {
            // Check for updates periodically
            setInterval(() => {
              registration.update();
            }, 60000); // Check every minute

            // Handle service worker updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setIsUpdateAvailable(true);
                }
              });
            });

            console.log('Service Worker found and configured');
          } else {
            console.log('No service worker registration found');
          }
        } catch (error) {
          console.error('Service Worker configuration failed:', error);
        }
      }
    };    // Handle install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Initialize only after client-side hydration
    if (typeof window !== 'undefined') {
      if (!checkIfInstalled()) {
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      }
      
      registerServiceWorker();
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      }
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        setIsInstallable(false);
        setIsInstalled(true);
        console.log('App installed successfully');
        return true;
      }
    } catch (error) {
      console.error('Installation failed:', error);
    }
    
    setDeferredPrompt(null);
    return false;
  };

  const updateApp = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
  };
  return {
    isInstallable: isClient ? isInstallable : false,
    isInstalled: isClient ? isInstalled : false,
    isUpdateAvailable: isClient ? isUpdateAvailable : false,
    installApp,
    updateApp
  };
}
