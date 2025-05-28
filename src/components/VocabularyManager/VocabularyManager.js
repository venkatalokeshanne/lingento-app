'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchWords, addUserData, updateUserData, deleteUserData } from '@/utils/firebaseUtils';
import { audioService } from '@/services/audioService';

// Enhanced WordCard Component with modern design
function WordCard({ word, onEdit, onDelete, onStudy }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getDifficultyConfig = (difficulty) => {
    switch (difficulty) {
      case 'easy': 
        return { 
          color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
          icon: '●',
          ring: 'ring-emerald-500'
        };
      case 'medium': 
        return { 
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
          icon: '●●',
          ring: 'ring-amber-500'
        };
      case 'hard': 
        return { 
          color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400',
          icon: '●●●',
          ring: 'ring-rose-500'
        };
      default: 
        return { 
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          icon: '●',
          ring: 'ring-gray-500'
        };
    }
  };

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

  const handleAudioPlay = (e) => {
    e.stopPropagation();
    
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      if (!isPlaying) {
        const utterance = new SpeechSynthesisUtterance(word.word);
        
        const voices = speechSynthesis.getVoices();
        const languageVoice = voices.find(voice => 
          voice.lang.toLowerCase().includes(word.language?.toLowerCase() || 'fr')
        );
        
        if (languageVoice) {
          utterance.voice = languageVoice;
        }
        
        utterance.rate = 0.8;
        utterance.pitch = 1;
        
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        speechSynthesis.speak(utterance);
      } else {
        speechSynthesis.cancel();
        setIsPlaying(false);
      }
    }
  };

  const difficultyConfig = getDifficultyConfig(word.difficulty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 overflow-hidden"
    >
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {word.word}
              </h3>
              <button
                onClick={handleAudioPlay}
                className={`p-2 rounded-full transition-all ${
                  isPlaying 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 scale-110' 
                    : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
                title="Play pronunciation"
              >
                {isPlaying ? (
                  <motion.svg 
                    animate={{ scale: [1, 1.2, 1] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-5 h-5" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </motion.svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3z"/>
                  </svg>
                )}
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              {word.translation}
            </p>
            
            {word.pronunciation && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">
                /{word.pronunciation}/
              </p>
            )}
          </div>

          {/* Difficulty Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyConfig.color} flex items-center gap-1`}>
            <span>{difficultyConfig.icon}</span>
            <span className="capitalize">{word.difficulty}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getCategoryIcon(word.category)} />
            </svg>
            {word.category}
          </span>
          <span className="inline-flex items-center px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
            {word.language}
          </span>
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {(showDetails || word.definition || word.example) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50"
          >
            {word.definition && (
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Definition:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{word.definition}</p>
              </div>
            )}
            {word.example && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Example:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{word.example}"</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700/30">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
        >
          {showDetails ? 'Show Less' : 'Show More'}
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onStudy && onStudy(word)}
            className="px-3 py-1.5 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 text-sm font-medium rounded-lg transition-colors"
          >
            Study
          </button>
          <button
            onClick={() => onEdit(word)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
            title="Edit word"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(word.id)}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Delete word"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced Add/Edit Word Modal
function WordModal({ isOpen, onClose, onSubmit, editingWord, formData, setFormData }) {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
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
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingWord ? 'Edit Word' : 'Add New Word'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {editingWord ? 'Update your vocabulary entry' : 'Add a new word to your vocabulary collection'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Main Word Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Word *
              </label>
              <input
                type="text"
                name="word"
                value={formData.word}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all placeholder-gray-500"
                placeholder="Enter the word"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Translation *
              </label>
              <input
                type="text"
                name="translation"
                value={formData.translation}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all placeholder-gray-500"
                placeholder="Enter translation"
                required
              />
            </div>
          </div>

          {/* Pronunciation */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Pronunciation
            </label>
            <input
              type="text"
              name="pronunciation"
              value={formData.pronunciation}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all placeholder-gray-500"
              placeholder="How to pronounce (e.g., bawn-ZHOOR)"
            />
          </div>

          {/* Definition */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Definition
            </label>
            <textarea
              name="definition"
              rows="3"
              value={formData.definition}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all resize-none placeholder-gray-500"
              placeholder="Enter definition or explanation"
            />
          </div>

          {/* Example */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Example Sentence
            </label>
            <textarea
              name="example"
              rows="2"
              value={formData.example}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all resize-none placeholder-gray-500"
              placeholder="Example sentence using this word"
            />
          </div>

          {/* Category, Language, Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
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
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
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
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
              >
                <option value="easy">Easy ●</option>
                <option value="medium">Medium ●●</option>
                <option value="hard">Hard ●●●</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {editingWord ? 'Update Word' : 'Add Word'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function VocabularyManager() {
  const { currentUser } = useAuth();  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [sortBy, setSortBy] = useState('dateAdded'); // 'dateAdded', 'alphabetical', 'difficulty'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  
  const [filters, setFilters] = useState({
    language: 'all',
    category: 'all',
    difficulty: 'all',  });
    // Mobile filters state - REMOVED (no longer needed)
  
  // Search and filters section state
  const [showSearchFilters, setShowSearchFilters] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [formData, setFormData] = useState({
    word: '',
    translation: '',
    pronunciation: '',
    definition: '',
    example: '',
    category: 'vocabulary',
    language: 'french',
    difficulty: 'medium',
  });

  // Extract unique filter values
  const languages = ['all', ...new Set(words.map(word => word.language))].filter(Boolean);
  const categories = ['all', ...new Set(words.map(word => word.category))].filter(Boolean);
  const difficulties = ['all', 'easy', 'medium', 'hard'];
  // Fetch words on component mount
  useEffect(() => {
    if (currentUser) {
      fetchWords(currentUser, setWords, setLoading);
    }
  }, [currentUser]);
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.word || !formData.translation) {
      alert('Word and translation are required');
      return;
    }
    
    try {
      if (editingWord) {
        // Update existing word
        await updateUserData(currentUser, 'vocabulary', editingWord.id, formData);
      } else {
        // Add new word
        await addUserData(currentUser, 'vocabulary', formData);
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
        difficulty: 'medium',
      });
      
      setShowModal(false);
      setEditingWord(null);
      fetchWords(currentUser, setWords, setLoading);
    } catch (error) {
      console.error('Error saving word:', error);
      alert('Error saving word. Please try again.');
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
    setEditingWord(word);
    setFormData({
      word: word.word || '',
      translation: word.translation || '',
      pronunciation: word.pronunciation || '',
      definition: word.definition || '',
      example: word.example || '',
      category: word.category || 'vocabulary',
      language: word.language || 'french',
      difficulty: word.difficulty || 'medium',
    });
    setShowModal(true);
  };

  // Handle add new word
  const handleAddWord = () => {
    setEditingWord(null);
    setFormData({
      word: '',
      translation: '',
      pronunciation: '',
      definition: '',
      example: '',
      category: 'vocabulary',
      language: 'french',
      difficulty: 'medium',
    });
    setShowModal(true);
  };
  // Filter and sort words
  const filteredAndSortedWords = words
    .filter(word => {
      const matchesSearch = !searchTerm || 
        word.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.translation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.definition?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLanguage = filters.language === 'all' || word.language === filters.language;
      const matchesCategory = filters.category === 'all' || word.category === filters.category;
      const matchesDifficulty = filters.difficulty === 'all' || word.difficulty === filters.difficulty;
      
      return matchesSearch && matchesLanguage && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'alphabetical':
          aValue = a.word?.toLowerCase() || '';
          bValue = b.word?.toLowerCase() || '';
          break;
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          aValue = difficultyOrder[a.difficulty] || 2;
          bValue = difficultyOrder[b.difficulty] || 2;
          break;
        case 'dateAdded':
        default:
          aValue = a.createdAt || 0;
          bValue = b.createdAt || 0;
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {        return aValue < bValue ? 1 : -1;
      }
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
    const byDifficulty = words.reduce((acc, word) => {
      acc[word.difficulty] = (acc[word.difficulty] || 0) + 1;
      return acc;
    }, {});
    const byLanguage = words.reduce((acc, word) => {
      acc[word.language] = (acc[word.language] || 0) + 1;
      return acc;
    }, {});
    
    // Count mastered words (you can adjust this logic based on your mastery criteria)
    const mastered = words.filter(word => word.mastered === true).length;
    
    return { total, byDifficulty, byLanguage, mastered };
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
  }
  return (    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
      
      {/* Enhanced Header with Stats */}
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 bg-clip-text text-transparent">
              Vocabulary Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {filteredAndSortedWords.length} of {words.length} words • 
              Manage your language learning vocabulary
            </p>
          </div>          {/* Quick Stats */}
          <div className="flex gap-4 flex-wrap">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Words</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.byDifficulty.easy || 0}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Easy</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.byDifficulty.medium || 0}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Medium</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.byDifficulty.hard || 0}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Hard</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.mastered || 0}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Mastered</div>
              </div>
            </div>
          </div>        </div>

        {/* Collapsible Search and Controls */}
        <div className="mb-8">
          {/* Search & Filters Toggle Button */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowSearchFilters(!showSearchFilters)}
              className="flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="font-medium text-gray-900 dark:text-white">Search & Filters</span>
                {(searchTerm || filters.language !== 'all' || filters.category !== 'all' || filters.difficulty !== 'all') && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                    {[searchTerm, filters.language !== 'all', filters.category !== 'all', filters.difficulty !== 'all'].filter(Boolean).length}
                  </span>
                )}
              </div>
              <svg className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${showSearchFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>          {/* Collapsible Search and Filters Panel */}
          <AnimatePresence>
            {showSearchFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex flex-col gap-6">
            {/* Search and View Toggle */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors placeholder-gray-500"
                  placeholder="Search words, translations, definitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'cards' 
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2" />
                  </svg>
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Table
                </button>
              </div>
            </div>            {/* Filters and Sorting */}            {/* Filters - Responsive Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Language Filter */}
              <select
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
                value={filters.language}
                onChange={(e) => setFilters({...filters, language: e.target.value})}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang === 'all' ? 'All Languages' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
              
              {/* Category Filter */}
              <select
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              
              {/* Difficulty Filter */}
              <select
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff === 'all' ? 'All Difficulties' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="dateAdded">Date Added</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="difficulty">Difficulty</option>
              </select>

              {/* Sort Order */}
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >                <span className="text-sm font-medium">{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                <svg className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>

            {/* Clear Filters Button - Show when filters are active */}
            {(filters.language !== 'all' || filters.category !== 'all' || filters.difficulty !== 'all') && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setFilters({ language: 'all', category: 'all', difficulty: 'all' })}
                  className="w-full sm:w-auto px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
            <>
              {/* Cards View */}
              {viewMode === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {filteredAndSortedWords.map(word => (
                      <WordCard 
                        key={word.id} 
                        word={word} 
                        onEdit={handleEditWord} 
                        onDelete={handleDeleteWord}
                        onStudy={(word) => {
                          // Implement study functionality later
                          console.log('Study word:', word);
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}              {/* Table View */}
              {viewMode === 'table' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                      <div className="col-span-4 sm:col-span-3">Word</div>
                      <div className="col-span-4 sm:col-span-3">Translation</div>
                      <div className="col-span-2 hidden sm:block">Language</div>
                      <div className="col-span-2 hidden sm:block">Difficulty</div>
                      <div className="col-span-4 sm:col-span-2 text-right">Actions</div>
                    </div>
                  </div>
                  
                  {/* Table Body */}
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    <AnimatePresence>
                      {filteredAndSortedWords.map(word => (
                        <motion.div
                          key={word.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="grid grid-cols-12 gap-4 items-center text-sm">                            <div className="col-span-4 sm:col-span-3">
                              <div className="font-semibold text-gray-900 dark:text-white">{word.word}</div>
                              {word.pronunciation && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 italic">/{word.pronunciation}/</div>
                              )}
                            </div>
                            <div className="col-span-4 sm:col-span-3 text-gray-700 dark:text-gray-300">{word.translation}</div>
                            <div className="col-span-2 hidden sm:block">
                              <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                {word.language}
                              </span>
                            </div>
                            <div className="col-span-2 hidden sm:block">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                word.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                word.difficulty === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400' :
                                'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400'
                              }`}>
                                {word.difficulty}
                              </span>
                            </div>
                            <div className="col-span-4 sm:col-span-2 flex items-center justify-end gap-2">
                              {/* Audio button - especially prominent on mobile */}
                              <button
                                onClick={() => speakWord(word)}
                                className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                title="Pronounce word"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0v-1a3 3 0 00-6 0v1z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleEditWord(word)}
                                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                title="Edit word"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteWord(word.id)}
                                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
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
            setFormData={setFormData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
