'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import LearningPath from '@/components/LearningPath/LearningPath';
import SEOHead from '@/components/SEOHead';

export default function LearningPathPage() {  return (
    <ProtectedRoute>
      <SEOHead 
        title="French Learning Path | Lingento - Structured Curriculum for French Mastery"
        description="Follow our AI-powered French learning curriculum. Structured lessons from beginner to advanced with clear progress tracking, modules, and personalized learning paths."
        keywords={[
          'French learning path',
          'French curriculum', 
          'French course structure',
          'learn French online',
          'French lessons plan',
          'structured French learning',
          'French beginner course',
          'French intermediate course',
          'French advanced course',
          'personalized French learning',
          'AI French tutor',
          'French study plan',
          'French language curriculum'
        ]}
        canonical="https://lingentoo.com/learning-path"
        ogImage="https://lingentoo.com/og-learning-path.jpg"
        twitterImage="https://lingentoo.com/twitter-learning-path.jpg"
      />
      <div className="min-h-screen">
        <LearningPath />
        
        {/* Structured Data for Course */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              "name": "French Learning Path",
              "description": "Comprehensive French language learning curriculum from beginner to advanced",
              "provider": {
                "@type": "Organization",
                "name": "Lingento",
                "url": "https://lingentoo.com"
              },
              "educationalLevel": ["Beginner", "Intermediate", "Advanced"],
              "teaches": [
                "French vocabulary",
                "French grammar",
                "French pronunciation",
                "French conversation",
                "French reading comprehension",
                "French writing skills"
              ],
              "courseMode": "online",
              "isAccessibleForFree": true,
              "inLanguage": "en",
              "about": {
                "@type": "Thing",
                "name": "French Language"
              }
            })
          }}
        />
      </div>
    </ProtectedRoute>
  );
}