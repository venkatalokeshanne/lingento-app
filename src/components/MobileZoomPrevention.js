// Mobile zoom prevention utility
'use client';

import { useEffect } from 'react';

export default function MobileZoomPrevention() {
  useEffect(() => {
    // Prevent pinch zoom
    const preventZoom = (e) => {
      if (e.touches?.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent double-tap zoom
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (e) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    // Prevent zoom on wheel events (desktop/trackpad)
    const preventWheelZoom = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Prevent keyboard zoom shortcuts
    const preventKeyboardZoom = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });
    document.addEventListener('wheel', preventWheelZoom, { passive: false });
    document.addEventListener('keydown', preventKeyboardZoom, { passive: false });

    // Additional meta viewport enforcement for iOS
    const addViewportMeta = () => {
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        document.getElementsByTagName('head')[0].appendChild(viewportMeta);
      }
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no';
    };

    addViewportMeta();

    // Cleanup event listeners
    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchend', preventDoubleTapZoom);
      document.removeEventListener('wheel', preventWheelZoom);
      document.removeEventListener('keydown', preventKeyboardZoom);
    };
  }, []);

  return null; // This component doesn't render anything
}
