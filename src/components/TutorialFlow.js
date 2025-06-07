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
    description: "Discover how to build your vocabulary, practice with flashcards, and master new languages effectively.",
    icon: "🎯",
    buttonText: "Let's Begin",
    features: [
      { icon: "📚", text: "Build vocabulary" },
      { icon: "🔄", text: "Practice flashcards" },
      { icon: "📊", text: "Track progress" }
    ]
  },
  {
    id: "navigation",
    title: "Easy Navigation",
    subtitle: "Everything you need is right here",
    description: "Use the navigation bar to access different learning modes. Each section is designed to enhance your learning experience.",
    icon: "🧭",
    buttonText: "Got it",
    features: [
      { icon: "📖", text: "Vocabulary manager" },
      { icon: "🃏", text: "Flashcard practice" },
      { icon: "📈", text: "Progress dashboard" }
    ]
  },
  {
    id: "add-words",
    title: "Add Your First Word",
    subtitle: "Building your personal dictionary",
    description: "Click the '+' button to add new words. Include translations, notes, and context to make learning more effective.",
    icon: "➕",
    buttonText: "Show Me",
    features: [
      { icon: "🌍", text: "Multiple languages" },
      { icon: "🏷️", text: "Custom tags" },
      { icon: "📝", text: "Personal notes" }
    ]
  },
  {
    id: "practice",
    title: "Practice Makes Perfect",
    subtitle: "Interactive learning modes",
    description: "Use flashcards, quizzes, and spaced repetition to reinforce your learning and improve retention.",
    icon: "🎪",
    buttonText: "Start Learning",
    features: [
      { icon: "🔄", text: "Spaced repetition" },
      { icon: "🎲", text: "Random practice" },
      { icon: "⭐", text: "Difficulty levels" }
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={(e) => e.target === e.currentTarget && handleSkip()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 px-6 py-8 text-white">
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
              aria-label="Close tutorial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <motion.div
                key={currentStep}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="text-6xl mb-4"
              >
                {currentTutorialStep.icon}
              </motion.div>
              
              <motion.h1
                key={`title-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold mb-2"
              >
                {currentTutorialStep.title}
              </motion.h1>
              
              <motion.p
                key={`subtitle-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/90 text-lg"
              >
                {currentTutorialStep.subtitle}
              </motion.p>
            </div>

            {/* Progress indicator */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>Step {currentStep + 1} of {TUTORIAL_STEPS.length}</span>
                <span>{Math.round(((currentStep + 1) / TUTORIAL_STEPS.length) * 100)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  className="bg-white h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  {currentTutorialStep.description}
                </p>

                {/* Features list */}
                <div className="space-y-3 mb-8">
                  {currentTutorialStep.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <span className="text-2xl">{feature.icon}</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                {currentStep > 0 && (
                  <button
                    onClick={handleSkip}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Skip tutorial
                  </button>
                )}
              </div>

              {/* Step indicators */}
              <div className="flex gap-2">
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
                ))}
              </div>

              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {currentTutorialStep.buttonText}
                {currentStep < TUTORIAL_STEPS.length - 1 && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </motion.button>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
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
