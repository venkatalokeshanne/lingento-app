'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const { currentUser, isNewUser, setIsNewUser } = useAuth();
  const { updatePreferences, preferences, hasCompletedTutorial, hasCompletedOnboarding } = useUserPreferences();
  const [showTutorial, setShowTutorial] = useState(false);// Function to show tutorial when a word is added
  const showTutorialOnWordAdded = () => {
    console.log('Word added, checking if tutorial should be shown');
    
    // Only show tutorial if onboarding is complete
    if (!hasCompletedOnboarding()) {
      console.log('Onboarding not complete, skipping tutorial');
      return;
    }
    
    // Only show tutorial if it hasn't been completed yet
    if (hasCompletedTutorial()) {
      console.log('Tutorial already completed, skipping');
      return;
    }
    
    console.log('Showing tutorial after word addition');
    setShowTutorial(true);
  };

  // Force showing tutorial for all users to test functionality
  const forceShowTutorial = false; // Disabled forcing tutorial to show so it only appears when a word is added
  // Check if the tutorial should be shown when auth or preferences change
  useEffect(() => {
    // Only proceed if the user is logged in
    if (!currentUser) return;
    
    // Don't show tutorial on dashboard page - let dashboard handle its own onboarding/tutorial flow
    if (pathname === '/dashboard') return;
    
    // For testing purposes, log the current state
    console.log('TutorialManager: Auth state', { 
      isLoggedIn: !!currentUser, 
      isNewUser, 
      hasCompletedOnboarding: hasCompletedOnboarding(),
      hasCompletedTutorial: hasCompletedTutorial(),
      pathname,
      preferences
    });
    
    // Only show tutorial if:
    // 1. User has completed onboarding AND
    // 2. User hasn't completed tutorial AND
    // 3. User is new OR we're forcing it for testing
    const shouldShowTutorial = hasCompletedOnboarding() && 
                              !hasCompletedTutorial() && 
                              (isNewUser || forceShowTutorial);
    
    if (shouldShowTutorial) {
      console.log('TutorialManager: Showing tutorial after onboarding completion');
      setShowTutorial(true);
    }
  }, [currentUser, isNewUser, hasCompletedOnboarding, hasCompletedTutorial, pathname, preferences, forceShowTutorial]);// Handle tutorial completion
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
        // Redirect to flashcards page after tutorial completion
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
