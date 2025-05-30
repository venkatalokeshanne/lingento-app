'use client';

import { useState, useEffect } from 'react';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SettingsPage() {
  const { preferences, updatePreferences, resetPreferences, loading: prefsLoading } = useUserPreferences();
  
  const [formData, setFormData] = useState({
    soundEnabled: true,
    autoPlay: true,
    audioSpeed: 1.0,
    theme: 'system',
    studyReminders: true,
    studyTime: '18:00',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Initialize form data when preferences load
  useEffect(() => {
    if (!prefsLoading && preferences) {
      setFormData({
        soundEnabled: preferences.soundEnabled ?? true,
        autoPlay: preferences.autoPlay ?? true,
        audioSpeed: preferences.audioSpeed ?? 1.0,
        theme: preferences.theme || 'system',
        studyReminders: preferences.studyReminders ?? true,
        studyTime: preferences.studyTime || '18:00',
      });
    }
  }, [preferences, prefsLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updatePreferences(formData);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all preferences to default values?')) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await resetPreferences();
      setMessage({ type: 'success', text: 'Settings reset to defaults!' });
    } catch (error) {
      console.error('Error resetting settings:', error);
      setMessage({ type: 'error', text: 'Failed to reset settings. Please try again.' });
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Loading Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg animate-pulse">
                <div className="w-10 h-10 bg-white/30 dark:bg-gray-300/30 rounded-full"></div>
              </div>
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-80 mx-auto mb-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
            </div>

            {/* Loading Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Loading Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6 animate-pulse">
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Loading Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-8 animate-pulse">
                  <div className="space-y-8">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-4">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                        <div className="space-y-3">
                          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        </div>
                      </div>
                    ))}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Settings
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Customize your learning experience and personalize your app preferences
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings Navigation Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Access</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-800/50 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 7.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M4.929 4.929a9 9 0 000 12.728M7.757 7.757a5 5 0 000 8.486" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Audio</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Sound & pronunciation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800/50 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Appearance</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Theme & display</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-800/50 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM7 7v10l5-5-5-5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Notifications</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Reminders & alerts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Form */}
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
                  {/* Audio Settings */}
                  <div className="group">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 7.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M4.929 4.929a9 9 0 000 12.728M7.757 7.757a5 5 0 000 8.486" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Audio Settings</h2>
                        <p className="text-gray-600 dark:text-gray-300">Configure sound and pronunciation preferences</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-700/20 space-y-6">
                      {/* Sound Effects Toggle */}
                      <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                            Sound Effects
                          </label>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Play sounds for correct/incorrect answers
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleChange('soundEnabled', !formData.soundEnabled)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                            formData.soundEnabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              formData.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Auto-play Toggle */}
                      <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                            Auto-play Pronunciation
                          </label>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Automatically play word pronunciation when shown
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleChange('autoPlay', !formData.autoPlay)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                            formData.autoPlay ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              formData.autoPlay ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                      
                      {/* Audio Speed Slider */}
                      <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Audio Speed
                        </label>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          Adjust pronunciation speed ({formData.audioSpeed}x)
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">0.5x</span>
                          <div className="flex-1 relative">
                            <input
                              type="range"
                              min="0.5"
                              max="2.0"
                              step="0.1"
                              value={formData.audioSpeed || 1.0}
                              onChange={(e) => handleChange('audioSpeed', parseFloat(e.target.value))}
                              className="w-full h-3 bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800 rounded-lg appearance-none cursor-pointer slider"
                              style={{
                                background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${((formData.audioSpeed - 0.5) / 1.5) * 100}%, #e0e7ff ${((formData.audioSpeed - 0.5) / 1.5) * 100}%, #e0e7ff 100%)`
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">2.0x</span>
                        </div>
                        <div className="flex justify-center mt-3">
                          <div className="bg-white dark:bg-gray-700 rounded-full px-4 py-2 shadow-lg border-2 border-indigo-200 dark:border-indigo-700">
                            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                              {formData.audioSpeed}x
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Theme Settings */}
                  <div className="group">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Appearance</h2>
                        <p className="text-gray-600 dark:text-gray-300">Choose your preferred theme and display settings</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-700/20">
                      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
                        Theme Preference
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: 'light', label: 'Light', icon: '☀️', desc: 'Bright and clean' },
                          { value: 'dark', label: 'Dark', icon: '🌙', desc: 'Easy on the eyes' },
                          { value: 'system', label: 'System', icon: '⚙️', desc: 'Match device' },
                        ].map((theme) => (
                          <button
                            key={theme.value}
                            type="button"
                            onClick={() => handleChange('theme', theme.value)}
                            className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                              formData.theme === theme.value
                                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 shadow-lg ring-2 ring-purple-200 dark:ring-purple-400'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600/50'
                            }`}
                          >
                            <div className="text-3xl mb-2">{theme.icon}</div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{theme.label}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">{theme.desc}</div>
                            {formData.theme === theme.value && (
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
                  </div>

                  {/* Notification Settings */}
                  <div className="group">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19l5-5 5 5-5 5-5-5zM2 9l5-5 5 5-5 5-5-5z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Notifications</h2>
                        <p className="text-gray-600 dark:text-gray-300">Manage study reminders and alerts</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-700/20 space-y-6">
                      {/* Study Reminders Toggle */}
                      <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                            Study Reminders
                          </label>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Get reminded to practice daily
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleChange('studyReminders', !formData.studyReminders)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${
                            formData.studyReminders ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              formData.studyReminders ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Reminder Time */}
                      {formData.studyReminders && (
                        <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Reminder Time
                          </label>
                          <input
                            type="time"
                            value={formData.studyTime}
                            onChange={(e) => handleChange('studyTime', e.target.value)}
                            className="block w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 text-lg"
                      >
                        {loading ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Save Settings</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleReset}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-500 dark:hover:to-gray-600 disabled:from-gray-100 disabled:to-gray-200 dark:disabled:from-gray-800 dark:disabled:to-gray-700 text-gray-700 dark:text-gray-200 font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-3 text-lg"
                      >
                        {loading ? (
                          <>
                            <div className="w-6 h-6 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin"></div>
                            <span>Resetting...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Reset to Defaults</span>
                          </>
                        )}
                      </button>
                    </div>
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
