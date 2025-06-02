'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const lastUpdated = 'December 15, 2024';

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include:
      
      • Personal information (name, email address, profile information)
      • Learning progress and performance data
      • Communication preferences
      • Device information and usage analytics
      • Cookies and similar tracking technologies`
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      content: `We use the information we collect to:
      
      • Provide, maintain, and improve our language learning services
      • Personalize your learning experience and track progress
      • Send you educational content, updates, and promotional materials
      • Respond to your comments, questions, and customer service requests
      • Monitor and analyze usage patterns to improve our platform
      • Detect, prevent, and address technical issues and security threats`
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing and Disclosure',
      content: `We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
      
      • With service providers who assist us in operating our platform
      • To comply with legal obligations or respond to lawful requests
      • To protect our rights, property, or safety, or that of our users
      • In connection with a merger, acquisition, or sale of assets
      • With your explicit consent for specific purposes`
    },
    {
      id: 'data-security',
      title: 'Data Security',
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
      
      • Encryption of data in transit and at rest
      • Regular security assessments and updates
      • Limited access to personal information on a need-to-know basis
      • Secure authentication and authorization protocols
      • Regular backup and disaster recovery procedures`
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      content: `We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Specifically:
      
      • Account information: Retained while your account is active
      • Learning progress data: Retained to track your educational journey
      • Communication records: Retained for customer service purposes
      • Usage analytics: Anonymized and retained for platform improvement
      • You can request deletion of your data at any time`
    },
    {
      id: 'your-rights',
      title: 'Your Rights and Choices',
      content: `You have several rights regarding your personal information:
      
      • Access: Request a copy of the personal information we hold about you
      • Correction: Update or correct inaccurate information
      • Deletion: Request deletion of your personal information
      • Portability: Request a copy of your data in a portable format
      • Restriction: Request that we limit processing of your information
      • Objection: Object to processing based on legitimate interests
      • Withdraw consent: Withdraw consent where processing is based on consent`
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking Technologies',
      content: `We use cookies and similar technologies to enhance your experience:
      
      • Essential cookies: Required for basic site functionality
      • Performance cookies: Help us understand how you use our site
      • Functionality cookies: Remember your preferences and settings
      • Marketing cookies: Used to deliver relevant advertisements
      
      You can control cookie settings through your browser preferences.`
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      content: `Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place:
      
      • Adequacy decisions by relevant authorities
      • Standard contractual clauses approved by data protection authorities
      • Binding corporate rules for intra-group transfers
      • Certified privacy frameworks`
    },
    {
      id: 'children-privacy',
      title: "Children's Privacy",
      content: `Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete such information.`
    },
    {
      id: 'changes',
      title: 'Changes to This Policy',
      content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by:
      
      • Posting the updated policy on our website
      • Sending you an email notification
      • Displaying a prominent notice on our platform
      
      Your continued use of our services after such modifications constitutes acceptance of the updated policy.`
    },
    {
      id: 'contact',
      title: 'Contact Information',
      content: `If you have any questions about this Privacy Policy or our data practices, please contact us:
      
      • Email: privacy@lingento.com
      • Address: 123 Learning Street, Education City, EC 12345
      • Phone: +1 (555) 123-4567
      • Data Protection Officer: dpo@lingento.com
      
      We will respond to your inquiry within 30 days.`
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
              Privacy Policy
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
            Our Commitment to Your Privacy
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            At Lingento, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
            language learning platform and services.
          </p>
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

        {/* Policy Sections */}
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
                      <ul className="list-none space-y-2">
                        {paragraph.split('\n').filter(line => line.trim()).map((item, iIndex) => (
                          <li key={iIndex} className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {item.trim().startsWith('•') ? (
                              <span className="flex items-start gap-3">
                                <span className="text-indigo-500 mt-1">•</span>
                                <span>{item.trim().substring(1).trim()}</span>
                              </span>
                            ) : (
                              item.trim()
                            )}
                          </li>
                        ))}
                      </ul>
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

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white mt-12"
        >
          <h2 className="text-2xl font-bold mb-4">
            Questions About This Policy?
          </h2>
          <p className="text-indigo-100 mb-6">
            If you have any questions or concerns about our Privacy Policy or data practices, 
            we're here to help. Our privacy team is committed to addressing your inquiries promptly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors text-center"
            >
              Contact Us
            </Link>
            <a
              href="mailto:privacy@lingento.com"
              className="border border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-indigo-600 transition-colors text-center"
            >
              Email Privacy Team
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
