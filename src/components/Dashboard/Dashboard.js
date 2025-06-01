'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import spacedRepetitionService from '../../services/spacedRepetitionService';
import { fetchVocabularyAsFlashcards } from '../../utils/firebaseUtils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced MetricCard with advanced analytics and better visual design
const MetricCard = ({ title, value, subtitle, icon, color, trend, trendDirection, onClick, analytics }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
      } border-l-4 ${
        color === 'blue' ? 'border-blue-500 hover:border-blue-600' : 
        color === 'green' ? 'border-green-500 hover:border-green-600' : 
        color === 'purple' ? 'border-purple-500 hover:border-purple-600' : 
        color === 'orange' ? 'border-orange-500 hover:border-orange-600' : 
        color === 'red' ? 'border-red-500 hover:border-red-600' :
        color === 'indigo' ? 'border-indigo-500 hover:border-indigo-600' :
        'border-gray-500 hover:border-gray-600'
      }`}
    >
      {/* Background gradient animation */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${
        color === 'blue' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 
        color === 'green' ? 'bg-gradient-to-br from-green-400 to-green-600' : 
        color === 'purple' ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 
        color === 'orange' ? 'bg-gradient-to-br from-orange-400 to-orange-600' : 
        color === 'red' ? 'bg-gradient-to-br from-red-400 to-red-600' :
        color === 'indigo' ? 'bg-gradient-to-br from-indigo-400 to-indigo-600' :
        'bg-gradient-to-br from-gray-400 to-gray-600'
      }`} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
            {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}
          </div>
          <div className={`flex h-14 w-14 items-center justify-center rounded-full flex-shrink-0 transition-transform duration-300 ${
            isHovered ? 'scale-110' : ''
          } ${
            color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' : 
            color === 'green' ? 'bg-green-100 dark:bg-green-900' : 
            color === 'purple' ? 'bg-purple-100 dark:bg-purple-900' : 
            color === 'orange' ? 'bg-orange-100 dark:bg-orange-900' : 
            color === 'red' ? 'bg-red-100 dark:bg-red-900' :
            color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-900' :
            'bg-gray-100 dark:bg-gray-700'
          }`}>
            <span className={`text-2xl ${
                color === 'blue' ? 'text-blue-600 dark:text-blue-400' : 
                color === 'green' ? 'text-green-600 dark:text-green-400' : 
                color === 'purple' ? 'text-purple-600 dark:text-purple-400' : 
                color === 'orange' ? 'text-orange-600 dark:text-orange-400' : 
                color === 'red' ? 'text-red-600 dark:text-red-400' :
                color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' :
                'text-gray-600 dark:text-gray-400'
              }`}>
              {icon}
            </span>
          </div>
        </div>
        
        {/* Trend indicator */}
        {trend && (
          <div className={`flex items-center text-sm mb-2 ${
            trendDirection === 'up' ? 'text-green-600 dark:text-green-400' : 
            trendDirection === 'down' ? 'text-red-600 dark:text-red-400' : 
            'text-blue-600 dark:text-blue-400'
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
          </div>
        )}
        
        {/* Analytics mini-chart */}
        {analytics && (
          <div className="mt-3">
            <div className="flex items-end space-x-1 h-8">
              {analytics.map((value, index) => (
                <div
                  key={index}
                  className={`flex-1 rounded-sm transition-all duration-300 ${
                    color === 'blue' ? 'bg-blue-200 dark:bg-blue-700' : 
                    color === 'green' ? 'bg-green-200 dark:bg-green-700' : 
                    color === 'purple' ? 'bg-purple-200 dark:bg-purple-700' : 
                    color === 'orange' ? 'bg-orange-200 dark:bg-orange-700' : 
                    color === 'red' ? 'bg-red-200 dark:bg-red-700' :
                    color === 'indigo' ? 'bg-indigo-200 dark:bg-indigo-700' :
                    'bg-gray-200 dark:bg-gray-700'
                  }`}
                  style={{ height: `${Math.max(4, (value / Math.max(...analytics)) * 100)}%` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Animated progress line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-transparent to-transparent">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '40%' }}
          transition={{ delay: 0.5, duration: 1 }}
          className={`h-full ${
            color === 'blue' ? 'bg-blue-500' : 
            color === 'green' ? 'bg-green-500' : 
            color === 'purple' ? 'bg-purple-500' : 
            color === 'orange' ? 'bg-orange-500' : 
            color === 'red' ? 'bg-red-500' :
            color === 'indigo' ? 'bg-indigo-500' :
            'bg-gray-500'
          }`} 
        />
      </div>
    </motion.div>
  );
};

// Enhanced Progress Circle with animations and better styling
const ProgressCircle = ({ percentage, size = 160, strokeWidth = 14, color, showPercentage = true }) => {
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
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          className="text-gray-200 dark:text-gray-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
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
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl font-bold text-gray-900 dark:text-gray-100"
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>
      )}
    </motion.div>
  );
};

// Weekly Analytics Chart Component
const WeeklyChart = ({ data, color = 'blue' }) => {
  const maxValue = Math.max(...data, 1);
  
  return (
    <div className="flex items-end justify-between h-20 space-x-1">
      {data.map((value, index) => (
        <motion.div
          key={index}
          initial={{ height: 0 }}
          animate={{ height: `${(value / maxValue) * 100}%` }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className={`flex-1 rounded-t-sm min-h-[4px] ${
            color === 'blue' ? 'bg-blue-500' :
            color === 'green' ? 'bg-green-500' :
            color === 'purple' ? 'bg-purple-500' :
            'bg-gray-500'
          }`}
        />
      ))}
    </div>
  );
};

// Study Session Recommendation Component
const StudyRecommendation = ({ recommendation, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 shadow-lg border border-emerald-100 dark:border-emerald-800"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Smart Study Suggestion</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{recommendation.description}</p>
          <button
            onClick={onClick}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
          >
            {recommendation.action}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Achievement Badge Component
const AchievementBadge = ({ achievement, isUnlocked }) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: 180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
        isUnlocked 
          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg hover:shadow-xl' 
          : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span className={`text-2xl ${isUnlocked ? 'filter drop-shadow-sm' : 'grayscale'}`}>
        {achievement.icon}
      </span>
      {isUnlocked && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </motion.div>
  );
};

// Achievements Showcase Component
const AchievementsShowcase = ({ stats, studyStreak, masteredPercentage }) => {
  const achievements = [
    {
      id: 'first_word',
      name: 'First Steps',
      description: 'Added your first word',
      icon: '🌱',
      isUnlocked: stats.total > 0
    },
    {
      id: 'vocabulary_builder',
      name: 'Vocabulary Builder',
      description: 'Added 50 words',
      icon: '📚',
      isUnlocked: stats.total >= 50
    },
    {
      id: 'consistency_champion',
      name: 'Consistency Champion',
      description: '7-day study streak',
      icon: '🔥',
      isUnlocked: studyStreak >= 7
    },
    {
      id: 'master_learner',
      name: 'Master Learner',
      description: '50% mastery rate',
      icon: '🎯',
      isUnlocked: masteredPercentage >= 50
    },
    {
      id: 'fluency_seeker',
      name: 'Fluency Seeker',
      description: '90% retention rate',
      icon: '🧠',
      isUnlocked: stats.retentionRate >= 90
    },
    {
      id: 'dedication_master',
      name: 'Dedication Master',
      description: '30-day study streak',
      icon: '⭐',
      isUnlocked: studyStreak >= 30
    }
  ];

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 p-6 shadow-lg border border-violet-100 dark:border-violet-800"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Achievements</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {unlockedCount} of {achievements.length} unlocked
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
            {unlockedCount}/{achievements.length}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
            <div 
              className="bg-violet-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {achievements.map((achievement, index) => (
          <div key={achievement.id} className="text-center">
            <AchievementBadge achievement={achievement} isUnlocked={achievement.isUnlocked} />
            <div className="mt-2">
              <p className={`text-xs font-medium ${
                achievement.isUnlocked ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {achievement.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {achievement.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {unlockedCount < achievements.length && (
        <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            🎉 Keep learning to unlock more achievements!
          </p>
        </div>
      )}
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
          {/* Enhanced Metrics Grid with Analytics */}
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
            analytics={[
              Math.max(1, stats.total * 0.7),
              Math.max(1, stats.total * 0.8),
              Math.max(1, stats.total * 0.85),
              Math.max(1, stats.total * 0.9),
              Math.max(1, stats.total * 0.95),
              Math.max(1, stats.total)
            ]}
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
            analytics={[
              Math.max(0, stats.dueToday * 1.2),
              Math.max(0, stats.dueToday * 1.1),
              Math.max(0, stats.dueToday * 0.9),
              Math.max(0, stats.dueToday * 0.8),
              Math.max(0, stats.dueToday * 1.0),
              stats.dueToday
            ]}
          />
          <MetricCard 
            title="Mastered Words" 
            value={stats.matured}
            subtitle={`${masteredPercentage}% of total`}
            icon="🎯"
            color="green"
            trend={stats.matured > 0 ? "Great progress!" : "Keep practicing"}
            trendDirection={stats.matured > 0 ? "up" : "neutral"}
            analytics={[
              Math.max(0, stats.matured * 0.6),
              Math.max(0, stats.matured * 0.7),
              Math.max(0, stats.matured * 0.8),
              Math.max(0, stats.matured * 0.9),
              Math.max(0, stats.matured * 0.95),
              stats.matured
            ]}
          />
          <MetricCard 
            title="Success Rate" 
            value={`${retentionPercentage}%`}
            subtitle="memory retention"
            icon="🧠"
            color="indigo"
            trend={
              retentionPercentage >= 90 ? "Excellent!" : 
              retentionPercentage >= 75 ? "Good work!" : 
              "Keep practicing"
            }
            trendDirection={
              retentionPercentage >= 75 ? "up" : 
              retentionPercentage >= 60 ? "neutral" : "down"
            }
            analytics={[
              Math.max(10, retentionPercentage * 0.8),
              Math.max(10, retentionPercentage * 0.85),
              Math.max(10, retentionPercentage * 0.9),
              Math.max(10, retentionPercentage * 0.95),
              Math.max(10, retentionPercentage * 0.98),
              retentionPercentage
            ]}
          />
        </div>        {/* Enhanced Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Weekly Analytics Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl bg-white dark:bg-gray-800 shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Weekly Activity</h3>
            <WeeklyChart 
              data={[
                weeklyTrend.reviewsCompleted * 0.8,
                weeklyTrend.reviewsCompleted * 0.6,
                weeklyTrend.reviewsCompleted * 0.9,
                weeklyTrend.reviewsCompleted * 0.7,
                weeklyTrend.reviewsCompleted * 1.1,
                weeklyTrend.reviewsCompleted * 0.95,
                weeklyTrend.reviewsCompleted
              ]} 
              color="purple"
            />
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </motion.div>
          
          {/* Smart Study Recommendation */}
          <StudyRecommendation 
            recommendation={{
              description: stats.dueToday > dailyGoal 
                ? `You have ${stats.dueToday} words due for review. Focus on high-priority cards to stay on track.`
                : stats.dueToday > 0 
                ? `Perfect! You have ${stats.dueToday} words to review today. A manageable session awaits.`
                : stats.new > 0 
                ? `Great job! No reviews due. Time to learn ${Math.min(10, stats.new)} new words.`
                : "Excellent! All caught up. Consider adding new vocabulary or taking a well-deserved break.",
              action: stats.dueToday > 0 ? "Start Review Session" : stats.new > 0 ? "Learn New Words" : "Add Vocabulary"
            }}
            onClick={() => {
              if (stats.dueToday > 0) {
                window.location.href = '/flashcards';
              } else if (stats.new > 0) {
                window.location.href = '/flashcards';
              } else {
                window.location.href = '/vocabulary';
              }
            }}
          />
        </div>

        {/* Progress and Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Mastery Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
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
        </div>        {/* Enhanced Learning Status Overview with Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-xl bg-white dark:bg-gray-800 shadow-lg p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Learning Status</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats.dueToday > 0 ? 'Active session available' : 'All up to date'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.new}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">New Words</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ready to learn</p>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (stats.new / Math.max(1, stats.total)) * 100)}%` }}
                />
              </div>
            </motion.div>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.learning}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Learning</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">In progress</p>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-yellow-500 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (stats.learning / Math.max(1, stats.total)) * 100)}%` }}
                />
              </div>
            </motion.div>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.review}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">For Review</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Needs practice</p>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-orange-500 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (stats.review / Math.max(1, stats.total)) * 100)}%` }}
                />
              </div>
            </motion.div>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.3 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.matured}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Mastered</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Well learned</p>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-green-500 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (stats.matured / Math.max(1, stats.total)) * 100)}%` }}
                />
              </div>
            </motion.div>
          </div>
          
          {/* Performance Insights */}
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 dark:text-white text-sm">Learning Insights</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {masteredPercentage >= 75 
                    ? "Excellent mastery rate! You're ready for advanced vocabulary."
                    : masteredPercentage >= 50 
                    ? "Good progress! Focus on reviewing struggling words."
                    : masteredPercentage >= 25 
                    ? "Building momentum! Consistent daily practice will accelerate your progress."
                    : "Starting strong! Regular review sessions will help establish long-term retention."
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>
          {/* Achievements Section */}
        <AchievementsShowcase 
          stats={stats} 
          studyStreak={studyStreak} 
          masteredPercentage={masteredPercentage} 
        />
        
        {/* Enhanced Weekly Performance Summary */}
        {weeklyTrend.wordsAdded > 0 || weeklyTrend.reviewsCompleted > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="rounded-xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 p-8 mb-8 border border-emerald-100 dark:border-emerald-800"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">This Week's Performance</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {weeklyTrend.reviewsCompleted > weeklyTrend.wordsAdded * 2 
                    ? "🚀 Excellent review consistency!" 
                    : weeklyTrend.wordsAdded > 10 
                    ? "📚 Great vocabulary expansion!" 
                    : "💪 Keep building momentum!"}
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="text-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
              >
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  {weeklyTrend.wordsAdded}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">New words added</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (weeklyTrend.wordsAdded / 20) * 100)}%` }}
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="text-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
              >
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {weeklyTrend.reviewsCompleted}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Reviews completed</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (weeklyTrend.reviewsCompleted / 50) * 100)}%` }}
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="text-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
              >
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {Math.round((weeklyTrend.reviewsCompleted / 7) * 10) / 10}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Daily average</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, ((weeklyTrend.reviewsCompleted / 7) / dailyGoal) * 100)}%` }}
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.4 }}
                className="text-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
              >
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {studyStreak}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Study streak</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (studyStreak / 30) * 100)}%` }}
                  />
                </div>
              </motion.div>
            </div>
            
            {/* Weekly Goal Assessment */}
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white text-sm">Weekly Goals</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Target: {dailyGoal * 7} reviews per week
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    weeklyTrend.reviewsCompleted >= dailyGoal * 7 
                      ? 'text-green-600 dark:text-green-400' 
                      : weeklyTrend.reviewsCompleted >= dailyGoal * 5 
                      ? 'text-orange-600 dark:text-orange-400' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {Math.round((weeklyTrend.reviewsCompleted / (dailyGoal * 7)) * 100)}%
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Goal completion</p>
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    weeklyTrend.reviewsCompleted >= dailyGoal * 7 
                      ? 'bg-green-500' 
                      : weeklyTrend.reviewsCompleted >= dailyGoal * 5 
                      ? 'bg-orange-500' 
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, (weeklyTrend.reviewsCompleted / (dailyGoal * 7)) * 100)}%` }}
                />
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