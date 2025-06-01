'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CurriculumDisplay({ 
  curriculum, 
  onRegenerateCurriculum, 
  onModuleStart,
  onModuleComplete,
  isGenerating,
  progress 
}) {
  const [expandedModule, setExpandedModule] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  if (!curriculum) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          No Curriculum Generated Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Create your personalized learning curriculum to see it here.
        </p>
        <button
          onClick={onRegenerateCurriculum}
          disabled={isGenerating}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : 'Generate Curriculum'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Curriculum Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-indigo-100 dark:border-indigo-800"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {curriculum.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              {curriculum.description}
            </p>
          </div>
          <button
            onClick={onRegenerateCurriculum}
            disabled={isGenerating}
            className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 inline-block mr-2"></div>
                Regenerating...
              </>
            ) : (
              '🔄 Regenerate'
            )}
          </button>
        </div>

        {/* Curriculum Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {curriculum.modules?.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Modules</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {curriculum.estimatedWeeks || 0}w
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {curriculum.milestones?.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Milestones</div>
          </div>          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {curriculum.level || 'Mixed'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Level</div>
          </div>
        </div>
      </motion.div>

      {/* Skills Overview - New Enhanced Section */}
      {curriculum.skills && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="mr-2">🎯</span>
            Skills Overview (CEFR Framework)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(curriculum.skills).map(([skillKey, skill]) => (
              <SkillCard key={skillKey} skill={skill} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Vocabulary & Grammar Overview */}
      {(curriculum.vocabulary || curriculum.grammar) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vocabulary Section */}
            {curriculum.vocabulary && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  {curriculum.vocabulary.emoji} {curriculum.vocabulary.title}
                </h3>
                <div className="space-y-3">
                  {curriculum.vocabulary.themes?.slice(0, 6).map((theme, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {theme.theme}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {theme.words?.length || 0} words
                      </div>
                    </div>
                  ))}
                  {curriculum.vocabulary.themes?.length > 6 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      +{curriculum.vocabulary.themes.length - 6} more themes
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Grammar Section */}
            {curriculum.grammar && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  {curriculum.grammar.emoji} {curriculum.grammar.title}
                </h3>
                <div className="space-y-3">
                  {curriculum.grammar.sections?.slice(0, 6).map((section, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="font-medium text-gray-900 dark:text-white text-sm flex items-center">
                        <span className="mr-2">{section.emoji}</span>
                        {section.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {section.points?.length || 0} grammar points
                      </div>
                    </div>
                  ))}
                  {curriculum.grammar.sections?.length > 6 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      +{curriculum.grammar.sections.length - 6} more sections
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Culture Overview */}
      {curriculum.culture && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            {curriculum.culture.emoji} {curriculum.culture.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {curriculum.culture.topics?.map((topic, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {topic}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Modules List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Learning Modules</h3>        {curriculum.modules?.map((module, index) => {
          const isCompleted = progress?.completedModules?.some(cm => cm.id === module.id);
          const isCurrent = progress?.currentModule?.id === module.id;
          
          return (
            <ModuleCard
              key={module.id}
              module={module}
              index={index}
              isExpanded={expandedModule === module.id}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              onToggleExpand={() => setExpandedModule(
                expandedModule === module.id ? null : module.id
              )}
              onSelectModule={() => setSelectedModule(module)}
              onModuleStart={onModuleStart}
              onModuleComplete={onModuleComplete}
            />
          );
        })}
      </div>

      {/* Daily Recommendations */}
      {curriculum.dailyRecommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Daily Study Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(curriculum.dailyRecommendations).map(([phase, description], index) => (
              <div key={phase} className="text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">
                    {index === 0 ? '🏃' : index === 1 ? '📖' : index === 2 ? '💪' : index === 3 ? '🧠' : '😌'}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white capitalize mb-1">
                  {phase}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Milestones */}
      {curriculum.milestones && curriculum.milestones.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Achievement Milestones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {curriculum.milestones.map((milestone, index) => (
              <div key={milestone.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🏆</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {milestone.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {milestone.description}
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                      {milestone.reward}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Module Detail Modal */}
      <AnimatePresence>
        {selectedModule && (
          <ModuleDetailModal
            module={selectedModule}
            onClose={() => setSelectedModule(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// SkillCard component for displaying enhanced skill information
const SkillCard = ({ skill }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{skill.emoji}</span>
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
            {skill.title?.replace(/\([^)]*\)/g, '').trim()}
          </h4>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {/* Functions/Can Understand */}
            {skill.functions && (
              <div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Functions:
                </div>
                <ul className="space-y-1">
                  {skill.functions.slice(0, 3).map((func, index) => (
                    <li key={index} className="text-xs text-gray-700 dark:text-gray-300 flex items-start">
                      <span className="text-indigo-500 mr-1">•</span>
                      {func}
                    </li>
                  ))}
                  {skill.functions.length > 3 && (
                    <li className="text-xs text-gray-500 dark:text-gray-400">
                      +{skill.functions.length - 3} more...
                    </li>
                  )}
                </ul>
              </div>
            )}

            {skill.canUnderstand && (
              <div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Can understand:
                </div>
                <ul className="space-y-1">
                  {skill.canUnderstand.slice(0, 3).map((item, index) => (
                    <li key={index} className="text-xs text-gray-700 dark:text-gray-300 flex items-start">
                      <span className="text-indigo-500 mr-1">•</span>
                      {item}
                    </li>
                  ))}
                  {skill.canUnderstand.length > 3 && (
                    <li className="text-xs text-gray-500 dark:text-gray-400">
                      +{skill.canUnderstand.length - 3} more...
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Tasks */}
            {skill.tasks && (
              <div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Tasks:
                </div>
                <ul className="space-y-1">
                  {skill.tasks.slice(0, 3).map((task, index) => (
                    <li key={index} className="text-xs text-gray-700 dark:text-gray-300 flex items-start">
                      <span className="text-indigo-500 mr-1">•</span>
                      {task}
                    </li>
                  ))}
                  {skill.tasks.length > 3 && (
                    <li className="text-xs text-gray-500 dark:text-gray-400">
                      +{skill.tasks.length - 3} more...
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Text Types */}
            {skill.textTypes && (
              <div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Text types:
                </div>
                <div className="flex flex-wrap gap-1">
                  {skill.textTypes.slice(0, 4).map((type, index) => (
                    <span key={index} className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded">
                      {type}
                    </span>
                  ))}
                  {skill.textTypes.length > 4 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{skill.textTypes.length - 4}...
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick preview when collapsed */}
      {!isExpanded && (
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {skill.functions?.length && `${skill.functions.length} functions`}
          {skill.canUnderstand?.length && `${skill.canUnderstand.length} skills`}
          {skill.tasks?.length && `${skill.tasks.length} tasks`}
          {skill.textTypes?.length && `${skill.textTypes.length} text types`}
        </div>
      )}
    </div>
  );
};

// Module Card Component
const ModuleCard = ({ 
  module, 
  index, 
  isExpanded, 
  isCompleted, 
  isCurrent, 
  onToggleExpand, 
  onSelectModule,
  onModuleStart,
  onModuleComplete 
}) => {
  const handleStartModule = () => {
    if (onModuleStart) {
      onModuleStart(module.id, module.title);
    }
  };

  const handleCompleteModule = () => {
    if (onModuleComplete) {
      onModuleComplete(module.id, module.title, 85); // Mock score
    }
  };

  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
    if (isCurrent) return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
    return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
  };

  const getStatusText = () => {
    if (isCompleted) return 'Completed';
    if (isCurrent) return 'In Progress';
    return 'Not Started';
  };

  const getStatusIcon = () => {
    if (isCompleted) return '✅';
    if (isCurrent) return '📖';
    return '⏳';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border ${
        isCurrent 
          ? 'border-blue-300 dark:border-blue-600 ring-2 ring-blue-100 dark:ring-blue-900' 
          : isCompleted
          ? 'border-green-300 dark:border-green-600'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                Module {index + 1}
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                {module.difficulty}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor()}`}>
                {getStatusIcon()} {getStatusText()}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {module.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {module.description}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>⏱️ {module.estimatedTime}</span>
              <span>📝 {module.objectives?.length || 0} objectives</span>
              <span>📚 {module.vocabulary?.length || 0} words</span>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isCompleted && !isCurrent && (
              <button
                onClick={handleStartModule}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Start Module
              </button>
            )}
            {isCurrent && (
              <button
                onClick={handleCompleteModule}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Complete
              </button>
            )}
            <button
              onClick={onSelectModule}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              Details
            </button>
            <button
              onClick={onToggleExpand}
              className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isExpanded ? '−' : '+'}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Objectives */}
                {module.objectives && module.objectives.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Learning Objectives</h4>
                    <ul className="space-y-1">
                      {module.objectives.slice(0, 3).map((objective, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Vocabulary */}
                {module.vocabulary && module.vocabulary.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Vocabulary</h4>
                    <div className="flex flex-wrap gap-1">
                      {module.vocabulary.slice(0, 8).map((word, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                          {word}
                        </span>
                      ))}
                      {module.vocabulary.length > 8 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                          +{module.vocabulary.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Module Detail Modal Component
const ModuleDetailModal = ({ module, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {module.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {module.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Learning Objectives */}
            {module.objectives && module.objectives.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🎯 Learning Objectives
                </h3>
                <ul className="space-y-2">
                  {module.objectives.map((objective, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Vocabulary */}
            {module.vocabulary && module.vocabulary.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📚 Key Vocabulary ({module.vocabulary.length} words)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {module.vocabulary.map((word, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Grammar Concepts */}
            {module.grammar && module.grammar.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📝 Grammar Concepts
                </h3>
                <ul className="space-y-2">
                  {module.grammar.map((concept, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-purple-500 mr-2 mt-1">▸</span>
                      <span className="text-gray-700 dark:text-gray-300">{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practice Activities */}
            {module.activities && module.activities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🎮 Practice Activities
                </h3>
                <ul className="space-y-2">
                  {module.activities.map((activity, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-1">⚡</span>
                      <span className="text-gray-700 dark:text-gray-300">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span>⏱️ Estimated time: {module.estimatedTime}</span>
                <span className="mx-4">•</span>
                <span>📊 Difficulty: {module.difficulty}</span>
              </div>
              <button
                onClick={() => {
                  // Here you would implement starting the module
                  console.log('Starting module:', module.id);
                  onClose();
                }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start Module
              </button>
            </div>
          </div>        </div>
      </motion.div>
    </motion.div>
  );
};
