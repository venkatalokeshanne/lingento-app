// Reading and Writing Hub - Main component
'use client';

import { useState } from 'react';
import ReadingModule from './ReadingModule';
import WritingModule from './WritingModule';

export default function ReadingWritingHub() {
  const [activeTab, setActiveTab] = useState('reading');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Reading & Writing Practice
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Improve your language skills with AI-powered reading and writing exercises
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('reading')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'reading'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📖 Reading
            </button>
            <button
              onClick={() => setActiveTab('writing')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'writing'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              ✍️ Writing
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'reading' ? <ReadingModule /> : <WritingModule />}
        </div>
      </div>
    </div>
  );
}
