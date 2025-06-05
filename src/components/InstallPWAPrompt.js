'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePWA } from '@/hooks/usePWA';
import { XMarkIcon, DevicePhoneMobileIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

// Constants for localStorage keys and timing
const PWA_STORAGE_KEY = 'lingento_pwa_preferences';
const SHOW_LATER_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export default function InstallPWAPrompt() {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  useEffect(() => {
    setIsClient(true);
    // Detect mobile device with more comprehensive checks
    const checkMobile = () => {
      // Check user agent
      const userAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      // Check screen size
      const screenMobile = window.innerWidth <= 768;
      // Check for touch capability
      const touchMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      return userAgentMobile || (screenMobile && touchMobile);
    };
    setIsMobile(checkMobile());
    
    // Update mobile state on resize
    const handleResize = () => setIsMobile(checkMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Handle touch events for swipe to dismiss on mobile
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (toastId) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > 50;
    const isDownSwipe = distance < -50;
    
    // Dismiss on swipe down (natural gesture to dismiss bottom notifications)
    if (isDownSwipe) {
      // Provide visual feedback for swipe action
      toast('Notification dismissed', { 
        icon: '👋',
        duration: 1500,
        style: {
          background: '#6B7280',
          color: 'white',
          fontSize: '14px'
        }
      });
      handleDismiss(toastId, 'close');
    }
  };

  // Add haptic feedback for better mobile UX (if supported)
  const triggerHapticFeedback = (type = 'light') => {
    if (isMobile && navigator.vibrate) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate([30, 10, 30]);
          break;
        default:
          navigator.vibrate(10);
      }
    }
  };
  const getPWAPreferences = () => {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(PWA_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading PWA preferences:', error);
      return null;
    }
  };

  // Save PWA preferences to localStorage
  const savePWAPreferences = (preferences) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(PWA_STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving PWA preferences:', error);
    }
  };

  // Check if user has chosen "show later" recently
  const shouldShowPrompt = () => {
    const preferences = getPWAPreferences();
    if (!preferences) return true;

    if (preferences.neverShow) return false;
    
    if (preferences.showLaterUntil) {
      const now = Date.now();
      return now > preferences.showLaterUntil;
    }
    
    return true;
  };

  useEffect(() => {
    // Only show install prompt if conditions are met
    if (isClient && isInstallable && !isInstalled && shouldShowPrompt()) {
      // Show install prompt after a delay
      const timer = setTimeout(() => {
        showInstallToast();
      }, 3000); // Show after 3 seconds for better UX

      return () => clearTimeout(timer);
    }
  }, [isClient, isInstallable, isInstalled]);
  const showInstallToast = () => {
    if (!isInstallable) return;    toast.custom(
      (t) => (
        <div 
          className={`${t.visible ? 'animate-enter' : 'animate-leave'} ${
            isMobile 
              ? 'mx-3 max-w-[calc(100vw-24px)] fixed bottom-0 left-0 right-0 mb-4' 
              : 'max-w-md'
          } w-full bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-800 dark:to-indigo-900/50 shadow-2xl rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 border border-blue-200/50 dark:border-indigo-700/50 p-1 relative transition-all duration-500 hover:shadow-3xl ${isMobile ? '' : 'transform hover:scale-[1.02]'}`}
          onTouchStart={isMobile ? handleTouchStart : undefined}
          onTouchMove={isMobile ? handleTouchMove : undefined}
          onTouchEnd={isMobile ? () => handleTouchEnd(t.id) : undefined}
        >
            {/* Decorative gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-2xl opacity-75 blur-sm"></div>
            {/* Mobile swipe indicator */}
          {isMobile && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full pwa-swipe-indicator"></div>
          )}
          
          <div className={`relative bg-white dark:bg-gray-800 rounded-2xl ${isMobile ? 'p-4' : 'p-5'}`}>
              {/* Header with app icon and device-specific messaging */}
            <div className={`flex items-start gap-3 ${isMobile ? 'mb-3' : 'mb-4'}`}>
              <div className="flex-shrink-0 relative">
                <div className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg app-icon-pulse`}>
                  <span className={`text-white ${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>L</span>
                </div>
                <div className={`absolute -bottom-1 -right-1 ${isMobile ? 'h-5 w-5' : 'h-6 w-6'} bg-emerald-500 rounded-full flex items-center justify-center shadow-md`}>
                  {isMobile ? (
                    <DevicePhoneMobileIcon className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} text-white`} />
                  ) : (
                    <ComputerDesktopIcon className="h-3 w-3 text-white" />
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-900 dark:text-white mb-1`}>
                  Install Lingento
                </h3>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-300 leading-relaxed`}>
                  {isMobile 
                    ? "Add to home screen for instant access"
                    : "Install the app for a faster, more focused learning experience"
                  }
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={() => handleDismiss(t.id, 'close')}
                className={`flex-shrink-0 ${isMobile ? 'p-1' : 'p-1.5'} rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors`}
                aria-label="Close notification"
              >
                <XMarkIcon className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-gray-400 dark:text-gray-500`} />
              </button>
            </div>            {/* Benefits list */}
            <div className={`${isMobile ? 'mb-3 space-y-1.5' : 'mb-4 space-y-2'}`}>
              {[
                `⚡ ${isMobile ? 'Lightning fast' : 'Faster performance'}`,
                `📱 ${isMobile ? 'Works offline' : 'Works offline'}`,
                `🔔 ${isMobile ? 'Notifications' : 'Push notifications'}`,
                `💾 ${isMobile ? 'No app store' : 'Direct desktop access'}`
              ].map((benefit, index) => (
                <div key={index} className={`flex items-center ${isMobile ? 'text-2xs' : 'text-xs'} text-gray-600 dark:text-gray-400`}>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>            {/* Action buttons */}
            <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row'}`}>
              <button
                onClick={() => handleInstallClick(t.id)}
                className={`${isMobile ? 'order-1 py-3' : 'py-2.5'} flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 ${isMobile ? '' : 'transform hover:scale-[1.02]'} ${isMobile ? 'text-sm' : 'text-sm'}`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {isMobile ? 'Add to Home Screen' : 'Install Now'}
                </span>
              </button>
              
              <div className={`${isMobile ? 'flex gap-2 order-2' : 'flex gap-2'}`}>
                <button
                  onClick={() => handleDismiss(t.id, 'later')}
                  className={`${isMobile ? 'flex-1 py-2.5 text-xs' : 'flex-1 py-2.5 text-sm'} bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 rounded-xl font-medium shadow hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300`}
                >
                  {isMobile ? 'Later' : 'Show Later'}
                </button>
                
                <button
                  onClick={() => handleDismiss(t.id, 'never')}
                  className={`${isMobile ? 'px-3 py-2 text-2xs' : 'px-3 py-2 text-xs'} text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors underline decoration-1 underline-offset-2 ${isMobile ? 'whitespace-nowrap' : ''}`}
                >
                  {isMobile ? 'Never' : 'Don\'t ask again'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ),      { 
        duration: Infinity,
        position: isMobile ? 'bottom-center' : 'top-right',
        style: isMobile ? {
          bottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
          left: '12px',
          right: '12px',
          position: 'fixed'
        } : {}
      }
    );
  };
  const handleInstallClick = async (toastId) => {
    triggerHapticFeedback('medium');
    try {
      const result = await installApp();
      if (result === true || result === 'accepted') {
        triggerHapticFeedback('heavy');
        toast.success('🎉 App installed successfully!', {
          duration: 4000,
          style: {
            background: '#10B981',
            color: 'white',
            fontWeight: '600'
          }
        });
        // Mark as installed to prevent future prompts
        savePWAPreferences({ installed: true, installedAt: Date.now() });
      } else {
        toast('Installation cancelled', { 
          icon: 'ℹ️',
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Installation failed:', error);
      toast.error('Installation failed. Please try again.');
    }
    toast.dismiss(toastId);
  };
  const handleDismiss = (toastId, action) => {
    triggerHapticFeedback('light');
    let preferences = {};
    
    switch (action) {
      case 'later':
        preferences = {
          showLaterUntil: Date.now() + SHOW_LATER_DURATION,
          lastDismissed: Date.now(),
          dismissCount: (getPWAPreferences()?.dismissCount || 0) + 1
        };
        toast('We\'ll ask again in a week', { 
          icon: '⏰',
          duration: 3000,
          style: {
            background: '#6366F1',
            color: 'white'
          }
        });
        break;
      case 'never':
        preferences = {
          neverShow: true,
          dismissedAt: Date.now()
        };
        toast('Got it! We won\'t ask again', { 
          icon: '👍',
          duration: 3000,
          style: {
            background: '#6B7280',
            color: 'white'
          }
        });
        break;
      case 'close':
      default:
        // Just close without saving preferences for regular close
        break;
    }
    
    if (Object.keys(preferences).length > 0) {
      savePWAPreferences({
        ...getPWAPreferences(),
        ...preferences
      });
    }
    
    toast.dismiss(toastId);
  };

  // This component doesn't render visible UI, it only manages the install prompt
  return null;
}