'use client';

import { Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SimpleVocabularyQuiz from '@/components/Quiz/SimpleVocabularyQuiz';
import { Toaster } from 'react-hot-toast';
import SEOHead from '@/components/SEOHead';

// Loading component
function QuizLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading quiz...</p>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <ProtectedRoute>      <SEOHead 
        title="Vocabulary Quiz | Lingento - Test Your Language Knowledge"
        description="Test your vocabulary with AI-powered quizzes. Adaptive difficulty, instant feedback, and spaced repetition to maximize your language learning results."
        keywords={[
          'vocabulary quiz',
          'language quiz',
          'test vocabulary',
          'language learning quiz',
          'vocabulary test',
          'word quiz',
          'practice vocabulary',
          'language learning quiz',
          'adaptive language quiz',
          'AI language quiz',
          'vocabulary assessment',
          'language knowledge test'
        ]}
        canonical="https://lingentoo.com/quiz"
        ogImage="https://lingentoo.com/og-quiz.jpg"
        twitterImage="https://lingentoo.com/twitter-quiz.jpg"
      />
      <div className="min-h-screen"><Suspense fallback={<QuizLoading />}>
          <SimpleVocabularyQuiz />
        </Suspense>
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#374151',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </div>
    </ProtectedRoute>
  );
}