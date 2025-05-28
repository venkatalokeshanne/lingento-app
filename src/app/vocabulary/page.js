'use client';

import VocabularyManager from '@/components/VocabularyManager/VocabularyManager';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function VocabularyPage() {
  return (
    <ProtectedRoute>
      <VocabularyManager />
    </ProtectedRoute>
  );
}
