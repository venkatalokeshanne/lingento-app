'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpCategories = [
    { id: 'all', name: 'All Topics', icon: '📚', count: 24 },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀', count: 6 },
    { id: 'features', name: 'Features', icon: '⭐', count: 8 },
    { id: 'account', name: 'Account Management', icon: '👤', count: 5 },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧', count: 5 }
  ];

  const helpArticles = [
    // Getting Started
    {
      id: 1,
      title: 'Welcome to Lingento: Your First Steps',
      category: 'getting-started',
      description: 'Learn how to set up your account and start your French vocabulary journey.',
      readTime: '3 min read',
      difficulty: 'Beginner',
      tags: ['setup', 'beginner', 'account']
    },
    {
      id: 2,
      title: 'Understanding Spaced Repetition',
      category: 'getting-started',
      description: 'Discover how our scientifically-proven algorithm helps you learn efficiently.',
      readTime: '5 min read',
      difficulty: 'Beginner',
      tags: ['algorithm', 'learning', 'science']
    },
    {
      id: 3,
      title: 'Setting Your Learning Goals',
      category: 'getting-started',
      description: 'How to configure daily goals and track your progress effectively.',
      readTime: '4 min read',
      difficulty: 'Beginner',
      tags: ['goals', 'progress', 'planning']
    },
    
    // Features
    {
      id: 4,
      title: 'Mastering Flashcard Practice',
      category: 'features',
      description: 'Advanced tips for getting the most out of your flashcard sessions.',
      readTime: '6 min read',
      difficulty: 'Intermediate',
      tags: ['flashcards', 'practice', 'tips']
    },
    {
      id: 5,
      title: 'Using the Writing Practice Feature',
      category: 'features',
      description: 'How to improve your French writing with AI-powered feedback.',
      readTime: '7 min read',
      difficulty: 'Intermediate',
      tags: ['writing', 'AI', 'feedback']
    },
    {
      id: 6,
      title: 'Understanding Progress Analytics',
      category: 'features',
      description: 'Learn to interpret your learning statistics and optimize your study routine.',
      readTime: '5 min read',
      difficulty: 'Advanced',
      tags: ['analytics', 'statistics', 'optimization']
    },
    
    // Account Management
    {
      id: 7,
      title: 'Managing Your Profile Settings',
      category: 'account',
      description: 'How to update your preferences, notifications, and privacy settings.',
      readTime: '4 min read',
      difficulty: 'Beginner',
      tags: ['profile', 'settings', 'privacy']
    },
    {
      id: 8,
      title: 'Syncing Across Multiple Devices',
      category: 'account',
      description: 'Ensure your progress stays synchronized across all your devices.',
      readTime: '3 min read',
      difficulty: 'Beginner',
      tags: ['sync', 'devices', 'mobile']
    },
    
    // Troubleshooting
    {
      id: 9,
      title: 'Audio Not Playing? Here\'s How to Fix It',
      category: 'troubleshooting',
      description: 'Troubleshoot common audio issues with pronunciation guides.',
      readTime: '4 min read',
      difficulty: 'Beginner',
      tags: ['audio', 'pronunciation', 'technical']
    },
    {
      id: 10,
      title: 'App Running Slowly? Performance Tips',
      category: 'troubleshooting',
      description: 'Optimize your app performance for the best learning experience.',
      readTime: '5 min read',
      difficulty: 'Intermediate',
      tags: ['performance', 'optimization', 'technical']
    }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const quickActions = [
    {
      title: 'Reset Password',
      description: 'Having trouble logging in?',
      icon: '🔑',
      action: '/login'
    },
    {
      title: 'Contact Support',
      description: 'Get personalized help',
      icon: '💬',
      action: '/contact'
    },
    {
      title: 'Report a Bug',
      description: 'Help us improve',
      icon: '🐛',
      action: '/contact'
    },
    {
      title: 'Feature Request',
      description: 'Suggest new features',
      icon: '💡',
      action: '/contact'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Help{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Center
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Find answers, learn new features, and get the most out of your French learning experience.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg"
              />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
        >
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.action}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-100 dark:border-gray-700"
            >
              <div className="text-3xl mb-3">{action.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{action.description}</p>
            </a>
          ))}
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {helpCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="space-y-6">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No articles found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Try adjusting your search terms or browse different categories.
                  </p>
                </div>
              ) : (
                filteredArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{article.readTime}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          article.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                          article.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {article.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {article.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-sm">
                        Read Article →
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Need Personal Help?</h2>
          <p className="mb-6 opacity-90">
            Can't find what you're looking for? Our support team is ready to assist you.
          </p>
          <a
            href="/contact"
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Contact Support Team
          </a>
        </motion.div>
      </div>
    </div>
  );
}
