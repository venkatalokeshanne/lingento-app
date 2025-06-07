"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { useAuth } from "@/context/AuthContext";

const TUTORIAL_STEPS = [
  {
    id: "welcome",
    title: "Welcome to Lingento!",
    subtitle: "Your language learning journey starts here",
    description: "Discover how to build your vocabulary, practice with flashcards, and master new languages effectively using our intelligent learning system.",    icon: (
      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
        <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/>
          <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-8V5h8v2z"/>
          <rect x="12" y="9" width="1" height="6" fill="#4285F4" opacity="0.8"/>
          <rect x="13" y="9" width="1" height="6" fill="#34A853" opacity="0.8"/>
          <rect x="14" y="9" width="1" height="6" fill="#FBBC05" opacity="0.8"/>
          <rect x="15" y="9" width="1" height="6" fill="#EA4335" opacity="0.8"/>
          <circle cx="10" cy="12" r="1.5" fill="currentColor" opacity="0.8"/>
          <path d="M8.5 10.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.6"/>
        </svg>
      </div>
    ),
    buttonText: "Let's Begin",
    features: [      { 
        icon: (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ), 
        text: "Add vocabulary words" 
      },
      { 
        icon: (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ), 
        text: "Practice with flashcards" 
      },
      { 
        icon: (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ), 
        text: "Track your progress" 
      }
    ]
  },
  {
    id: "navigation",
    title: "Easy Navigation",
    subtitle: "Everything you need is right here",
    description: "Use the navigation bar to access different learning modes. Each section is designed to enhance your learning experience.",    icon: (
      <svg className="w-8 h-8 sm:w-12 sm:h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    buttonText: "Got it",
    features: [
      { 
        icon: (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ), 
        text: "Dashboard overview" 
      },
      { 
        icon: (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ), 
        text: "Vocabulary manager" 
      },
      { 
        icon: (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ), 
        text: "Flashcard practice" 
      }
    ]
  },
  {
    id: "add-words",
    title: "Add Your First Word",
    subtitle: "Building your personal dictionary",
    description: "Click the floating '+' button to add new words. Include translations, notes, and context to make learning more effective.",    icon: (
      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
        <svg className="w-5 h-5 sm:w-8 sm:h-8 text-white transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
    ),
    buttonText: "Show Me",    features: [
      { 
        icon: (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        ), 
        text: "Multiple languages" 
      },
      { 
        icon: (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        ), 
        text: "Custom tags" 
      },
      { 
        icon: (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        ), 
        text: "Personal notes" 
      }
    ]
  },
  {
    id: "practice",
    title: "Practice Makes Perfect",
    subtitle: "Interactive learning modes",
    description: "Use flashcards, spaced repetition, and smart analytics to reinforce your learning and improve retention over time.",
    icon: (
      <svg className="w-8 h-8 sm:w-12 sm:h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),    buttonText: "Start Learning",
    features: [
      { 
        icon: (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        ), 
        text: "Spaced repetition" 
      },
      { 
        icon: (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        ), 
        text: "Audio pronunciation" 
      },
      { 
        icon: (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ), 
        text: "Mark as learned" 
      }
    ]
  }
];

export default function TutorialFlow({ onComplete, onSkip }) {
  const { updatePreferences } = useUserPreferences();
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentTutorialStep = TUTORIAL_STEPS[currentStep];

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < TUTORIAL_STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleComplete();
      }
      setIsAnimating(false);
    }, 150);
  }, [currentStep, isAnimating]);

  const handlePrevious = useCallback(() => {
    if (isAnimating || currentStep === 0) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev - 1);
      setIsAnimating(false);
    }, 150);
  }, [currentStep, isAnimating]);

  const handleComplete = useCallback(async () => {
    try {
      await updatePreferences({
        tutorialCompleted: true,
        completedAt: new Date().toISOString(),
      });
      setIsVisible(false);
      onComplete?.();
    } catch (error) {
      console.error("Error completing tutorial:", error);
    }
  }, [updatePreferences, onComplete]);

  const handleSkip = useCallback(async () => {
    try {
      await updatePreferences({
        tutorialCompleted: true,
        tutorialSkipped: true,
        skippedAt: new Date().toISOString(),
      });
      setIsVisible(false);
      onSkip?.();
    } catch (error) {
      console.error("Error skipping tutorial:", error);
    }
  }, [updatePreferences, onSkip]);

  const goToStep = useCallback((stepIndex) => {
    if (stepIndex === currentStep || isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(stepIndex);
      setIsAnimating(false);
    }, 150);
  }, [currentStep, isAnimating]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowRight':
        case 'Enter':
        case ' ':
          event.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handlePrevious();
          break;
        case 'Escape':
          event.preventDefault();
          handleSkip();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, handleSkip]);

  if (!isVisible) {
    return null;
  }  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50"
        onClick={(e) => e.target === e.currentTarget && handleSkip()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl max-w-sm sm:max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
        >          {/* Header */}
          <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 px-4 sm:px-6 py-6 sm:py-8 text-white">
            <button
              onClick={handleSkip}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-white/70 hover:text-white transition-colors p-2 sm:p-1 hover:bg-white/10 rounded-full touch-manipulation"
              aria-label="Close tutorial"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">              <motion.div
                key={currentStep}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-white dark:bg-gray-800 rounded-full shadow-lg"
              >
                {currentTutorialStep.icon}
              </motion.div>
              
              <motion.h1
                key={`title-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl font-bold mb-2"
              >
                {currentTutorialStep.title}
              </motion.h1>
                <motion.p
                key={`subtitle-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/90 text-base sm:text-lg"
              >
                {currentTutorialStep.subtitle}
              </motion.p>
            </div>

            {/* Progress indicator */}
            <div className="mt-4 sm:mt-6">
              <div className="flex justify-between text-xs sm:text-sm text-white/70 mb-2">
                <span>Step {currentStep + 1} of {TUTORIAL_STEPS.length}</span>
                <span>{Math.round(((currentStep + 1) / TUTORIAL_STEPS.length) * 100)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2">
                <motion.div
                  className="bg-white h-1.5 sm:h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>          {/* Content */}
          <div className="p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                  {currentTutorialStep.description}
                </p>

                {/* Features list */}                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">                  {currentTutorialStep.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 flex-shrink-0">
                        {feature.icon}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>            {/* Navigation */}
            <div className="space-y-4 sm:space-y-0">
              {/* Step indicators - Move to top on mobile */}
              <div className="flex justify-center gap-2 sm:hidden">
                {TUTORIAL_STEPS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToStep(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 touch-manipulation ${
                      index === currentStep
                        ? "bg-blue-500 scale-125"
                        : index < currentStep
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>

              {/* Main Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                {/* Left side - Previous/Skip buttons */}
                <div className="flex items-center justify-center sm:justify-start gap-2 order-2 sm:order-1">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation text-sm sm:text-base"
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {currentStep > 0 && (
                    <button
                      onClick={handleSkip}
                      className="px-3 sm:px-4 py-2.5 sm:py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation text-sm sm:text-base"
                    >
                      Skip tutorial
                    </button>
                  )}
                </div>

                {/* Step indicators - Hidden on mobile, shown on desktop */}
                <div className="hidden sm:flex gap-2">
                  {TUTORIAL_STEPS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToStep(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? "bg-blue-500 scale-125"
                          : index < currentStep
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                      }`}
                      aria-label={`Go to step ${index + 1}`}
                    />
                  ))}                </div>

                {/* Next Button - Full width on mobile */}
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-3 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation text-sm sm:text-base order-1 sm:order-2"
                >
                  {currentTutorialStep.buttonText}
                  {currentStep < TUTORIAL_STEPS.length - 1 && (
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Use <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">←</kbd> <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">→</kbd> arrow keys or <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">ESC</kbd> to skip
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
