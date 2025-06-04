'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LANGUAGES, NATIVE_LANGUAGES, LEVELS } from '@/constants/languages';

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
        language: preferences.language || 'english',
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
  };  if (prefsLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Loading Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg animate-pulse">
                <div className="w-10 h-10 bg-white/30 dark:bg-gray-300/30 rounded-full"></div>
              </div>
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-80 mx-auto mb-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
            </div>

            {/* Loading Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Loading User Info Card */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6 animate-pulse">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto mb-2"></div>
                    <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-1"></div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16 mb-1"></div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-40"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading Settings Form */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-8 animate-pulse">
                  <div className="space-y-10">
                    {/* Loading sections */}
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                          <div>
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-60"></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {[1, 2, 3].map((j) => (
                            <div key={j} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }  return (
    <ProtectedRoute>
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Learning Profile
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Personalize your language learning journey with custom preferences and goals
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">        {/* User Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6 sticky top-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl text-white font-bold">
                  {currentUser?.displayName?.charAt(0)?.toUpperCase() || currentUser?.email?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Account Info</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded mx-auto"></div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Display Name</p>
                    <p className="text-gray-900 dark:text-gray-100 font-semibold">{currentUser?.displayName || 'Not set'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-800/50 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-gray-100 font-semibold text-sm break-all">{currentUser?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>        {/* Settings Form */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-8">
            {/* Success/Error Messages */}
            {message.text && (
              <div className={`mb-8 p-4 rounded-xl border-l-4 ${
                message.type === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-500' 
                  : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-500'
              }`}>
                <div className="flex items-center gap-3">
                  {message.type === 'success' ? (
                    <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="font-medium">{message.text}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Learning Language */}
              <div className="group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>                  <div>
                    <label className="block text-xl font-bold text-gray-900 dark:text-gray-100">
                      Learning Language
                    </label>
                    <p className="text-gray-600 dark:text-gray-300">Which language would you like to master?</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => handleChange('language', lang.value)}
                      className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        formData.language === lang.value
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 shadow-lg ring-2 ring-blue-200 dark:ring-blue-400'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{lang.flag}</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{lang.label}</div>
                      {formData.language === lang.value && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Proficiency Level */}
              <div className="group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>                  <div>
                    <label className="block text-xl font-bold text-gray-900 dark:text-gray-100">
                      Proficiency Level
                    </label>
                    <p className="text-gray-600 dark:text-gray-300">How would you rate your current skills?</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => handleChange('level', level.value)}
                      className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${
                        formData.level === level.value
                          ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 shadow-lg ring-2 ring-emerald-200 dark:ring-emerald-400'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">{level.label}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{level.description}</div>
                        </div>
                        {formData.level === level.value && (
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center ml-4">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Native Language */}
              <div className="group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>                  <div>
                    <label className="block text-xl font-bold text-gray-900 dark:text-gray-100">
                      Native Language
                    </label>
                    <p className="text-gray-600 dark:text-gray-300">What language do you speak fluently?</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {NATIVE_LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => handleChange('nativeLanguage', lang.value)}
                      className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        formData.nativeLanguage === lang.value
                          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 shadow-lg ring-2 ring-purple-200 dark:ring-purple-400'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{lang.flag}</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{lang.label}</div>
                      {formData.nativeLanguage === lang.value && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Goal */}
              <div className="group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>                  <div>
                    <label className="block text-xl font-bold text-gray-900 dark:text-gray-100">
                      Daily Goal
                    </label>
                    <p className="text-gray-600 dark:text-gray-300">How many new words per day?</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl p-6 border border-orange-200 dark:border-orange-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">5 words</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">50 words</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={formData.dailyGoal}
                      onChange={(e) => handleChange('dailyGoal', parseInt(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-orange-200 to-red-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #fb923c 0%, #fb923c ${(formData.dailyGoal - 5) / 45 * 100}%, #fed7aa ${(formData.dailyGoal - 5) / 45 * 100}%, #fed7aa 100%)`
                      }}
                    />                    <div className="flex justify-center mt-4">
                      <div className="bg-white dark:bg-gray-700 rounded-full px-6 py-3 shadow-lg border-2 border-orange-200 dark:border-orange-600">
                        <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                          {formData.dailyGoal}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">words/day</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 text-center">
                    Start with a manageable goal and increase as you progress
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 text-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save Profile Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</ProtectedRoute>
  );
}