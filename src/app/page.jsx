'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import SocialMetaTags from "@/components/SocialMetaTags";

export default function Home() {
  const { currentUser } = useAuth();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);  const featuredWords = [
    { word: "happiness", translation: "bonheur", language: "French", pronunciation: "/bɔ.nœʁ/" },
    { word: "freedom", translation: "libertad", language: "Spanish", pronunciation: "/li.βeɾ.ˈtað/" },
    { word: "love", translation: "Liebe", language: "German", pronunciation: "/ˈliːbə/" },
    { word: "wisdom", translation: "saggezza", language: "Italian", pronunciation: "/sadˈdʒettsa/" },
    { word: "peace", translation: "平和", language: "Japanese", pronunciation: "/heiwa/" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % featuredWords.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [featuredWords.length]);
    return (
    <>
      <SocialMetaTags 
        title="Lingento | Learn Any Language Effectively with Smart Flashcards"
        description="Master vocabulary in multiple languages with spaced repetition. Interactive flashcards, personalized learning paths, and AI-powered features to accelerate your language learning journey."
        image="/og-image.svg"
        url="https://lingentoo.com"
      />
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Lingento",
            "description": "Master vocabulary in multiple languages with our AI-powered spaced repetition system. Interactive flashcards, personalized learning paths, and proven techniques.",
            "url": "https://lingentoo.com",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "2500",
              "bestRating": "5",
              "worstRating": "1"
            },
            "author": {
              "@type": "Organization",
              "name": "Lingento Team",
              "url": "https://lingentoo.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Lingento",
              "logo": {
                "@type": "ImageObject",
                "url": "https://lingentoo.com/icons/icon-512x512.png",
                "width": 512,
                "height": 512
              }
            },
            "featureList": [
              "AI-powered spaced repetition",
              "Interactive flashcards",
              "Personalized learning paths",
              "Progress tracking",
              "Offline learning capability",
              "Multi-device synchronization"
            ]
          })
        }}
      />
      
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-6 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-medium">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                AI-Powered Spaced Repetition
              </div>              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Master Any Language
                <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Naturally
                </span>
              </h1>
            </div>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              Learn vocabulary in any language with our scientifically-proven spaced repetition system. 
              <span className="font-semibold text-indigo-600 dark:text-indigo-400"> Just 5 minutes a day.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href={currentUser ? "/dashboard" : "/register"} className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-semibold text-lg transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                {currentUser ? "Continue Learning" : "Start Learning Free"}
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
              <a href="#demo" className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-2xl font-semibold text-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 text-center shadow-lg hover:shadow-xl">
                Watch Demo
              </a>
            </div>
            
            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[
                    { bg: "bg-gradient-to-br from-pink-400 to-red-400" },
                    { bg: "bg-gradient-to-br from-yellow-400 to-orange-400" },
                    { bg: "bg-gradient-to-br from-green-400 to-blue-400" },
                    { bg: "bg-gradient-to-br from-purple-400 to-indigo-400" },
                    { bg: "bg-gradient-to-br from-indigo-400 to-purple-400" }
                  ].map((avatar, i) => (
                    <div key={i} className={`w-10 h-10 ${avatar.bg} rounded-full border-3 border-white dark:border-gray-800 flex items-center justify-center text-white font-bold text-sm`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-gray-900 dark:text-white font-bold">2,500+ learners</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">4.9/5</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  No credit card
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Free forever
                </div>
              </div>
            </div>
          </div>
          
          {/* Interactive Flashcard Demo */}
          <div className="flex-1 relative max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl transform rotate-6 opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl transform -rotate-3 opacity-20"></div>
            
            <div className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
              {/* Demo Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Flashcard Demo</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              
              {/* Word Card */}
              <div className={`bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-2xl mb-6 transition-all duration-500 ${isAnimating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}>                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      {featuredWords[currentWordIndex].word}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {featuredWords[currentWordIndex].language}
                    </p>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                  <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">
                    {featuredWords[currentWordIndex].translation}
                  </p>
                </div>
              </div>
              
              {/* Progress indicators */}
              <div className="flex justify-center gap-2 mb-6">
                {featuredWords.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentWordIndex
                        ? 'bg-indigo-500 w-6'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              
              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button className="flex items-center justify-center gap-2 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                  <span className="text-sm font-medium">Hard</span>
                </button>
                <button className="flex items-center justify-center gap-2 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-xl hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors">
                  <span className="text-sm font-medium">Good</span>
                </button>
                <button className="flex items-center justify-center gap-2 p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                  <span className="text-sm font-medium">Easy</span>
                </button>
              </div>
              
              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">127</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Words learned</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">7</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Day streak</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">94%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-6 sm:px-8 lg:px-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">2,500+</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Learners</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">50k+</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Words Practiced</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">94%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">4.9</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">App Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
              Why Choose
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Lingento?
              </span>
            </h2>            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our scientifically-backed approach makes learning vocabulary in any language faster and more effective than traditional methods.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Spaced Repetition */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Smart Spaced Repetition</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our AI algorithm tracks your memory curve and shows words at the optimal moment for maximum retention.
                </p>
                <div className="mt-4 flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Feature 2 - Native Audio */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.774L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.797-3.774a1 1 0 011.617.774zM15 8a3 3 0 110 6V8z" clipRule="evenodd"/>
                    <path d="M17.5 6.205a5 5 0 110 7.59"/>
                  </svg>
                </div>                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Native Pronunciation</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Listen to authentic pronunciation from native speakers to perfect your accent and comprehension in any language.
                </p>
                <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                  <span>Hear samples</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Feature 3 - Progress Tracking */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Detailed Analytics</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Track your learning progress with detailed statistics, streak counters, and personalized insights.
                </p>
                <div className="mt-4 flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                  <span>View dashboard</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature 4 - Adaptive Learning */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Adaptive Learning</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  The AI adapts to your learning style and pace, focusing on words you find challenging while maintaining ones you know.
                </p>
                <div className="mt-4 flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium">
                  <span>See how</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature 5 - 5 Minutes Daily */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Just 5 Minutes Daily</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Short, focused sessions fit into any schedule. Consistency beats intensity when building long-term memory.
                </p>
                <div className="mt-4 flex items-center text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                  <span>Start habit</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature 6 - Offline Support */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-green-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Learn Anywhere</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Download lessons for offline study. Practice during commutes, flights, or anywhere without internet.
                </p>
                <div className="mt-4 flex items-center text-teal-600 dark:text-teal-400 text-sm font-medium">
                  <span>Go offline</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="demo" className="py-20 px-6 sm:px-8 lg:px-16 bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
              How It
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Three simple steps to master vocabulary in any language using proven cognitive science principles.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                </div>                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Start Your Journey</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  Jump right into learning vocabulary in your target language. Our smart algorithm adapts to your progress and shows you new words at the perfect pace.
                </p>
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <span className="text-sm font-medium">Ready in seconds</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
              
              {/* Connection line */}
              <div className="hidden lg:block absolute top-10 -right-6 w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Daily Practice</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                Spend just 5 minutes daily reviewing flashcards. Our algorithm shows you words exactly when you need to review them.
              </p>
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <span className="text-sm font-medium">5 min/day</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
              </div>
              
              {/* Connection line */}
              <div className="hidden lg:block absolute top-10 -right-6 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            </div>
          </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Track Progress</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  Watch your vocabulary grow with detailed analytics. See your learning streaks, accuracy rates, and mastery levels.
                </p>
                <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
                  <span className="text-sm font-medium">Real-time stats</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Demo Video Placeholder */}
          <div className="mt-16 text-center">
            <div className="relative max-w-4xl mx-auto">
              <div className="aspect-video bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-center h-full">
                  <button className="group flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-110">
                    <svg className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                  </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="text-xl font-bold mb-2">See Lingento in Action</h4>
                  <p className="text-white/80">2 minute demo showing how spaced repetition works</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-8 sm:px-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Features designed for optimal learning
            </h2>              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our method is backed by decades of cognitive science research to maximize your vocabulary retention in any language.
              </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 transition-transform hover:transform hover:scale-105">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-indigo-600 dark:text-indigo-400">
                  <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Spaced Repetition</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our intelligent algorithm determines the optimal time to review each word, maximizing your long-term memory.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 transition-transform hover:transform hover:scale-105">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-indigo-600 dark:text-indigo-400">
                  <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                  <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                </svg>
              </div>              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Professional Audio</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Listen to the correct pronunciation of each word by native speakers to improve your accent in any language.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 transition-transform hover:transform hover:scale-105">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-indigo-600 dark:text-indigo-400">
                  <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Detailed Statistics</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track your progress with detailed graphs showing your learning curve and strengths.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
              What Our
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Learners Say
              </span>
            </h2>            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join thousands of successful language learners who transformed their vocabulary with Lingento.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-red-400 flex items-center justify-center text-white font-bold mr-4">
                    ML
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Marie Leclerc</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Student • Paris</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>                  <blockquote className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    "After 3 months with Lingento, I can hold conversations with confidence. The spaced repetition method is incredibly effective! I went from knowing 50 words to over 800."
                  </blockquote>
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        847 words learned
                      </span>
                      <span>•</span>
                      <span>92 day streak</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center text-white font-bold mr-4">
                    TB
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Thomas Blanc</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Business Executive • Lyon</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>                  <blockquote className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    "I only had 10 minutes a day to learn before a business trip. Lingento made every minute count and I was able to navigate with confidence!"
                  </blockquote>
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        432 words learned
                      </span>
                      <span>•</span>
                      <span>45 day streak</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center text-white font-bold mr-4">
                    SK
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Sophie Kovač</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Retiree • Bordeaux</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    "At 65, I thought it was too late to learn a new language. Lingento proved me wrong! The interface is intuitive and the progression keeps me motivated every day."
                  </blockquote>
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        623 words learned
                      </span>
                      <span>•</span>
                      <span>156 day streak</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">99% Uptime</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Reliable learning</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">GDPR Compliant</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Data protected</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">4.9/5 Rating</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">App Store</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">24/7 Support</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Always here</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl overflow-hidden shadow-2xl">
            {/* Animated background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('/api/placeholder/1200/600')] opacity-10"></div>
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full translate-x-30 translate-y-30 animate-pulse delay-1000"></div>
            </div>
            
            <div className="relative flex flex-col lg:flex-row items-center">
              <div className="flex-1 p-12 lg:p-16 text-center lg:text-left">                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                  {currentUser ? (
                    <>Continue Your<br />Learning Journey</>
                  ) : (
                    <>Start Learning<br />Today</>
                  )}
                </h2>
                <p className="text-xl text-indigo-100 mb-8 leading-relaxed max-w-lg">
                  {currentUser 
                    ? 'Your progress is waiting for you. Jump back into your flashcards and continue building your vocabulary.'
                    : 'Join thousands of successful learners. Start with our free plan and upgrade when you\'re ready.'}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link 
                    href={currentUser ? "/flashcards" : "/register"} 
                    className="group px-8 py-4 bg-white hover:bg-gray-50 text-indigo-600 rounded-2xl font-semibold text-lg transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {currentUser ? 'Continue Learning' : 'Start Free Trial'}
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                  
                  {!currentUser && (
                    <Link 
                      href="/login" 
                      className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 rounded-2xl font-semibold text-lg transition-all duration-300 text-center backdrop-blur-sm"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
                
                <div className="flex items-center justify-center lg:justify-start gap-6 text-indigo-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm">Free forever plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm">No credit card required</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-12 lg:p-16 relative">
                <div className="relative max-w-sm mx-auto">
                  {/* Phone mockup */}
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"></div>
                          <div className="bg-green-100 dark:bg-green-900/30 py-1 px-3 rounded-full">
                            <span className="text-xs text-green-800 dark:text-green-400 font-medium">+15 streak</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full w-full"></div>
                          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full w-4/5"></div>
                          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full w-3/5"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2">
                          <div className="h-8 bg-red-100 dark:bg-red-900/30 rounded-lg"></div>
                          <div className="h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg"></div>
                          <div className="h-8 bg-green-100 dark:bg-green-900/30 rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center animate-bounce delay-500">
                    <span className="text-2xl">🚀</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-16 px-6 sm:px-8 lg:px-16 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 pb-12 mb-12 border-b border-gray-200 dark:border-gray-700">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Lingento
                </h2>
              </div>              <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
                Master vocabulary in any language with our scientifically-proven spaced repetition system. 
                Learn effectively, practice consistently, succeed confidently.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a></li>
                <li><a href="#demo" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How it Works</a></li>
                <li><a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Testimonials</a></li>                <li><Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</Link></li>
                <li><Link href="/faq" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            {/* Support */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Support</h3>
              <ul className="space-y-3">                <li><Link href="/help" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Us</Link></li>
                <li><Link href="/community" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Community</Link></li>
                <li><Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Lingento. All rights reserved. Made with ❤️ for language learners worldwide.
            </p>              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>Choose your language:</span>
                  <button className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">🇺🇸 English</button>                  <button className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">🇫🇷 Français</button>
                  <button className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">🇪🇸 Español</button>
                  <button className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">🇩🇪 Deutsch</button>
                </div>
              </div>
          </div>        </div>
      </footer>
    </div>
    </>
  );
}