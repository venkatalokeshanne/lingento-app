'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import ProtectedRoute from '@/components/ProtectedRoute';

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
  { value: 'beginner', label: 'Beginner', description: 'Just starting out' },
  { value: 'elementary', label: 'Elementary', description: 'Basic words and phrases' },
  { value: 'intermediate', label: 'Intermediate', description: 'Comfortable with basics' },
  { value: 'upper-intermediate', label: 'Upper Intermediate', description: 'Complex conversations' },
  { value: 'advanced', label: 'Advanced', description: 'Near fluent' },
  { value: 'proficient', label: 'Proficient', description: 'Native-like fluency' },
];

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const { preferences, updatePreferences, loading: prefsLoading } = useUserPreferences();
  const [formData, setFormData] = useState({
    language: '',
    level: '',
    nativeLanguage: '',
    dailyGoal: 20,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Initialize form data when preferences load
  useEffect(() => {
    if (!prefsLoading && preferences) {
      setFormData({
        language: preferences.language || 'french',
        level: preferences.level || 'beginner',
        nativeLanguage: preferences.nativeLanguage || 'english',
        dailyGoal: preferences.dailyGoal || 20,
      });
    }
  }, [preferences, prefsLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updatePreferences(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (prefsLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Profile</h1>
              <p className="text-gray-600">
                Customize your language learning experience
              </p>
            </div>

            {/* User Info */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Account Info</h2>
              <p className="text-gray-700">
                <span className="font-medium">Display Name:</span> {currentUser?.displayName || 'Not set'}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email:</span> {currentUser?.email}
              </p>
            </div>

            {/* Success/Error Messages */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Learning Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Which language are you learning?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => handleChange('language', lang.value)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        formData.language === lang.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">{lang.flag}</div>
                      <div className="text-sm font-medium">{lang.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Proficiency Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What's your current level?
                </label>
                <div className="space-y-2">
                  {LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => handleChange('level', level.value)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        formData.level === level.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="font-medium">{level.label}</div>
                      <div className="text-sm text-gray-600">{level.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Native Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What's your native language?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {NATIVE_LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => handleChange('nativeLanguage', lang.value)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        formData.nativeLanguage === lang.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">{lang.flag}</div>
                      <div className="text-sm font-medium">{lang.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily vocabulary goal
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={formData.dailyGoal}
                    onChange={(e) => handleChange('dailyGoal', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-lg font-semibold text-blue-600 min-w-[3rem]">
                    {formData.dailyGoal}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Number of new words to learn per day
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
