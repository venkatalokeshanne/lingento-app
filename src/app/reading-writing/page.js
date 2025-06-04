// Reading & Writing Practice Page
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import ReadingWritingHub from '@/components/ReadingWriting/ReadingWritingHub';
import SEOHead from '@/components/SEOHead';

export default function ReadingWritingPage() {
  return (
    <ProtectedRoute>
      <SEOHead 
        title="French Reading & Writing Practice | Lingento - Improve French Comprehension"
        description="Practice French reading comprehension and writing skills with interactive exercises, guided texts, and AI feedback. Improve your French literacy at your own pace."
        keywords={[
          'French reading practice',
          'French writing practice',
          'French comprehension',
          'French reading exercises',
          'French writing exercises',
          'improve French reading',
          'improve French writing',
          'French literacy',
          'French text analysis',
          'French writing feedback',
          'French reading skills',
          'French writing skills',
          'practice French writing',
          'practice French reading'
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
