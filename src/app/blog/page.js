'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import SEOHead from '@/components/SEOHead';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'The Science Behind Spaced Repetition for Language Learning',
      excerpt: 'Discover why spaced repetition is the most effective method for memorizing French vocabulary and how to maximize your learning results.',
      category: 'Learning Strategies',
      readTime: '8 min read',
      date: 'March 15, 2024',
      slug: 'spaced-repetition-language-learning',
      featured: true
    },
    {
      id: 2,
      title: '10 Most Common French Words Every Beginner Should Know',
      excerpt: 'Start your French journey with these essential vocabulary words that appear in 80% of everyday conversations.',
      category: 'Vocabulary',
      readTime: '5 min read',
      date: 'March 12, 2024',
      slug: 'essential-french-words-beginners'
    },
    {
      id: 3,
      title: 'Master French Pronunciation: A Complete Guide',
      excerpt: 'Learn the secrets of French pronunciation with our comprehensive guide including audio examples and practice exercises.',
      category: 'Pronunciation',
      readTime: '12 min read',
      date: 'March 10, 2024',
      slug: 'master-french-pronunciation-guide'
    },
    {
      id: 4,
      title: 'How to Create Effective French Flashcards',
      excerpt: 'Maximize your vocabulary retention with proven flashcard techniques and design principles for French learners.',
      category: 'Study Tips',
      readTime: '6 min read',
      date: 'March 8, 2024',
      slug: 'effective-french-flashcards'
    },
    {
      id: 5,
      title: 'French Grammar Made Simple: Key Rules for Beginners',
      excerpt: 'Understand the fundamentals of French grammar with clear explanations and practical examples.',
      category: 'Grammar',
      readTime: '10 min read',
      date: 'March 5, 2024',
      slug: 'french-grammar-beginners'
    },
    {
      id: 6,
      title: 'Building Your French Vocabulary: Advanced Techniques',
      excerpt: 'Advanced strategies for expanding your French vocabulary beyond basic words and phrases.',
      category: 'Vocabulary',
      readTime: '9 min read',
      date: 'March 3, 2024',
      slug: 'advanced-french-vocabulary-techniques'
    }
  ];

  const categories = [
    'All Posts',
    'Learning Strategies',
    'Vocabulary',
    'Pronunciation', 
    'Grammar',
    'Study Tips'
  ];
  return (
    <>
      <SEOHead 
        title="French Learning Blog | Lingento - Tips, Strategies & Language Insights"
        description="Discover effective French learning strategies, vocabulary tips, pronunciation guides, and language learning insights from our expert team."
        keywords={[
          'French learning blog',
          'French language tips',
          'vocabulary learning strategies', 
          'French pronunciation guide',
          'spaced repetition tips',
          'French grammar tips',
          'language learning blog',
          'French study methods',
          'French learning resources',
          'improve French skills',
          'French learning advice',
          'language acquisition tips'
        ]}
        canonical="https://lingentoo.com/blog"
        ogImage="https://lingentoo.com/og-blog.jpg"
        twitterImage="https://lingentoo.com/twitter-blog.jpg"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              French Learning{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Expert tips, strategies, and insights to accelerate your French learning journey
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Article</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex items-center mb-4">
                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-medium">
                  {blogPosts[0].category}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-4 text-sm">
                  {blogPosts[0].date} • {blogPosts[0].readTime}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {blogPosts[0].title}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {blogPosts[0].excerpt}
              </p>
              <Link
                href={`/blog/${blogPosts[0].slug}`}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                Read Full Article
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* All Posts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 px-2 py-1 rounded text-sm font-medium">
                      {post.category}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-3 text-xs">
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {post.date}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with French Learning Tips
          </h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Get weekly French learning tips, vocabulary lists, and study strategies delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>

      {/* Structured Data for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Lingento French Learning Blog",
            "description": "Expert French learning tips, strategies, and insights",
            "url": "https://lingentoo.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Lingento",
              "url": "https://lingentoo.com"
            },
            "blogPost": blogPosts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "url": `https://lingentoo.com/blog/${post.slug}`,
              "datePublished": post.date,
              "author": {
                "@type": "Organization",
                "name": "Lingento"
              }
                    }))
          })
        }}
      />
    </div>
    </>
  );
}
