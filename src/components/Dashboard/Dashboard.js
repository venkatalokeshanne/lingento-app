'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import spacedRepetitionService from '../../services/spacedRepetitionService';
import { fetchVocabularyAsFlashcards } from '../../utils/firebaseUtils';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Modern dashboard components
const MetricCard = ({ title, value, subtitle, icon, color, trend, trendDirection, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      } ${
        color === 'blue' ? 'border-l-4 border-blue-500' : 
        color === 'green' ? 'border-l-4 border-green-500' : 
        color === 'purple' ? 'border-l-4 border-purple-500' : 
        color === 'orange' ? 'border-l-4 border-orange-500' : 
        color === 'red' ? 'border-l-4 border-red-500' :
        'border-l-4 border-gray-500'
      }`}
    >
      <div className="flex justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</h3>
          {subtitle && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}
          {trend && (
            <p className={`mt-2 flex items-center text-sm ${
              trendDirection === 'up' ? 'text-green-500' : 
              trendDirection === 'down' ? 'text-red-500' : 
              'text-blue-500'
            }`}>
              {trendDirection === 'up' ? (
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : trendDirection === 'down' ? (
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              ) : (
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {trend}
            </p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-full flex-shrink-0 ${
          color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' : 
          color === 'green' ? 'bg-green-100 dark:bg-green-900' : 
          color === 'purple' ? 'bg-purple-100 dark:bg-purple-900' : 
          color === 'orange' ? 'bg-orange-100 dark:bg-orange-900' : 
          color === 'red' ? 'bg-red-100 dark:bg-red-900' :
          'bg-gray-100 dark:bg-gray-700'
        }`}>
          <span className={`text-2xl ${
              color === 'blue' ? 'text-blue-600 dark:text-blue-400' : 
              color === 'green' ? 'text-green-600 dark:text-green-400' : 
              color === 'purple' ? 'text-purple-600 dark:text-purple-400' : 
              color === 'orange' ? 'text-orange-600 dark:text-orange-400' : 
              color === 'red' ? 'text-red-600 dark:text-red-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>
            {icon}
          </span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-transparent to-transparent">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '30%' }}
          transition={{ delay: 0.5, duration: 1 }}
          className={`h-full ${
            color === 'blue' ? 'bg-blue-500' : 
            color === 'green' ? 'bg-green-500' : 
            color === 'purple' ? 'bg-purple-500' : 
            color === 'orange' ? 'bg-orange-500' : 
            color === 'red' ? 'bg-red-500' :
            'bg-gray-500'
          }`} 
        />
      </div>
    </motion.div>
  );
};

const ProgressCircle = ({ percentage, size = 160, strokeWidth = 14, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative inline-flex" 
      style={{ width: size, height: size }}
    >
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-gray-200 dark:text-gray-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <text
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
          className="text-2xl font-bold dark:text-gray-200"
          fill="currentColor"
        >
          {Math.round(percentage)}%
        </text>
      </svg>
    </motion.div>
  );
};

const InspirationCard = () => {
  const quotes = [
    "Learning a language is a journey, not a destination.",
    "Every word you learn is a stepping stone to fluency.",
    "The best way to learn a language is one word at a time.",
    "Consistency beats intensity when learning languages.",
    "Today's effort is tomorrow's fluency.",
    "Small actions every day lead to big results over time.",
    "Learning a new word a day keeps language barriers away.",
    "The more you practice, the luckier you get with language."
  ];

  const randomIndex = Math.floor(Math.random() * quotes.length);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 p-8 shadow-lg"
    >
      <div className="absolute -right-8 -top-8">
        <svg width="160" height="160" viewBox="0 0 160 160" className="opacity-20">
          <circle cx="80" cy="80" r="80" fill="white" />
        </svg>
      </div>
      <div className="absolute -left-4 -bottom-4">
        <svg width="100" height="100" viewBox="0 0 100 100" className="opacity-20">
          <circle cx="50" cy="50" r="50" fill="white" />
        </svg>
      </div>
      <div className="relative z-10">
        <svg className="h-8 w-8 text-white opacity-80 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <p className="text-xl font-light text-white italic leading-relaxed">"{quotes[randomIndex]}"</p>
        <div className="mt-8 flex justify-end">
          <button className="flex items-center text-sm font-medium text-white hover:text-blue-100">
            <span className="mr-1">New inspiration</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const StreakDisplay = ({ streak, lastStudyDate }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const activeDays = Math.min(streak, 7);
  
  // Calculate which days should be shown as active based on current date and streak
  const getDayStatus = (dayIndex) => {
    if (streak === 0) return false;
    const daysSinceStart = Math.min(streak - 1, 6);
    const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Convert Sunday=0 to Sunday=6
    const startIndex = (todayIndex - daysSinceStart + 7) % 7;
    
    if (daysSinceStart === 6) {
      // Full week streak
      return true;
    } else {
      // Partial streak
      if (startIndex <= todayIndex) {
        return dayIndex >= startIndex && dayIndex <= todayIndex;
      } else {
        return dayIndex >= startIndex || dayIndex <= todayIndex;
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative rounded-xl bg-white dark:bg-gray-800 shadow-lg p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Study Streak</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Keep it going!</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-400">
            {streak}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-lg">
            {streak === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => {
          const isActive = getDayStatus(i);
          const isToday = i === (today.getDay() === 0 ? 6 : today.getDay() - 1);
          
          return (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 border-2 transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-br from-orange-400 to-amber-500 border-amber-400 shadow-lg' 
                  : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              } ${isToday ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : ''}`}>
                <span className={`text-xs font-medium ${
                  isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {day.slice(0, 1)}
                </span>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">{day}</span>
              {isActive && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="w-1 h-1 rounded-full bg-amber-500 mt-1"
                />
              )}
            </div>
          );
        })}
      </div>
      
      {streak > 0 && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
            🔥 {streak >= 7 ? 'Amazing! Week-long streak!' : 
                streak >= 3 ? 'Great momentum!' : 
                'Good start!'}
          </p>
        </div>
      )}
    </motion.div>
  );
};

const GoalProgressCard = ({ completed, total }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-xl bg-white dark:bg-gray-800 shadow-lg p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Daily Goal</h3>
          <p className="text-gray-500 dark:text-gray-400">Review {total} words today</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          percentage >= 100 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
        }`}>
          {percentage >= 100 ? 'Completed' : 'In Progress'}
        </span>
      </div>
      <div className="flex flex-col items-center">
        <ProgressCircle 
          percentage={percentage} 
          color={percentage >= 100 ? 'text-green-500 dark:text-green-400' : 'text-blue-500 dark:text-blue-400'} 
        />
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400 font-medium">
          {completed} / {total} words reviewed
        </p>
      </div>
    </motion.div>
  );
};

