'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { useTheme } from '@/context/ThemeContext';
import CurriculumGenerator from './CurriculumGenerator';
import CurriculumDisplay from './CurriculumDisplay';
import ProgressTracker from './ProgressTracker';
import CustomizationPanel from './CustomizationPanel';
import AchievementNotification from './AchievementNotification';
import ExportSharePanel from './ExportSharePanel';
import learningPathService from '@/services/learningPathService';

export default function LearningPath() {
  const { currentUser } = useAuth();
  const { preferences } = useUserPreferences();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');  const [curriculum, setCurriculum] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(null);
  const [customizations, setCustomizations] = useState({
    focusAreas: [],
    difficulty: 'adaptive',
    pacing: 'normal',
    learningStyle: 'mixed'
  });
  const [showAchievements, setShowAchievements] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'syllabus', name: 'Syllabus', icon: '📋' },
    { id: 'curriculum', name: 'Curriculum', icon: '📚' },
    { id: 'progress', name: 'Progress', icon: '📈' },
    { id: 'customize', name: 'Customize', icon: '⚙️' }
  ];
  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser]);

  const loadUserData = async () => {
    try {
      // Load existing curriculum and progress
      const [curriculumData, progressData] = await Promise.all([
        learningPathService.loadCurriculum(currentUser.uid),
        learningPathService.loadProgress(currentUser.uid)
      ]);
      
      if (curriculumData) {
        setCurriculum(curriculumData.curriculum);
        setCustomizations(curriculumData.customizations || customizations);
      }
      
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };
  const handleGenerateCurriculum = async () => {
    setIsGenerating(true);
    try {
      // Generate new curriculum using AI
      const newCurriculum = await CurriculumGenerator.generateCurriculum({
        language: preferences?.language,
        level: preferences?.level,
        nativeLanguage: preferences?.nativeLanguage,
        dailyGoal: preferences?.dailyGoal,
        customizations
      });
      
      setCurriculum(newCurriculum);
      
      // Save to Firestore
      await learningPathService.saveCurriculum(
        currentUser.uid, 
        newCurriculum, 
        customizations
      );
      
    } catch (error) {
      console.error('Error generating curriculum:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomizationApply = async (newCustomizations) => {
    try {
      setCustomizations(newCustomizations);
      
      // If curriculum exists, regenerate with new customizations
      if (curriculum) {
        setIsGenerating(true);
        const updatedCurriculum = await CurriculumGenerator.generateCurriculum({
          language: preferences?.language,
          level: preferences?.level,
          nativeLanguage: preferences?.nativeLanguage,
          dailyGoal: preferences?.dailyGoal,
          customizations: newCustomizations
        });
        
        setCurriculum(updatedCurriculum);
        
        // Save updated curriculum
        await learningPathService.saveCurriculum(
          currentUser.uid, 
          updatedCurriculum, 
          newCustomizations
        );
        
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Error applying customizations:', error);
      setIsGenerating(false);
    }
  };

  const handleModuleStart = async (moduleId, moduleName) => {
    try {
      await learningPathService.startModule(currentUser.uid, moduleId, moduleName);
      
      // Reload progress to reflect changes
      const updatedProgress = await learningPathService.loadProgress(currentUser.uid);
      setProgress(updatedProgress);
    } catch (error) {
      console.error('Error starting module:', error);
    }
  };

  const handleModuleComplete = async (moduleId, moduleName, score = null) => {
    try {
      const result = await learningPathService.completeModule(
        currentUser.uid, 
        moduleId, 
        moduleName, 
        score
      );
        if (result.success) {
        setProgress(result.progress);
        
        // Check for new achievements and show notifications
        const recentAchievements = result.progress.achievements?.filter(
          a => new Date(a.unlockedAt).getTime() > Date.now() - 10000 // Within last 10 seconds
        );
        
        if (recentAchievements?.length > 0) {
          setNewAchievements(recentAchievements);
          setShowAchievements(true);
        }
      }
    } catch (error) {
      console.error('Error completing module:', error);
    }
  };

  if (!preferences?.language) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Complete Your Profile First
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please set your language preferences to generate a personalized learning path.
          </p>
          <button
            onClick={() => window.location.href = '/settings'}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Settings
          </button>
        </div>
      </div>
    );
  }

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
                Learning Path
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered structured curriculum for {preferences.language}
              </p>
            </div>            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              {curriculum && (
                <button
                  onClick={() => setShowExportPanel(true)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  📊 Export
                </button>
              )}
              {!curriculum && (
                <button
                  onClick={handleGenerateCurriculum}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg transform hover:scale-105 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🤖</span>
                      Generate Curriculum
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >            {activeTab === 'overview' && (
              <OverviewTab 
                curriculum={curriculum}
                progress={progress}
                onGenerateCurriculum={handleGenerateCurriculum}
                onModuleStart={handleModuleStart}
                isGenerating={isGenerating}
                preferences={preferences}
              />
            )}

            {activeTab === 'syllabus' && (
              <SyllabusTab 
                curriculum={curriculum}
                preferences={preferences}
              />
            )}
              
            {activeTab === 'curriculum' && (
              <CurriculumDisplay 
                curriculum={curriculum}
                onRegenerateCurriculum={handleGenerateCurriculum}
                onModuleStart={handleModuleStart}
                onModuleComplete={handleModuleComplete}
                isGenerating={isGenerating}
                progress={progress}
              />
            )}
            
            {activeTab === 'progress' && (
              <ProgressTracker 
                progress={progress}
                curriculum={curriculum}
              />
            )}
            
            {activeTab === 'customize' && (
              <CustomizationPanel 
                customizations={customizations}
                setCustomizations={setCustomizations}
                onApplyChanges={handleCustomizationApply}
                curriculum={curriculum}
              />
            )}
          </motion.div>        </AnimatePresence>

        {/* Achievement Notifications */}
        {showAchievements && (
          <AchievementNotification
            achievements={newAchievements}
            onClose={() => setShowAchievements(false)}
          />
        )}

        {/* Export/Share Panel */}
        {showExportPanel && (
          <ExportSharePanel
            curriculum={curriculum}
            progress={progress}
            onClose={() => setShowExportPanel(false)}
          />
        )}
      </div>
    </div>
  );
}

// Overview Tab Component
const OverviewTab = ({ curriculum, progress, onGenerateCurriculum, onModuleStart, isGenerating, preferences }) => {
  if (!curriculum) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold mb-4">Personalized Learning Journey</h2>
          <p className="text-indigo-100 mb-6 leading-relaxed">
            Get an AI-generated curriculum tailored to your {preferences.language} learning goals, 
            current level ({preferences.level}), and daily targets ({preferences.dailyGoal} words/day).
          </p>
          <button
            onClick={onGenerateCurriculum}
            disabled={isGenerating}
            className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Create My Learning Path'}
          </button>
        </motion.div>

        {/* Features Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What You'll Get</h3>
          <div className="space-y-4">
            {[
              { icon: '🧠', title: 'AI-Powered Curriculum', desc: 'Personalized learning modules' },
              { icon: '📊', title: 'Progress Tracking', desc: 'Detailed analytics and milestones' },
              { icon: '🎯', title: 'Adaptive Difficulty', desc: 'Adjusts to your learning pace' },
              { icon: '🏆', title: 'Achievement System', desc: 'Unlock rewards as you progress' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="text-2xl">{feature.icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // When curriculum exists, show overview
  return (
    <div className="space-y-8">
      {/* Current Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Current Level</h3>
            <span className="text-2xl">📈</span>
          </div>
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            {progress?.currentLevel || 'Beginner'}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {curriculum.modules?.length || 0} modules available
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Progress</h3>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {progress?.overallProgress || 0}%
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Overall completion
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Time Invested</h3>
            <span className="text-2xl">⏰</span>
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {curriculum.estimatedWeeks || 0}w
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Estimated completion
          </p>
        </motion.div>
      </div>

      {/* Current Module */}
      {curriculum.modules && curriculum.modules.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-100 dark:border-blue-800"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Next Up: {curriculum.modules[0].title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {curriculum.modules[0].description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                {curriculum.modules[0].difficulty}
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                {curriculum.modules[0].estimatedTime}
              </span>
            </div>            <button 
              onClick={() => onModuleStart(curriculum.modules[0].id, curriculum.modules[0].title)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start Module
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Syllabus Tab Component - Displays comprehensive table of contents
const SyllabusTab = ({ curriculum, preferences }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  // Get language flag helper function
  const getLanguageFlag = (language) => {
    const flags = {
      spanish: '🇪🇸', french: '🇫🇷', german: '🇩🇪', italian: '🇮🇹', portuguese: '🇵🇹',
      russian: '🇷🇺', chinese: '🇨🇳', japanese: '🇯🇵', korean: '🇰🇷', arabic: '🇸🇦',
      hindi: '🇮🇳', dutch: '🇳🇱', swedish: '🇸🇪', norwegian: '🇳🇴', danish: '🇩🇰'
    };
    return flags[language?.toLowerCase()] || '🌍';
  };

  if (!curriculum) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Syllabus Overview
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Generate your curriculum to see the detailed CEFR-compliant syllabus structure.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Syllabus Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-100 dark:border-blue-800"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-4xl">{getLanguageFlag(preferences?.language)}</span>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {preferences?.language?.charAt(0).toUpperCase() + preferences?.language?.slice(1)} Learning Syllabus
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                CEFR Level: {preferences?.level} • Comprehensive Table of Contents
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🗣️</div>
            <div className="font-semibold text-gray-900 dark:text-white">Speaking</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Interactive Communication
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">👂</div>
            <div className="font-semibold text-gray-900 dark:text-white">Listening</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Audio Comprehension
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">📖</div>
            <div className="font-semibold text-gray-900 dark:text-white">Reading</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Text Understanding
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skills Overview */}
      {curriculum.skills && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div 
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setExpandedSection(expandedSection === 'skills' ? null : 'skills')}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <span className="mr-3 text-2xl">🎯</span>
              Skills Framework ({Object.keys(curriculum.skills).length} Core Skills)
            </h3>
            <span className="text-gray-400">
              {expandedSection === 'skills' ? '▼' : '▶'}
            </span>
          </div>
          
          <AnimatePresence>
            {expandedSection === 'skills' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(curriculum.skills).map(([skillKey, skill]) => (
                    <div key={skillKey} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">{skill.emoji}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {skill.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {skill.functions?.length || 0} functions • {skill.tasks?.length || 0} tasks
                          </p>
                        </div>
                      </div>
                      {skill.functions && (
                        <div className="space-y-1">
                          {skill.functions.slice(0, 2).map((func, index) => (
                            <div key={index} className="text-xs text-gray-700 dark:text-gray-300 flex items-start">
                              <span className="text-indigo-500 mr-1">•</span>
                              <span>{func}</span>
                            </div>
                          ))}
                          {skill.functions.length > 2 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              +{skill.functions.length - 2} more functions
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Vocabulary Overview */}
      {curriculum.vocabulary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div 
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setExpandedSection(expandedSection === 'vocabulary' ? null : 'vocabulary')}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <span className="mr-3 text-2xl">📝</span>
              Vocabulary Themes ({Object.keys(curriculum.vocabulary).length} Categories)
            </h3>
            <span className="text-gray-400">
              {expandedSection === 'vocabulary' ? '▼' : '▶'}
            </span>
          </div>
          
          <AnimatePresence>
            {expandedSection === 'vocabulary' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(curriculum.vocabulary).map(([categoryKey, category]) => (
                    <div key={categoryKey} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">{category.emoji}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {category.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {category.words?.length || 0} words
                          </p>
                        </div>
                      </div>
                      {category.words && (
                        <div className="space-y-1">
                          {category.words.slice(0, 4).map((word, index) => (
                            <div key={index} className="text-xs text-gray-700 dark:text-gray-300 flex items-start">
                              <span className="text-green-500 mr-1">•</span>
                              <span>{word}</span>
                            </div>
                          ))}
                          {category.words.length > 4 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              +{category.words.length - 4} more words
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Grammar Overview */}
      {curriculum.grammar && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div 
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setExpandedSection(expandedSection === 'grammar' ? null : 'grammar')}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <span className="mr-3 text-2xl">⚙️</span>
              Grammar Structure ({Object.keys(curriculum.grammar).length} Components)
            </h3>
            <span className="text-gray-400">
              {expandedSection === 'grammar' ? '▼' : '▶'}
            </span>
          </div>
          
          <AnimatePresence>
            {expandedSection === 'grammar' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(curriculum.grammar).map(([grammarKey, grammar]) => (
                    <div key={grammarKey} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">{grammar.emoji}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {grammar.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {grammar.topics?.length || 0} topics
                          </p>
                        </div>
                      </div>
                      {grammar.topics && (
                        <div className="space-y-1">
                          {grammar.topics.slice(0, 3).map((topic, index) => (
                            <div key={index} className="text-xs text-gray-700 dark:text-gray-300 flex items-start">
                              <span className="text-blue-500 mr-1">•</span>
                              <span>{topic}</span>
                            </div>
                          ))}
                          {grammar.topics.length > 3 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              +{grammar.topics.length - 3} more topics
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Learning Modules Overview */}
      {curriculum.modules && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div 
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setExpandedSection(expandedSection === 'modules' ? null : 'modules')}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <span className="mr-3 text-2xl">📚</span>
              Learning Modules ({curriculum.modules.length} Modules)
            </h3>
            <span className="text-gray-400">
              {expandedSection === 'modules' ? '▼' : '▶'}
            </span>
          </div>
          
          <AnimatePresence>
            {expandedSection === 'modules' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {curriculum.modules.map((module, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{module.emoji || '📖'}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              Module {index + 1}: {module.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {module.estimatedTime}
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                          {module.difficulty}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {module.description}
                      </p>
                      
                      {module.objectives && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Key Objectives:
                          </div>
                          {module.objectives.slice(0, 2).map((objective, objIndex) => (
                            <div key={objIndex} className="text-xs text-gray-700 dark:text-gray-300 flex items-start">
                              <span className="text-purple-500 mr-1">•</span>
                              <span>{objective}</span>
                            </div>
                          ))}
                          {module.objectives.length > 2 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              +{module.objectives.length - 2} more objectives
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Culture Overview */}
      {curriculum.culture && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div 
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setExpandedSection(expandedSection === 'culture' ? null : 'culture')}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <span className="mr-3 text-2xl">🌍</span>
              Cultural Context ({curriculum.culture.topics?.length || 0} Topics)
            </h3>
            <span className="text-gray-400">
              {expandedSection === 'culture' ? '▼' : '▶'}
            </span>
          </div>
          
          <AnimatePresence>
            {expandedSection === 'culture' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {curriculum.culture.description}
                  </p>
                  
                  {curriculum.culture.topics && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Cultural Topics:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {curriculum.culture.topics.map((topic, index) => (
                          <div key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                            <span className="text-orange-500 mr-2">🔸</span>
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};