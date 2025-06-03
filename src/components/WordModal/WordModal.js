"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { bedrockService } from "@/services/bedrockService";
import audioService from "@/services/audioService";
import { addUserData, updateUserData } from "@/utils/firebaseUtils";
import translateService from "@/services/translateService";

/**
 * Reusable Word Modal Component for adding vocabulary across the app
 */
function WordModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingWord = null, 
  initialWord = '',
  language = 'fr',
  userId = null
}) {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    word: '',
    translation: '',
    pronunciation: '',
    definition: '',
    example: '',
    category: '',
    language: language || 'fr'
  });
    // Modal state for AI features
  const [isGeneratingExamples, setIsGeneratingExamples] = useState(false);
  const [generatedExamples, setGeneratedExamples] = useState([]);
  const [showExamples, setShowExamples] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationTimeout, setTranslationTimeout] = useState(null);
  const [isGeneratingDefinition, setIsGeneratingDefinition] = useState(false);
  const [isGeneratingPronunciation, setIsGeneratingPronunciation] = useState(false);
  const [verbConjugations, setVerbConjugations] = useState(null);
  
  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  // Return null if modal is not open
  if (!isOpen) return null;
  
  // Initialize form with data when editing
  useEffect(() => {
    if (editingWord) {
      setFormData({
        word: editingWord.word || '',
        translation: editingWord.translation || '',
        pronunciation: editingWord.pronunciation || '',
        definition: editingWord.definition || '',
        example: editingWord.example || '',
        category: editingWord.category || '',
        language: editingWord.language || language || 'fr'
      });
    } else if (initialWord) {
      setFormData(prev => ({
        ...prev,
        word: initialWord
      }));
      
      // Auto-translate when initialWord is provided
      if (initialWord) {
        handleAutoTranslate(initialWord);
      }
    }
  }, [editingWord, initialWord, language]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (translationTimeout) {
        clearTimeout(translationTimeout);
      }
    };
  }, [translationTimeout]);
  
  // Auto-translate example sentences
  const autoTranslateExample = async (exampleText, sourceLanguage) => {
    if (!exampleText || !translateService.isValidTextForTranslation(exampleText)) return;

    try {
      const result = await translateService.translateText(
        exampleText,
        sourceLanguage,
        'english'
      );
      
      if (result?.translatedText) {
        setFormData(prev => ({ 
          ...prev, 
          translatedExample: result.translatedText 
        }));
      }
    } catch (error) {
      console.error('Auto-translate example failed:', error);
    }
  };
  
  // Handle input changes and auto-generate content
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-translate, auto-generate pronunciation, and auto-generate examples when word field changes
    if (name === 'word' && value.trim() && !editingWord) {
      handleAutoTranslate(value);
    }
  };
  
  // Auto translate functionality
  const handleAutoTranslate = (wordValue) => {
    // Clear any pending translation request
    if (translationTimeout) {
      clearTimeout(translationTimeout);
    }
    
    // Only translate if the word is a valid input and translation service is available
    if (wordValue?.trim() && translateService.isReady()) {
      // Set a small delay to avoid too many API calls while typing
      const timeoutId = setTimeout(async () => {
        try {
          setIsTranslating(true);
          
          // Check if text is valid for translation
          if (!translateService.isValidTextForTranslation(wordValue)) {
            console.log(`Word not suitable for translation: "${wordValue}"`);
            setIsTranslating(false);
            return;
          }
          
          const result = await translateService.simpleTranslate(wordValue, formData.language);
          
          if (result?.translation) {
            setFormData(prev => ({ 
              ...prev, 
              translation: result.translation 
            }));
            
            // After translating, try to auto-generate pronunciation
            handleGeneratePronunciation(false, wordValue);
          }
        } catch (error) {
          console.error('Auto-translate failed:', error);
        } finally {
          setIsTranslating(false);
        }
      }, 600); // 600ms delay
      
      setTranslationTimeout(timeoutId);
    }
  };
  
  // Generate pronunciation with AI
  const handleGeneratePronunciation = async (manualTrigger = true, wordToUse = null) => {
    const wordValue = wordToUse || formData.word;
    
    if (!wordValue || (isGeneratingPronunciation && manualTrigger)) return;
    
    if (!bedrockService.isReady()) {
      if (manualTrigger) {
        toast.error('AI service is not configured');
      }
      return;
    }
    
    try {
      if (manualTrigger) {
        setIsGeneratingPronunciation(true);
      }
      
      const pronunciation = await bedrockService.generatePronunciation(wordValue, formData.language);
      
      if (pronunciation) {
        setFormData(prev => ({
          ...prev,
          pronunciation
        }));
        
        if (manualTrigger) {
          toast.success('Pronunciation generated');
        }
      }
    } catch (error) {
      console.error('Error generating pronunciation:', error);
      if (manualTrigger) {
        toast.error('Failed to generate pronunciation');
      }
    } finally {
      setIsGeneratingPronunciation(false);
    }
  };
  
  // Generate definition with AI
  const handleGenerateDefinition = async () => {
    if (!formData.word || !formData.translation || !bedrockService.isReady()) {
      toast.error('Please ensure word and translation are filled, and AI service is configured');
      return;
    }
    
    setIsGeneratingDefinition(true);
    try {
      const definition = await bedrockService.generateDefinition(
        formData.word, 
        formData.translation,
        formData.language
      );
      
      setFormData(prev => ({
        ...prev,
        definition
      }));
      
      toast.success('Definition generated successfully!');
    } catch (error) {
      console.error('Error generating definition:', error);
      toast.error('Failed to generate definition');
    } finally {
      setIsGeneratingDefinition(false);
    }
  };
  
  // Generate examples with AI
  const handleGenerateExamples = async () => {
    if (!formData.word || !formData.translation || !bedrockService.isReady()) {
      toast.error('Please ensure word and translation are filled, and AI service is configured');
      return;
    }

    setIsGeneratingExamples(true);
    try {      
      const examples = await bedrockService.generateExamples(
        formData.word,
        formData.translation,
        formData.language,
        formData.definition,
        'intermediate'
      );
      
      if (examples && examples.length > 0) {
        // Use the first example by default
        const firstExample = examples[0];
        setFormData(prev => ({
          ...prev,
          example: firstExample,
          translatedExample: '' // Will be auto-translated
        }));
        
        // Store all generated examples for manual selection
        setGeneratedExamples(examples);
        setShowExamples(true);
        
        // Auto-translate the example
        autoTranslateExample(firstExample, formData.language);
        
        toast.success('Examples generated successfully!');
      }
    } catch (error) {
      console.error('Error generating examples:', error);
      toast.error('Failed to generate examples');
    } finally {
      setIsGeneratingExamples(false);
    }
  };
  
  // Check if word is a verb and generate conjugations
  const handleCheckVerbConjugations = async () => {
    if (!formData.word || !bedrockService.isReady()) {
      return;
    }
    
    try {
      const conjugations = await bedrockService.generateVerbConjugations(
        formData.word,
        formData.language
      );
      
      if (conjugations && Object.keys(conjugations).length) {
        setVerbConjugations(conjugations);
      }
    } catch (error) {
      console.error('Error checking verb conjugations:', error);
      // Don't show error for this passive check
    }
  };
  
  // Use a selected example
  const useExample = (example) => {
    setFormData(prev => ({ ...prev, example }));
    setShowExamples(false);
    autoTranslateExample(example, formData.language);
  };

  // Handle word audio pronunciation
  const handleWordAudio = async () => {
    if (!formData.word || isPlayingAudio) return;
    
    try {
      setIsPlayingAudio(true);
      await audioService.playAudio(formData.word, formData.language, {
        onStart: () => {
          setIsPlayingAudio(true);
        },
        onEnd: () => {
          setIsPlayingAudio(false);
        },
        onError: (error) => {
          console.error('Error playing word audio:', error);
          setIsPlayingAudio(false);
          toast.error('Failed to play pronunciation');
        }
      });
    } catch (error) {
      console.error('Error with word audio service:', error);
      setIsPlayingAudio(false);
      toast.error('Audio pronunciation unavailable');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.word.trim() || !formData.translation.trim()) {
      toast.error('Please fill in at least the word and translation fields');
      return;
    }
    
    try {
      const wordData = {
        ...formData,
        createdAt: new Date(),
        lastReviewDate: null,
        nextReviewDate: new Date(),
        difficulty: 0,
        interval: 1,
        repetitions: 0,
        easeFactor: 2.5,
        isMatured: false,
        correctCount: 0,
        incorrectCount: 0,
      };
      
      // If onSubmit callback is provided, use it
      if (onSubmit) {
        await onSubmit(wordData, editingWord);
        return;
      }
      
      // Otherwise handle submission directly
      if (userId) {
        if (editingWord) {
          await updateUserData(userId, 'vocabulary', editingWord.id, wordData);
          toast.success('Word updated successfully!');
        } else {
          await addUserData(userId, 'vocabulary', wordData);
          toast.success('Word added successfully!');
        }
        
        // Close modal
        onClose();
      } else {
        // If no userId, redirect to vocabulary page
        router.push('/vocabulary');
      }
    } catch (error) {
      console.error('Error saving word:', error);
      toast.error('Failed to save word. Please try again.');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
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

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Main Word Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Word *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="word"
                  value={formData.word}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all placeholder-gray-500 text-sm"
                  placeholder="Enter the word"
                  required
                />
                {formData.word && (
                  <button
                    type="button"
                    onClick={handleWordAudio}
                    disabled={isPlayingAudio}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-all ${
                      isPlayingAudio 
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 scale-110' 
                        : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                    title="Play pronunciation"
                  >
                    {isPlayingAudio ? (
                      <svg 
                        className="w-4 h-4 animate-pulse" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
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
          </div>
          
          {/* Pronunciation */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Pronunciation
                {isGeneratingPronunciation && (
                  <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                    (Auto-generating...)
                  </span>
                )}
              </label>
              <button
                type="button"
                onClick={() => handleGeneratePronunciation(true)}
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
                    Generate IPA
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                name="pronunciation"
                value={formData.pronunciation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all placeholder-gray-500 text-sm"
                placeholder="Phonetic pronunciation (e.g., sah-loo) - auto-generates when typing word"
              />
              {isGeneratingPronunciation && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Definition */}
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
                              type="button"
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
          </div>
          
          {/* Category and Language */}
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
              <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm">
                {formData.language ? formData.language.charAt(0).toUpperCase() + formData.language.slice(1) : 'French'}
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(From user preferences)</span>
              </div>
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
          </div>
        </form>

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

export default WordModal;
