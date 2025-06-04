'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Community() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'beginners', name: 'Beginners' },
    { id: 'grammar', name: 'Grammar' },
    { id: 'pronunciation', name: 'Pronunciation' },
    { id: 'culture', name: 'Culture' },
    { id: 'resources', name: 'Resources' }
  ];

  const communityStats = [
    { label: 'Active Members', value: '15,847' },
    { label: 'Posts This Week', value: '2,394' },
    { label: 'Languages Discussed', value: '12' },
    { label: 'Study Groups', value: '156' }
  ];
  const featuredPosts = [
    {
      id: 1,
      title: 'Essential Travel Phrases for Any Language',
      author: 'Marie Dubois',
      avatar: '/api/placeholder/40/40',
      category: 'beginners',
      replies: 23,
      likes: 156,
      timeAgo: '2 hours ago',
      excerpt: 'Planning a trip abroad? Here are the must-know phrases that will help you navigate any situation...'
    },
    {
      id: 2,
      title: 'Understanding Grammar Moods in Language Learning',
      author: 'Pierre Martin',
      avatar: '/api/placeholder/40/40',
      category: 'grammar',
      replies: 45,
      likes: 234,
      timeAgo: '4 hours ago',
      excerpt: 'Grammar moods can be tricky, but with these simple rules and examples, you\'ll master them in no time...'
    },
    {
      id: 3,
      title: 'Foreign Movie Recommendations for Language Learning',
      author: 'Sophie Chen',
      avatar: '/api/placeholder/40/40',
      category: 'resources',
      replies: 67,
      likes: 389,
      timeAgo: '6 hours ago',
      excerpt: 'Discover amazing foreign films that will improve your listening skills while entertaining you...'
    },
    {
      id: 4,
      title: 'Mastering Difficult Pronunciation Sounds',
      author: 'Jean-Luc Bernard',
      avatar: '/api/placeholder/40/40',
      category: 'pronunciation',
      replies: 34,
      likes: 198,
      timeAgo: '8 hours ago',
      excerpt: 'Step-by-step guide to pronouncing difficult sounds with audio examples and practice exercises...'
    }
  ];
  const studyGroups = [
    {
      id: 1,
      name: 'Morning Language Practice',
      members: 234,
      description: 'Daily 30-minute conversation practice every morning at 8 AM EST',
      nextSession: 'Tomorrow 8:00 AM',
      level: 'Intermediate'
    },
    {
      id: 2,
      name: 'Foreign Language Book Club',
      members: 156,
      description: 'Reading literature in target languages and discussing together',
      nextSession: 'Friday 7:00 PM',
      level: 'Advanced'
    },
    {
      id: 3,
      name: 'Beginner Friendly Zone',
      members: 567,
      description: 'Safe space for beginners to ask questions and practice basics',
      nextSession: 'Daily',
      level: 'Beginner'
    }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? featuredPosts 
    : featuredPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <Link href="/" className="text-indigo-600 hover:text-indigo-500 transition-colors">
                ← Back to Home
              </Link>
            </div>            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Language Learning Community
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
              Connect with fellow language learners, share resources, ask questions, and practice together.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-12">
        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {communityStats.map((stat, index) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Discussion Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Featured Posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedCategory === 'all' ? 'Recent Discussions' : `${categories.find(c => c.id === selectedCategory)?.name} Discussions`}
                </h2>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  New Post
                </button>
              </div>

              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          {post.title}
                        </h3>
                        <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs rounded-full">
                          {categories.find(c => c.id === post.category)?.name}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                          <span>by {post.author}</span>
                          <span>{post.timeAgo}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                            </svg>
                            {post.replies}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                            </svg>
                            {post.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Join Community CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white"
            >
              <h3 className="text-xl font-bold mb-3">Join Our Community</h3>              <p className="text-indigo-100 mb-4">
                Connect with thousands of language learners from around the world.
              </p>
              <button className="w-full bg-white text-indigo-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                Sign Up Free
              </button>
            </motion.div>

            {/* Study Groups */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Active Study Groups
              </h3>
              <div className="space-y-4">
                {studyGroups.map((group) => (
                  <div key={group.id} className="border-b border-gray-200 dark:border-gray-600 last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {group.name}
                      </h4>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                        {group.level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {group.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{group.members} members</span>
                      <span>Next: {group.nextSession}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                Browse All Groups
              </button>
            </motion.div>

            {/* Community Guidelines */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Community Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Be respectful and supportive
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Use appropriate language
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Share helpful resources
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Ask questions freely
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  No spam or self-promotion
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
