'use client';

import { useEffect, useState } from 'react';

export default function PWADebugLoader() {
  const [debugInfo, setDebugInfo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const loadDebugInfo = async () => {
      try {
        // Get version info
        const versionResponse = await fetch('/version.json');
        const versionData = await versionResponse.json();
        
        // Get service worker info
        let swInfo = null;
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            swInfo = {
              scope: registration.scope,
              updateViaCache: registration.updateViaCache,
              installing: !!registration.installing,
              waiting: !!registration.waiting,
              active: !!registration.active
            };
          }
        }

        setDebugInfo({
          version: versionData,
          serviceWorker: swInfo,
          timestamp: new Date().toISOString(),
          cacheNames: await caches.keys()
        });
      } catch (error) {
        console.error('Failed to load PWA debug info:', error);
      }
    };

    loadDebugInfo();

    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_ACTIVATED') {
          console.log('🔄 SW updated, refreshing debug info');
          loadDebugInfo(); // Refresh debug info
        }
      });
    }

    // Show/hide with keyboard shortcut
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  if (process.env.NODE_ENV !== 'development' || !debugInfo) {
    return null;
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        title="PWA Debug Info (Ctrl+Shift+P)"
      >
        🔧
      </button>

      {/* Debug panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-black bg-opacity-90 text-green-400 p-4 rounded-lg max-w-md max-h-96 overflow-auto font-mono text-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-yellow-400 font-bold">PWA Debug Info</h3>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="text-cyan-400">📦 Version:</div>
              <div className="ml-2">
                <div>App: {debugInfo.version.version}</div>
                <div>Build: {debugInfo.version.buildNumber}</div>
                <div>Time: {debugInfo.version.buildISO}</div>
                <div>Strategy: {debugInfo.version.pwa?.updateStrategy}</div>
              </div>
            </div>

            {debugInfo.serviceWorker && (
              <div>
                <div className="text-cyan-400">⚙️ Service Worker:</div>
                <div className="ml-2">
                  <div>Scope: {debugInfo.serviceWorker.scope}</div>
                  <div>Installing: {debugInfo.serviceWorker.installing ? '✅' : '❌'}</div>
                  <div>Waiting: {debugInfo.serviceWorker.waiting ? '✅' : '❌'}</div>
                  <div>Active: {debugInfo.serviceWorker.active ? '✅' : '❌'}</div>
                </div>
              </div>
            )}

            <div>
              <div className="text-cyan-400">💾 Caches ({debugInfo.cacheNames.length}):</div>
              <div className="ml-2 max-h-24 overflow-auto">
                {debugInfo.cacheNames.map((name, i) => (
                  <div key={i} className="truncate">{name}</div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-cyan-400">🕒 Last Check:</div>
              <div className="ml-2">{new Date(debugInfo.timestamp).toLocaleString()}</div>
            </div>

            <div className="pt-2 border-t border-gray-600">
              <button
                onClick={() => {
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistration().then(reg => {
                      if (reg) {
                        console.log('🔄 Forcing update check...');
                        reg.update();
                      }
                    });
                  }
                }}
                className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 mr-2"
              >
                🔄 Force Update
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
              >
                🔄 Reload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
