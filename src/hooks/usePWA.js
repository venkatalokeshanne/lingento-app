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
    };    // Register service worker and handle updates
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Next.js PWA creates the service worker automatically
          // We just need to get the existing registration
          const registration = await navigator.serviceWorker.getRegistration();
          
          if (registration) {
            console.log('Service Worker found and configured');
            
            // Check for updates immediately and then periodically
            const checkForUpdates = () => {
              registration.update().then(() => {
                console.log('Update check completed');
              });
            };
            
            // Check for updates every 30 seconds instead of every minute
            setInterval(checkForUpdates, 30000);
            
            // Initial update check
            checkForUpdates();

            // Handle service worker updates
            registration.addEventListener('updatefound', () => {
              console.log('New service worker found');
              const newWorker = registration.installing;
              
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  console.log('Service worker state changed:', newWorker.state);
                  
                  if (newWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      // New content is available
                      console.log('New content is available, update ready');
                      setIsUpdateAvailable(true);
                    } else {
                      // Content is cached for the first time
                      console.log('Content is cached for the first time');
                    }
                  }
                  
                  if (newWorker.state === 'activated') {
                    console.log('New service worker activated');
                  }
                });
              }
            });

            // Listen for service worker messages
            navigator.serviceWorker.addEventListener('message', (event) => {
              if (event.data && event.data.type === 'SW_ACTIVATED') {
                console.log('Service Worker activated, reloading page');
                // Small delay to ensure everything is ready
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              }
            });

            // Handle controller changes (when skipWaiting is called)
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
              if (refreshing) return;
              refreshing = true;
              console.log('Controller changed, refreshing page');
              window.location.reload();
            });
            
          } else {
            console.log('No service worker registration found');
          }
        } catch (error) {
          console.error('Service Worker configuration failed:', error);
        }
      }
    };// Handle install prompt
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
    console.log('Updating app...');
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          console.log('Sending SKIP_WAITING message to service worker');
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Force immediate reload after short delay
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          console.log('No waiting service worker found, forcing reload');
          window.location.reload();
        }
      });
    } else {
      // Fallback: just reload the page
      window.location.reload();
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
