'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import TutorialFlow from '@/components/TutorialFlow';
import { TutorialProvider } from '@/context/TutorialContext';

/**
 * TutorialManager Component
 * 
 * This component manages when to show the tutorial flow:
 * - Monitors auth state for new users
 * - Displays tutorial only on first login
 * - Integrates with user preferences to avoid showing tutorial more than once
 */
export default function TutorialManager({ children }) {
  const router = useRouter();
  const { currentUser, isNewUser, setIsNewUser } = useAuth();
  const { updatePreferences, preferences, hasCompletedTutorial } = useUserPreferences();
  const [showTutorial, setShowTutorial] = useState(false);
  // Function to show tutorial when a word is added
  const showTutorialOnWordAdded = () => {
    console.log('Word added, showing tutorial');
    // We'll show the tutorial when a word is added, regardless of whether the user has completed the tutorial before
    setShowTutorial(true);
  };

  // Force showing tutorial for all users to test functionality
  const forceShowTutorial = false; // Disabled forcing tutorial to show so it only appears when a word is added
  
  // Check if the tutorial should be shown when auth or preferences change
  useEffect(() => {
    // Only proceed if the user is logged in
    if (!currentUser) return;
    
    // For testing purposes, log the current state
    console.log('TutorialManager: Auth state', { 
      isLoggedIn: !!currentUser, 
      isNewUser, 
      hasCompletedTutorial: hasCompletedTutorial(),
      preferences
    });
    setShowTutorial(true);
    // If we're forcing the tutorial to show, or if it's a new user who hasn't completed the tutorial
    // Note: we don't auto-show the tutorial on login anymore - it will be triggered by word addition instead
    if (forceShowTutorial || (isNewUser && !hasCompletedTutorial() && false)) {
      console.log('TutorialManager: Showing tutorial on login');
      setShowTutorial(true);
    }
  }, [currentUser, isNewUser, hasCompletedTutorial, preferences, forceShowTutorial]);
  // Handle tutorial completion
  const handleTutorialComplete = async () => {
    try {
      // Update user preferences to mark tutorial as completed
      await updatePreferences({
        tutorialCompleted: true,
        tutorialSkipped: false,
        tutorialCompletedAt: new Date()
      });
      
      // Reset new user state
      setIsNewUser(false);
      setShowTutorial(false);
      
      // Set a small timeout to allow the animation to complete
      setTimeout(() => {
        // Redirect to flashcards page after tutorial
        router.push('/flashcards');
      }, 300);
    } catch (error) {
      console.error('Error completing tutorial:', error);
    }
  };
  // Handle tutorial skipping
  const handleTutorialSkip = async () => {
    try {
      // Update user preferences to mark tutorial as skipped
      await updatePreferences({
        tutorialCompleted: true,
        tutorialSkipped: true,
        tutorialSkippedAt: new Date()
      });
      
      // Reset new user state
      setIsNewUser(false);
      setShowTutorial(false);
      
      // Set a small timeout to allow the animation to complete
      setTimeout(() => {
        // Redirect to flashcards page after skipping
        router.push('/flashcards');
      }, 300);    } catch (error) {
      console.error('Error skipping tutorial:', error);
    }
  };
  
  return (
    <TutorialProvider showTutorialCallback={showTutorialOnWordAdded}>
      {showTutorial && (
        <TutorialFlow
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
        />
      )}
      {children}
    </TutorialProvider>
  );
}
