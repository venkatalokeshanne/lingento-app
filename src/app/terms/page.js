'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermsOfService() {
  const lastUpdated = 'December 15, 2024';

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      content: `By accessing and using Lingento's language learning platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.

      These Terms of Service ("Terms") govern your use of our website located at lingento.com (the "Service") operated by Lingento ("us", "we", or "our"). Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.`
    },
    {
      id: 'description',
      title: 'Description of Service',
      content: `Lingento provides an online platform for learning French vocabulary through spaced repetition and AI-powered learning techniques. Our services include:

      • Interactive vocabulary lessons and exercises
      • Personalized learning paths and progress tracking
      • Spaced repetition algorithms for optimal retention
      • Community features for learner interaction
      • Premium features for enhanced learning experience
      • Mobile and web access to learning content`
    },
    {
      id: 'user-accounts',
      title: 'User Accounts',
      content: `To access certain features of our Service, you must register for an account. When you create an account, you agree to:

      • Provide accurate, current, and complete information
      • Maintain and promptly update your account information
      • Maintain the security of your password and account
      • Accept responsibility for all activities under your account
      • Notify us immediately of any unauthorized use
      • Not share your account credentials with others`
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use Policy',
      content: `You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree NOT to use the Service:

      • To violate any applicable local, state, national, or international law
      • To transmit or post any harmful, threatening, abusive, or harassing content
      • To impersonate any person or entity or falsely state your affiliation
      • To interfere with or disrupt the Service or servers
      • To attempt to gain unauthorized access to any portion of the Service
      • To engage in any form of spam or unsolicited advertising
      • To upload viruses or malicious code
      • To collect user information without consent`
    },
    {
      id: 'subscription-billing',
      title: 'Subscription and Billing',
      content: `Our Service offers both free and paid subscription plans:

      Free Plan:
      • Limited access to vocabulary lessons
      • Basic progress tracking
      • Community access

      Premium Plans:
      • Unlimited access to all content
      • Advanced learning features
      • Priority customer support
      • Offline access capabilities

      Billing Terms:
      • Subscriptions automatically renew unless cancelled
      • Changes to subscription fees will be communicated in advance
      • Refunds are provided according to our refund policy
      • You can cancel your subscription at any time`
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Rights',
      content: `The Service and its original content, features, and functionality are and will remain the exclusive property of Lingento and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used without our prior written consent.

      User-Generated Content:
      • You retain ownership of content you create
      • You grant us a license to use, modify, and display your content
      • You represent that you have the right to grant such license
      • We may remove content that violates these Terms`
    },
    {
      id: 'privacy-data',
      title: 'Privacy and Data Protection',
      content: `Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.

      Data Protection Rights:
      • Right to access your personal data
      • Right to correct inaccurate information
      • Right to delete your data
      • Right to data portability
      • Right to object to processing

      Please review our Privacy Policy for complete details about our data practices.`
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers and Warranties',
      content: `The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, this Company:

      • Excludes all representations and warranties relating to this Service
      • Excludes all liability for damages arising out of or in connection with your use of this Service

      Educational Disclaimer:
      • Our Service is designed to supplement, not replace, formal language education
      • Learning outcomes may vary based on individual effort and circumstances
      • We do not guarantee specific learning results or proficiency levels
      • Success depends on consistent use and practice`
    },
    {
      id: 'limitation-liability',
      title: 'Limitation of Liability',
      content: `In no event shall Lingento, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.

      Our total liability to you for all claims arising from or relating to the Service shall not exceed the amount you paid us in the twelve months preceding the claim.

      Some jurisdictions do not allow the exclusion of certain warranties or the limitation of liability, so the above limitations may not apply to you.`
    },
    {
      id: 'termination',
      title: 'Termination',
      content: `We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason, including:

      • Breach of these Terms
      • Violation of applicable laws
      • Fraudulent or harmful activities
      • Extended periods of inactivity

      Upon termination:
      • Your right to use the Service ceases immediately
      • You may no longer access your account
      • We may delete your data in accordance with our retention policy
      • Provisions that should survive termination will remain in effect`
    },
    {
      id: 'changes-terms',
      title: 'Changes to Terms',
      content: `We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.

      We will notify you of changes by:
      • Posting updates on our website
      • Sending email notifications to registered users
      • Displaying prominent notices within the Service

      What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after revisions become effective, you agree to be bound by the revised terms.`
    },
    {
      id: 'governing-law',
      title: 'Governing Law and Dispute Resolution',
      content: `These Terms shall be interpreted and governed by the laws of [Jurisdiction], without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.

      Dispute Resolution:
      • We encourage resolving disputes through direct communication
      • Mediation may be required before litigation
      • Certain disputes may be subject to binding arbitration
      • Class action lawsuits are waived where legally permissible

      If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions will remain in effect.`
    },
    {
      id: 'contact-information',
      title: 'Contact Information',
      content: `If you have any questions about these Terms of Service, please contact us:

      • Email: legal@lingento.com
      • Address: 123 Learning Street, Education City, EC 12345
      • Phone: +1 (555) 123-4567
      • Support: support@lingento.com

      For technical support or account-related questions, please use our Help Center or contact our support team. We aim to respond to all inquiries within 48 hours during business days.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <Link href="/" className="text-indigo-600 hover:text-indigo-500 transition-colors">
                ← Back to Home
              </Link>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 py-12">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Lingento
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            These Terms of Service ("Terms") govern your use of the Lingento language learning platform. 
            By accessing or using our service, you agree to be bound by these Terms. Please read them carefully 
            before using our platform.
          </p>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8"
        >
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                Important Legal Agreement
              </h3>
              <p className="text-amber-700 dark:text-amber-300">
                These Terms constitute a legally binding agreement between you and Lingento. 
                If you do not agree to these Terms, please do not use our service.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors py-1"
              >
                {index + 1}. {section.title}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 3) }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {index + 1}. {section.title}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {section.content.split('\n\n').map((paragraph, pIndex) => (
                  <div key={pIndex} className="mb-4">
                    {paragraph.includes('•') ? (
                      <div>
                        {paragraph.split('\n').map((line, lIndex) => {
                          if (line.trim().startsWith('•')) {
                            return (
                              <div key={lIndex} className="flex items-start gap-3 mb-2">
                                <span className="text-indigo-500 mt-1">•</span>
                                <span className="text-gray-600 dark:text-gray-300">
                                  {line.trim().substring(1).trim()}
                                </span>
                              </div>
                            );
                          } else if (line.trim() && !line.includes(':')) {
                            return (
                              <p key={lIndex} className="text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                                {line.trim()}
                              </p>
                            );
                          } else if (line.trim().endsWith(':')) {
                            return (
                              <h4 key={lIndex} className="font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">
                                {line.trim()}
                              </h4>
                            );
                          }
                          return null;
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legal Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white mt-12"
        >
          <h2 className="text-2xl font-bold mb-4">
            Questions About These Terms?
          </h2>
          <p className="text-indigo-100 mb-6">
            If you have any questions about these Terms of Service or need clarification on any provision, 
            our legal team is here to help. We're committed to transparency and clear communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors text-center"
            >
              Contact Us
            </Link>
            <a
              href="mailto:legal@lingento.com"
              className="border border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-indigo-600 transition-colors text-center"
            >
              Email Legal Team
            </a>
          </div>
        </motion.div>

        {/* Scroll to Top */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex justify-center mt-12"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
          >
            Back to Top ↑
          </button>
        </motion.div>
      </div>
    </div>
  );
}
