'use client';

import { useUserPreferences } from '@/context/UserPreferencesContext';
import VocabularyManager from '@/components/VocabularyManager/VocabularyManager';
import ProtectedRoute from '@/components/ProtectedRoute';
import OnboardingFlow from '@/components/OnboardingFlow';
import SEOHead from '@/components/SEOHead';

export default function VocabularyPage() {
  const { hasCompletedOnboarding, loading } = useUserPreferences();

  return (
    <ProtectedRoute>
      <SEOHead 
        title="French Vocabulary Builder | Lingento - Master French Words Fast"
        description="Build your French vocabulary with our advanced spaced repetition system. Learn 10,000+ French words with flashcards, pronunciation guides, and adaptive learning technology."
        keywords={[
          'French vocabulary',
          'French words',
          'vocabulary builder',
          'French flashcards',
          'spaced repetition',
          'French pronunciation',
          'learn French vocabulary',
          'French language learning',
          'vocabulary practice',
          'French vocabulary app',
          'memorize French words',
          'French vocabulary training'
        ]}
        canonical="https://lingentoo.com/vocabulary"
        ogImage="https://lingentoo.com/og-vocabulary.jpg"
        twitterImage="https://lingentoo.com/twitter-vocabulary.jpg"
      />
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : !hasCompletedOnboarding() ? (
        <OnboardingFlow />
      ) : (
        <VocabularyManager />
      )}
    </ProtectedRoute>
  );
}
