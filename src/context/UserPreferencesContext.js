'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

// Create the user preferences context
const UserPreferencesContext = createContext();

// Hook to use the user preferences context
export const useUserPreferences = () => {
  return useContext(UserPreferencesContext);
};

// Default preferences
const defaultPreferences = {
  language: 'french',
  level: 'beginner',
  nativeLanguage: 'english',
  dailyGoal: 20, // words per day
  soundEnabled: true,
  autoPlay: true,
  theme: 'system', // 'light', 'dark', 'system'
  studyReminders: true,
  studyTime: '18:00', // Default study reminder time
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Provider component
export function UserPreferencesProvider({ children }) {
  const { currentUser } = useAuth();
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user preferences from Firestore
  const loadPreferences = async (user) => {
    if (!user) {
      setPreferences(defaultPreferences);
      setLoading(false);
      return;
    }

    try {
      const db = getFirestore();
      const preferencesRef = doc(db, `users/${user.uid}/settings/preferences`);
      
      // Set up real-time listener
      const unsubscribe = onSnapshot(preferencesRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setPreferences({
            ...defaultPreferences,
            ...data,
            // Convert timestamps if they exist
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date(),
          });
        } else {
          // Document doesn't exist, create it with defaults
          createDefaultPreferences(user);
        }
        setLoading(false);
        setError(null);
      }, (error) => {
        console.error('Error loading user preferences:', error);
        setError(error.message);
        setPreferences(defaultPreferences);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up preferences listener:', error);
      setError(error.message);
      setPreferences(defaultPreferences);
      setLoading(false);
    }
  };

  // Create default preferences for new users
  const createDefaultPreferences = async (user) => {
    if (!user) return;

    try {
      const db = getFirestore();
      const preferencesRef = doc(db, `users/${user.uid}/settings/preferences`);
      
      const newPreferences = {
        ...defaultPreferences,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(preferencesRef, newPreferences);
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error creating default preferences:', error);
      setError(error.message);
    }
  };

  // Update user preferences
  const updatePreferences = async (updates) => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const db = getFirestore();
      const preferencesRef = doc(db, `users/${currentUser.uid}/settings/preferences`);
      
      const updatedPreferences = {
        ...updates,
        updatedAt: new Date(),
      };

      await setDoc(preferencesRef, updatedPreferences, { merge: true });
      
      // Local state will be updated automatically by the onSnapshot listener
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      setError(error.message);
      throw error;
    }
  };

  // Reset preferences to defaults
  const resetPreferences = async () => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const db = getFirestore();
      const preferencesRef = doc(db, `users/${currentUser.uid}/settings/preferences`);
      
      const resetPrefs = {
        ...defaultPreferences,
        createdAt: preferences.createdAt, // Keep original creation date
        updatedAt: new Date(),
      };

      await setDoc(preferencesRef, resetPrefs);
      return true;
    } catch (error) {
      console.error('Error resetting preferences:', error);
      setError(error.message);
      throw error;
    }
  };

  // Get preference by key
  const getPreference = (key) => {
    return preferences[key] ?? defaultPreferences[key];
  };

  // Check if user has completed onboarding
  const hasCompletedOnboarding = () => {
    return preferences.language && preferences.level && preferences.nativeLanguage;
  };

  // Load preferences when user changes
  useEffect(() => {
    let unsubscribe;

    if (currentUser) {
      loadPreferences(currentUser).then((unsub) => {
        if (unsub) unsubscribe = unsub;
      });
    } else {
      setPreferences(defaultPreferences);
      setLoading(false);
      setError(null);
    }

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

  const value = {
    preferences,
    loading,
    error,
    updatePreferences,
    resetPreferences,
    getPreference,
    hasCompletedOnboarding,
    // Quick access to commonly used preferences
    language: preferences.language,
    level: preferences.level,
    nativeLanguage: preferences.nativeLanguage,
    dailyGoal: preferences.dailyGoal,
    soundEnabled: preferences.soundEnabled,
    autoPlay: preferences.autoPlay,
    theme: preferences.theme,
    studyReminders: preferences.studyReminders,
    studyTime: preferences.studyTime,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
}
