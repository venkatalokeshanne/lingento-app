'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function UserGuide() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
    { id: 'dashboard', title: 'Your Dashboard', icon: '📊' },
    { id: 'flashcards', title: 'Flashcards', icon: '🗂️' },
    { id: 'quizzes', title: 'Quizzes', icon: '🧠' },
    { id: 'reading', title: 'Reading Practice', icon: '📖' },
    { id: 'vocabulary', title: 'Vocabulary Manager', icon: '📝' },
    { id: 'pronunciation', title: 'Pronunciation', icon: '🗣️' },
    { id: 'progress', title: 'Progress Tracking', icon: '📈' },
    { id: 'settings', title: 'Settings', icon: '⚙️' },
    { id: 'mobile', title: 'Mobile Features', icon: '📱' },
    { id: 'tips', title: 'Study Tips', icon: '💡' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: '🔧' }
  ];

  const SectionContent = ({ sectionId }) => {
    switch (sectionId) {
      case 'getting-started':        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              🚀 Getting Started with Lingento
            </h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-indigo-500 p-6 rounded-lg">
              <p className="text-indigo-800 dark:text-indigo-200 text-lg">
                <strong>Welcome!</strong> This guide will help you start learning effectively with Lingento. 
                Follow these steps to begin your language journey.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Step 1: Set Up Your Profile</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                  <li>Click the settings icon (⚙️) in the navigation menu</li>
                  <li>Choose your target language from the dropdown</li>
                  <li>Set your current skill level (Beginner, Intermediate, Advanced)</li>
                  <li>Choose your daily study goal (15, 30, or 60 minutes)</li>
                  <li>Save your preferences</li>
                </ol>
              </div>              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8">Step 2: Start with Your First Lesson</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                  <li>Go to your Dashboard (click the home icon 🏠)</li>
                  <li>Look for the "Quick Start" section</li>
                  <li>Click "Start Learning" to begin with basic vocabulary</li>
                  <li>Complete your first 5-10 flashcards</li>
                  <li>Take a short quiz to test your knowledge</li>
                </ol>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8">Step 3: Explore the Features</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">Now that you've started, explore these key features:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
                  <strong className="text-blue-800 dark:text-blue-200">🗂️ Flashcards:</strong>
                  <span className="text-blue-700 dark:text-blue-300"> Learn new words with spaced repetition</span>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
                  <strong className="text-green-800 dark:text-green-200">🧠 Quizzes:</strong>
                  <span className="text-green-700 dark:text-green-300"> Test your knowledge with multiple choice questions</span>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
                  <strong className="text-purple-800 dark:text-purple-200">📖 Reading Practice:</strong>
                  <span className="text-purple-700 dark:text-purple-300"> Improve comprehension with graded texts</span>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg">
                  <strong className="text-orange-800 dark:text-orange-200">🗣️ Pronunciation:</strong>
                  <span className="text-orange-700 dark:text-orange-300"> Practice speaking with audio feedback</span>
                </div>
              </div>
            </div>
          </div>
        );      case 'dashboard':
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              📊 Using Your Dashboard
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Your Dashboard is your learning home base. Here's how to make the most of it:
            </p>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Daily Progress Section</h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3">📈</span>
                    <div>
                      <strong className="text-green-800 dark:text-green-200">Study Streak:</strong>
                      <span className="text-green-700 dark:text-green-300"> See how many days in a row you've studied</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3">🎯</span>
                    <div>
                      <strong className="text-green-800 dark:text-green-200">Today's Goal:</strong>
                      <span className="text-green-700 dark:text-green-300"> Track your daily study time progress</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3">📚</span>
                    <div>
                      <strong className="text-green-800 dark:text-green-200">Words Learned:</strong>
                      <span className="text-green-700 dark:text-green-300"> Count of new vocabulary you've mastered</span>
                    </div>
                  </li>
                </ul>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8">Quick Actions</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="text-2xl mb-2">🚀</div>
                    <strong className="text-gray-800 dark:text-gray-200">Continue Learning</strong>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Picks up where you left off</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="text-2xl mb-2">🔄</div>
                    <strong className="text-gray-800 dark:text-gray-200">Review Flashcards</strong>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Practice words that need reinforcement</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="text-2xl mb-2">🧠</div>
                    <strong className="text-gray-800 dark:text-gray-200">Take Quiz</strong>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Quick knowledge check</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="text-2xl mb-2">📖</div>
                    <strong className="text-gray-800 dark:text-gray-200">Reading Practice</strong>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Start a reading session</p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8">Weekly Overview</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 p-6 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 mb-4">The chart shows your study activity:</p>
                <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                  <li>🟢 <strong>Green bars</strong> = days you met your goal</li>
                  <li>🟡 <strong>Yellow bars</strong> = partial progress</li>
                  <li>⚪ <strong>Gray bars</strong> = no study time</li>
                  <li>👆 <strong>Click any bar</strong> to see detailed stats for that day</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-l-4 border-emerald-500 p-6 rounded-lg">
                <p className="text-emerald-800 dark:text-emerald-200">
                  <strong>💡 Pro Tip:</strong> Check your dashboard every morning to plan your study session 
                  and see what needs review!
                </p>
              </div>
            </div>
          </div>
        );      case 'flashcards':
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              🗂️ Mastering Flashcards
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Flashcards are your main tool for learning new vocabulary. Here's how to use them effectively:
            </p>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Starting a Flashcard Session</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <ol className="space-y-4 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</span>
                    <span>Click "Flashcards" in the main navigation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</span>
                    <span>Choose a category (e.g., "Basic Words", "Food", "Travel")</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</span>
                    <div>
                      <span>Select your study mode:</span>
                      <div className="mt-2 ml-6 space-y-2">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                          <strong className="text-blue-800 dark:text-blue-200">Learn New:</strong>
                          <span className="text-blue-700 dark:text-blue-300"> Introduces new vocabulary</span>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                          <strong className="text-green-800 dark:text-green-200">Review:</strong>
                          <span className="text-green-700 dark:text-green-300"> Practice words you've seen before</span>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                          <strong className="text-purple-800 dark:text-purple-200">Mixed:</strong>
                          <span className="text-purple-700 dark:text-purple-300"> Combination of new and review</span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">4</span>
                    <span>Set the number of cards (10, 20, or 50)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">5</span>
                    <span>Click "Start Session"</span>
                  </li>
                </ol>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8">During Your Session</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <div className="text-2xl mb-2">👀</div>
                    <strong className="text-gray-800 dark:text-gray-200">Read the word</strong>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Take time to understand the pronunciation</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <div className="text-2xl mb-2">🤔</div>
                    <strong className="text-gray-800 dark:text-gray-200">Think of the meaning</strong>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Try to recall before revealing</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <div className="text-2xl mb-2">👆</div>
                    <strong className="text-gray-800 dark:text-gray-200">Show Answer</strong>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Click to see the translation</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <div className="text-2xl mb-2">⭐</div>
                    <strong className="text-gray-800 dark:text-gray-200">Rate your knowledge</strong>
                    <div className="mt-2 space-y-1 text-sm">
                      <div>🔴 <strong>Hard</strong> - didn't know it</div>
                      <div>🟡 <strong>Good</strong> - knew with effort</div>
                      <div>🟢 <strong>Easy</strong> - knew immediately</div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8">Smart Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg">
                  <div className="text-2xl mb-3">🧠</div>
                  <strong className="text-purple-800 dark:text-purple-200">Spaced Repetition</strong>
                  <p className="text-purple-700 dark:text-purple-300 text-sm mt-1">Words you find hard appear more often</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg">
                  <div className="text-2xl mb-3">🔊</div>
                  <strong className="text-green-800 dark:text-green-200">Audio Pronunciation</strong>
                  <p className="text-green-700 dark:text-green-300 text-sm mt-1">Learn correct pronunciation for each word</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg">
                  <div className="text-2xl mb-3">📝</div>
                  <strong className="text-blue-800 dark:text-blue-200">Example Sentences</strong>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">See words used in context</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-lg">
                  <div className="text-2xl mb-3">📈</div>
                  <strong className="text-orange-800 dark:text-orange-200">Progress Tracking</strong>
                  <p className="text-orange-700 dark:text-orange-300 text-sm mt-1">See which words you've mastered</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-l-4 border-yellow-500 p-6 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200">
                  <strong>💡 Study Tip:</strong> Don't worry about getting everything perfect! 
                  The system will show you difficult words more frequently until you master them.
                </p>
              </div>
            </div>
          </div>
        );      case 'quizzes':
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              🧠 Taking Effective Quizzes
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Quizzes help test your knowledge and reinforce learning. Here's how to get the most out of them:
            </p>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Starting a Quiz</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <ol className="space-y-4 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</span>
                    <span>Click "Quizzes" in the navigation menu</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</span>
                    <div>
                      <span>Choose your quiz type:</span>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <strong className="text-blue-800 dark:text-blue-200">📚 Vocabulary Quiz:</strong>
                          <p className="text-blue-700 dark:text-blue-300 text-sm">Multiple choice word meanings</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <strong className="text-green-800 dark:text-green-200">🔄 Translation Quiz:</strong>
                          <p className="text-green-700 dark:text-green-300 text-sm">Translate sentences</p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                          <strong className="text-purple-800 dark:text-purple-200">🎧 Listening Quiz:</strong>
                          <p className="text-purple-700 dark:text-purple-300 text-sm">Answer based on audio</p>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                          <strong className="text-orange-800 dark:text-orange-200">🎯 Mixed Review:</strong>
                          <p className="text-orange-700 dark:text-orange-300 text-sm">All question types combined</p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</span>
                    <span>Select difficulty level (Easy, Medium, Hard)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">4</span>
                    <span>Choose number of questions (10, 20, or 30)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">5</span>
                    <span>Click "Start Quiz"</span>
                  </li>
                </ol>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8">Taking the Quiz</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <div className="text-3xl mb-2">📖</div>
                    <strong className="text-gray-800 dark:text-gray-200 block">Read carefully</strong>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Take time to understand each question</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <div className="text-3xl mb-2">🎧</div>
                    <strong className="text-gray-800 dark:text-gray-200 block">Use audio</strong>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Click play button for listening questions</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <div className="text-3xl mb-2">✅</div>
                    <strong className="text-gray-800 dark:text-gray-200 block">Select your answer</strong>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Click on the choice you think is correct</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <div className="text-3xl mb-2">💡</div>
                    <strong className="text-gray-800 dark:text-gray-200 block">Check feedback</strong>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">See explanation for right/wrong answers</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    <div className="text-3xl mb-2">➡️</div>
                    <strong className="text-gray-800 dark:text-gray-200 block">Continue</strong>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Click "Next" to move to the next question</p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8">After Your Quiz</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-800/20 p-6 rounded-lg">
                  <div className="text-2xl mb-3">📊</div>
                  <strong className="text-green-800 dark:text-green-200">Review Results</strong>
                  <p className="text-green-700 dark:text-green-300 text-sm mt-1">See your score and time taken</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-800/20 p-6 rounded-lg">
                  <div className="text-2xl mb-3">❌</div>
                  <strong className="text-red-800 dark:text-red-200">Check Mistakes</strong>
                  <p className="text-red-700 dark:text-red-300 text-sm mt-1">Review questions you got wrong</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-800/20 p-6 rounded-lg">
                  <div className="text-2xl mb-3">💾</div>
                  <strong className="text-blue-800 dark:text-blue-200">Save Progress</strong>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">Your results are automatically saved</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-800/20 p-6 rounded-lg">
                  <div className="text-2xl mb-3">🎯</div>
                  <strong className="text-purple-800 dark:text-purple-200">Get Recommendations</strong>
                  <p className="text-purple-700 dark:text-purple-300 text-sm mt-1">See suggested areas to study more</p>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8">Quiz Strategies</h3>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-l-4 border-indigo-500 p-6 rounded-lg">
                <ul className="space-y-3 text-indigo-700 dark:text-indigo-300">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">💡</span>
                    Take short quizzes (10 questions) daily rather than long ones weekly
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">🔍</span>
                    Review incorrect answers immediately after finishing
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">🎯</span>
                    Focus on your weak areas shown in the results
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">🧠</span>
                    Don't guess wildly - use elimination to improve your chances
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-l-4 border-blue-500 p-6 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200">
                  <strong>📚 Remember:</strong> Quizzes are for learning, not just testing. 
                  Pay attention to the explanations - they're often more valuable than your score!
                </p>
              </div>
            </div>
          </div>
        );      case 'reading':
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                📖 Reading Practice Made Easy
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Reading practice improves your comprehension and exposes you to words in context. 
                Here's how to use this feature effectively
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Choosing a Text */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Choosing a Text
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">📚</span>
                      <span>Click "Reading" in the main navigation</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">🎯</span>
                      <span>Browse by difficulty: Beginner, Intermediate, Advanced</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">📝</span>
                      <span>Filter by topic: News, Stories, Culture, Science</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">⏱️</span>
                      <span>Choose length: Short (5 min), Medium (10 min), Long (20 min)</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">👁️</span>
                      <span>Preview the text before starting</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">🚀</span>
                      <span>Click "Start Reading" to begin</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* While Reading */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-green-800 dark:text-green-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  While Reading
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center mb-2">
                        <span className="text-green-500 mr-2">🖱️</span>
                        <span className="font-semibold">Click unknown words</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Tap any word to see its meaning instantly</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center mb-2">
                        <span className="text-green-500 mr-2">➕</span>
                        <span className="font-semibold">Add to vocabulary</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Save new words for later review</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center mb-2">
                        <span className="text-green-500 mr-2">🔊</span>
                        <span className="font-semibold">Audio support</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Hear pronunciation with the speaker icon</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center mb-2">
                        <span className="text-green-500 mr-2">📝</span>
                        <span className="font-semibold">Take notes</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Use the notes panel for thoughts</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Features */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-purple-800 dark:text-purple-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                  Interactive Features
                </h3>
                <div className="grid md:grid-cols-3 gap-3 sm:gap-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="text-2xl mb-2">🔍</div>
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-1">Word Definitions</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Instant translations without leaving the page</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="text-2xl mb-2">🎵</div>
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-1">Pronunciation Help</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Audio for any word you click</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="text-2xl mb-2">📊</div>
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-1">Progress Tracking</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">See reading speed improve</p>
                  </div>
                </div>
              </div>

              {/* After Reading */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-orange-800 dark:text-orange-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                  After Reading
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">❓</span>
                      <span><strong>Take the comprehension quiz</strong> - Test your understanding</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">📚</span>
                      <span><strong>Review saved words</strong> - Go through vocabulary you collected</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">📈</span>
                      <span><strong>Check your stats</strong> - See reading speed and accuracy</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">💡</span>
                      <span><strong>Get recommendations</strong> - Find similar texts to read next</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-l-4 border-emerald-500 p-6 rounded-lg">
                <p className="text-emerald-800 dark:text-emerald-200">
                  <strong>📖 Reading Tip:</strong> Don't try to understand every single word! 
                  Focus on getting the main idea first, then go back to learn specific vocabulary.
                </p>
              </div>
            </div>
          </div>
        );      case 'vocabulary':
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                📝 Managing Your Vocabulary
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                The Vocabulary Manager helps you organize, review, and master all the words you're learning
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Accessing Your Vocabulary */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Accessing Your Vocabulary
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-indigo-500 mr-3">📚</span>
                    <span>Click "Vocabulary" in the main navigation</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🕐</div>
                        <h4 className="font-semibold text-indigo-700 dark:text-indigo-300">Recent</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Words you just learned</p>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                      <div className="text-center">
                        <div className="text-2xl mb-2">📖</div>
                        <h4 className="font-semibold text-indigo-700 dark:text-indigo-300">Learning</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Words you're practicing</p>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                      <div className="text-center">
                        <div className="text-2xl mb-2">✅</div>
                        <h4 className="font-semibold text-indigo-700 dark:text-indigo-300">Mastered</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Words you know well</p>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                      <div className="text-center">
                        <div className="text-2xl mb-2">😅</div>
                        <h4 className="font-semibold text-indigo-700 dark:text-indigo-300">Difficult</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Words needing more practice</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adding New Words */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-green-800 dark:text-green-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Adding New Words
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">➕</span>
                      <span>Click the "Add Word" button (+ icon)</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">🌍</span>
                      <span>Type the word in your target language</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">🏠</span>
                      <span>Add the translation in your native language</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Optional extras:</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center"><span className="text-green-500 mr-2">📝</span>Example sentence</li>
                      <li className="flex items-center"><span className="text-green-500 mr-2">💭</span>Personal notes</li>
                      <li className="flex items-center"><span className="text-green-500 mr-2">🏷️</span>Category tag (food, travel, etc.)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Organizing Your Words */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-purple-800 dark:text-purple-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                  Organizing Your Words
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center mb-2">
                        <span className="text-purple-500 mr-2">🔍</span>
                        <span className="font-semibold">Search</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Find specific words quickly</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center mb-2">
                        <span className="text-purple-500 mr-2">🏷️</span>
                        <span className="font-semibold">Filter by category</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">View words by topic</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center mb-2">
                        <span className="text-purple-500 mr-2">📊</span>
                        <span className="font-semibold">Sort options</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Alphabetical, recent, difficult, etc.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center mb-2">
                        <span className="text-purple-500 mr-2">📋</span>
                        <span className="font-semibold">Custom lists</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Group words for specific goals</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviewing and Practicing */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-orange-800 dark:text-orange-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                  Reviewing and Practicing
                </h3>
                <div className="grid md:grid-cols-3 gap-3 sm:gap-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="text-2xl mb-2">📅</div>
                    <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-1">Daily Review</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Practice words due for review</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-1">Focus Practice</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Work on difficult words</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="text-2xl mb-2">📦</div>
                    <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-1">Bulk Actions</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Create decks and quizzes</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-l-4 border-violet-500 p-6 rounded-lg">
                <p className="text-violet-800 dark:text-violet-200">
                  <strong>📝 Organization Tip:</strong> Use categories and personal notes! 
                  Words with context and personal connections are much easier to remember.
                </p>
              </div>
            </div>
          </div>
        );      case 'pronunciation':
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                🗣️ Improving Your Pronunciation
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Good pronunciation builds confidence and helps you communicate clearly. 
                Here's how to practice effectively
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Starting Practice */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Starting Pronunciation Practice
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">🎤</span>
                      <span>Make sure your microphone is working and allowed in your browser</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">🔊</span>
                      <span>Find the speaker icon next to any word</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">👂</span>
                      <span>Click to hear the correct pronunciation</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">📱</span>
                      <span>Click the microphone icon to record yourself</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">🔄</span>
                      <span>Compare your pronunciation with the original</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">🎯</span>
                      <span>Practice until you feel confident</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Practice Methods */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-green-800 dark:text-green-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Practice Methods
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📝</div>
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1">Word-by-word</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Practice individual vocabulary from flashcards</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📖</div>
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1">Sentence practice</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Read full sentences from reading exercises</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="text-center">
                      <div className="text-2xl mb-2">💬</div>
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1">Conversation mode</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Practice common phrases and responses</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎵</div>
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1">Pronunciation drills</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Focus on difficult sounds</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Getting Feedback */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-purple-800 dark:text-purple-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                  Getting Feedback
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2 text-xl">🎤</span>
                      <div>
                        <span className="font-semibold">Record your voice</span>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Click the microphone and speak clearly</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2 text-xl">📊</span>
                      <div>
                        <span className="font-semibold">Review the analysis</span>
                        <p className="text-sm text-gray-600 dark:text-gray-300">See which parts need improvement</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2 text-xl">🔄</span>
                      <div>
                        <span className="font-semibold">Try again</span>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Practice until you're satisfied</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2 text-xl">💾</span>
                      <div>
                        <span className="font-semibold">Save good recordings</span>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Keep track of your progress</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pronunciation Tips */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-orange-800 dark:text-orange-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">💡</span>
                  Pronunciation Tips
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">🔇</span>
                      <span>Practice in a quiet environment for better accuracy</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">🔊</span>
                      <span>Speak at normal volume - not too loud or soft</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">🎯</span>
                      <span>Focus on one sound at a time if struggling</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">🔁</span>
                      <span>Listen to the model pronunciation multiple times</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">⏰</span>
                      <span>Practice regularly for 5-10 minutes rather than long sessions</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">😌</span>
                      <span>Stay relaxed and don't worry about perfection</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-amber-500 p-6 rounded-lg">
                <p className="text-amber-800 dark:text-amber-200">
                  <strong>🔧 Technical Note:</strong> If pronunciation features aren't working, 
                  check that your browser has microphone permission and you're using a modern browser like Chrome or Firefox.
                </p>
              </div>
            </div>
          </div>
        );      case 'progress':
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                📈 Tracking Your Progress
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Seeing your progress keeps you motivated and helps identify areas for improvement
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Understanding Your Stats */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-blue-800 dark:text-blue-200 mb-4 sm:mb-6 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">📊</span>
                  Understanding Your Stats
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🔥</div>
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Study Streak</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Consecutive days studied (even 5 minutes counts!)</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="text-center">
                      <div className="text-2xl mb-2">⏰</div>
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Total Study Time</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">All time spent learning across features</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📚</div>
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Words Learned</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Vocabulary successfully mastered</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎯</div>
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Quiz Accuracy</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Average score across all quizzes</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📖</div>
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Reading Speed</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Reading and comprehension rate</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🏆</div>
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Achievements</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Badges and milestones earned</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily and Weekly Views */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-green-800 dark:text-green-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">📅</span>
                  Daily and Weekly Views
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center mb-2">
                        <span className="text-green-500 mr-2">🎯</span>
                        <span className="font-semibold">Daily Goals</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Set and track daily study time targets</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center mb-2">
                        <span className="text-green-500 mr-2">📊</span>
                        <span className="font-semibold">Weekly Summary</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">See patterns in your study habits</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center mb-2">
                        <span className="text-green-500 mr-2">📈</span>
                        <span className="font-semibold">Monthly Overview</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Long-term progress and trends</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center mb-2">
                        <span className="text-green-500 mr-2">🏅</span>
                        <span className="font-semibold">Achievements</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Unlock badges for milestones</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Using Progress Data */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-purple-800 dark:text-purple-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">🧠</span>
                  Using Progress Data
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">🔍</span>
                      <span><strong>Identify patterns:</strong> What times/days do you study best?</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">🎯</span>
                      <span><strong>Adjust goals:</strong> Make targets challenging but achievable</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">🎉</span>
                      <span><strong>Celebrate wins:</strong> Acknowledge your improvements</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">🔧</span>
                      <span><strong>Address gaps:</strong> Notice which skills need attention</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staying Motivated */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-orange-800 dark:text-orange-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">💪</span>
                  Staying Motivated
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">🔄</span>
                      <span>Focus on consistency over perfection</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">🎊</span>
                      <span>Celebrate small daily victories</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">📏</span>
                      <span>Compare to your past, not others</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">🎯</span>
                      <span>Set weekly mini-goals for momentum</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">💝</span>
                      <span>Remember why you started learning</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">👥</span>
                      <span>Share progress with friends/family</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-l-4 border-indigo-500 p-6 rounded-lg">
                <p className="text-indigo-800 dark:text-indigo-200">
                  <strong>💡 Motivation Tip:</strong> Progress isn't always linear! 
                  Some days will be better than others - what matters is showing up consistently.
                </p>
              </div>
            </div>
          </div>
        );      case 'settings':
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                ⚙️ Customizing Your Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Personalize Lingento to match your learning style and preferences
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Learning Preferences */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-blue-800 dark:text-blue-200 mb-4 sm:mb-6 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">🎓</span>
                  Learning Preferences
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center mb-2">
                      <span className="text-blue-500 mr-2">🌍</span>
                      <span className="font-semibold">Target Language</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Choose which language you're learning</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center mb-2">
                      <span className="text-blue-500 mr-2">🏠</span>
                      <span className="font-semibold">Native Language</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Set your primary language for translations</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center mb-2">
                      <span className="text-blue-500 mr-2">📊</span>
                      <span className="font-semibold">Skill Level</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Beginner, Intermediate, or Advanced</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center mb-2">
                      <span className="text-blue-500 mr-2">🎯</span>
                      <span className="font-semibold">Daily Goal</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Set realistic study time targets</p>
                  </div>
                </div>
              </div>

              {/* Interface Settings */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-green-800 dark:text-green-200 mb-4 sm:mb-6 flex items-center">
                  <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">🎨</span>
                  Interface Settings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center mb-2">
                      <span className="text-green-500 mr-2">🌓</span>
                      <span className="font-semibold">Theme</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Light or dark mode for comfort</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center mb-2">
                      <span className="text-green-500 mr-2">🔤</span>
                      <span className="font-semibold">Font Size</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Adjust text size for readability</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center mb-2">
                      <span className="text-green-500 mr-2">✨</span>
                      <span className="font-semibold">Animation</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Enable/disable motion effects</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center mb-2">
                      <span className="text-green-500 mr-2">🔊</span>
                      <span className="font-semibold">Sound Effects</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Turn on/off audio feedback</p>
                  </div>
                </div>
              </div>

              {/* Study Behavior */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-purple-800 dark:text-purple-200 mb-4 sm:mb-6 flex items-center">
                  <span className="w-8 h-8 bg-purple-500 text-white rounded-round flex items-center justify-center text-sm font-bold mr-3">📚</span>
                  Study Behavior
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center mb-2">
                      <span className="text-purple-500 mr-2">🎵</span>
                      <span className="font-semibold">Auto-play Audio</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Automatically hear pronunciation</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center mb-2">
                      <span className="text-purple-500 mr-2">🔄</span>
                      <span className="font-semibold">Review Frequency</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">How often to show review cards</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center mb-2">
                      <span className="text-purple-500 mr-2">🧩</span>
                      <span className="font-semibold">Quiz Difficulty</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Adjust question complexity</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center mb-2">
                      <span className="text-purple-500 mr-2">⚡</span>
                      <span className="font-semibold">Flashcard Speed</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">How quickly cards advance</p>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-orange-800 dark:text-orange-200 mb-4 sm:mb-6 flex items-center">
                  <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">🔔</span>
                  Notifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center mb-2">
                      <span className="text-orange-500 mr-2">⏰</span>
                      <span className="font-semibold">Daily Reminders</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Set times for study notifications</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center mb-2">
                      <span className="text-orange-500 mr-2">🔥</span>
                      <span className="font-semibold">Streak Alerts</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Reminders to maintain your streak</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center mb-2">
                      <span className="text-orange-500 mr-2">🏆</span>
                      <span className="font-semibold">Achievement Notifications</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Celebrate your milestones</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center mb-2">
                      <span className="text-orange-500 mr-2">📝</span>
                      <span className="font-semibold">Review Reminders</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">When vocabulary needs practice</p>
                  </div>
                </div>
              </div>

              {/* Privacy and Data */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 sm:mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">🔐</span>
                  Privacy and Data
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-2">
                      <span className="text-gray-500 mr-2">📥</span>
                      <span className="font-semibold">Data Export</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Download your learning progress</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-2">
                      <span className="text-gray-500 mr-2">☁️</span>
                      <span className="font-semibold">Account Backup</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Sync across multiple devices</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-2">
                      <span className="text-gray-500 mr-2">🛡️</span>
                      <span className="font-semibold">Privacy Settings</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Control what data is shared</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-2">
                      <span className="text-gray-500 mr-2">🔄</span>
                      <span className="font-semibold">Reset Options</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Clear progress or start fresh</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-l-4 border-cyan-500 p-6 rounded-lg">
                <p className="text-cyan-800 dark:text-cyan-200">
                  <strong>⚙️ Settings Tip:</strong> Experiment with different settings to find what works best for you. 
                  You can always change them later as your preferences evolve!
                </p>
              </div>
            </div>
          </div>
        );      case 'mobile':
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                📱 Learning on Mobile
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Lingento works great on phones and tablets. Here's how to make the most of mobile learning
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Getting Started on Mobile */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Getting Started on Mobile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">🌐</span>
                      <span>Open your mobile browser (Safari, Chrome, etc.)</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">🔑</span>
                      <span>Go to your Lingento website and log in</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Add to Home Screen:</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center"><span className="text-blue-500 mr-2">📱</span><strong>iPhone:</strong> Share → Add to Home Screen</li>
                      <li className="flex items-center"><span className="text-blue-500 mr-2">🤖</span><strong>Android:</strong> Menu → Add to Home Screen</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Mobile-Optimized Features */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-green-800 dark:text-green-200 mb-4 sm:mb-6 flex items-center">
                  <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">📲</span>
                  Mobile-Optimized Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="text-center">
                      <div className="text-2xl mb-2">👆</div>
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1">Touch-friendly</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Large buttons and easy navigation</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="text-center">
                      <div className="text-2xl mb-2">👆</div>
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1">Swipe Gestures</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Swipe flashcards left/right</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎤</div>
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1">Voice Input</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Use phone's microphone</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📱</div>
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1">Offline Reading</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Download texts for offline use</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="text-center">
                      <div className="text-2xl mb-2">⚡</div>
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1">Quick Sessions</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Perfect for 5-10 minute breaks</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🔔</div>
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1">Notifications</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Smart study reminders</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Study Tips */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-purple-800 dark:text-purple-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">💡</span>
                  Mobile Study Tips
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">🕐</span>
                      <span><strong>Use downtime:</strong> Study during commutes, waiting in lines</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">⏱️</span>
                      <span><strong>Keep sessions short:</strong> 5-15 minutes work well</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">🎵</span>
                      <span><strong>Use audio features:</strong> Great for pronunciation practice</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">🔔</span>
                      <span><strong>Enable notifications:</strong> Gentle reminders to study</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">🔄</span>
                      <span><strong>Sync across devices:</strong> Start mobile, continue desktop</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">🎯</span>
                      <span><strong>Focus on consistency:</strong> Small daily sessions add up</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Mobile Activities */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-orange-800 dark:text-orange-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">🏆</span>
                  Best Mobile Activities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center mb-2">
                      <span className="text-orange-500 mr-2">💳</span>
                      <span className="font-semibold">Flashcard Review</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Perfect for quick vocab practice</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center mb-2">
                      <span className="text-orange-500 mr-2">🎧</span>
                      <span className="font-semibold">Audio Lessons</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Listen while walking or exercising</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center mb-2">
                      <span className="text-orange-500 mr-2">⚡</span>
                      <span className="font-semibold">Quick Quizzes</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Test knowledge in spare moments</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center mb-2">
                      <span className="text-orange-500 mr-2">📝</span>
                      <span className="font-semibold">Vocabulary Logging</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Add new words you encounter</p>
                  </div>
                </div>
              </div>

              {/* Mobile Troubleshooting */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">🔧</span>
                  Mobile Troubleshooting
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-gray-500 mr-2">🐌</span>
                      <span><strong>Slow loading:</strong> Check your internet connection</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 mr-2">🔇</span>
                      <span><strong>Audio not working:</strong> Ensure volume is up and not on silent</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-gray-500 mr-2">🎤</span>
                      <span><strong>Microphone issues:</strong> Allow microphone permission in browser</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 mr-2">📱</span>
                      <span><strong>Display problems:</strong> Try rotating device or refreshing page</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-l-4 border-teal-500 p-6 rounded-lg">
                <p className="text-teal-800 dark:text-teal-200">
                  <strong>📱 Mobile Advantage:</strong> Mobile learning lets you study anywhere! 
                  Even 5 minutes of practice while waiting for the bus adds up over time.
                </p>
              </div>
            </div>
          </div>
        );      case 'tips':
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                💡 Effective Study Tips
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Get the most out of your language learning with these proven strategies
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Daily Habits */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-blue-800 dark:text-blue-200 mb-4 sm:mb-6 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">📅</span>
                  Daily Habits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center mb-2">
                      <span className="text-blue-500 mr-2">🎯</span>
                      <span className="font-semibold">Consistency beats intensity</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">15 minutes daily is better than 2 hours once a week</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center mb-2">
                      <span className="text-blue-500 mr-2">⏰</span>
                      <span className="font-semibold">Study at the same time</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Build a routine that becomes automatic</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center mb-2">
                      <span className="text-blue-500 mr-2">🥪</span>
                      <span className="font-semibold">Use the sandwich method</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Review → Learn new → Review again</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center mb-2">
                      <span className="text-blue-500 mr-2">🎯</span>
                      <span className="font-semibold">Set micro-goals</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">"Learn 5 new words" instead of "study vocabulary"</p>
                  </div>
                </div>
              </div>

              {/* Memory Techniques */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-green-800 dark:text-green-200 mb-4 sm:mb-6 flex items-center">
                  <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">🧠</span>
                  Memory Techniques
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center mb-2">
                      <span className="text-green-500 mr-2">🔗</span>
                      <span className="font-semibold">Create associations</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Link new words to things you already know</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center mb-2">
                      <span className="text-green-500 mr-2">👁️</span>
                      <span className="font-semibold">Use visualization</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Picture the meaning of words in your mind</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center mb-2">
                      <span className="text-green-500 mr-2">❤️</span>
                      <span className="font-semibold">Make personal connections</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">How does this word relate to your life?</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center mb-2">
                      <span className="text-green-500 mr-2">📖</span>
                      <span className="font-semibold">Practice in context</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Learn phrases, not just isolated words</p>
                  </div>
                </div>
              </div>

              {/* Smart Study Strategies */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-purple-800 dark:text-purple-200 mb-4 sm:mb-6 flex items-center">
                  <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">🧩</span>
                  Smart Study Strategies
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">📊</span>
                      <span><strong>Focus on frequency:</strong> Learn common words before rare ones</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">⏰</span>
                      <span><strong>Review before you forget:</strong> Don't wait until words are gone</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">❌</span>
                      <span><strong>Embrace mistakes:</strong> Errors show what needs practice</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">🔄</span>
                      <span><strong>Use spaced repetition:</strong> Review at increasing intervals</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">🌙</span>
                      <span><strong>Study before sleep:</strong> Brain consolidates memory overnight</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">🎯</span>
                      <span><strong>Focus on weak areas:</strong> Spend time where you need it most</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Avoiding Common Pitfalls */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-orange-800 dark:text-orange-200 mb-4 sm:mb-6 flex items-center">
                  <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">⚠️</span>
                  Avoiding Common Pitfalls
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">📚</span>
                      <span><strong>Don't cram:</strong> Intensive sessions lead to quick forgetting</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">✨</span>
                      <span><strong>Don't be a perfectionist:</strong> Good enough is better than not starting</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">🔄</span>
                      <span><strong>Don't neglect review:</strong> Learning new is useless if you forget old</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">👆</span>
                      <span><strong>Don't study passively:</strong> Actively recall, don't just re-read</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">👥</span>
                      <span><strong>Don't compare to others:</strong> Everyone learns at their own pace</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-2">🏃</span>
                      <span><strong>Don't rush:</strong> Slow and steady wins the race</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivation Boosters */}
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-4 sm:mb-6 flex items-center">
                  <span className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">🚀</span>
                  Motivation Boosters
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500 mr-2">🔥</span>
                      <span className="font-semibold">Track your streak</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Seeing consecutive days motivates continuation</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500 mr-2">🎉</span>
                      <span className="font-semibold">Celebrate small wins</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Acknowledge progress, however small</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500 mr-2">❤️</span>
                      <span className="font-semibold">Connect with your 'why'</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Remember why you started learning</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500 mr-2">👥</span>
                      <span className="font-semibold">Find a study buddy</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Share progress with friends or family</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-l-4 border-pink-500 p-6 rounded-lg">
                <p className="text-pink-800 dark:text-pink-200">
                  <strong>🌟 Golden Rule:</strong> The best study method is the one you'll actually stick with! 
                  Experiment to find what works for your personality and schedule.
                </p>
              </div>
            </div>
          </div>
        );      case 'troubleshooting':
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                🔧 Troubleshooting Common Issues
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Having problems? Here are quick solutions to get you back to learning
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Audio Problems */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-blue-800 dark:text-blue-200 mb-4 sm:mb-6 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">🔊</span>
                  Audio Problems
                </h3>
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center mb-3">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">1</span>
                      <span className="font-semibold text-blue-700 dark:text-blue-300">"I can't hear any sound"</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-9">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-blue-500 mr-2">🔧</span>
                        Check device volume is turned up
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-blue-500 mr-2">🔇</span>
                        Ensure not on silent/mute mode
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-blue-500 mr-2">🔄</span>
                        Try clicking speaker icon multiple times
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-blue-500 mr-2">🌐</span>
                        Test audio on other websites
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center mb-3">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</span>
                      <span className="font-semibold text-blue-700 dark:text-blue-300">"Microphone not working"</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-9">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-blue-500 mr-2">✅</span>
                        Allow microphone permission
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-blue-500 mr-2">⚙️</span>
                        Check browser microphone settings
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-blue-500 mr-2">🔄</span>
                        Try different browser (Chrome works best)
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-blue-500 mr-2">🔒</span>
                        Close other apps using microphone
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Issues */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-green-800 dark:text-green-200 mb-4 sm:mb-6 flex items-center">
                  <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">⚡</span>
                  Loading and Performance
                </h3>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex items-center mb-3">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">⏳</span>
                    <span className="font-semibold text-green-700 dark:text-green-300">"Pages load slowly or freeze"</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-9">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-green-500 mr-2">📶</span>
                      Check internet connection speed
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-green-500 mr-2">📑</span>
                      Close other browser tabs
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-green-500 mr-2">🧹</span>
                      Clear browser cache and cookies
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-green-500 mr-2">🕵️</span>
                      Try incognito/private browsing
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Issues */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-purple-800 dark:text-purple-200 mb-4 sm:mb-6 flex items-center">
                  <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">👤</span>
                  Account and Progress Issues
                </h3>
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center mb-3">
                      <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">📊</span>
                      <span className="font-semibold text-purple-700 dark:text-purple-300">"My progress isn't saving"</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-9">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-purple-500 mr-2">🔑</span>
                        Ensure you're logged into account
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-purple-500 mr-2">🍪</span>
                        Check cookies are enabled
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-purple-500 mr-2">✅</span>
                        Complete activities fully
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-purple-500 mr-2">🔄</span>
                        Try logging out and back in
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center mb-3">
                      <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">🔐</span>
                      <span className="font-semibold text-purple-700 dark:text-purple-300">"I forgot my password"</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-9">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-purple-500 mr-2">🔗</span>
                        Use "Forgot Password" link
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-purple-500 mr-2">📧</span>
                        Check email (including spam)
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-purple-500 mr-2">📋</span>
                        Follow reset instructions
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-purple-500 mr-2">🔒</span>
                        Create secure new password
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Issues */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-orange-800 dark:text-orange-200 mb-4 sm:mb-6 flex items-center">
                  <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">📱</span>
                  Mobile-Specific Issues
                </h3>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-orange-200 dark:border-orange-700">
                  <div className="flex items-center mb-3">
                    <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">📱</span>
                    <span className="font-semibold text-orange-700 dark:text-orange-300">"App doesn't work on my phone"</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-9">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-orange-500 mr-2">⬆️</span>
                      Update mobile browser
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-orange-500 mr-2">🌐</span>
                      Try different browser
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-orange-500 mr-2">🧹</span>
                      Clear browser data
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-orange-500 mr-2">🔄</span>
                      Restart your device
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Contact */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 sm:mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">💬</span>
                  When to Contact Support
                </h3>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Contact our support team if:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-gray-500 mr-2">✅</span>
                      You've tried solutions above
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-gray-500 mr-2">📊</span>
                      Lost significant progress
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-gray-500 mr-2">🐛</span>
                      Experiencing a blocking bug
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-gray-500 mr-2">💡</span>
                      Have improvement suggestions
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-l-4 border-red-500 p-6 rounded-lg">
                <p className="text-red-800 dark:text-red-200">
                  <strong>📞 Need More Help?</strong> Include details about your device, browser, 
                  and what you were doing when the problem occurred. Screenshots are helpful too!
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
                Lingento User Guide
              </h1>
              <p className="text-indigo-100 text-base sm:text-lg">
                Everything you need to know to learn effectively
              </p>
            </div>
            <Link
              href="/help"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center text-white font-medium transition-all duration-200 self-start sm:self-auto"
            >
              ← Back to Help
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 sm:gap-6 lg:gap-8">
          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-4"
            >
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Guide Sections</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-sm">{section.icon}</span>
                      <span className="text-center leading-tight">{section.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Guide Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                    }`}
                  >
                    <span className="mr-3">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </nav>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8"
            >
              <SectionContent sectionId={activeSection} />
            </motion.div>
          </div>
        </div>
      </div>      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8 sm:mt-12 lg:mt-16">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-4 text-base sm:text-lg">Still need help? We're here to assist you!</p>
            <div className="flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-6">
              <Link href="/help" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors">
                Help Center
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors">
                Contact Support
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href="/help/faq" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
