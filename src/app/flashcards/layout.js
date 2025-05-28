'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import FlashcardsPage from './page';

export default function FlashcardsWrapper() {
  return (
    <ProtectedRoute>
      <FlashcardsPage />
    </ProtectedRoute>
  );
}
