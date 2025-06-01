'use client';

// This file contains code that should run only in the browser
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      const swUrl = '/service-worker.js';
      
      navigator.serviceWorker.register(swUrl)
        .then(function(registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          
          // Check for updates on load
          registration.update();
          
          // Check for updates periodically (every hour)
          setInterval(() => {
            registration.update();
            console.log('Checking for PWA updates');
          }, 60 * 60 * 1000);
          
          // Detect when a new service worker is waiting to install
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            // When the new service worker is installed
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, dispatch event to notify app
                window.dispatchEvent(new CustomEvent('sw-waiting', { 
                  detail: { waiting: newWorker } 
                }));
              }
            });
          });
        })
        .catch(function(error) {
          console.error('ServiceWorker registration failed: ', error);
        });
      
      // Handle controller changes (when skipWaiting is called)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        console.log('Controller changed, refreshing page');
      });
    });
  }
}
