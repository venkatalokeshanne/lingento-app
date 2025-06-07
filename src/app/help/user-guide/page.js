'use client';

import { useState } from 'react';
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
      case 'getting-started':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🚀 Getting Started with Lingento</h2>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-blue-800">
                <strong>Welcome!</strong> This guide will help you start learning effectively with Lingento. 
                Follow these steps to begin your language journey.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Step 1: Set Up Your Profile</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Click the settings icon (⚙️) in the navigation menu</li>
                <li>Choose your target language from the dropdown</li>
                <li>Set your current skill level (Beginner, Intermediate, Advanced)</li>
                <li>Choose your daily study goal (15, 30, or 60 minutes)</li>
                <li>Save your preferences</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Step 2: Start with Your First Lesson</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Go to your Dashboard (click the home icon 🏠)</li>
                <li>Look for the "Quick Start" section</li>
                <li>Click "Start Learning" to begin with basic vocabulary</li>
                <li>Complete your first 5-10 flashcards</li>
                <li>Take a short quiz to test your knowledge</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Step 3: Explore the Features</h3>
              <p className="text-gray-600 mb-2">Now that you've started, explore these key features:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Flashcards:</strong> Learn new words with spaced repetition</li>
                <li><strong>Quizzes:</strong> Test your knowledge with multiple choice questions</li>
                <li><strong>Reading Practice:</strong> Improve comprehension with graded texts</li>
                <li><strong>Pronunciation:</strong> Practice speaking with audio feedback</li>
              </ul>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Using Your Dashboard</h2>
            
            <p className="text-gray-600 mb-4">
              Your Dashboard is your learning home base. Here's how to make the most of it:
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Daily Progress Section</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Study Streak:</strong> See how many days in a row you've studied</li>
                <li><strong>Today's Goal:</strong> Track your daily study time progress</li>
                <li><strong>Words Learned:</strong> Count of new vocabulary you've mastered</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Quick Actions</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li><strong>Continue Learning:</strong> Picks up where you left off</li>
                <li><strong>Review Flashcards:</strong> Practice words that need reinforcement</li>
                <li><strong>Take Quiz:</strong> Quick knowledge check</li>
                <li><strong>Reading Practice:</strong> Start a reading session</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Weekly Overview</h3>
              <p className="text-gray-600 mb-2">The chart shows your study activity:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Green bars = days you met your goal</li>
                <li>Yellow bars = partial progress</li>
                <li>Gray bars = no study time</li>
                <li>Click any bar to see detailed stats for that day</li>
              </ul>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-4">
                <p className="text-green-800">
                  <strong>Pro Tip:</strong> Check your dashboard every morning to plan your study session 
                  and see what needs review!
                </p>
              </div>
            </div>
          </div>
        );

      case 'flashcards':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🗂️ Mastering Flashcards</h2>
            
            <p className="text-gray-600 mb-4">
              Flashcards are your main tool for learning new vocabulary. Here's how to use them effectively:
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Starting a Flashcard Session</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Click "Flashcards" in the main navigation</li>
                <li>Choose a category (e.g., "Basic Words", "Food", "Travel")</li>
                <li>Select your study mode:
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li><strong>Learn New:</strong> Introduces new vocabulary</li>
                    <li><strong>Review:</strong> Practice words you've seen before</li>
                    <li><strong>Mixed:</strong> Combination of new and review</li>
                  </ul>
                </li>
                <li>Set the number of cards (10, 20, or 50)</li>
                <li>Click "Start Session"</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">During Your Session</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li><strong>Read the word:</strong> Take time to understand the pronunciation</li>
                <li><strong>Think of the meaning:</strong> Try to recall before revealing</li>
                <li><strong>Click "Show Answer"</strong> to see the translation</li>
                <li><strong>Rate your knowledge:</strong>
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>🔴 "Hard" - didn't know it at all</li>
                    <li>🟡 "Good" - knew it with some effort</li>
                    <li>🟢 "Easy" - knew it immediately</li>
                  </ul>
                </li>
                <li><strong>Listen to audio:</strong> Click the speaker icon for pronunciation</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Smart Features</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Spaced Repetition:</strong> Words you find hard appear more often</li>
                <li><strong>Audio Pronunciation:</strong> Learn correct pronunciation for each word</li>
                <li><strong>Example Sentences:</strong> See words used in context</li>
                <li><strong>Progress Tracking:</strong> See which words you've mastered</li>
              </ul>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                <p className="text-yellow-800">
                  <strong>Study Tip:</strong> Don't worry about getting everything perfect! 
                  The system will show you difficult words more frequently until you master them.
                </p>
              </div>
            </div>
          </div>
        );

      case 'quizzes':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🧠 Taking Effective Quizzes</h2>
            
            <p className="text-gray-600 mb-4">
              Quizzes help test your knowledge and reinforce learning. Here's how to get the most out of them:
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Starting a Quiz</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Click "Quizzes" in the navigation menu</li>
                <li>Choose your quiz type:
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li><strong>Vocabulary Quiz:</strong> Multiple choice word meanings</li>
                    <li><strong>Translation Quiz:</strong> Translate sentences</li>
                    <li><strong>Listening Quiz:</strong> Answer based on audio</li>
                    <li><strong>Mixed Review:</strong> All question types combined</li>
                  </ul>
                </li>
                <li>Select difficulty level (Easy, Medium, Hard)</li>
                <li>Choose number of questions (10, 20, or 30)</li>
                <li>Click "Start Quiz"</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Taking the Quiz</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li><strong>Read carefully:</strong> Take time to understand each question</li>
                <li><strong>Use audio:</strong> Click play button for listening questions</li>
                <li><strong>Select your answer:</strong> Click on the choice you think is correct</li>
                <li><strong>Check feedback:</strong> See explanation for right/wrong answers</li>
                <li><strong>Continue:</strong> Click "Next" to move to the next question</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">After Your Quiz</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Review Results:</strong> See your score and time taken</li>
                <li><strong>Check Mistakes:</strong> Review questions you got wrong</li>
                <li><strong>Save Progress:</strong> Your results are automatically saved</li>
                <li><strong>Get Recommendations:</strong> See suggested areas to study more</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Quiz Strategies</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Take short quizzes (10 questions) daily rather than long ones weekly</li>
                <li>Review incorrect answers immediately after finishing</li>
                <li>Focus on your weak areas shown in the results</li>
                <li>Don't guess wildly - use elimination to improve your chances</li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
                <p className="text-blue-800">
                  <strong>Remember:</strong> Quizzes are for learning, not just testing. 
                  Pay attention to the explanations - they're often more valuable than your score!
                </p>
              </div>
            </div>
          </div>
        );

      case 'reading':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 Reading Practice Made Easy</h2>
            
            <p className="text-gray-600 mb-4">
              Reading practice improves your comprehension and exposes you to words in context. 
              Here's how to use this feature effectively:
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Choosing a Text</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Click "Reading" in the main navigation</li>
                <li>Browse available texts by:
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li><strong>Difficulty Level:</strong> Beginner, Intermediate, Advanced</li>
                    <li><strong>Topic:</strong> News, Stories, Culture, Science, etc.</li>
                    <li><strong>Length:</strong> Short (5 min), Medium (10 min), Long (20 min)</li>
                  </ul>
                </li>
                <li>Click on a text title to see a preview</li>
                <li>Check the estimated reading time and difficulty</li>
                <li>Click "Start Reading" when you've chosen</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">While Reading</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li><strong>Click unknown words:</strong> Tap any word to see its meaning instantly</li>
                <li><strong>Add to vocabulary:</strong> Click the "+" button to save new words</li>
                <li><strong>Use audio support:</strong> Click the speaker icon to hear pronunciation</li>
                <li><strong>Take notes:</strong> Use the notes panel to jot down thoughts</li>
                <li><strong>Adjust speed:</strong> Read at your own pace - there's no timer</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Interactive Features</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Word Definitions:</strong> Instant translations without leaving the page</li>
                <li><strong>Pronunciation Help:</strong> Audio for any word you click</li>
                <li><strong>Vocabulary Building:</strong> Save new words to review later</li>
                <li><strong>Comprehension Questions:</strong> Answer questions about what you read</li>
                <li><strong>Progress Tracking:</strong> See your reading speed and comprehension improve</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">After Reading</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li><strong>Take the comprehension quiz:</strong> Test your understanding</li>
                <li><strong>Review saved words:</strong> Go through vocabulary you collected</li>
                <li><strong>Check your stats:</strong> See reading speed and accuracy</li>
                <li><strong>Get recommendations:</strong> Find similar texts to read next</li>
              </ol>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-4">
                <p className="text-green-800">
                  <strong>Reading Tip:</strong> Don't try to understand every single word! 
                  Focus on getting the main idea first, then go back to learn specific vocabulary.
                </p>
              </div>
            </div>
          </div>
        );

      case 'vocabulary':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Managing Your Vocabulary</h2>
            
            <p className="text-gray-600 mb-4">
              The Vocabulary Manager helps you organize, review, and master all the words you're learning:
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Accessing Your Vocabulary</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Click "Vocabulary" in the main navigation</li>
                <li>You'll see all your saved words organized by:
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li><strong>Recent:</strong> Words you just learned</li>
                    <li><strong>Learning:</strong> Words you're currently practicing</li>
                    <li><strong>Mastered:</strong> Words you know well</li>
                    <li><strong>Difficult:</strong> Words that need more practice</li>
                  </ul>
                </li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Adding New Words</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Click the "Add Word" button (+ icon)</li>
                <li>Type the word in your target language</li>
                <li>Add the translation in your native language</li>
                <li>Optionally add:
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>Example sentence</li>
                    <li>Personal notes</li>
                    <li>Category tag (food, travel, business, etc.)</li>
                  </ul>
                </li>
                <li>Click "Save" to add it to your collection</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Organizing Your Words</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Search:</strong> Use the search bar to find specific words quickly</li>
                <li><strong>Filter by category:</strong> View words by topic (food, travel, etc.)</li>
                <li><strong>Sort options:</strong> 
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>Alphabetical order</li>
                    <li>Recently added</li>
                    <li>Most difficult</li>
                    <li>Least practiced</li>
                  </ul>
                </li>
                <li><strong>Create custom lists:</strong> Group words for specific goals</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Reviewing and Practicing</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li><strong>Daily Review:</strong> Click "Review Today" to practice words due for review</li>
                <li><strong>Focus on weak areas:</strong> Use "Practice Difficult Words"</li>
                <li><strong>Bulk actions:</strong> Select multiple words to:
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>Create a custom flashcard deck</li>
                    <li>Generate a practice quiz</li>
                    <li>Export to study elsewhere</li>
                  </ul>
                </li>
              </ol>

              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mt-4">
                <p className="text-purple-800">
                  <strong>Organization Tip:</strong> Use categories and personal notes! 
                  Words with context and personal connections are much easier to remember.
                </p>
              </div>
            </div>
          </div>
        );

      case 'pronunciation':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🗣️ Improving Your Pronunciation</h2>
            
            <p className="text-gray-600 mb-4">
              Good pronunciation builds confidence and helps you communicate clearly. 
              Here's how to practice effectively:
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Starting Pronunciation Practice</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Make sure your microphone is working and allowed in your browser</li>
                <li>Find the speaker icon 🔊 next to any word</li>
                <li>Click to hear the correct pronunciation</li>
                <li>Click the microphone icon 🎤 to record yourself</li>
                <li>Compare your pronunciation with the original</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Practice Methods</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Word-by-word:</strong> Practice individual vocabulary from your flashcards</li>
                <li><strong>Sentence practice:</strong> Read full sentences from reading exercises</li>
                <li><strong>Conversation mode:</strong> Practice common phrases and responses</li>
                <li><strong>Pronunciation drills:</strong> Focus on difficult sounds</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Getting Feedback</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li><strong>Record your voice:</strong> Click the microphone and speak clearly</li>
                <li><strong>Review the analysis:</strong> See which parts need improvement</li>
                <li><strong>Try again:</strong> Practice until you're satisfied</li>
                <li><strong>Save good recordings:</strong> Keep track of your progress</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Pronunciation Tips</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Practice in a quiet environment for better accuracy</li>
                <li>Speak at normal volume - not too loud or soft</li>
                <li>Focus on one sound at a time if struggling</li>
                <li>Listen to the model pronunciation multiple times</li>
                <li>Practice regularly for just 5-10 minutes rather than long sessions</li>
              </ul>

              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mt-4">
                <p className="text-orange-800">
                  <strong>Technical Note:</strong> If pronunciation features aren't working, 
                  check that your browser has microphone permission and you're using a modern browser like Chrome or Firefox.
                </p>
              </div>
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📈 Tracking Your Progress</h2>
            
            <p className="text-gray-600 mb-4">
              Seeing your progress keeps you motivated and helps identify areas for improvement:
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Understanding Your Stats</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Study Streak:</strong> Consecutive days you've studied (even 5 minutes counts!)</li>
                <li><strong>Total Study Time:</strong> All time spent learning across all features</li>
                <li><strong>Words Learned:</strong> Vocabulary you've successfully mastered</li>
                <li><strong>Quiz Accuracy:</strong> Average score across all quizzes taken</li>
                <li><strong>Reading Speed:</strong> How quickly you can read and comprehend</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Daily and Weekly Views</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li><strong>Daily Goals:</strong> Set and track daily study time targets</li>
                <li><strong>Weekly Summary:</strong> See patterns in your study habits</li>
                <li><strong>Monthly Overview:</strong> Long-term progress and achievements</li>
                <li><strong>Achievements:</strong> Unlock badges for milestones reached</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Using Progress Data</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Identify patterns:</strong> What times/days do you study best?</li>
                <li><strong>Adjust goals:</strong> Make targets challenging but achievable</li>
                <li><strong>Celebrate wins:</strong> Acknowledge your improvements</li>
                <li><strong>Address gaps:</strong> Notice which skills need more attention</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Staying Motivated</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Focus on consistency over perfection</li>
                <li>Celebrate small daily victories</li>
                <li>Compare yourself to your past performance, not others</li>
                <li>Set weekly mini-goals to maintain momentum</li>
              </ul>

              <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mt-4">
                <p className="text-indigo-800">
                  <strong>Motivation Tip:</strong> Progress isn't always linear! 
                  Some days will be better than others - what matters is showing up consistently.
                </p>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">⚙️ Customizing Your Settings</h2>
            
            <p className="text-gray-600 mb-4">
              Personalize Lingento to match your learning style and preferences:
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Learning Preferences</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Target Language:</strong> Choose which language you're learning</li>
                <li><strong>Native Language:</strong> Set your primary language for translations</li>
                <li><strong>Skill Level:</strong> Beginner, Intermediate, or Advanced</li>
                <li><strong>Daily Goal:</strong> Set realistic study time targets</li>
                <li><strong>Preferred Study Time:</strong> When you usually study (for reminders)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Interface Settings</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Theme:</strong> Light or dark mode for comfortable viewing</li>
                <li><strong>Font Size:</strong> Adjust text size for better readability</li>
                <li><strong>Animation:</strong> Enable/disable motion effects</li>
                <li><strong>Sound Effects:</strong> Turn on/off audio feedback</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Study Behavior</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Auto-play Audio:</strong> Automatically hear pronunciation</li>
                <li><strong>Review Frequency:</strong> How often to show review cards</li>
                <li><strong>Quiz Difficulty:</strong> Adjust question complexity</li>
                <li><strong>Flashcard Speed:</strong> How quickly cards advance</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Notifications</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li><strong>Daily Reminders:</strong> Set times to get study notifications</li>
                <li><strong>Streak Alerts:</strong> Get reminded to maintain your streak</li>
                <li><strong>Achievement Notifications:</strong> Celebrate your milestones</li>
                <li><strong>Review Reminders:</strong> When vocabulary needs practice</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Privacy and Data</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Data Export:</strong> Download your learning progress</li>
                <li><strong>Account Backup:</strong> Sync across multiple devices</li>
                <li><strong>Privacy Settings:</strong> Control what data is shared</li>
                <li><strong>Reset Options:</strong> Clear progress or start fresh</li>
              </ul>

              <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mt-4">
                <p className="text-gray-800">
                  <strong>Settings Tip:</strong> Experiment with different settings to find what works best for you. 
                  You can always change them later as your preferences evolve!
                </p>
              </div>
            </div>
          </div>
        );

      case 'mobile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📱 Learning on Mobile</h2>
            
            <p className="text-gray-600 mb-4">
              Lingento works great on phones and tablets. Here's how to make the most of mobile learning:
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Getting Started on Mobile</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Open your mobile browser (Safari, Chrome, etc.)</li>
                <li>Go to your Lingento website</li>
                <li>Log in with your account</li>
                <li>For easier access, add to your home screen:
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li><strong>iPhone:</strong> Tap Share → Add to Home Screen</li>
                    <li><strong>Android:</strong> Tap Menu → Add to Home Screen</li>
                  </ul>
                </li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Mobile-Optimized Features</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Touch-friendly interface:</strong> Large buttons and easy navigation</li>
                <li><strong>Swipe gestures:</strong> Swipe flashcards left/right to rate difficulty</li>
                <li><strong>Voice input:</strong> Use your phone's microphone for pronunciation</li>
                <li><strong>Offline reading:</strong> Download texts to read without internet</li>
                <li><strong>Quick sessions:</strong> Perfect for 5-10 minute study breaks</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Mobile Study Tips</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Use downtime:</strong> Study during commutes, waiting in lines, etc.</li>
                <li><strong>Keep sessions short:</strong> 5-15 minutes work well on mobile</li>
                <li><strong>Use audio features:</strong> Great for pronunciation practice</li>
                <li><strong>Enable notifications:</strong> Gentle reminders to study</li>
                <li><strong>Sync across devices:</strong> Start on mobile, continue on desktop</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Best Mobile Activities</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Flashcard review:</strong> Perfect for quick vocab practice</li>
                <li><strong>Audio lessons:</strong> Listen while walking or exercising</li>
                <li><strong>Quick quizzes:</strong> Test knowledge in spare moments</li>
                <li><strong>Vocabulary logging:</strong> Add new words you encounter</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Mobile Troubleshooting</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Slow loading:</strong> Check your internet connection</li>
                <li><strong>Audio not working:</strong> Ensure volume is up and not on silent</li>
                <li><strong>Microphone issues:</strong> Allow microphone permission in browser</li>
                <li><strong>Display problems:</strong> Try rotating your device or refreshing the page</li>
              </ul>

              <div className="bg-teal-50 border-l-4 border-teal-400 p-4 mt-4">
                <p className="text-teal-800">
                  <strong>Mobile Advantage:</strong> Mobile learning lets you study anywhere! 
                  Even 5 minutes of practice while waiting for the bus adds up over time.
                </p>
              </div>
            </div>
          </div>
        );

      case 'tips':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Effective Study Tips</h2>
            
            <p className="text-gray-600 mb-4">
              Get the most out of your language learning with these proven strategies:
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Daily Habits</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Consistency beats intensity:</strong> 15 minutes daily is better than 2 hours once a week</li>
                <li><strong>Study at the same time:</strong> Build a routine that becomes automatic</li>
                <li><strong>Use the sandwich method:</strong> Review → Learn new → Review again</li>
                <li><strong>Set micro-goals:</strong> "Learn 5 new words" instead of "study vocabulary"</li>
                <li><strong>Mix different activities:</strong> Don't just do flashcards - vary your practice</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Memory Techniques</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Create associations:</strong> Link new words to things you already know</li>
                <li><strong>Use visualization:</strong> Picture the meaning of words in your mind</li>
                <li><strong>Make personal connections:</strong> How does this word relate to your life?</li>
                <li><strong>Practice in context:</strong> Learn phrases, not just isolated words</li>
                <li><strong>Tell stories:</strong> Use new vocabulary in sentences about your day</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Smart Study Strategies</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Focus on frequency:</strong> Learn common words before rare ones</li>
                <li><strong>Review before you forget:</strong> Don't wait until words are completely gone</li>
                <li><strong>Embrace mistakes:</strong> Errors show you what needs more practice</li>
                <li><strong>Use spaced repetition:</strong> Review at increasing intervals</li>
                <li><strong>Study before sleep:</strong> Your brain consolidates memory overnight</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Avoiding Common Pitfalls</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Don't cram:</strong> Intensive sessions lead to quick forgetting</li>
                <li><strong>Don't be a perfectionist:</strong> Good enough is better than not starting</li>
                <li><strong>Don't neglect review:</strong> Learning new words is useless if you forget old ones</li>
                <li><strong>Don't study passively:</strong> Actively recall, don't just re-read</li>
                <li><strong>Don't compare yourself to others:</strong> Everyone learns at their own pace</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Motivation Boosters</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Track your streak:</strong> Seeing consecutive days motivates continuation</li>
                <li><strong>Celebrate small wins:</strong> Acknowledge progress, however small</li>
                <li><strong>Connect with your 'why':</strong> Remember why you started learning</li>
                <li><strong>Use positive self-talk:</strong> "I'm improving" instead of "I'm bad at this"</li>
                <li><strong>Find a study buddy:</strong> Share progress with friends or family</li>
              </ul>

              <div className="bg-pink-50 border-l-4 border-pink-400 p-4 mt-4">
                <p className="text-pink-800">
                  <strong>Golden Rule:</strong> The best study method is the one you'll actually stick with! 
                  Experiment to find what works for your personality and schedule.
                </p>
              </div>
            </div>
          </div>
        );

      case 'troubleshooting':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔧 Troubleshooting Common Issues</h2>
            
            <p className="text-gray-600 mb-4">
              Having problems? Here are solutions to the most common issues:
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Audio Problems</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium text-gray-700 mb-2">🔊 "I can't hear any sound"</p>
                <ol className="list-decimal list-inside space-y-1 ml-4 text-sm">
                  <li>Check your device volume is turned up</li>
                  <li>Make sure you're not on silent/mute mode</li>
                  <li>Try clicking the speaker icon multiple times</li>
                  <li>Refresh the page and try again</li>
                  <li>Test audio on other websites to check if it's a browser issue</li>
                </ol>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium text-gray-700 mb-2">🎤 "Microphone not working"</p>
                <ol className="list-decimal list-inside space-y-1 ml-4 text-sm">
                  <li>Allow microphone permission when prompted</li>
                  <li>Check browser settings for microphone access</li>
                  <li>Make sure no other apps are using your microphone</li>
                  <li>Try a different browser (Chrome works best)</li>
                  <li>Restart your browser and try again</li>
                </ol>
              </div>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Loading and Performance</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium text-gray-700 mb-2">⏳ "Pages load slowly or freeze"</p>
                <ol className="list-decimal list-inside space-y-1 ml-4 text-sm">
                  <li>Check your internet connection speed</li>
                  <li>Close other browser tabs to free up memory</li>
                  <li>Clear your browser cache and cookies</li>
                  <li>Disable browser extensions temporarily</li>
                  <li>Try using an incognito/private browsing window</li>
                </ol>
              </div>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Account and Progress Issues</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium text-gray-700 mb-2">📊 "My progress isn't saving"</p>
                <ol className="list-decimal list-inside space-y-1 ml-4 text-sm">
                  <li>Make sure you're logged into your account</li>
                  <li>Check that cookies are enabled in your browser</li>
                  <li>Complete activities fully before closing the browser</li>
                  <li>Try logging out and back in</li>
                  <li>Contact support if progress continues to be lost</li>
                </ol>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium text-gray-700 mb-2">🔐 "I forgot my password"</p>
                <ol className="list-decimal list-inside space-y-1 ml-4 text-sm">
                  <li>Use the "Forgot Password" link on the login page</li>
                  <li>Check your email (including spam folder)</li>
                  <li>Follow the reset instructions in the email</li>
                  <li>Create a new, secure password</li>
                  <li>Log in with your new password</li>
                </ol>
              </div>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Mobile-Specific Issues</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium text-gray-700 mb-2">📱 "App doesn't work on my phone"</p>
                <ol className="list-decimal list-inside space-y-1 ml-4 text-sm">
                  <li>Update your mobile browser to the latest version</li>
                  <li>Try a different browser (Chrome, Safari, Firefox)</li>
                  <li>Clear browser data and restart</li>
                  <li>Check if you have enough storage space</li>
                  <li>Restart your device</li>
                </ol>
              </div>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">When to Contact Support</h3>
              <p className="text-gray-600 mb-2">Contact our support team if:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You've tried the solutions above and still have problems</li>
                <li>You lost significant progress or vocabulary</li>
                <li>You're experiencing a bug that prevents you from learning</li>
                <li>You have suggestions for improving the app</li>
              </ul>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
                <p className="text-red-800">
                  <strong>Need More Help?</strong> Include details about your device, browser, 
                  and what you were doing when the problem occurred. Screenshots are helpful too!
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lingento User Guide</h1>
              <p className="text-gray-600 mt-1">Everything you need to know to learn effectively</p>
            </div>
            <Link
              href="/help"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              ← Back to Help
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Guide Sections</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-800 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <SectionContent sectionId={activeSection} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="mb-2">Still need help? We're here to assist you!</p>
            <div className="flex justify-center space-x-4">
              <Link href="/help" className="text-blue-600 hover:text-blue-800">
                Help Center
              </Link>
              <span className="text-gray-400">•</span>
              <Link href="/contact" className="text-blue-600 hover:text-blue-800">
                Contact Support
              </Link>
              <span className="text-gray-400">•</span>
              <Link href="/help/faq" className="text-blue-600 hover:text-blue-800">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
