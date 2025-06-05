'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { LANGUAGES, NATIVE_LANGUAGES, LEVELS } from '@/constants/languages';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingFlow() {
  const { currentUser } = useAuth();
  const { updatePreferences } = useUserPreferences();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    language: '',
    level: '',
    nativeLanguage: '',
    dailyGoal: 20,
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!preferences.language || !preferences.level || !preferences.nativeLanguage) {
      return;
    }

    setLoading(true);
    try {
      await updatePreferences({
        ...preferences,
        onboardingCompleted: true,
      });
      // The parent component will handle hiding the onboarding flow
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 1: return preferences.language;
      case 2: return preferences.level;
      case 3: return preferences.nativeLanguage;
      case 4: return true;
      default: return false;
    }
  };  return (    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-violet-800 to-purple-900 flex items-center justify-center p-3 sm:p-4 z-50 overflow-hidden">
      <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] max-w-2xl w-full my-4 sm:my-8 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col backdrop-blur-lg border border-white/10 relative transition-all duration-300 ease-in-out hover:shadow-[0_25px_70px_-15px_rgba(79,70,229,0.4)] dark:hover:shadow-[0_25px_70px_-15px_rgba(79,70,229,0.3)]">
        {/* Header (Fixed Height) */}
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 sm:px-8 py-6 sm:py-8 text-white relative overflow-visible pt-7 pb-8 flex-shrink-0">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="0.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 relative z-10 gap-1 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center sm:text-left w-full sm:w-auto">Welcome to Lingento!</h1>
            <div className="text-sm bg-white/20 px-4 py-1.5 rounded-full font-medium backdrop-blur-sm self-center sm:self-auto inline-flex justify-center items-center whitespace-nowrap shadow-sm z-20 min-w-[90px]">
              Step {currentStep} of 4
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2.5 shadow-inner overflow-hidden mt-3 sm:mt-4 mb-0.5">
            <div 
              className="bg-gradient-to-r from-blue-300 to-indigo-300 h-2.5 rounded-full transition-all duration-500 ease-out shadow"
              style={{ width: `${Math.max(10, (currentStep / 4) * 100)}%` }}
            ></div>
          </div>
        </div>        {/* Content (Scrollable Area) - Single scrollable container */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200 dark:scrollbar-thumb-indigo-800 scrollbar-track-transparent hover:scrollbar-thumb-indigo-300 dark:hover:scrollbar-thumb-indigo-700 scroll-smooth overscroll-contain">          <div className="p-4 sm:p-8 md:p-10 flex items-center justify-center relative">
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-gradient-to-r from-transparent via-indigo-300/50 dark:via-indigo-700/50 to-transparent rounded-full hidden sm:flex animate-pulse content-scroll-indicator"></div>
            <div className="w-full max-w-lg px-2 sm:px-0">{/* Step 1: Learning Language */}              {currentStep === 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                  className="text-center sm:pb-4">
                  <div className="inline-block p-4 sm:p-6 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-full mb-4 sm:mb-6 shadow-inner">
                    <div className="text-5xl sm:text-6xl animate-float">🌍</div>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3 px-1">
                    Which language do you want to learn?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base px-1">
                    Choose the language you'd like to focus on
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 pr-1">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => handlePreferenceChange('language', lang.value)}
                        className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 ${
                          preferences.language === lang.value
                            ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 shadow-lg ring-2 ring-indigo-200 dark:ring-indigo-400'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                        }`}
                      >
                        <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 transform transition-transform group-hover:scale-110">{lang.flag}</div>
                        <div className="font-medium text-sm sm:text-base">{lang.label}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}              {/* Step 2: Proficiency Level */}
              {currentStep === 2 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                  className="text-center sm:pb-4">
                  <div className="inline-block p-4 sm:p-6 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-full mb-4 sm:mb-6 shadow-inner">
                    <div className="text-5xl sm:text-6xl animate-float">📈</div>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3 px-1">
                    What's your current level?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base px-1">
                    This helps us tailor content to your needs
                  </p>
                  <div className="space-y-3 sm:space-y-4 pr-1">
                    {LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => handlePreferenceChange('level', level.value)}
                        className={`w-full p-4 sm:p-5 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 ${
                          preferences.level === level.value
                            ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-3 sm:gap-5">
                          <div className="text-2xl sm:text-3xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full flex-shrink-0">{level.emoji}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white truncate">{level.label}</div>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{level.description}</div>
                          </div>
                          {preferences.level === level.value && (
                            <div className="text-indigo-600 dark:text-indigo-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}              {/* Step 3: Native Language */}
              {currentStep === 3 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                  className="text-center sm:pb-4">
                  <div className="inline-block p-4 sm:p-6 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-full mb-4 sm:mb-6 shadow-inner">
                    <div className="text-5xl sm:text-6xl animate-float">🏠</div>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3 px-1">
                    What's your native language?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base px-1">
                    We'll use this for translations and explanations
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 pr-1">
                    {NATIVE_LANGUAGES.map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => handlePreferenceChange('nativeLanguage', lang.value)}
                        className={`group p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 ${
                          preferences.nativeLanguage === lang.value
                            ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 shadow-lg ring-2 ring-indigo-200 dark:ring-indigo-400'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                        }`}
                      >
                        <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 transform transition-transform group-hover:scale-110">{lang.flag}</div>
                        <div className="font-medium text-sm sm:text-base">{lang.label}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}{/* Step 4: Daily Goal */}
              {currentStep === 4 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                  className="text-center sm:pb-4">
                  <div className="inline-block p-4 sm:p-6 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-full mb-4 sm:mb-6 shadow-inner">
                    <div className="text-5xl sm:text-6xl animate-float">🎯</div>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3 px-1">
                    Set your daily goal
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base px-1">
                    How many new words would you like to learn each day?
                  </p>
                  
                  <div className="max-w-md mx-auto">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 sm:p-10 shadow-sm border border-indigo-100 dark:border-indigo-800/30">
                      <div className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4 transition-all duration-300">
                        {preferences.dailyGoal}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg">words per day</div>
                      <div className="space-y-4 sm:space-y-6">
                        <input
                          type="range"
                          min="5"
                          max="50"
                          step="5"
                          value={preferences.dailyGoal}
                          onChange={(e) => handlePreferenceChange('dailyGoal', parseInt(e.target.value))}
                          className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 touch-pan-x"
                          style={{
                            backgroundImage: `linear-gradient(to right, #6366f1 0%, #8b5cf6 ${(preferences.dailyGoal - 5) / 45 * 100}%, #e5e7eb ${(preferences.dailyGoal - 5) / 45 * 100}%, #e5e7eb 100%)`
                          }}
                        />
                        
                        <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                          <span>5 words</span>
                          <span>50 words</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>        {/* Footer */}
        <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/70 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-3 sm:px-5 py-2 sm:py-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
            <div className="flex gap-1.5 sm:gap-2 mx-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full transition-all duration-300 ${
                  step === currentStep
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 scale-110'
                    : step < currentStep
                    ? 'bg-gradient-to-r from-green-500 to-teal-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          {currentStep < 4 ? (            <button
              onClick={handleNext}
              disabled={!isStepComplete(currentStep)}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center gap-1.5 sm:gap-2 font-medium text-sm sm:text-base"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          ) : (            <button
              onClick={handleComplete}
              disabled={loading || !isStepComplete(4)}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center gap-1.5 sm:gap-2 font-medium text-sm sm:text-base"
            >
              {loading ? (                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                  <span className="text-sm sm:text-base">Setting up...</span>
                </>
              ) : (
                <>
                  Get Started
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
