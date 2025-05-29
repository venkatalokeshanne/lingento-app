'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';

const LANGUAGES = [
  { value: 'french', label: 'French', flag: '🇫🇷' },
  { value: 'spanish', label: 'Spanish', flag: '🇪🇸' },
  { value: 'german', label: 'German', flag: '🇩🇪' },
  { value: 'italian', label: 'Italian', flag: '🇮🇹' },
  { value: 'portuguese', label: 'Portuguese', flag: '🇵🇹' },
  { value: 'russian', label: 'Russian', flag: '🇷🇺' },
  { value: 'chinese', label: 'Chinese', flag: '🇨🇳' },
  { value: 'japanese', label: 'Japanese', flag: '🇯🇵' },
  { value: 'korean', label: 'Korean', flag: '🇰🇷' },
];

const NATIVE_LANGUAGES = [
  { value: 'english', label: 'English', flag: '🇺🇸' },
  { value: 'spanish', label: 'Spanish', flag: '🇪🇸' },
  { value: 'french', label: 'French', flag: '🇫🇷' },
  { value: 'german', label: 'German', flag: '🇩🇪' },
  { value: 'italian', label: 'Italian', flag: '🇮🇹' },
  { value: 'portuguese', label: 'Portuguese', flag: '🇵🇹' },
  { value: 'chinese', label: 'Chinese', flag: '🇨🇳' },
  { value: 'japanese', label: 'Japanese', flag: '🇯🇵' },
  { value: 'korean', label: 'Korean', flag: '🇰🇷' },
];

const LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'Just starting out', emoji: '🌱' },
  { value: 'elementary', label: 'Elementary', description: 'Basic words and phrases', emoji: '📚' },
  { value: 'intermediate', label: 'Intermediate', description: 'Comfortable with basics', emoji: '🚀' },
  { value: 'upper-intermediate', label: 'Upper Intermediate', description: 'Complex conversations', emoji: '⭐' },
  { value: 'advanced', label: 'Advanced', description: 'Near fluent', emoji: '🏆' },
  { value: 'proficient', label: 'Proficient', description: 'Native-like fluency', emoji: '👑' },
];

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
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Welcome to Lingento!</h1>
            <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Step {currentStep} of 4
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step 1: Learning Language */}
          {currentStep === 1 && (
            <div className="text-center">
              <div className="text-6xl mb-4">🌍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Which language do you want to learn?
              </h2>
              <p className="text-gray-600 mb-8">
                Choose the language you'd like to focus on
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => handlePreferenceChange('language', lang.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      preferences.language === lang.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-3xl mb-2">{lang.flag}</div>
                    <div className="font-semibold">{lang.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Proficiency Level */}
          {currentStep === 2 && (
            <div className="text-center">
              <div className="text-6xl mb-4">📈</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What's your current level?
              </h2>
              <p className="text-gray-600 mb-8">
                This helps us tailor content to your needs
              </p>
              
              <div className="space-y-3">
                {LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => handlePreferenceChange('level', level.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] ${
                      preferences.level === level.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{level.emoji}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{level.label}</div>
                        <div className="text-sm text-gray-600">{level.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Native Language */}
          {currentStep === 3 && (
            <div className="text-center">
              <div className="text-6xl mb-4">🏠</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What's your native language?
              </h2>
              <p className="text-gray-600 mb-8">
                We'll use this for translations and explanations
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {NATIVE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => handlePreferenceChange('nativeLanguage', lang.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      preferences.nativeLanguage === lang.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-3xl mb-2">{lang.flag}</div>
                    <div className="font-semibold">{lang.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Daily Goal */}
          {currentStep === 4 && (
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Set your daily goal
              </h2>
              <p className="text-gray-600 mb-8">
                How many new words would you like to learn each day?
              </p>
              
              <div className="max-w-md mx-auto">
                <div className="bg-gray-50 rounded-xl p-8">
                  <div className="text-6xl font-bold text-blue-600 mb-4">
                    {preferences.dailyGoal}
                  </div>
                  <div className="text-gray-600 mb-6">words per day</div>
                  
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={preferences.dailyGoal}
                      onChange={(e) => handlePreferenceChange('dailyGoal', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>5 words</span>
                      <span>50 words</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>
          
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === currentStep
                    ? 'bg-blue-600'
                    : step < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={!isStepComplete(currentStep)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading || !isStepComplete(4)}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Setting up...
                </>
              ) : (
                'Get Started! 🚀'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