// Activity Timeline Component
const ActivityTimeline = ({ recentActivity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'review':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'add':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'master':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'streak':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
        );
      case 'perfect':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      default:
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getColorClasses = (type) => {
    switch (type) {
      case 'master':
      case 'perfect':
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400';
      case 'review':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400';
      case 'add':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400';
      case 'streak':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-xl bg-white dark:bg-gray-800 shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-4 max-h-64 overflow-y-auto">
        {recentActivity && recentActivity.length > 0 ? (
          recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getColorClasses(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
              </div>
              {activity.badge && (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-full">
                  {activity.badge}
                </span>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Start studying to see your progress here</p>
          </div>
        )}
      </div>
    </motion.div>  );
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { preferences } = useUserPreferences();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [goalCompleted, setGoalCompleted] = useState(0);
  const [studyStreak, setStudyStreak] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState({ wordsAdded: 0, reviewsCompleted: 0 });

  const dailyGoal = preferences?.dailyGoal || 20;

  // Generate realistic recent activity based on actual user data
  const generateRecentActivity = (cards, stats) => {
    const activities = [];
    const now = new Date();
    
    if (stats && stats.total > 0) {
      // Check for recently reviewed cards
      const recentlyReviewed = cards?.filter(card => {
        if (!card.lastReviewDate) return false;
        const reviewDate = card.lastReviewDate.seconds 
          ? new Date(card.lastReviewDate.seconds * 1000)
          : new Date(card.lastReviewDate);
        const hoursDiff = (now - reviewDate) / (1000 * 60 * 60);
        return hoursDiff < 24;
      }) || [];

      if (recentlyReviewed.length > 0) {
        activities.push({
          type: 'review',
          action: `Reviewed ${recentlyReviewed.length} word${recentlyReviewed.length > 1 ? 's' : ''}`,
          time: recentlyReviewed.length > 5 ? 'Today' : 'A few hours ago',
          badge: recentlyReviewed.length >= 10 ? 'Productive!' : null
        });
      }

      // Check for newly mastered words
      const newlyMastered = cards?.filter(card => card.isMatured) || [];
      if (newlyMastered.length > 0) {
        const lastMastered = newlyMastered[newlyMastered.length - 1];
        activities.push({
          type: 'master',
          action: `Mastered "${lastMastered.word}"`,
          time: 'Yesterday',
          badge: newlyMastered.length >= 5 ? 'Expert!' : null
        });
      }

      // Check for recently added words
      const recentlyAdded = cards?.filter(card => {
        if (!card.createdAt) return false;
        const createDate = card.createdAt.seconds 
          ? new Date(card.createdAt.seconds * 1000)
          : new Date(card.createdAt);
        const daysDiff = (now - createDate) / (1000 * 60 * 60 * 24);
        return daysDiff < 2;
      }) || [];

      if (recentlyAdded.length > 0) {
        activities.push({
          type: 'add',
          action: `Added ${recentlyAdded.length} new word${recentlyAdded.length > 1 ? 's' : ''}`,
          time: recentlyAdded.length > 3 ? 'Yesterday' : '2 days ago'
        });
      }

      // Check for perfect sessions
      if (stats.retentionRate >= 90 && recentlyReviewed.length >= 5) {
        activities.push({
          type: 'perfect',
          action: 'Perfect review session!',
          time: 'Today',
          badge: 'Excellent!'
        });
      }
    }

    return activities.slice(0, 4); // Limit to recent 4 activities
  };

  // Calculate study streak from actual data
  const calculateStudyStreak = (cards) => {
    if (!cards || cards.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let currentDate = new Date(today);
    
    // Go backwards day by day to find consecutive study days
    for (let i = 0; i < 30; i++) { // Check last 30 days max
      const hasStudiedOnDate = cards.some(card => {
        if (!card.lastReviewDate) return false;
        const reviewDate = card.lastReviewDate.seconds 
          ? new Date(card.lastReviewDate.seconds * 1000)
          : new Date(card.lastReviewDate);
        reviewDate.setHours(0, 0, 0, 0);
        return reviewDate.getTime() === currentDate.getTime();
      });
      
      if (hasStudiedOnDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (i === 0 && !hasStudiedOnDate) {
        // No study today, check yesterday
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      } else {
        break;
      }
    }
    
    return streak;
  };

  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        try {
          const cards = await fetchVocabularyAsFlashcards(
            currentUser,
            setFlashcards,
            setLoading
          );
          
          if (cards && cards.length > 0) {
            // Calculate statistics
            const statsData = spacedRepetitionService.getStatistics(cards);
            setStats(statsData);
            
            // Calculate today's reviewed cards
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const reviewedToday = cards.filter(card => {
              if (!card.lastReviewDate) return false;
              
              let reviewDate;
              if (card.lastReviewDate.seconds) {
                reviewDate = new Date(card.lastReviewDate.seconds * 1000);
              } else {
                reviewDate = new Date(card.lastReviewDate);
              }
              
              reviewDate.setHours(0, 0, 0, 0);
              return reviewDate.getTime() === today.getTime();
            }).length;
            
            setGoalCompleted(reviewedToday);
            
            // Calculate study streak
            const streakCount = calculateStudyStreak(cards);
            setStudyStreak(streakCount);
            
            // Generate recent activity
            const activities = generateRecentActivity(cards, statsData);
            setRecentActivity(activities);
            
            // Calculate weekly trends
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            
            const recentWords = cards.filter(card => {
              if (!card.createdAt) return false;
              const createDate = card.createdAt.seconds 
                ? new Date(card.createdAt.seconds * 1000)
                : new Date(card.createdAt);
              return createDate > weekAgo;
            });
            
            const recentReviews = cards.filter(card => {
              if (!card.lastReviewDate) return false;
              const reviewDate = card.lastReviewDate.seconds 
                ? new Date(card.lastReviewDate.seconds * 1000)
                : new Date(card.lastReviewDate);
              return reviewDate > weekAgo;
            });
            
            setWeeklyTrend({
              wordsAdded: recentWords.length,
              reviewsCompleted: recentReviews.length
            });
          }
        } catch (error) {
          console.error("Error loading flashcards data:", error);
        }
      }
      setLoading(false);
    };

    loadData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your progress...</p>
        </div>
      </div>    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">Welcome to Lingento!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Start your {preferences?.language || 'language'} learning journey by adding your first vocabulary words. 
            Our spaced repetition system will help you master them efficiently.
          </p>
          <div className="space-y-4">
            <Link href="/vocabulary" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition duration-200 shadow-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First Words
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Goal: {dailyGoal} words per day • Level: {preferences?.level || 'beginner'}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const retentionPercentage = Math.round(stats.retentionRate || 0);
  const masteredPercentage = stats.total > 0 ? Math.round((stats.matured / stats.total) * 100) : 0;
  const progressTowardsGoal = Math.round((goalCompleted / dailyGoal) * 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Learning Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {preferences?.language && (
                  <span className="capitalize">{preferences.language}</span>
                )} language • {preferences?.level || 'Beginner'} level
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Today's Goal</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {goalCompleted} / {dailyGoal}
                </p>
              </div>
              <div className="w-12 h-12 relative">
                <ProgressCircle 
                  percentage={progressTowardsGoal} 
                  size={48} 
                  strokeWidth={4}
                  color="text-indigo-500 dark:text-indigo-400"
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Top Row - Goals and Streak */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GoalProgressCard completed={goalCompleted} total={dailyGoal} />
          <StreakDisplay streak={studyStreak} />
        </div>
        
        {/* Inspiration Card */}
        <div className="mb-8">
          <InspirationCard />
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Total Vocabulary" 
            value={stats.total}
            subtitle="words in your collection"
            icon="📚"
            color="blue"
            trend={weeklyTrend.wordsAdded > 0 ? `+${weeklyTrend.wordsAdded} this week` : "Add more words"}
            trendDirection={weeklyTrend.wordsAdded > 0 ? "up" : "neutral"}
            onClick={() => window.location.href = '/vocabulary'}
          />
          <MetricCard 
            title="Words Due Today" 
            value={stats.dueToday}
            subtitle="ready for review"
            icon="📅"
            color={stats.dueToday > dailyGoal ? "red" : stats.dueToday > dailyGoal * 0.7 ? "orange" : "green"}
            trend={
              stats.dueToday === 0 ? "All caught up!" :
              stats.dueToday > dailyGoal ? "High priority" : 
              "Manageable workload"
            }
            trendDirection={
              stats.dueToday === 0 ? "neutral" :
              stats.dueToday > dailyGoal ? "up" : "neutral"
            }
            onClick={() => window.location.href = '/flashcards'}
          />
          <MetricCard 
            title="Mastered Words" 
            value={stats.matured}
            subtitle={`${masteredPercentage}% of total`}
            icon="🎯"
            color="green"
            trend={stats.matured > 0 ? "Great progress!" : "Keep practicing"}
            trendDirection={stats.matured > 0 ? "up" : "neutral"}
          />
          <MetricCard 
            title="Success Rate" 
            value={`${retentionPercentage}%`}
            subtitle="memory retention"
            icon="🧠"
            color="purple"
            trend={
              retentionPercentage >= 90 ? "Excellent!" : 
              retentionPercentage >= 75 ? "Good work!" : 
              "Keep practicing"
            }
            trendDirection={
              retentionPercentage >= 75 ? "up" : 
              retentionPercentage >= 60 ? "neutral" : "down"
            }
          />
        </div>
        
        {/* Bottom Row - Progress and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Mastery Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-xl bg-white dark:bg-gray-800 shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Mastery Progress</h3>
            <div className="flex flex-col items-center">
              <ProgressCircle 
                percentage={masteredPercentage} 
                color="text-green-500 dark:text-green-400"
                size={180}
                strokeWidth={16}
              />
              <div className="mt-6 text-center">
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.matured} / {stats.total}</p>
                <p className="text-gray-600 dark:text-gray-400">words mastered</p>
                {masteredPercentage >= 50 && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    🎉 You're doing amazing!
                  </p>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Activity Timeline */}
          <ActivityTimeline recentActivity={recentActivity} />
        </div>        
        {/* Learning Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-xl bg-white dark:bg-gray-800 shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Learning Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.new}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">New Words</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ready to learn</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.learning}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Learning</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">In progress</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.review}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">For Review</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Needs practice</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.matured}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Mastered</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Well learned</p>
            </div>
          </div>
        </motion.div>
        
        {/* Weekly Performance Summary */}
        {weeklyTrend.wordsAdded > 0 || weeklyTrend.reviewsCompleted > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-xl bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">This Week's Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{weeklyTrend.wordsAdded}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">New words added</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{weeklyTrend.reviewsCompleted}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reviews completed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round((weeklyTrend.reviewsCompleted / 7) * 10) / 10}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Daily average</p>
              </div>
            </div>
          </motion.div>
        ) : null}
        
        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link href="/flashcards" className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition duration-200 shadow-lg transform hover:scale-105">
            <svg className="w-5 h-5 mr-3 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="font-semibold">Practice Flashcards</span>
            {stats.dueToday > 0 && (
              <span className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">
                {stats.dueToday} due
              </span>
            )}
          </Link>
          <Link href="/vocabulary" className="group inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 shadow-lg transform hover:scale-105">
            <svg className="w-5 h-5 mr-3 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-semibold">Add New Words</span>
          </Link>
          <Link href="/reading-writing" className="group inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 shadow-lg transform hover:scale-105">
            <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="font-semibold">Reading & Writing</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;