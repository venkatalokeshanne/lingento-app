// Reading & Writing Practice Page
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import ReadingWritingHub from '@/components/ReadingWriting/ReadingWritingHub';

export default function ReadingWritingPage() {
  return (
    <ProtectedRoute>
      <ReadingWritingHub />
    </ProtectedRoute>
  );
}
