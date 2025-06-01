'use client';

import { Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SimpleVocabularyQuiz from '@/components/Quiz/SimpleVocabularyQuiz';
import { Toaster } from 'react-hot-toast';

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
    <ProtectedRoute>
      <div className="min-h-screen">        <Suspense fallback={<QuizLoading />}>
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