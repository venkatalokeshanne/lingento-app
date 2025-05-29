'use client';

import { useUserPreferences } from '@/context/UserPreferencesContext';
import Dashboard from '../../components/Dashboard/Dashboard';
import ProtectedRoute from '../../components/ProtectedRoute';
import OnboardingFlow from '../../components/OnboardingFlow';

export default function DashboardPage() {
  const { hasCompletedOnboarding, loading } = useUserPreferences();

  return (
    <ProtectedRoute>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : !hasCompletedOnboarding() ? (
        <OnboardingFlow />
      ) : (
        <Dashboard />
      )}
    </ProtectedRoute>
  );
}