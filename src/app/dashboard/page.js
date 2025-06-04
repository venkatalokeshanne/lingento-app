'use client';

import { useUserPreferences } from '@/context/UserPreferencesContext';
import Dashboard from '../../components/Dashboard/Dashboard';
import ProtectedRoute from '../../components/ProtectedRoute';
import OnboardingFlow from '../../components/OnboardingFlow';
import TutorialFlow from '../../components/TutorialFlow';

export default function DashboardPage() {
  const { hasCompletedOnboarding, hasCompletedTutorial, loading } = useUserPreferences();

  return (
    <ProtectedRoute>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : !hasCompletedOnboarding() ? (
        <OnboardingFlow />
      ) : !hasCompletedTutorial() ? (
        <div className="relative">
          <Dashboard />
          <TutorialFlow 
            onComplete={() => {
              // Tutorial completed, will show main dashboard
              console.log('Tutorial completed');
            }}
            onSkip={() => {
              // Tutorial skipped, will show main dashboard
              console.log('Tutorial skipped');
            }}
          />
        </div>
      ) : (
        <Dashboard />
      )}
    </ProtectedRoute>
  );
}