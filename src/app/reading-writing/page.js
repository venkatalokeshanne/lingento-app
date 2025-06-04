// Reading & Writing Practice Page
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import ReadingWritingHub from '@/components/ReadingWriting/ReadingWritingHub';
import SEOHead from '@/components/SEOHead';

export default function ReadingWritingPage() {
  return (
    <ProtectedRoute>      <SEOHead 
        title="Reading & Writing Practice | Lingento - Improve Language Comprehension"
        description="Practice reading comprehension and writing skills with interactive exercises, guided texts, and AI feedback. Improve your language literacy at your own pace."
        keywords={[
          'reading practice',
          'writing practice',
          'language comprehension',
          'reading exercises',
          'writing exercises',
          'improve reading',
          'improve writing',
          'language literacy',
          'text analysis',
          'writing feedback',
          'reading skills',
          'writing skills',
          'practice writing',
          'practice reading'
        ]}
        canonical="https://lingentoo.com/reading-writing"
        ogImage="https://lingentoo.com/og-reading-writing.jpg"
        twitterImage="https://lingentoo.com/twitter-reading-writing.jpg"
      />
      <div className="relative">
        <ReadingWritingHub />
      </div>
    </ProtectedRoute>
  );
}
