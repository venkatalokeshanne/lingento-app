// PWA Debug utilities to help troubleshoot update issues

export const PWADebug = {
  // Log current service worker status
  async logServiceWorkerStatus() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        
        console.group('🔧 PWA Debug Status');
        console.log('Service Worker Registration:', registration);
        
        if (registration) {
          console.log('Installing SW:', registration.installing);
          console.log('Waiting SW:', registration.waiting);
          console.log('Active SW:', registration.active);
          console.log('Update Available:', !!registration.waiting);
          
          if (registration.active) {
            console.log('Active SW Script URL:', registration.active.scriptURL);
            console.log('Active SW State:', registration.active.state);
          }
        }
        
        console.log('Current Controller:', navigator.serviceWorker.controller);
        console.groupEnd();
        
        return registration;
      } catch (error) {
        console.error('Error getting service worker status:', error);
      }
    } else {
      console.warn('Service Worker not supported');
    }
  },

  // Force service worker update
  async forceUpdate() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (registration) {
          console.log('🔄 Forcing service worker update...');
          await registration.update();
          console.log('✅ Update check completed');
          
          // Wait a bit and check status again
          setTimeout(() => {
            this.logServiceWorkerStatus();
          }, 1000);
        }
      } catch (error) {
        console.error('Error forcing update:', error);
      }
    }
  },

  // Clear all caches
  async clearAllCaches() {
    if ('caches' in window) {
      try {
        console.log('🧹 Clearing all caches...');
        const cacheNames = await caches.keys();
        
        console.log('Found caches:', cacheNames);
        
        await Promise.all(
          cacheNames.map(cacheName => {
            console.log(`Deleting cache: ${cacheName}`);
            return caches.delete(cacheName);
          })
        );
        
        console.log('✅ All caches cleared');
      } catch (error) {
        console.error('Error clearing caches:', error);
      }
    }
  },

  // Unregister service worker (for debugging)
  async unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (registration) {
          console.log('🗑️ Unregistering service worker...');
          await registration.unregister();
          console.log('✅ Service worker unregistered');
          
          // Clear caches after unregistering
          await this.clearAllCaches();
        }
      } catch (error) {
        console.error('Error unregistering service worker:', error);
      }
    }
  },

  // Full PWA reset (for debugging)
  async fullReset() {
    console.log('🔄 Performing full PWA reset...');
    
    await this.unregisterServiceWorker();
    
    // Clear localStorage
    if (typeof localStorage !== 'undefined') {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('pwa') || key.includes('sw') || key.includes('cache')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log('🧹 Cleared PWA-related localStorage');
    }
    
    console.log('✅ Full PWA reset completed. Please refresh the page.');
  },

  // Monitor service worker events
  startMonitoring() {
    if ('serviceWorker' in navigator) {
      console.log('🔍 Starting PWA monitoring...');
      
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('📡 Service Worker controller changed');
      });
      
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('📨 Message from Service Worker:', event.data);
      });
      
      // Check for updates periodically
      setInterval(async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          console.log('⚠️ Service Worker update is waiting!');
        }
      }, 10000); // Check every 10 seconds
    }
  }
};

// Make it globally available for debugging
if (typeof window !== 'undefined') {
  window.PWADebug = PWADebug;
  
  // Auto-start monitoring in development
  if (process.env.NODE_ENV === 'development') {
    PWADebug.startMonitoring();
  }
}
