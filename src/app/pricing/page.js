'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import SEOHead from '@/components/SEOHead';

export default function PricingPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started with vocabulary learning',
      features: [
        'Access to 1,000 vocabulary words',
        'Basic spaced repetition algorithm',
        'Simple flashcard practice',
        'Progress tracking',
        'Mobile app access'
      ],
      limitations: [
        'Limited vocabulary content',
        'Basic features only',
        'Community support only'
      ],
      cta: currentUser ? 'Current Plan' : 'Get Started Free',
      popular: false,
      color: 'gray'
    },
    {
      name: 'Pro',
      price: { monthly: 9.99, annual: 99.99 },
      description: 'Ideal for serious learners wanting comprehensive features',
      features: [
        'Access to 10,000+ vocabulary words',
        'Advanced spaced repetition with AI',
        'Smart flashcards with pronunciation',
        'Detailed progress analytics',
        'Writing practice with AI feedback',
        'Reading comprehension exercises',
        'Vocabulary quiz generator',
        'Offline mode',
        'Priority email support'
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      popular: true,
      color: 'indigo'
    },
    {
      name: 'Premium',
      price: { monthly: 19.99, annual: 199.99 },
      description: 'For language enthusiasts who want everything',
      features: [
        'Everything in Pro',
        'Unlimited vocabulary content',
        'AI-powered conversation practice',
        'Personalized learning curriculum',
        'Advanced writing analysis',
        'Speaking practice with feedback',
        'Custom vocabulary imports',
        'Advanced analytics & insights',
        'Priority customer support',
        'Early access to new features'
      ],
      limitations: [],
      cta: 'Start Premium Trial',
      popular: false,
      color: 'purple'
    }
  ];

  const handlePlanSelect = (plan) => {
    if (plan.name === 'Free') {
      if (!currentUser) {
        router.push('/register');
      }
      return;
    }
    // Handle premium plan selection - would integrate with payment system
    console.log(`Selected ${plan.name} plan`);
  };
  return (
    <>
      <SEOHead        title="Pricing Plans | Lingento - Choose Your Language Learning Plan"
        description="Choose the perfect language learning plan for you. Free, Pro, and Premium options with advanced spaced repetition, AI feedback, and comprehensive vocabulary training."
        keywords={[          'language learning pricing',
          'language course pricing',
          'language app pricing',
          'language learning subscription',          'language learning plans',
          'affordable language learning',
          'language premium features',
          'vocabulary learning cost',          'language learning membership',
          'language tutor pricing'
        ]}
        canonical="https://lingentoo.com/pricing"
        ogImage="https://lingentoo.com/og-pricing.jpg"
        twitterImage="https://lingentoo.com/twitter-pricing.jpg"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Learning Journey
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Start free and upgrade as you progress. All plans include our core vocabulary learning features
            with scientifically-proven spaced repetition.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all relative ${
                billingPeriod === 'annual'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 ${
                plan.popular ? 'ring-2 ring-indigo-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {plan.description}
                </p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${plan.price[billingPeriod]}
                  </span>
                  {plan.price[billingPeriod] > 0 && (
                    <span className="text-gray-600 dark:text-gray-300">
                      /{billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanSelect(plan)}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: "Can I change plans anytime?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                q: "Do you offer student discounts?",
                a: "Yes, we offer 50% off for students with a valid student email address."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
              },
              {
                q: "Is there a free trial?",
                a: "Yes! Pro and Premium plans come with a 14-day free trial. No credit card required."
              }
            ].map((faq, idx) => (
              <div key={idx} className="text-left bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Structured Data for Pricing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",            "name": "Lingento Language Learning Platform",
            "description": "AI-powered vocabulary learning with spaced repetition",
            "provider": {
              "@type": "Organization",
              "name": "Lingento",
              "url": "https://lingentoo.com"
            },
            "offers": [
              {
                "@type": "Offer",
                "name": "Free Plan",
                "description": "Perfect for getting started with vocabulary learning",
                "price": "0",
                "priceCurrency": "USD",
                "eligibleQuantity": {
                  "@type": "QuantitativeValue",
                  "value": "1000",
                  "unitText": "vocabulary words"
                }
              },
              {
                "@type": "Offer", 
                "name": "Pro Plan",
                "description": "Ideal for serious learners wanting comprehensive features",
                "price": "9.99",
                "priceCurrency": "USD",
                "billingIncrement": "P1M",
                "eligibleQuantity": {
                  "@type": "QuantitativeValue",
                  "value": "10000",
                  "unitText": "vocabulary words"
                }
              },
              {
                "@type": "Offer",
                "name": "Premium Plan", 
                "description": "For language enthusiasts who want everything",
                "price": "19.99",
                "priceCurrency": "USD",
                "billingIncrement": "P1M",
                "eligibleQuantity": {
                  "@type": "QuantitativeValue",
                  "value": "unlimited",
                  "unitText": "vocabulary content"
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
