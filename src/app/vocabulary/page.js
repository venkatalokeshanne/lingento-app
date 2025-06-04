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
      <SEOHead        title="Vocabulary Builder | Lingento - Master Words Fast"
        description="Build your vocabulary with our advanced spaced repetition system. Learn 10,000+ words with flashcards, pronunciation guides, and adaptive learning technology."
        keywords={[
          'vocabulary',
          'vocabulary builder',
          'flashcards',
          'spaced repetition',
          'pronunciation',
          'learn vocabulary',
          'language learning',
          'vocabulary practice',
          'vocabulary app',
          'memorize words',
          'vocabulary training'
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
