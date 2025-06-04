'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { useAuth } from '@/context/AuthContext';
import { addUserData } from '@/utils/firebaseUtils';

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Lingento! 👋',
    content: 'Let\'s start by adding your first word. This is the core of your language learning journey!',
    icon: '🌟',
    action: 'Start',
    highlight: null
  },
  {
    id: 'find-add-button',
    title: 'Find the Add Button',
    content: 'Look for the + button to add new words. Click it to start adding vocabulary!',
    icon: '➕',
    action: 'Next',
    highlight: '.add-button',
    autoAction: 'highlight-add-button'
  },
  {
    id: 'word-added',
    title: 'Sample Word Added! 🎉',
    content: 'We\'ve added a sample word "hello" for you. Now let\'s see it in action with flashcards!',
    icon: '✨',
    action: 'See Flashcards',
    highlight: null,
    autoAction: 'add-sample-word'
  },
  {
    id: 'view-flashcards',
    title: 'Practice with Flashcards',
    content: 'Here\'s your new word in flashcard format! Tap to flip, use audio, and start learning.',
    icon: '🃏',
    action: 'Start Learning!',
    highlight: '.flashcard-container',
    autoAction: 'navigate-to-flashcards'
  }
];

export default function TutorialFlow({ onComplete, onSkip }) {
  const { updatePreferences } = useUserPreferences();
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [autoActionExecuted, setAutoActionExecuted] = useState(false);
  const currentTutorialStep = TUTORIAL_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      await updatePreferences({
        tutorialCompleted: true,
      });
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error completing tutorial:', error);
    }
  };

  const handleSkip = async () => {
    try {
      await updatePreferences({
        tutorialCompleted: true,
        tutorialSkipped: true,
      });
      setIsVisible(false);
      if (onSkip) {
        onSkip();
      }
    } catch (error) {
      console.error('Error skipping tutorial:', error);
    }
  };  const handleAction = () => {
    const step = currentTutorialStep;
    
    // For the "view-flashcards" step, navigate and complete
    if (step.id === 'view-flashcards') {
      router.push('/flashcards');
      setTimeout(() => {
        handleComplete();
      }, 500);
      return;
    }
    
    // For the last step, complete the tutorial
    if (currentStep === TUTORIAL_STEPS.length - 1) {
      handleComplete();
      return;
    }
    
    // Otherwise, just move to the next step
    handleNext();
  };
  // Add highlight effect to target elements
  useEffect(() => {
    if (currentTutorialStep.highlight) {
      const element = document.querySelector(currentTutorialStep.highlight);
      if (element) {
        element.classList.add('tutorial-highlight');
        
        // Remove highlight when step changes
        return () => {
          element.classList.remove('tutorial-highlight');
        };
      }
    }
  }, [currentStep, currentTutorialStep.highlight]);

  // Handle automatic actions for tutorial steps
  useEffect(() => {
    const executeAutoAction = async () => {
      if (!currentTutorialStep.autoAction || autoActionExecuted) {
        return;
      }

      // Add a small delay to let the UI settle
      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        switch (currentTutorialStep.autoAction) {
          case 'highlight-add-button':
            // The highlighting is already handled by the previous useEffect
            // Just mark as executed
            setAutoActionExecuted(true);
            break;

          case 'add-sample-word':
            if (user?.uid) {
              const sampleWord = {
                word: 'hello',
                translation: 'hola',
                language: 'Spanish',
                partOfSpeech: 'interjection',
                difficulty: 'beginner',
                notes: 'A common greeting',
                createdAt: new Date().toISOString(),
                tags: ['greetings', 'common']
              };

              await addUserData(user.uid, 'words', sampleWord);
              console.log('Sample word added successfully');
            }
            setAutoActionExecuted(true);
            break;          case 'navigate-to-flashcards':
            // Navigate to flashcards page and complete tutorial
            router.push('/flashcards');
            setAutoActionExecuted(true);
            // Complete the tutorial after navigation
            setTimeout(() => {
              handleComplete();
            }, 500);
            break;

          default:
            setAutoActionExecuted(true);
            break;
        }
      } catch (error) {
        console.error('Error executing auto action:', error);
        setAutoActionExecuted(true); // Mark as executed even on error to prevent loops
      }
    };

    executeAutoAction();
  }, [currentStep, currentTutorialStep.autoAction, user?.uid, router, autoActionExecuted]);

  // Reset auto action executed flag when step changes
  useEffect(() => {
    setAutoActionExecuted(false);
  }, [currentStep]);

  if (!isVisible) {
    return null;
  }  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-[100]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] max-w-md mx-auto w-full overflow-hidden relative border border-gray-100 dark:border-gray-700"
        style={{
          animation: 'tutorialGlow 3s infinite ease-in-out'
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-b from-blue-200 to-purple-200 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full filter blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-t from-indigo-200 to-pink-200 dark:from-indigo-900/30 dark:to-pink-900/30 rounded-full filter blur-3xl opacity-20 -ml-20 -mb-20 pointer-events-none"></div>
        
        {/* Close button */}
        <button 
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-1.5 backdrop-blur-sm transition-all duration-200 hover:scale-110"
          aria-label="Close tutorial"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>        {/* Header - Modern & sophisticated with improved mobile alignment */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 pt-8 sm:pt-10 pb-5 sm:pb-6 px-5 sm:px-8 text-white relative overflow-hidden" 
             style={{ backgroundSize: '200% 200%', animation: 'gradientShift 8s ease infinite' }}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTE0aC0ydjRoMnYtNHptMTAgMTBoLTJ2NGgydi00em0wLTEwaC0ydjRoMnYtNHptLTIwIDEwaC0ydjRoMnYtNHptMC0xMGgtMnY0aDJ2LTR6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=')] opacity-20" 
               style={{ animation: 'patternShift 20s linear infinite' }}></div>
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 mb-3 relative z-10">
            <h1 className="text-lg sm:text-xl font-bold tracking-wide">Lingento Tutorial</h1>
            <div className="text-xs sm:text-sm bg-white/20 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full shadow-inner whitespace-nowrap">
              {currentStep + 1} of {TUTORIAL_STEPS.length}
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden relative z-10 shadow-inner">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content - Enhanced with better visuals */}
        <div className="p-5 sm:p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >              
              <motion.div 
                className="mb-4 sm:mb-6 transform transition-transform"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, 0, -2, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <div className="text-5xl sm:text-6xl mb-2 inline-flex p-5 sm:p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full shadow-lg sm:shadow-xl relative">
                  {/* Decorative rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-blue-200/30 dark:border-blue-600/20 animate-pulse" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute inset-0 rounded-full border border-purple-200/50 dark:border-purple-600/30" style={{ transform: 'scale(1.1)' }}></div>
                  
                  {/* The actual icon */}
                  <span className="transform transition-transform">{currentTutorialStep.icon}</span>
                </div>
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent px-1">
                {currentTutorialStep.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-5 sm:mb-8 leading-relaxed text-sm sm:text-base md:text-lg max-w-sm mx-auto">
                {currentTutorialStep.content}
              </p>
            </motion.div>
          </AnimatePresence>        </div>
        
        {/* Footer - Refined design with smaller fonts and improved layout */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-b from-transparent to-gray-50/80 dark:to-gray-800/30 border-t border-gray-100/70 dark:border-gray-700/50 flex flex-wrap sm:flex-nowrap justify-between items-center gap-2">          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-2 py-1.5 sm:px-3 sm:py-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 text-xs rounded-lg ${currentStep === 0 ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
            >
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium">Back</span>
              </span>
            </button>
            
            {currentStep > 0 && (
              <button
                onClick={handleSkip}
                className="px-2 py-1.5 sm:px-3 sm:py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 text-xs font-medium rounded-lg"
              >
                Skip
              </button>
            )}
          </div>
            {/* Step indicators - compact design with smaller dots */}
          <div className="hidden sm:flex gap-1 order-last sm:order-none w-full sm:w-auto justify-center my-2 sm:my-0">
            {TUTORIAL_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-blue-600 w-3.5 transform scale-110'
                    : index < currentStep
                    ? 'bg-green-500 hover:scale-110'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                title={`Step ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Action button - compact design with smaller text */}
          <button
            onClick={handleAction}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-300 font-semibold text-xs shadow-md hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-auto sm:ml-0"
          >
            {currentTutorialStep.action}
          </button>
        </div>
      </motion.div>

      {/* CSS for tutorial highlights */}      <style jsx global>{`
        .tutorial-highlight {
          position: relative;
          z-index: 101;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          animation: tutorialPulse 2s infinite;
        }
        
        @keyframes tutorialPulse {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.5);
          }
        }
        
        @keyframes countdown {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
