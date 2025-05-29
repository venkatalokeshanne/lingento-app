'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchWords, addUserData, updateUserData, deleteUserData } from '@/utils/firebaseUtils';
import { audioService } from '@/services/audioService';
import { translateService } from '@/services/translateService';
import { bedrockService } from '@/services/bedrockService';
import TranslationUsageMonitor from '@/components/TranslationUsageMonitor';
import toast, { Toaster } from 'react-hot-toast';

// Enhanced WordCard Component with modern design
function WordCard({ word, onEdit, onDelete, onShowConjugations }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const getCategoryIcon = (category) => {
    const icons = {
      vocabulary: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      phrases: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      grammar: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      idioms: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
      business: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      travel: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945',
      food: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01',
      technology: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    };
    return icons[category] || icons.vocabulary;
  };
  
  const handleAudioPlay = async (e) => {
    e.stopPropagation();
    
    if (isPlaying) {
      audioService.stop();
      setIsPlaying(false);
      return;
    }
    
    setAudioError(false);
    
    // Check if user interaction is needed (mainly for mobile)
    if (audioService.requiresUserInteraction()) {
      toast.error("Tap anywhere on screen to enable audio on mobile", {
        duration: 3000,
        icon: '🔊',
      });
      setAudioError(true);
      return;
    }
    
    try {
      await audioService.playAudio(word.word, word.language, {
        onStart: () => {
          setIsPlaying(true);
        },
        onEnd: () => {
          setIsPlaying(false);
        },
        onError: (error) => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
          setAudioError(true);
          
          // Show user-friendly error for mobile audio issues
          if (error.code === "USER_INTERACTION_REQUIRED") {
            toast.error("Tap anywhere on screen to enable audio on mobile", {
              duration: 3000,
              icon: '🔊',
            });
          } else {
            toast.error("Couldn't play audio. Try again later.", {
              duration: 3000,
            });
          }
        }
      });
    } catch (error) {
      console.error('Error with audio service:', error);
      setIsPlaying(false);
      setAudioError(true);
      
      toast.error("Audio playback failed. Please try again.", {
        duration: 3000,
      });
    }
  };
  
  const handleWordClick = () => {
    // Check if the word is a verb and has conjugations
    if (word.conjugations && Object.keys(word.conjugations).length > 0) {
      onShowConjugations(word);
    }
  };
    return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 overflow-hidden flex flex-col h-full transform hover:-translate-y-1"    >
      {/* Card Header */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Header with word, audio, and action buttons */}
        <div className="flex items-start justify-between gap-2 mb-3">
          {/* Left side: Word, Pronunciation and Audio */}
          <div className="flex-1 border-l-3 border-blue-500 pl-3">
            <div className="flex items-center gap-2 mb-1">
              <h3 
                className={`font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                  word.conjugations && Object.keys(word.conjugations).length > 0 ? 'cursor-pointer hover:underline' : ''
                }`}
                onClick={handleWordClick}
                title={word.conjugations && Object.keys(word.conjugations).length > 0 ? 'Click to view conjugations' : ''}
              >
                {word.word}
              </h3>
              <button
                onClick={handleAudioPlay}
                className={`p-1.5 rounded-full transition-all ${
                  isPlaying 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 scale-110' 
                    : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
                title="Play pronunciation"
              >
                {isPlaying ? (
                  <motion.svg 
                    animate={{ scale: [1, 1.2, 1] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}                    className="w-4 h-4" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </motion.svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>
            </div>
            {/* Pronunciation display */}
            {word.pronunciation && (
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium italic bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800 mb-2">
                /{word.pronunciation}/
              </div>
            )}
          </div>
          
          {/* Right side: Action buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(word)}
              className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
              title="Edit"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(word.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>        {/* Translation Section */}
        <div className="mb-3">
          <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed font-medium bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border-l-3 border-emerald-500">
            {word.translation}
          </p>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Example */}
          {word.example && (
            <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              "{word.example}"
            </p>
          )}
        </div>
      </div>

      {/* Card Footer - Tags positioned at bottom */}
      <div className="px-4 pb-4 mt-auto">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getCategoryIcon(word.category)} />
            </svg>
            {word.category}
          </span>
          <span className="inline-flex items-center px-2.5 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium">
            {word.language}
          </span>
          {/* Show verb indicator if has conjugations */}
          {word.conjugations && Object.keys(word.conjugations).length > 0 && (
            <span className="inline-flex items-center px-2.5 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-full cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors font-medium"
                  onClick={handleWordClick}
                  title="Click to view conjugations">
              Verb ✏️
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Conjugation Modal Component
function ConjugationModal({ isOpen, onClose, word }) {
  const [playingAudio, setPlayingAudio] = useState(null);

  if (!isOpen || !word) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConjugationAudio = async (conjugatedForm, pronoun, tense) => {
    const audioKey = `${tense}-${pronoun}`;
    
    if (playingAudio === audioKey) {
      audioService.stop();
      setPlayingAudio(null);
      return;
    }
    
    try {
      await audioService.playAudio(conjugatedForm, word.language, {
        onStart: () => {
          setPlayingAudio(audioKey);
        },
        onEnd: () => {
          setPlayingAudio(null);
        },
        onError: (error) => {
          console.error('Error playing conjugation audio:', error);
          setPlayingAudio(null);
        }
      });
    } catch (error) {
      console.error('Error with conjugation audio service:', error);
      setPlayingAudio(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={handleBackdropClick}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{word.word}</h2>
            <p className="text-gray-600 dark:text-gray-300">{word.translation}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Word Info */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full font-medium">
                {word.category}
              </span>
              <span className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full font-medium">
                {word.language}
              </span>
              {word.pronunciation && (
                <span className="text-gray-500 dark:text-gray-400 italic">
                  /{word.pronunciation}/
                </span>
              )}
            </div>
            
            {word.definition && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Definition:</p>
                <p className="text-gray-600 dark:text-gray-400">{word.definition}</p>
              </div>
            )}
            
            {word.example && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Example:</p>
                <p className="text-gray-600 dark:text-gray-400 italic">"{word.example}"</p>
              </div>
            )}
          </div>

          {/* Conjugations Table */}
          {word.conjugations && Object.keys(word.conjugations).length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Verb Conjugations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(word.conjugations).map(([tense, conjugations]) => (
                  <div key={tense} className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700 shadow-sm">
                    <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-3 text-center uppercase tracking-wide">
                      {tense === 'passe' ? 'Passé Composé' : tense}
                    </h4>                    <div className="space-y-2">
                      {Object.entries(conjugations).map(([pronoun, form]) => {
                        const audioKey = `${tense}-${pronoun}`;
                        const isPlaying = playingAudio === audioKey;
                        
                        return (
                          <div key={pronoun} className="flex justify-between items-center py-1 px-2 bg-white dark:bg-gray-700 rounded border border-emerald-100 dark:border-emerald-800">
                            <span className="font-medium text-emerald-700 dark:text-emerald-300 text-sm">
                              {pronoun}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-800 dark:text-gray-200">
                                {form}
                              </span>
                              <button
                                onClick={() => handleConjugationAudio(form, pronoun, tense)}
                                className={`p-1 rounded-full transition-all flex-shrink-0 ${
                                  isPlaying 
                                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 scale-110' 
                                    : 'text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                }`}
                                title="Play pronunciation"
                              >
                                {isPlaying ? (
                                  <motion.svg 
                                    animate={{ scale: [1, 1.2, 1] }} 
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="w-3 h-3" 
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                  </motion.svg>
                                ) : (
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 9v6h4l5 5V4L7 9H3z"/>
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Generated Examples */}
          {word.generatedExamples && word.generatedExamples.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Generated Examples
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {word.generatedExamples.map((example, index) => (
                  <div key={index} className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-3">
                    <p className="text-gray-700 dark:text-gray-300 italic">"{example}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Enhanced Add/Edit Word Modal
function WordModal({ isOpen, onClose, onSubmit, editingWord, formData, setFormData }) {
  const [isGeneratingExamples, setIsGeneratingExamples] = useState(false);
  const [generatedExamples, setGeneratedExamples] = useState([]);
  const [showExamples, setShowExamples] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationTimeout, setTranslationTimeout] = useState(null);  const [isGeneratingDefinition, setIsGeneratingDefinition] = useState(false);
  const [generatedDefinition, setGeneratedDefinition] = useState('');
  const [isGeneratingPronunciation, setIsGeneratingPronunciation] = useState(false);
  const [verbConjugations, setVerbConjugations] = useState(null);
  
  if (!isOpen) return null;
  // Auto-translate functionality
  const autoTranslate = async (word, sourceLanguage) => {
    if (!word || word.length < 2 || !sourceLanguage) return;
    
    setIsTranslating(true);
    try {
      const result = await translateService.translateText(word, sourceLanguage, 'english');
      if (result && result.translatedText) {
        setFormData(prev => ({ 
          ...prev, 
          translation: result.translatedText 
        }));
        toast.success('Translation completed!');
      }
    } catch (error) {
      console.error('Auto-translation failed:', error);
      toast.error('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-translate when word field changes
    if (name === 'word' && value.trim() && !editingWord) {
      // Clear existing timeout
      if (translationTimeout) {
        clearTimeout(translationTimeout);
      }
        // Set new timeout for debouncing
      const newTimeout = setTimeout(() => {
        autoTranslate(value.trim(), formData.language || 'french');
      }, 1000); // 1 second delay
      
      setTranslationTimeout(newTimeout);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (translationTimeout) {
        clearTimeout(translationTimeout);
      }
    };
  }, [translationTimeout]);
  // Generate AI examples
  const handleGenerateExamples = async () => {
    if (!formData.word || !formData.translation || !bedrockService.isReady()) {
      toast.error('Please ensure word and translation are filled, and AWS Bedrock is configured');
      return;
    }

    setIsGeneratingExamples(true);
    try {      const examples = await bedrockService.generateExamples(
        formData.word,
        formData.translation,
        formData.language,
        formData.definition,
        'intermediate'
      );
      
      setGeneratedExamples(examples);
      setShowExamples(true);
      toast.success('Examples generated successfully!');
    } catch (error) {
      console.error('Error generating examples:', error);
      toast.error('Failed to generate examples. Please check your AWS Bedrock configuration.');
    } finally {
      setIsGeneratingExamples(false);
    }
  };

  // Generate AI definition
  const handleGenerateDefinition = async () => {
    if (!formData.word || !formData.translation || !bedrockService.isReady()) {
      toast.error('Please ensure word and translation are filled, and AWS Bedrock is configured');
      return;
    }

    setIsGeneratingDefinition(true);
    setVerbConjugations(null);
    try {      // Detect if the word might be a verb
      const isVerb = /\b(to |er$|ir$|re$|ar$|oir$|yer$)\b/i.test(formData.word) || 
                    formData.category === 'verbs' ||
                    /\b(verb|infinitive)\b/i.test(formData.definition) ||
                    (formData.language === 'french' && /^(aller|avoir|être|faire|dire|venir|voir|savoir|pouvoir|falloir|vouloir|prendre|donner|tenir|enir|partir|sentir|sortir|mettre|suivre|vivre|écrire|lire|boire|croire|recevoir|devoir|mouvoir|pleuvoir|valoir)$|er$|ir$|re$|oir$/i.test(formData.word));const result = await bedrockService.generateDefinition(
        formData.word,
        formData.language,
        formData.translation,
        isVerb ? 'verb' : 'other',
        formData.definition
      );
      
      if (result) {
        if (result.definition) {
          setGeneratedDefinition(result.definition);
          setFormData(prev => ({ ...prev, definition: result.definition }));
        }
        
        if (result.conjugations && Object.keys(result.conjugations).length > 0) {
          setVerbConjugations(result.conjugations);
        }
        
        toast.success('Definition generated successfully!');
      }
    } catch (error) {
      console.error('Error generating definition:', error);
      toast.error('Failed to generate definition. Please check your AWS Bedrock configuration.');    } finally {
      setIsGeneratingDefinition(false);
    }
  };

  // Generate pronunciation using AWS Bedrock
  const handleGeneratePronunciation = async () => {
    if (!formData.word || !bedrockService.isReady()) {
      toast.error('Please enter a word and ensure AWS Bedrock is configured');
      return;
    }

    setIsGeneratingPronunciation(true);
    try {
      const pronunciation = await bedrockService.generatePronunciation(
        formData.word,
        formData.language
      );
      
      if (pronunciation) {
        setFormData(prev => ({ ...prev, pronunciation: pronunciation }));
        toast.success('Pronunciation generated successfully!');
      }
    } catch (error) {
      console.error('Error generating pronunciation:', error);
      toast.error('Failed to generate pronunciation. Please check your AWS Bedrock configuration.');
    } finally {
      setIsGeneratingPronunciation(false);
    }
  };

  // Use a generated example
  const useExample = (example) => {
    setFormData(prev => ({ ...prev, example }));
    setShowExamples(false);
    toast.success('Example added to your word!');
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass generated data along with the form submission
    const submissionData = {
      formData,
      generatedDefinition,
      verbConjugations,
      generatedExamples
    };
    onSubmit(e, submissionData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingWord ? 'Edit Word' : 'Add New Word'}
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {editingWord ? 'Update your vocabulary entry' : 'Add a new word to your vocabulary collection'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">          {/* Main Word Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Word *
              </label>
              <input
                type="text"
                name="word"
                value={formData.word}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all placeholder-gray-500 text-sm"
                placeholder="Enter the word"
                required
              />
            </div>            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Translation *
                {isTranslating && (
                  <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                    (Auto-translating...)
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="translation"
                  value={formData.translation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all placeholder-gray-500 text-sm"
                  placeholder="Enter translation (auto-translates when typing word)"
                  required
                />
                {isTranslating && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            </div>
          </div>          {/* Pronunciation */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Pronunciation
              </label>
              <button
                type="button"
                onClick={handleGeneratePronunciation}
                disabled={isGeneratingPronunciation || !formData.word}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-md transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
              >
                {isGeneratingPronunciation ? (
                  <>
                    <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 9v6l4-3-4-3z" />
                    </svg>
                    Auto IPA
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              name="pronunciation"
              value={formData.pronunciation}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all placeholder-gray-500 text-sm"
              placeholder="IPA notation (e.g., /bɔ̃.ʒuʁ/) - or click Auto IPA"
            />
          </div>{/* Definition */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Definition
              </label>
              <button
                type="button"
                onClick={handleGenerateDefinition}
                disabled={isGeneratingDefinition || !formData.word || !formData.translation}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-md transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
              >
                {isGeneratingDefinition ? (
                  <>
                    <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Definition
                  </>
                )}
              </button>
            </div>
            <textarea
              name="definition"
              rows="2"
              value={formData.definition}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all resize-none placeholder-gray-500 text-sm"
              placeholder="Enter definition or explanation (or generate with AI)"
            />            
            {/* Verb Conjugation Display */}
            {verbConjugations && (
              <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <h4 className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Verb Conjugations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(verbConjugations).map(([tense, conjugations]) => (
                    <div key={tense} className="bg-white dark:bg-gray-700 rounded-md p-2 border border-emerald-200 dark:border-emerald-700">
                      <h5 className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide mb-1">
                        {tense === 'passe' ? 'Passé Composé' : 
                         tense.charAt(0).toUpperCase() + tense.slice(1)}
                      </h5>
                      <div className="space-y-0.5">
                        {Object.entries(conjugations).map(([pronoun, form]) => (
                          <div key={pronoun} className="flex justify-between items-center text-xs">
                            <span className="text-gray-600 dark:text-gray-400">{pronoun}:</span>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  await audioService.playAudio(form, formData.language);
                                } catch (error) {
                                  console.error('Error playing conjugation audio:', error);
                                }
                              }}
                              className="font-medium text-gray-800 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer underline-offset-2 hover:underline"
                              title={`Click to pronounce ${form}`}
                            >
                              {form}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Example */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Example Sentence
              </label>
              <button
                type="button"
                onClick={handleGenerateExamples}
                disabled={isGeneratingExamples || !formData.word || !formData.translation}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-md transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
              >
                {isGeneratingExamples ? (
                  <>
                    <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI Examples
                  </>
                )}
              </button>
            </div>
            <textarea
              name="example"
              rows="2"
              value={formData.example}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all resize-none placeholder-gray-500 text-sm"
              placeholder="Example sentence using this word (or generate with AI)"
            />
          </div>          {/* Category and Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all text-sm"
              >
                <option value="vocabulary">Vocabulary</option>
                <option value="phrases">Phrases</option>
                <option value="grammar">Grammar</option>
                <option value="idioms">Idioms</option>
                <option value="slang">Slang</option>
                <option value="academic">Academic</option>
                <option value="business">Business</option>
                <option value="travel">Travel</option>
                <option value="food">Food</option>
                <option value="technology">Technology</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all text-sm"
              >
                <option value="french">French</option>
                <option value="spanish">Spanish</option>
                <option value="german">German</option>
                <option value="italian">Italian</option>
                <option value="portuguese">Portuguese</option>
                <option value="russian">Russian</option>
                <option value="chinese">Chinese</option>
                <option value="japanese">Japanese</option>
                <option value="korean">Korean</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
            >
              {editingWord ? 'Update Word' : 'Add Word'}
            </button>
          </div></form>

        {/* AI Generated Examples Modal */}
        {showExamples && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 rounded-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Generated Examples
                </h3>
                <button
                  onClick={() => setShowExamples(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                {generatedExamples.map((example, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => useExample(example)}
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">"{example}"</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Click to use this example</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowExamples(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function VocabularyManager() {
  const { currentUser } = useAuth();  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [sortBy, setSortBy] = useState('dateAdded'); // 'dateAdded', 'alphabetical'
  const [filters, setFilters] = useState({
    category: 'all',
  });// Mobile filters state - REMOVED (no longer needed)
    // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  
  // Conjugation modal state
  const [showConjugationModal, setShowConjugationModal] = useState(false);
  const [selectedWordForConjugation, setSelectedWordForConjugation] = useState(null);  const [formData, setFormData] = useState({
    word: '',
    translation: '',
    pronunciation: '',
    definition: '',
    example: '',
    category: 'vocabulary',
    language: 'french',
  });
  
  // State for AI generation functionality
  const [isGeneratingPronunciation, setIsGeneratingPronunciation] = useState(false);
  
  // Extract unique filter values
  const categories = ['all', ...new Set(words.map(word => word.category))].filter(Boolean);
  // Fetch words on component mount
  useEffect(() => {
    if (currentUser) {
      fetchWords(currentUser, setWords, setLoading);
    }
  }, [currentUser]);  // Handle form submission
  const handleSubmit = async (e, submissionData = null) => {
    e.preventDefault();
    
    // Extract data from either the form event or the passed submission data
    const dataToSave = submissionData ? submissionData.formData : formData;
    
    if (!dataToSave.word || !dataToSave.translation) {
      alert('Word and translation are required');
      return;
    }
    
    try {
      // Prepare the data to save, including any generated content
      const saveData = { ...dataToSave };
      
      // If we have submission data from WordModal, include generated content
      if (submissionData) {
        // Save generated definition if available and not already in form
        if (submissionData.generatedDefinition && !saveData.definition) {
          saveData.definition = submissionData.generatedDefinition;
        }
        
        // Save verb conjugations if available
        if (submissionData.verbConjugations && Object.keys(submissionData.verbConjugations).length > 0) {
          saveData.conjugations = submissionData.verbConjugations;
          // Mark as verb type for easier identification
          if (!saveData.category || saveData.category === 'vocabulary') {
            saveData.category = 'verbs';
          }
        }
        
        // Save generated examples as additional metadata
        if (submissionData.generatedExamples && submissionData.generatedExamples.length > 0) {
          saveData.generatedExamples = submissionData.generatedExamples;
          // If no example is set, use the first generated example
          if (!saveData.example && submissionData.generatedExamples.length > 0) {
            saveData.example = submissionData.generatedExamples[0];
          }
        }
      }
      
      if (editingWord) {
        // Update existing word
        await updateUserData(currentUser, 'vocabulary', editingWord.id, saveData);
        toast.success('Word updated successfully!');
      } else {
        // Add new word
        await addUserData(currentUser, 'vocabulary', saveData);
        toast.success('Word added successfully!');
      }
        // Reset form
      setFormData({
        word: '',
        translation: '',
        pronunciation: '',
        definition: '',
        example: '',
        category: 'vocabulary',
        language: 'french',
      });
      
      setShowModal(false);
      setEditingWord(null);
      fetchWords(currentUser, setWords, setLoading);
    } catch (error) {
      console.error('Error saving word:', error);
      toast.error('Error saving word. Please try again.');
    }
  };
  // Handle word deletion
  const handleDeleteWord = async (wordId) => {
    if (!confirm('Are you sure you want to delete this word?')) return;
    
    try {
      await deleteUserData(currentUser, 'vocabulary', wordId);
      fetchWords(currentUser, setWords, setLoading);
    } catch (error) {
      console.error('Error deleting word:', error);
      alert('Error deleting word. Please try again.');
    }
  };

  // Handle word edit
  const handleEditWord = (word) => {
    setEditingWord(word);    setFormData({
      word: word.word || '',
      translation: word.translation || '',
      pronunciation: word.pronunciation || '',
      definition: word.definition || '',
      example: word.example || '',
      category: word.category || 'vocabulary',
      language: word.language || 'french',
    });
    setShowModal(true);
  };

  // Handle add new word
  const handleAddWord = () => {
    setEditingWord(null);    setFormData({
      word: '',
      translation: '',
      pronunciation: '',
      definition: '',
      example: '',
      category: 'vocabulary',
      language: 'french',    });
    setShowModal(true);
  };

  // Handle show conjugations
  const handleShowConjugations = (word) => {
    setSelectedWordForConjugation(word);
    setShowConjugationModal(true);
  };
  // Filter and sort words
  const filteredAndSortedWords = words
    .filter(word => {
      const matchesSearch = !searchTerm || 
        word.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.translation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.definition?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filters.category === 'all' || word.category === filters.category;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue, bValue;
        switch (sortBy) {
        case 'alphabetical':
          aValue = a.word?.toLowerCase() || '';
          bValue = b.word?.toLowerCase() || '';
          break;
        case 'dateAdded':
        default:
          aValue = a.createdAt || 0;
          bValue = b.createdAt || 0;
          break;
      }
      
      // Always sort in descending order (newest first for dateAdded, Z-A for alphabetical)
      return aValue < bValue ? 1 : -1;
    });

  // Handle audio playback using centralized audio service
  const speakWord = async (word) => {
    try {
      await audioService.playAudio(word.word, word.language, {
        onStart: () => {
          // Optional: could add visual feedback here if needed
          console.log(`Playing pronunciation for: ${word.word}`);
        },
        onEnd: () => {
          // Optional: could add visual feedback here if needed
          console.log(`Finished playing: ${word.word}`);
        },
        onError: (error) => {
          console.error('Error playing audio:', error);
          // Fallback to browser's speech synthesis as backup
          if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(word.word);
            const voices = speechSynthesis.getVoices();
            const languageVoice = voices.find(voice => 
              voice.lang.toLowerCase().includes(word.language?.toLowerCase() || 'en')
            );
            if (languageVoice) {
              utterance.voice = languageVoice;
            }
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
          }
        }
      });
    } catch (error) {
      console.error('Error with audio service:', error);
    }
  };
  const getStats = () => {
    const total = words.length;
    const byLanguage = words.reduce((acc, word) => {
      acc[word.language] = (acc[word.language] || 0) + 1;
      return acc;
    }, {});
    
    // Count mastered words (you can adjust this logic based on your mastery criteria)
    const mastered = words.filter(word => word.mastered === true).length;    
    return { total, byLanguage, mastered };
  };

  const stats = getStats();

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to access your vocabulary
          </h2>
        </div>
      </div>
    );
  }  return (    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      {/* Ultra-minimal spacer for fixed navbar */}
      <div className="h-8"></div>
        {/* Compact Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 bg-clip-text text-transparent mb-1">
              Vocabulary Manager
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredAndSortedWords.length} of {words.length} words in your collection
            </p>
          </div>
          
          {/* Compact Stats Cards */}
          <div className="flex flex-row justify-center lg:justify-end gap-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-2 shadow border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Words</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-2 shadow border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{stats.mastered || 0}</div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Mastered</div>
              </div>
            </div>
          </div>        </div>        {/* Balanced Compact Search and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all placeholder-gray-400"
              placeholder="Search your vocabulary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>          {/* Filters and Controls Row */}
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3">
            {/* Left side: Filters */}
            <div className="flex items-center gap-3">
              {/* Category Filter */}
              <select
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all min-w-[120px]"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all min-w-[110px]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="dateAdded">Newest First</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>

            {/* Right side: View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'cards' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'table' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Table
              </button>
            </div>
          </div>
        </div>{/* Content Area */}
        <div className="pb-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                <div className="absolute inset-0 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" style={{animationDelay: '0.15s', animationDuration: '1.5s'}}></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your vocabulary...</p>
            </div>
          ) : filteredAndSortedWords.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto px-4">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {words.length === 0 ? 'No words yet' : 'No words found'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  {words.length === 0 
                    ? "Start building your vocabulary by adding your first word" 
                    : "Try adjusting your search or filters to find what you're looking for"}
                </p>
                <button
                  onClick={handleAddWord}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Your First Word
                </button>
              </div>
            </div>
          ) : (
            <>              {/* Enhanced Cards View */}
              {viewMode === 'cards' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                  <AnimatePresence>
                    {filteredAndSortedWords.map(word => (
                      <WordCard 
                        key={word.id} 
                        word={word} 
                        onEdit={handleEditWord} 
                        onDelete={handleDeleteWord}
                        onShowConjugations={handleShowConjugations}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}{/* Modern Table View */}
              {viewMode === 'table' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Enhanced Table Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-8 sm:grid-cols-12 gap-3 sm:gap-4 items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <div className="col-span-3 sm:col-span-3">Word</div>
                      <div className="col-span-3 sm:col-span-4">Translation</div>
                      <div className="col-span-2 hidden sm:block">Language</div>
                      <div className="col-span-2 sm:col-span-3 text-right">Actions</div>
                    </div>
                  </div>
                  
                  {/* Enhanced Table Body */}
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    <AnimatePresence>
                      {filteredAndSortedWords.map(word => (
                        <motion.div
                          key={word.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="group px-4 sm:px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10 transition-all duration-200"
                        >
                          <div className="grid grid-cols-8 sm:grid-cols-12 gap-3 sm:gap-4 items-start text-sm">                            {/* Word Column */}
                            <div className="col-span-3 sm:col-span-3">
                              <div 
                                className={`font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-tight ${
                                  word.conjugations && Object.keys(word.conjugations).length > 0 
                                    ? 'cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors' 
                                    : ''
                                }`}
                                onClick={() => {
                                  if (word.conjugations && Object.keys(word.conjugations).length > 0) {
                                    handleShowConjugations(word);
                                  }
                                }}
                                title={word.conjugations && Object.keys(word.conjugations).length > 0 ? 'Click to view conjugations' : ''}
                              >
                                {word.word}
                              </div>
                            </div>

                            {/* Translation Column - Fixed overflow */}
                            <div className="col-span-3 sm:col-span-4">
                              <div 
                                className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-2 break-words hover:line-clamp-none transition-all duration-200 cursor-pointer"
                                title="Click to expand"
                              >
                                {word.translation}
                              </div>
                            </div>

                            {/* Language Column - Hidden on mobile */}
                            <div className="col-span-2 hidden sm:block">
                              <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                                {word.language}
                              </span>
                            </div>

                            {/* Actions Column */}
                            <div className="col-span-2 sm:col-span-3 flex items-center justify-end gap-2">
                              {/* Audio Button */}
                              <button
                                onClick={() => speakWord(word)}
                                className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 group-hover:scale-110"
                                title="Pronounce word"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0v-1a3 3 0 00-6 0v1z" />
                                </svg>
                              </button>
                              {/* Edit Button */}
                              <button
                                onClick={() => handleEditWord(word)}
                                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 group-hover:scale-110"
                                title="Edit word"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteWord(word.id)}
                                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 group-hover:scale-110"
                                title="Delete word"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>      {/* Enhanced Floating Action Button */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50"
      >
        <button
          onClick={handleAddWord}
          className="group w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1"
          title="Add new word"
        >
          <svg className="w-8 h-8 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </motion.div>

      {/* Add/Edit Word Modal */}
      <AnimatePresence>
        {showModal && (
          <WordModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingWord(null);
            }}
            onSubmit={handleSubmit}
            editingWord={editingWord}
            formData={formData}
            setFormData={setFormData}          />
        )}      </AnimatePresence>

      {/* Conjugation Modal */}
      <AnimatePresence>
        {showConjugationModal && (
          <ConjugationModal
            isOpen={showConjugationModal}
            onClose={() => {
              setShowConjugationModal(false);
              setSelectedWordForConjugation(null);
            }}
            word={selectedWordForConjugation}
          />
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}
