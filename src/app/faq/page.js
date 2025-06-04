'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEOHead from '@/components/SEOHead';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedItem, setExpandedItem] = useState(null);

  const categories = [
    { id: 'general', name: 'General', icon: '❓' },
    { id: 'account', name: 'Account', icon: '👤' },
    { id: 'learning', name: 'Learning', icon: '📚' },
    { id: 'technical', name: 'Technical', icon: '⚙️' },
    { id: 'billing', name: 'Billing', icon: '💳' }
  ];

  const faqs = {
    general: [      {
        q: "What is Lingento?",
        a: "Lingento is a modern vocabulary learning app that uses scientifically-proven spaced repetition algorithms to help you master words efficiently. Our platform combines AI-powered features with traditional learning methods to provide personalized vocabulary building experience."
      },
      {
        q: "How does spaced repetition work?",
        a: "Spaced repetition is a learning technique that shows you vocabulary cards at increasing intervals. Words you find difficult appear more frequently, while words you know well appear less often. This optimizes your study time and improves long-term retention by up to 90%."
      },
      {
        q: "What makes Lingento different from other language learning apps?",
        a: "Lingento focuses specifically on vocabulary mastery using advanced spaced repetition algorithms. We offer AI-powered pronunciation guides, contextual examples, writing practice with feedback, and detailed progress analytics. Our approach is scientifically-backed and designed for serious learners."
      },
      {        q: "Do I need any prior language knowledge to start?",
        a: "No! Lingento is designed for learners at all levels, from complete beginners to advanced students. Our system adapts to your current level and provides appropriate vocabulary based on your progress and goals."
      },
      {
        q: "How much time should I spend studying each day?",
        a: "We recommend 15-30 minutes of daily practice for optimal results. Consistency is more important than long study sessions. Our system will suggest daily goals based on your preferences and track your progress."
      }
    ],
    account: [
      {
        q: "How do I create an account?",
        a: "Click the 'Get Started' button on our homepage, enter your email address and create a password. You can also sign up using your Google account for faster registration."
      },
      {
        q: "Can I use Lingento on multiple devices?",
        a: "Yes! Your progress syncs across all devices. You can study on your phone, tablet, or computer and pick up right where you left off."
      },
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a reset link. Follow the instructions in the email to create a new password."
      },
      {
        q: "Can I delete my account?",
        a: "Yes, you can delete your account anytime from your profile settings. Please note that this action is irreversible and will permanently remove all your progress and data."
      },
      {
        q: "How do I change my email address?",
        a: "Go to your profile settings, click 'Change Email', enter your new email address, and verify it through the confirmation email we'll send you."
      }
    ],
    learning: [
      {
        q: "How many words should I learn per day?",
        a: "This depends on your goals and available time. Beginners typically start with 10-15 new words per day, while more advanced learners might handle 20-30. Our system will recommend a pace based on your performance."
      },
      {
        q: "What happens if I miss a day of study?",
        a: "Don't worry! Life happens. When you return, you'll see cards that were due for review. The spaced repetition algorithm adjusts automatically, and you can catch up gradually without being overwhelmed."
      },
      {
        q: "Can I add my own vocabulary words?",
        a: "Yes! Pro and Premium users can add custom vocabulary words with translations, pronunciation guides, and example sentences. This is perfect for words you encounter in daily life or specific to your interests."
      },
      {
        q: "How do you track my progress?",
        a: "We track multiple metrics including words learned, retention rate, study streaks, time spent studying, and mastery levels. You can view detailed analytics in your dashboard to see how you're improving over time."
      },
      {
        q: "What if I find a word too easy or too difficult?",
        a: "You can manually adjust the difficulty of any word. Mark words as 'easy' to see them less frequently, or 'hard' to review them more often. The algorithm learns from your feedback and adjusts accordingly."
      }
    ],
    technical: [
      {
        q: "Do I need an internet connection to use Lingento?",
        a: "While an internet connection is required for initial setup and syncing, Pro and Premium users can download vocabulary sets for offline study. Your progress will sync when you reconnect to the internet."
      },
      {
        q: "Which devices and browsers are supported?",
        a: "Lingento works on all modern web browsers (Chrome, Firefox, Safari, Edge) and is optimized for mobile devices. We also have dedicated mobile apps for iOS and Android."
      },
      {
        q: "Is my data secure?",
        a: "Absolutely! We use enterprise-grade encryption to protect your data. Your learning progress and personal information are stored securely and never shared with third parties. Read our Privacy Policy for complete details."
      },
      {
        q: "I'm experiencing technical issues. What should I do?",
        a: "First, try refreshing the page or restarting the app. If the problem persists, check our status page for known issues. For persistent problems, contact our support team with details about your device and the issue."
      },
      {
        q: "Do you have mobile apps?",
        a: "Yes! Our mobile apps are available for both iOS and Android devices. Download them from the App Store or Google Play Store. All features are synchronized between web and mobile versions."
      }
    ],
    billing: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions. All payments are processed securely through our payment partners."
      },
      {
        q: "Can I cancel my subscription anytime?",
        a: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access to premium features until the end of your current billing period."
      },
      {
        q: "Do you offer refunds?",
        a: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied within the first 30 days, contact our support team for a full refund."
      },
      {
        q: "What happens when my subscription expires?",
        a: "When your subscription expires, you'll be moved to the free plan. Your progress and data remain safe, but you'll lose access to premium features like unlimited vocabulary and advanced analytics."
      },
      {
        q: "Do you offer student or educational discounts?",
        a: "Yes! Students with valid .edu email addresses receive 50% off all plans. We also offer special pricing for educational institutions. Contact our sales team for volume discounts."
      }
    ]
  };

  const toggleExpanded = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };
  return (
    <>      <SEOHead 
        title="FAQ | Lingento - Frequently Asked Questions About Language Learning"
        description="Get answers to common questions about Lingento language learning app. Learn about spaced repetition, vocabulary training, pronunciation, and our learning methods."
        keywords={[
          'language learning FAQ',
          'Lingento questions',
          'spaced repetition questions',
          'vocabulary help',
          'language learning support',
          'language app help',
          'pronunciation guide',
          'vocabulary learning questions',
          'language learning tips',
          'learning progress help'
        ]}
        canonical="https://lingentoo.com/faq"
        ogImage="https://lingentoo.com/og-faq.jpg"
        twitterImage="https://lingentoo.com/twitter-faq.jpg"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about Lingento. Can't find what you're looking for? 
            Contact our support team for personalized help.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Category Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* FAQ Items */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {faqs[activeCategory].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleExpanded(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.q}
                  </h3>
                  <motion.div
                    animate={{ rotate: expandedItem === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedItem === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white"
          >
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>            <p className="mb-6 opacity-90">
              Our support team is here to help you succeed in your language learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/community"
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Join Community
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Structured Data for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is spaced repetition and how does it work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Spaced repetition is a learning technique that shows you vocabulary cards at increasing intervals. Words you find difficult appear more frequently, while words you know well appear less often. This optimizes your study time and improves long-term retention by up to 90%."
                }
              },
              {
                "@type": "Question", 
                "name": "What makes Lingento different from other language learning apps?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Lingento focuses specifically on vocabulary mastery using advanced spaced repetition algorithms. We offer AI-powered pronunciation guides, contextual examples, writing practice with feedback, and detailed progress analytics. Our approach is scientifically-backed and designed for serious learners."
                }
              },
              {
                "@type": "Question",                "name": "Do I need any prior language knowledge to start?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No! Lingento is designed for learners at all levels, from complete beginners to advanced students. Our system adapts to your current level and provides appropriate vocabulary based on your progress and goals."
                }
              },
              {
                "@type": "Question",
                "name": "How much time should I spend studying each day?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We recommend 15-30 minutes per day for optimal results. Consistency is more important than duration. Our spaced repetition algorithm will show you the most important words to review each day, making your study time highly efficient."
                }
              }
            ]
                  })
        }}
      />
    </div>
    </>
  );
}
