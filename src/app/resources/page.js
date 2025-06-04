'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import SEOHead from '@/components/SEOHead';

export default function ResourcesPage() {
  const resourceCategories = [
    {      title: 'Vocabulary Lists',
      description: 'Curated vocabulary organized by topics and difficulty levels',
      icon: '📚',
      resources: [        { name: '100 Most Common Words', type: 'PDF', difficulty: 'Beginner' },
        { name: 'Food & Cooking Vocabulary', type: 'Interactive', difficulty: 'Intermediate' },
        { name: 'Business Terms', type: 'PDF', difficulty: 'Advanced' },
        { name: 'Travel Phrases', type: 'Audio + PDF', difficulty: 'Beginner' }
      ]
    },
    {      title: 'Grammar Guides',
      description: 'Comprehensive grammar explanations with examples',
      icon: '📝',
      resources: [        { name: 'Verb Conjugation Guide', type: 'Interactive', difficulty: 'All Levels' },
        { name: 'Articles & Gender Rules', type: 'PDF', difficulty: 'Beginner' },
        { name: 'Subjunctive Mood Explained', type: 'Video + PDF', difficulty: 'Advanced' },
        { name: 'Tenses Timeline', type: 'Infographic', difficulty: 'Intermediate' }
      ]
    },
    {      title: 'Pronunciation Tools',
      description: 'Audio resources and guides for perfecting pronunciation',
      icon: '🔊',
      resources: [        { name: 'Phonetic Alphabet', type: 'Audio Guide', difficulty: 'Beginner' },
        { name: 'Silent Letters Guide', type: 'Interactive', difficulty: 'Intermediate' },
        { name: 'Accent Patterns', type: 'Audio + PDF', difficulty: 'Advanced' },
        { name: 'Liaison Rules Practice', type: 'Audio Exercises', difficulty: 'Intermediate' }
      ]
    },
    {
      title: 'Study Tools',
      description: 'Interactive tools and exercises to enhance your learning',
      icon: '🛠️',
      resources: [        { name: 'Conjugation Trainer', type: 'Web Tool', difficulty: 'All Levels' },
        { name: 'Vocabulary Flashcard Generator', type: 'Web Tool', difficulty: 'All Levels' },
        { name: 'Accent Marks Practice', type: 'Interactive', difficulty: 'Intermediate' },
        { name: 'Dictation Exercises', type: 'Audio + Interactive', difficulty: 'Advanced' }
      ]
    },
    {      title: 'Cultural Insights',
      description: 'Learn about different cultures and customs while improving your language',
      icon: '🌍',
      resources: [        { name: 'Cultural Holidays & Traditions', type: 'Article Series', difficulty: 'All Levels' },
        { name: 'Cultural Etiquette Guide', type: 'PDF', difficulty: 'Intermediate' },
        { name: 'Regional Language Variations', type: 'Audio + PDF', difficulty: 'Advanced' },
        { name: 'Pop Culture Vocabulary', type: 'Interactive', difficulty: 'Intermediate' }
      ]
    },
    {      title: 'Practice Exercises',
      description: 'Hands-on exercises to reinforce your language skills',
      icon: '✏️',
      resources: [        { name: 'Daily Practice Worksheets', type: 'PDF Series', difficulty: 'All Levels' },
        { name: 'Reading Comprehension', type: 'Interactive', difficulty: 'Intermediate' },
        { name: 'Writing Prompts', type: 'PDF', difficulty: 'Advanced' },
        { name: 'Listening Exercises', type: 'Audio + Questions', difficulty: 'All Levels' }
      ]
    }
  ];

  const difficultyColors = {
    'Beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Advanced': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'All Levels': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  };
  return (
    <>
      <SEOHead        title="Language Learning Resources | Lingento - Free Tools & Study Materials"
        description="Access free language learning resources including vocabulary lists, pronunciation guides, grammar references, and study tools to accelerate your language mastery."
        keywords={[
          'language learning resources',
          'free language materials',
          'vocabulary lists',
          'grammar guide',
          'pronunciation tools',
          'language study materials',          'language learning resources',
          'language reference materials',
          'language learning tools',
          'language study guides',
          'language resources',
          'free language lessons'
        ]}
        canonical="https://lingentoo.com/resources"
        ogImage="https://lingentoo.com/og-resources.jpg"
        twitterImage="https://lingentoo.com/twitter-resources.jpg"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Language Learning{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Resources
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive collection of free language learning materials, tools, and guides to support your language journey
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Resource Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {resourceCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{category.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {category.description}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                {category.resources.map((resource, resourceIndex) => (
                  <div
                    key={resourceIndex}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {resource.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {resource.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[resource.difficulty]}`}>
                        {resource.difficulty}
                      </span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Resource Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-center"
        >          <h2 className="text-3xl font-bold text-white mb-4">
            🎯 Ultimate Language Learning Bundle
          </h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Get our complete collection of language learning resources including vocabulary lists, 
            grammar guides, pronunciation tools, and interactive exercises - all in one comprehensive bundle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
              Download Free Bundle
            </button>
            <Link
              href="/register"
              className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </motion.div>

        {/* Study Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How to Use These Resources Effectively
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Set Clear Goals</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Choose resources that align with your current level and learning objectives.
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">📅</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Create a Schedule</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Dedicate specific time slots for different types of resources and practice.
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">🔄</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Practice Regularly</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Consistent daily practice with varied resources leads to better retention.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Structured Data for Resources */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",            "name": "Language Learning Resources",
            "description": "Comprehensive collection of language learning materials and tools",
            "url": "https://lingentoo.com/resources",
            "itemListElement": resourceCategories.map((category, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "CreativeWork",
                "name": category.title,
                "description": category.description,
                "url": `https://lingentoo.com/resources#${category.title.toLowerCase().replace(/\s+/g, '-')}`
              }
                        }))
          })
        }}
      />
    </div>
    </>
  );
}
