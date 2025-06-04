'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import SEOHead from '@/components/SEOHead';

export default function LearnFrenchVocabularyPage() {
  const vocabularyCategories = [
    {
      title: 'Essential Daily Words',
      description: 'Master the 100 most common French words used in everyday conversation',
      wordCount: '100+',
      difficulty: 'Beginner',
      examples: ['bonjour', 'merci', 'au revoir', 'oui', 'non'],
      icon: '☀️'
    },
    {
      title: 'Food & Dining',
      description: 'Learn French vocabulary for restaurants, cooking, and food shopping',
      wordCount: '300+',
      difficulty: 'Beginner',
      examples: ['restaurant', 'nourriture', 'boire', 'manger', 'délicieux'],
      icon: '🍽️'
    },
    {
      title: 'Travel & Transportation',
      description: 'Navigate France with essential travel and transportation vocabulary',
      wordCount: '250+',
      difficulty: 'Intermediate',
      examples: ['voyage', 'aéroport', 'train', 'hôtel', 'réservation'],
      icon: '✈️'
    },
    {
      title: 'Business French',
      description: 'Professional vocabulary for workplace and business communication',
      wordCount: '500+',
      difficulty: 'Advanced',
      examples: ['entreprise', 'réunion', 'contrat', 'négociation', 'présentation'],
      icon: '💼'
    },
    {
      title: 'Academic French',
      description: 'Advanced vocabulary for academic writing and formal communication',
      wordCount: '400+',
      difficulty: 'Advanced',
      examples: ['recherche', 'analyse', 'théorie', 'méthodologie', 'conclusion'],
      icon: '🎓'
    },
    {
      title: 'Culture & Society',
      description: 'Understand French culture through specialized vocabulary',
      wordCount: '350+',
      difficulty: 'Intermediate',
      examples: ['culture', 'tradition', 'société', 'histoire', 'patrimoine'],
      icon: '🏛️'
    }
  ];

  const learningFeatures = [
    {
      title: 'Spaced Repetition Algorithm',
      description: 'Our AI-powered system shows you words just before you forget them, maximizing retention.',
      icon: '🧠',
      benefit: '90% retention rate'
    },
    {
      title: 'Native Pronunciation',
      description: 'Learn correct French pronunciation with native speaker audio for every word.',
      icon: '🔊',
      benefit: 'Perfect accent training'
    },
    {
      title: 'Contextual Examples',
      description: 'See how French words are used in real sentences and conversations.',
      icon: '💬',
      benefit: 'Natural usage patterns'
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your vocabulary growth with detailed analytics and achievement badges.',
      icon: '📊',
      benefit: 'Motivated learning'
    }
  ];

  const difficultyColors = {
    'Beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Advanced': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };
  return (
    <>
      <SEOHead 
        title="Learn French Vocabulary Online | 10,000+ Words with Spaced Repetition"
        description="Master French vocabulary with our scientifically-proven spaced repetition system. Learn 10,000+ French words with flashcards, pronunciation, and adaptive learning."
        keywords={[
          'learn French vocabulary',
          'French words',
          'French vocabulary online',
          'French flashcards',
          'French spaced repetition',
          'memorize French words',
          'French vocabulary app',
          'French vocabulary list',
          'essential French words',
          'French vocabulary builder',
          'French word learning',
          'French vocabulary practice',
          'common French words',
          'French vocabulary training'
        ]}
        canonical="https://lingentoo.com/learn-french-vocabulary"
        ogImage="https://lingentoo.com/og-learn-french-vocabulary.jpg"
        twitterImage="https://lingentoo.com/twitter-learn-french-vocabulary.jpg"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Learn French Vocabulary{' '}
              <span className="block text-yellow-300">the Smart Way</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Master 10,000+ French words with our scientifically-proven spaced repetition system. 
              Join thousands of learners achieving fluency faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl text-lg transition-colors shadow-lg"
              >
                🚀 Start Learning Free
              </Link>
              <Link
                href="/flashcards"
                className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-bold rounded-xl text-lg transition-colors"
              >
                📚 Try Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Key Features */}
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Lingento Works Better
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our approach combines cognitive science with modern technology for optimal vocabulary acquisition
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {learningFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                {feature.description}
              </p>
              <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">
                {feature.benefit}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Vocabulary Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Vocabulary Categories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose from curated word collections for every learning goal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vocabularyCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{category.icon}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[category.difficulty]}`}>
                    {category.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {category.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {category.wordCount} words
                  </span>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Sample words:</p>
                  <div className="flex flex-wrap gap-1">
                    {category.examples.map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Master French Vocabulary?
          </h2>
          <p className="text-xl text-indigo-100 mb-6 max-w-2xl mx-auto">
            Join thousands of learners who've improved their French vocabulary with our proven system. 
            Start your journey today with our free account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl text-lg hover:bg-gray-100 transition-colors"
            >
              🎯 Start Learning Now
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-bold rounded-xl text-lg transition-colors"
            >
              💎 View Premium Plans
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Lingento French Vocabulary Learning",
            "description": "Learn French vocabulary with spaced repetition and AI-powered learning system",
            "url": "https://lingentoo.com/learn-french-vocabulary",
            "teaches": "French Language Vocabulary",
            "educationalLevel": ["Beginner", "Intermediate", "Advanced"],
            "courseMode": "online",
            "isAccessibleForFree": true,
            "offers": {
              "@type": "Offer",
              "category": "French Vocabulary Course",
              "price": "0",
              "priceCurrency": "USD"
            }
                  })
        }}
      />
    </div>
    </>
  );
}
