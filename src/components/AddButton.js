'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * Reusable Add Button Component for use across the app
 * @param {Object} props
 * @param {Function} props.onClick - Function to call when button is clicked
 * @param {string} props.title - Tooltip title for the button
 * @param {string} props.position - Position of the button ('bottom-right', 'bottom-left', 'top-right', 'top-left')
 * @param {boolean} props.show - Whether to show the button or not
 */
export default function AddButton({ 
  onClick, 
  title = "Add new", 
  position = "bottom-right",
  show = true 
}) {
  const [mounted, setMounted] = useState(false);
  
  // To prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted || !show) return null;
  // Determine position class based on prop
  const getPositionClass = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6 md:bottom-8 md:left-8';
      case 'top-right':
        return 'top-6 right-6 md:top-8 md:right-8';
      case 'top-left':
        return 'top-6 left-6 md:top-8 md:left-8';
      case 'middle-right':
        return 'bottom-24 right-6 md:bottom-28 md:right-8';      case 'below-filter':
        return 'bottom-[2.5rem] right-6 md:bottom-[2.5rem] md:right-8';
      case 'bottom-right':
      default:
        return 'bottom-6 right-6 md:bottom-8 md:right-8';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      className={`fixed ${getPositionClass()} z-50`}
    >
      <button
        onClick={onClick}
        className="group w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1"
        title={title}
      >
        <svg className="w-8 h-8 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </motion.div>
  );
}
